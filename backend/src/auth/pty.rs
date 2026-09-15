//! A real pseudo-terminal for terminal authentication.
//!
//! The stable terminal authentication method needs an interactive TTY: the
//! agent program draws a TUI and reads keys. A pipe is not enough, so this
//! module allocates a real PTY and spawns the program on its slave end.
//!
//! Only platforms where Batey can also kill the whole process tree run
//! the real implementation. `TERMINAL_AUTH_SUPPORTED` reports that, and the
//! ACP client advertises the stable client terminal-auth capability from the
//! same constant. Batey therefore never claims a capability it cannot
//! honor.
use std::collections::BTreeMap;
use std::path::PathBuf;

/// Whether this build runs the real PTY implementation.
///
/// The Unix implementation makes the child a session leader, so a single
/// `killpg` removes the whole process tree. No other platform has an
/// equivalent path here yet, so they report no support.
pub const TERMINAL_AUTH_SUPPORTED: bool = cfg!(unix);

/// The initial window. The client resizes it later over the flow socket.
pub const DEFAULT_WINDOW: PtyWindow = PtyWindow { cols: 80, rows: 24 };

/// The size of the visible terminal area.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PtyWindow {
    pub cols: u16,
    pub rows: u16,
}

impl PtyWindow {
    /// Clamps a client-supplied window to a usable range. A browser may
    /// choose the window size; it may choose nothing else about the process.
    pub fn clamped(cols: u16, rows: u16) -> Self {
        Self {
            cols: cols.clamp(8, 1000),
            rows: rows.clamp(4, 500),
        }
    }
}

/// Everything the PTY layer needs to start one program.
///
/// The caller builds every field from the installed agent runtime and the
/// advertised authentication method. No field ever comes from a request body.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct PtyCommand {
    pub program: String,
    pub args: Vec<String>,
    pub env: BTreeMap<String, String>,
    pub cwd: PathBuf,
}

/// How the program ended.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PtyExit {
    /// The program exited with this status code. Zero means success.
    Code(u32),
    /// A signal terminated the program. This is always a failure.
    Signal(String),
}

impl PtyExit {
    pub fn succeeded(&self) -> bool {
        matches!(self, Self::Code(0))
    }
}

/// The live ends of one running PTY.
pub struct PtySpawn {
    pub handle: std::sync::Arc<PtyHandle>,
    /// Raw bytes the program wrote. The channel closes at end of output.
    pub output: tokio::sync::mpsc::Receiver<Vec<u8>>,
    /// Resolves once the program ends.
    pub exit: tokio::sync::oneshot::Receiver<PtyExit>,
}

/// Starts one program on a new PTY.
pub fn spawn(command: &PtyCommand, window: PtyWindow) -> anyhow::Result<PtySpawn> {
    imp::spawn(command, window)
}

pub use imp::PtyHandle;

#[cfg(unix)]
mod imp {
    use super::{PtyCommand, PtyExit, PtySpawn, PtyWindow};
    use portable_pty::{native_pty_system, ChildKiller, CommandBuilder, MasterPty, PtySize};
    use std::io::{Read, Write};
    use std::sync::{Arc, Mutex};

    /// One read of the PTY master. A terminal writes small chunks, so this
    /// buffer only bounds one read, not the retained output.
    const READ_CHUNK_BYTES: usize = 8 * 1024;
    /// Pending output chunks. A client that stops reading cannot grow memory
    /// without bound; the reader task blocks instead.
    const OUTPUT_CHANNEL_DEPTH: usize = 64;

    /// The control end of one running PTY.
    pub struct PtyHandle {
        master: Mutex<Box<dyn MasterPty + Send>>,
        writer: Mutex<Box<dyn Write + Send>>,
        killer: Mutex<Box<dyn ChildKiller + Send + Sync>>,
        /// The child pid. `setsid` in the spawn path makes it the process
        /// group id too, so one `killpg` reaches every descendant.
        pid: Option<u32>,
    }

