use process_wrap::tokio::TokioChildWrapper;
use std::collections::HashMap;
use std::path::Path;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::{ChildStderr, ChildStdin, ChildStdout};

#[cfg(not(windows))]
use process_wrap::tokio::{KillOnDrop, ProcessGroup, TokioCommandWrap};
#[cfg(not(windows))]
use std::process::Stdio;
#[cfg(not(windows))]
use tokio::process::Command;

pub struct AcpProcess {
    pub child: Box<dyn TokioChildWrapper>,
    pub root_pid: Option<u32>,
    pub stdin: ChildStdin,
    pub stdout: BufReader<ChildStdout>,
    pub stderr: ChildStderr,
}

impl AcpProcess {
    pub fn spawn(
        command: &str,
        args: &[String],
        env_vars: &HashMap<String, String>,
        cwd: &Path,
    ) -> anyhow::Result<Self> {
        // Windows: use our hand-rolled JobObject path. process-wrap's `JobObject`
        // wrapper associates a completion port with the job; that association
        // empirically prevents `KILL_ON_JOB_CLOSE` from firing when pueblo-hub dies,
        // leaving the codex-acp subtree alive. Confirmed via tasklist after
        // matching reproductions on both paths.
        #[cfg(windows)]
        {
            super::windows_job::spawn(command, args, env_vars, cwd)
        }

        #[cfg(not(windows))]
        {
            let mut cmd = Command::new(command);
            cmd.args(args);
            cmd.current_dir(cwd)
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .stderr(Stdio::piped());
            cmd.env_clear();
            for (k, v) in env_vars {
                cmd.env(k, v);
            }

            // ProcessGroup::leader() makes the child the head of a new pgrp so
            // that `start_kill` (= killpg via process-wrap's ProcessGroupChild)
            // wipes the whole subtree — agents like codex-acp spawn their own
            // children, and `KillOnDrop` alone (tokio kill_on_drop = TerminateProcess
            // on the direct child only) would orphan them on Linux/macOS.
            let mut wrap = TokioCommandWrap::from(cmd);
            wrap.wrap(ProcessGroup::leader());
            wrap.wrap(KillOnDrop);

            let mut child = wrap
                .spawn()
                .map_err(|e| anyhow::anyhow!("Failed to spawn ACP agent '{}': {}", command, e))?;
            let root_pid = child.id();

            let stdin = child
                .stdin()
                .take()
                .ok_or_else(|| anyhow::anyhow!("stdin not piped"))?;
            let stdout = child
                .stdout()
                .take()
                .ok_or_else(|| anyhow::anyhow!("stdout not piped"))?;
            let stderr = child
                .stderr()
                .take()
                .ok_or_else(|| anyhow::anyhow!("stderr not piped"))?;

            Ok(Self {
                child,
                root_pid,
                stdin,
                stdout: BufReader::new(stdout),
                stderr,
            })
        }
    }

    pub async fn kill(&mut self) {
        let _ = Box::into_pin(self.child.kill()).await;
    }
}

/// What one ACP process may write to the server log through stderr.
///
/// Ordinary chat agents use `Log`, because their diagnostics help an
/// operator. Authentication processes use `Discard`: their stderr frequently
/// carries device codes, URLs, tokens, or other credentials, and that
/// material must never reach the log. `Discard` keeps draining the pipe, so
/// the child never blocks on a full stderr buffer.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StderrPolicy {
    /// Log every non-empty stderr line at warning level.
    Log,
    /// Drain stderr but never log a line from it.
    Discard,
}

pub async fn drain_stderr(stderr: ChildStderr, agent_name: String, policy: StderrPolicy) {
    let mut reader = BufReader::new(stderr);
    let mut line = String::new();
    loop {
        line.clear();
        match reader.read_line(&mut line).await {
            Ok(0) => break,
            Ok(_) => {
                let trimmed = line.trim_end();
                if trimmed.is_empty() {
                    continue;
                }
                match policy {
                    StderrPolicy::Log => {
                        tracing::warn!(agent = %agent_name, "stderr: {}", trimmed);
                    }
                    // The line may be a credential. Drop it entirely.
                    StderrPolicy::Discard => {}
                }
            }
            Err(e) => {
                tracing::debug!(agent = %agent_name, "stderr read error: {}", e);
                break;
            }
        }
    }
}

#[cfg(all(test, unix))]
mod stderr_policy_tests {
    use super::*;
    use std::process::Stdio;
    use std::sync::{Arc, Mutex};

    /// A shared in-memory sink for tracing events.
    #[derive(Clone, Default)]
    struct LogBuffer(Arc<Mutex<Vec<u8>>>);

    impl std::io::Write for LogBuffer {
        fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
            self.0
                .lock()
                .expect("log buffer lock")
                .extend_from_slice(buf);
            Ok(buf.len())
        }
        fn flush(&mut self) -> std::io::Result<()> {
            Ok(())
        }
    }

    impl<'a> tracing_subscriber::fmt::MakeWriter<'a> for LogBuffer {
        type Writer = LogBuffer;
        fn make_writer(&'a self) -> Self::Writer {
            self.clone()
        }
    }

    /// Writes one secret marker to stderr, then one more line so the marker
    /// is never the final buffered tail, and runs the drain to completion.
    fn drain_marker_stderr(policy: StderrPolicy, marker: &str) -> String {
        let script = format!("echo {marker} >&2; echo after-secret >&2");
        let buffer = LogBuffer::default();
        let subscriber = tracing_subscriber::fmt()
            .with_ansi(false)
            .with_writer(buffer.clone())
            .finish();
        // The drain runs inline on this thread, so a scoped subscriber
        // captures exactly what this policy emits.
        tracing::subscriber::with_default(subscriber, || {
            let runtime = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .expect("a runtime for the drain");
            runtime.block_on(async {
                let mut child = tokio::process::Command::new("sh")
                    .arg("-c")
                    .arg(script)
                    .stderr(Stdio::piped())
                    .spawn()
                    .expect("a process that writes stderr");
                let stderr = child.stderr.take().expect("stderr was piped");
                drain_stderr(stderr, "policy-probe".to_owned(), policy).await;
                child.wait().await.expect("the stderr writer exited");
            });
        });
        let captured = buffer.0.lock().expect("log buffer lock").clone();
        String::from_utf8(captured).expect("the log buffer is valid UTF-8")
    }

    /// Authentication stderr may carry credentials. The discard policy keeps
    /// draining it, but nothing from it reaches the log.
    #[test]
    fn discarded_stderr_never_reaches_the_log() {
        const SECRET: &str = "DEVICE-CODE-SECRET-7f3a";
        let logged = drain_marker_stderr(StderrPolicy::Discard, SECRET);
        assert!(
            !logged.contains(SECRET),
            "discarded stderr reached the log: {logged}"
        );
    }

    /// Ordinary chat-agent stderr keeps reaching the log, so the discard
    /// policy must never silently become the default.
    #[test]
    fn logged_stderr_still_reaches_the_log() {
        const DIAGNOSTIC: &str = "CHAT-AGENT-DIAGNOSTIC-2b9d";
        let logged = drain_marker_stderr(StderrPolicy::Log, DIAGNOSTIC);
        assert!(
            logged.contains(DIAGNOSTIC),
            "ordinary agent stderr stopped being logged: {logged}"
        );
    }
}