    impl std::fmt::Debug for PtyHandle {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            f.debug_struct("PtyHandle").field("pid", &self.pid).finish()
        }
    }

    impl PtyHandle {
        /// Writes user keystrokes to the program.
        ///
        /// The bytes go to the PTY master and nowhere else. Batey never
        /// stores or logs terminal input.
        pub fn write_input(&self, bytes: &[u8]) -> anyhow::Result<()> {
            let mut writer = self
                .writer
                .lock()
                .map_err(|_| anyhow::anyhow!("PTY writer lock poisoned"))?;
            writer.write_all(bytes)?;
            writer.flush()?;
            Ok(())
        }

        pub fn resize(&self, window: PtyWindow) -> anyhow::Result<()> {
            let master = self
                .master
                .lock()
                .map_err(|_| anyhow::anyhow!("PTY master lock poisoned"))?;
            master.resize(PtySize {
                rows: window.rows,
                cols: window.cols,
                pixel_width: 0,
                pixel_height: 0,
            })?;
            Ok(())
        }

        /// Kills the program and every process it started.
        ///
        /// The child is a session leader, so its process group holds the
        /// whole subtree. `killpg` removes all of it. The direct kill runs
        /// afterwards in case the group call fails.
        pub fn kill_tree(&self) {
            if let Some(pid) = self.pid {
                if let Ok(pid) = i32::try_from(pid) {
                    // SAFETY: `killpg` only inspects the pid and the signal.
                    unsafe {
                        libc::killpg(pid, libc::SIGKILL);
                    }
                }
            }
            if let Ok(mut killer) = self.killer.lock() {
                let _ = killer.kill();
            }
        }
    }

    pub fn spawn(command: &PtyCommand, window: PtyWindow) -> anyhow::Result<PtySpawn> {
        let pty_system = native_pty_system();
        let pair = pty_system.openpty(PtySize {
            rows: window.rows,
            cols: window.cols,
            pixel_width: 0,
            pixel_height: 0,
        })?;

        let mut builder = CommandBuilder::new(&command.program);
        // `CommandBuilder` seeds itself from the Batey environment.
        // Clear it first: the caller already resolved the exact sanitized
        // environment, including per-agent secret isolation.
        builder.env_clear();
        for arg in &command.args {
            builder.arg(arg);
        }
        for (name, value) in &command.env {
            builder.env(name, value);
        }
        builder.cwd(&command.cwd);

        let mut child = pair.slave.spawn_command(builder)?;
        // Only the child may hold the slave end. Otherwise the master never
        // sees end of output when the child exits.
        drop(pair.slave);

        let pid = child.process_id();
        let killer = child.clone_killer();
        let reader = pair.master.try_clone_reader()?;
        let writer = pair.master.take_writer()?;

        let handle = Arc::new(PtyHandle {
            master: Mutex::new(pair.master),
            writer: Mutex::new(writer),
            killer: Mutex::new(killer),
            pid,
        });

        let (output_tx, output) = tokio::sync::mpsc::channel(OUTPUT_CHANNEL_DEPTH);
        std::thread::spawn(move || {
            let mut reader = reader;
            let mut buffer = vec![0u8; READ_CHUNK_BYTES];
            loop {
                match reader.read(&mut buffer) {
                    Ok(0) | Err(_) => break,
                    Ok(read) => {
                        if output_tx.blocking_send(buffer[..read].to_vec()).is_err() {
                            break;
                        }
                    }
                }
            }
        });

        let (exit_tx, exit) = tokio::sync::oneshot::channel();
        std::thread::spawn(move || {
            let status = match child.wait() {
                Ok(status) => match status.signal() {
                    Some(signal) => PtyExit::Signal(signal.to_owned()),
                    None => PtyExit::Code(status.exit_code()),
                },
                // A wait failure cannot prove success, so report a failure.
                Err(_) => PtyExit::Code(1),
            };
            let _ = exit_tx.send(status);
        });

        Ok(PtySpawn {
            handle,
            output,
            exit,
        })
    }
}

#[cfg(not(unix))]
mod imp {
    use super::{PtyCommand, PtySpawn, PtyWindow};

    /// The control end of one running PTY. This build never creates one.
    #[derive(Debug)]
    pub struct PtyHandle;

    impl PtyHandle {
        pub fn write_input(&self, _bytes: &[u8]) -> anyhow::Result<()> {
            anyhow::bail!("Terminal authentication is not supported on this platform")
        }

        pub fn resize(&self, _window: PtyWindow) -> anyhow::Result<()> {
            anyhow::bail!("Terminal authentication is not supported on this platform")
        }

        pub fn kill_tree(&self) {}
    }

    pub fn spawn(_command: &PtyCommand, _window: PtyWindow) -> anyhow::Result<PtySpawn> {
        anyhow::bail!("Terminal authentication is not supported on this platform")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn window_clamps_client_values() {
        assert_eq!(PtyWindow::clamped(0, 0), PtyWindow { cols: 8, rows: 4 });
        assert_eq!(
            PtyWindow::clamped(u16::MAX, u16::MAX),
            PtyWindow {
                cols: 1000,
                rows: 500
            }
        );
        assert_eq!(
            PtyWindow::clamped(120, 40),
            PtyWindow {
                cols: 120,
                rows: 40
            }
        );
    }

    #[test]
    fn only_a_zero_exit_code_succeeds() {
        assert!(PtyExit::Code(0).succeeded());
        assert!(!PtyExit::Code(1).succeeded());
        assert!(!PtyExit::Signal("SIGKILL".into()).succeeded());
    }
}
