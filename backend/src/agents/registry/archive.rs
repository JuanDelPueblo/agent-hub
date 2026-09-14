//! Safe extraction of registry archives.
//!
//! A registry archive is an unverified outside input, so extraction is
//! deliberately strict. Every entry path is rebuilt from validated components
//! and stays under the destination directory. Links are rejected outright:
//! a symbolic or hard link inside an archive can point outside the
//! destination, and a later entry can then write through it. Devices, sockets,
//! and FIFOs are rejected for the same reason.
//!
//! Extraction also bounds the entry count and the total extracted size, so a
//! small archive cannot fill the disk.
use sha2::{Digest, Sha256};
use std::collections::BTreeSet;
use std::io::{Cursor, Read};
use std::path::{Component, Path, PathBuf};

/// Refuse an archive with more entries than this.
pub const MAX_ENTRIES: usize = 100_000;
/// Refuse an archive that extracts to more than this many bytes.
pub const MAX_TOTAL_BYTES: u64 = 2 * 1024 * 1024 * 1024;

/// The archive formats the registry format allows.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ArchiveKind {
    TarGz,
    TarBz2,
    Zip,
    /// Not an archive: the download is the executable itself.
    Raw,
}

impl ArchiveKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::TarGz => "tar.gz",
            Self::TarBz2 => "tar.bz2",
            Self::Zip => "zip",
            Self::Raw => "raw",
        }
    }
}

/// Installer formats the registry format excludes. They are named so the
/// error tells the user what happened.
const INSTALLER_SUFFIXES: &[&str] = &[".dmg", ".pkg", ".deb", ".rpm", ".msi", ".appimage"];

/// Chooses the format from the archive URL, then confirms it against the
/// leading bytes. The bytes win, because a release asset is sometimes named
/// without a matching suffix.
pub fn detect(url: &str, bytes: &[u8]) -> anyhow::Result<ArchiveKind> {
    let path = url.split(['?', '#']).next().unwrap_or(url).to_lowercase();
    if let Some(suffix) = INSTALLER_SUFFIXES
        .iter()
        .find(|suffix| path.ends_with(**suffix))
    {
        anyhow::bail!("Installer archives are not supported ({suffix})");
    }
    if let Some(kind) = magic_kind(bytes) {
        return Ok(kind);
    }
    if path.ends_with(".tar.gz") || path.ends_with(".tgz") {
        anyhow::bail!("Archive claims to be gzip but the content is not gzip");
    }
    if path.ends_with(".tar.bz2") || path.ends_with(".tbz2") {
        anyhow::bail!("Archive claims to be bzip2 but the content is not bzip2");
    }
    if path.ends_with(".zip") {
        anyhow::bail!("Archive claims to be zip but the content is not zip");
    }
    Ok(ArchiveKind::Raw)
}

fn magic_kind(bytes: &[u8]) -> Option<ArchiveKind> {
    if bytes.starts_with(&[0x1f, 0x8b]) {
        return Some(ArchiveKind::TarGz);
    }
    if bytes.starts_with(b"BZh") {
        return Some(ArchiveKind::TarBz2);
    }
    // Local file header, empty archive, and spanned archive markers.
    if bytes.starts_with(b"PK\x03\x04") || bytes.starts_with(b"PK\x05\x06") {
        return Some(ArchiveKind::Zip);
    }
    None
}

pub fn sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    hasher
        .finalize()
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

/// Compares a computed digest with registry-supplied integrity metadata.
/// Comparison ignores case, because the registry schema allows either.
pub fn verify_sha256(bytes: &[u8], expected: &str) -> anyhow::Result<()> {
    let actual = sha256_hex(bytes);
    anyhow::ensure!(
        actual.eq_ignore_ascii_case(expected.trim()),
        "Archive integrity check failed: expected sha256 {}, got {actual}",
        expected.trim().to_lowercase()
    );
    Ok(())
}

/// Extracts `bytes` into `destination`, which must already exist and should
/// be empty. `raw_name` names the file a raw (non-archive) download becomes.
pub fn extract(
    kind: ArchiveKind,
    bytes: &[u8],
    destination: &Path,
    raw_name: &str,
) -> anyhow::Result<()> {
    anyhow::ensure!(
        destination.is_dir(),
        "Extraction destination {} is not a directory",
        destination.display()
    );
    match kind {
        ArchiveKind::TarGz => extract_tar(
            flate2::read::GzDecoder::new(Cursor::new(bytes)),
            destination,
        ),
        ArchiveKind::TarBz2 => {
            extract_tar(bzip2::read::BzDecoder::new(Cursor::new(bytes)), destination)
        }
        ArchiveKind::Zip => extract_zip(bytes, destination),
        ArchiveKind::Raw => extract_raw(bytes, destination, raw_name),
    }
}

fn extract_raw(bytes: &[u8], destination: &Path, raw_name: &str) -> anyhow::Result<()> {
    let name = safe_file_name(raw_name)?;
    let target = destination.join(name);
    std::fs::write(&target, bytes)?;
    set_executable(&target)?;
    Ok(())
}

fn extract_tar<R: Read>(reader: R, destination: &Path) -> anyhow::Result<()> {
    let mut archive = tar::Archive::new(reader);
    let mut entries = 0usize;
    let mut total = 0u64;
    let mut created_dirs: BTreeSet<PathBuf> = BTreeSet::new();
    for entry in archive.entries()? {
        let mut entry = entry?;
        entries += 1;
        anyhow::ensure!(entries <= MAX_ENTRIES, "Archive has too many entries");

        let raw_path = entry.path()?.to_path_buf();
        let kind = entry.header().entry_type();
        if kind.is_symlink() || kind.is_hard_link() {
            anyhow::bail!(
                "Archive entry '{}' is a link; links are not extracted",
                raw_path.display()
            );
        }
        let relative = safe_relative_path(&raw_path)?;
        let target = destination.join(&relative);

        if kind.is_dir() {
            std::fs::create_dir_all(&target)?;
            created_dirs.insert(target);
            continue;
        }
        anyhow::ensure!(
            kind.is_file(),
            "Archive entry '{}' is not a regular file",
            raw_path.display()
        );

        let size = entry.header().size()?;
        total = total.saturating_add(size);
        anyhow::ensure!(
            total <= MAX_TOTAL_BYTES,
            "Archive extracts to too much data"
        );

        if let Some(parent) = target.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut data = Vec::with_capacity(size.min(MAX_TOTAL_BYTES) as usize);
        entry.read_to_end(&mut data)?;
        std::fs::write(&target, &data)?;
        let mode = entry.header().mode().unwrap_or(0o644);
        apply_mode(&target, mode)?;
    }
    Ok(())
}

fn extract_zip(bytes: &[u8], destination: &Path) -> anyhow::Result<()> {
    let mut archive = zip::ZipArchive::new(Cursor::new(bytes))?;
    anyhow::ensure!(archive.len() <= MAX_ENTRIES, "Archive has too many entries");
    let mut total = 0u64;
    for index in 0..archive.len() {
        let mut entry = archive.by_index(index)?;
        let raw_name = entry.name().to_string();
        // A zip stores a symlink as a file whose unix mode says so.
        if let Some(mode) = entry.unix_mode() {
            anyhow::ensure!(
                mode & 0o170000 != 0o120000,
                "Archive entry '{raw_name}' is a link; links are not extracted"
            );
        }
        // `enclosed_name` already refuses traversal; the shared check runs
        // anyway so both formats obey exactly one rule.
        let enclosed = entry
            .enclosed_name()
            .ok_or_else(|| anyhow::anyhow!("Archive entry '{raw_name}' has an unsafe path"))?;
        let relative = safe_relative_path(&enclosed)?;
        let target = destination.join(&relative);

        if entry.is_dir() {
            std::fs::create_dir_all(&target)?;
            continue;
        }
        total = total.saturating_add(entry.size());
        anyhow::ensure!(
            total <= MAX_TOTAL_BYTES,
            "Archive extracts to too much data"
        );
        if let Some(parent) = target.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let mut data = Vec::new();
        entry.read_to_end(&mut data)?;
        std::fs::write(&target, &data)?;
        // A zip written on Windows carries no mode. The launch command is
        // made executable after extraction, so this stays a plain file.
        if let Some(mode) = entry.unix_mode() {
            apply_mode(&target, mode)?;
        }
    }
    Ok(())
}

/// Rebuilds an entry path from validated components. An absolute path, a
/// drive or UNC prefix, a root component, and every `..` are rejected.
pub fn safe_relative_path(path: &Path) -> anyhow::Result<PathBuf> {
    let mut safe = PathBuf::new();
    for component in path.components() {
        match component {
            Component::Normal(part) => {
                let text = part.to_str().ok_or_else(|| {
                    anyhow::anyhow!("Archive entry '{}' is not valid UTF-8", path.display())
                })?;
                // A backslash is a separator on Windows, so a POSIX archive
                // must not smuggle one through a single component.
                anyhow::ensure!(
                    !text.contains('\\') && !text.contains('/'),
                    "Archive entry '{}' has an unsafe path component",
                    path.display()
                );
                safe.push(text);
            }
            Component::CurDir => {}
            Component::ParentDir | Component::RootDir | Component::Prefix(_) => {
                anyhow::bail!(
                    "Archive entry '{}' escapes the extraction directory",
                    path.display()
                );
            }
        }
    }
    anyhow::ensure!(
        !safe.as_os_str().is_empty(),
        "Archive entry '{}' has an empty path",
        path.display()
    );
    Ok(safe)
}

/// One path component, with no separator and no traversal. Used for the file
/// name a raw download takes and for the `cmd` a distribution launches.
fn safe_file_name(name: &str) -> anyhow::Result<String> {
    let trimmed = name.trim();
    anyhow::ensure!(!trimmed.is_empty(), "Empty download file name");
    anyhow::ensure!(
        !trimmed.contains('/') && !trimmed.contains('\\') && trimmed != "." && trimmed != "..",
        "Unsafe download file name '{trimmed}'"
    );
    Ok(trimmed.to_string())
}

/// The file name a raw download takes, derived from its URL.
pub fn file_name_from_url(url: &str) -> String {
    let path = url.split(['?', '#']).next().unwrap_or(url);
    let candidate = path.rsplit('/').next().unwrap_or("");
    match safe_file_name(candidate) {
        Ok(name) => name,
        Err(_) => "agent".to_string(),
    }
}

/// Marks a file executable for the owner, the group, and others.
pub fn set_executable(path: &Path) -> anyhow::Result<()> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mut permissions = std::fs::metadata(path)?.permissions();
        let mode = permissions.mode();
        permissions.set_mode(mode | 0o111);
        std::fs::set_permissions(path, permissions)?;
    }
    #[cfg(not(unix))]
    {
        let _ = path;
    }
    Ok(())
}

/// Keeps the archive's executable bit and drops setuid, setgid, and sticky.
fn apply_mode(path: &Path, mode: u32) -> anyhow::Result<()> {
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let safe = (mode & 0o777) | 0o600;
        std::fs::set_permissions(path, std::fs::Permissions::from_mode(safe))?;
    }
    #[cfg(not(unix))]
    {
        let _ = (path, mode);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    fn tar_gz(build: impl FnOnce(&mut tar::Builder<Vec<u8>>)) -> Vec<u8> {
        let mut builder = tar::Builder::new(Vec::new());
        build(&mut builder);
        let tar = builder.into_inner().unwrap();
        let mut encoder = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::fast());
        encoder.write_all(&tar).unwrap();
        encoder.finish().unwrap()
    }

    fn append_file(builder: &mut tar::Builder<Vec<u8>>, path: &str, body: &[u8], mode: u32) {
        let mut header = tar::Header::new_gnu();
        header.set_size(body.len() as u64);
        header.set_mode(mode);
        header.set_cksum();
        builder.append_data(&mut header, path, body).unwrap();
    }

    /// `tar::Builder` refuses to write a traversing path, so the hostile
    /// archives the extractor must reject are written into the header itself.
    fn append_unsafe_path(builder: &mut tar::Builder<Vec<u8>>, path: &str, body: &[u8]) {
        let mut header = tar::Header::new_gnu();
        header.set_size(body.len() as u64);
        header.set_mode(0o644);
        header.set_entry_type(tar::EntryType::Regular);
        let name = &mut header.as_gnu_mut().expect("gnu header").name;
        name.fill(0);
        let bytes = path.as_bytes();
        assert!(bytes.len() < name.len(), "test path is too long");
        name[..bytes.len()].copy_from_slice(bytes);
        header.set_cksum();
        builder.append(&header, body).unwrap();
    }

    fn zip_bytes(entries: &[(&str, &[u8])]) -> Vec<u8> {
        let mut writer = zip::ZipWriter::new(Cursor::new(Vec::new()));
        for (name, body) in entries {
            writer
                .start_file(*name, zip::write::SimpleFileOptions::default())
                .unwrap();
            writer.write_all(body).unwrap();
        }
        writer.finish().unwrap().into_inner()
    }

    #[test]
    fn detects_every_supported_format() {
        let gz = tar_gz(|b| append_file(b, "bin/agent", b"x", 0o755));
        assert_eq!(
            detect("https://e.invalid/a.tar.gz", &gz).unwrap(),
            ArchiveKind::TarGz
        );
        let zip = zip_bytes(&[("agent.exe", b"x")]);
        assert_eq!(
            detect("https://e.invalid/a.zip", &zip).unwrap(),
            ArchiveKind::Zip
        );
        assert_eq!(
            detect("https://e.invalid/agent-linux-amd64", b"\x7fELF").unwrap(),
            ArchiveKind::Raw
        );
        assert_eq!(
            detect("https://e.invalid/a.tbz2", b"BZh9").unwrap(),
            ArchiveKind::TarBz2
        );
        // A query string does not change the format.
        assert_eq!(
            detect("https://e.invalid/a.zip?token=1", &zip).unwrap(),
            ArchiveKind::Zip
        );
    }

    #[test]
    fn installer_formats_and_mislabelled_archives_are_rejected() {
        for url in [
            "https://e.invalid/a.dmg",
            "https://e.invalid/a.pkg",
            "https://e.invalid/a.deb",
            "https://e.invalid/a.rpm",
            "https://e.invalid/a.msi",
            "https://e.invalid/a.AppImage",
        ] {
            assert!(detect(url, b"whatever").is_err(), "{url} was accepted");
        }
        assert!(detect("https://e.invalid/a.tar.gz", b"not gzip").is_err());
        assert!(detect("https://e.invalid/a.zip", b"not zip").is_err());
        assert!(detect("https://e.invalid/a.tar.bz2", b"not bzip2").is_err());
    }

    #[test]
    fn integrity_metadata_is_enforced_when_present() {
        let digest = sha256_hex(b"payload");
        assert_eq!(digest.len(), 64);
        assert!(verify_sha256(b"payload", &digest).is_ok());
        assert!(verify_sha256(b"payload", &digest.to_uppercase()).is_ok());
        assert!(verify_sha256(b"tampered", &digest).is_err());
        assert_eq!(
            sha256_hex(b""),
            "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        );
    }

    #[test]
    fn tar_extraction_keeps_layout_and_executable_bit() {
        let tmp = tempfile::tempdir().unwrap();
        let archive = tar_gz(|builder| {
            append_file(builder, "bin/agent", b"#!/bin/sh\n", 0o755);
            append_file(builder, "share/notes.txt", b"hello", 0o644);
        });
        extract(ArchiveKind::TarGz, &archive, tmp.path(), "agent").unwrap();
        assert!(tmp.path().join("bin/agent").is_file());
        assert_eq!(
            std::fs::read_to_string(tmp.path().join("share/notes.txt")).unwrap(),
            "hello"
        );
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let mode = std::fs::metadata(tmp.path().join("bin/agent"))
                .unwrap()
                .permissions()
                .mode();
            assert_eq!(mode & 0o111, 0o111, "executable bit was lost");
            let mode = std::fs::metadata(tmp.path().join("share/notes.txt"))
                .unwrap()
                .permissions()
                .mode();
            assert_eq!(mode & 0o111, 0, "data file became executable");
        }
    }

    #[test]
    fn tar_path_traversal_is_rejected() {
        let tmp = tempfile::tempdir().unwrap();
        let destination = tmp.path().join("install");
        std::fs::create_dir_all(&destination).unwrap();
        for path in ["../escape", "a/../../escape", "/etc/escape"] {
            let archive = tar_gz(|builder| append_unsafe_path(builder, path, b"x"));
            let error = extract(ArchiveKind::TarGz, &archive, &destination, "agent")
                .expect_err(&format!("{path} was extracted"));
            assert!(
                error.to_string().contains("escapes") || error.to_string().contains("unsafe"),
                "unexpected error for {path}: {error}"
            );
        }
        assert!(!tmp.path().join("escape").exists());
        assert!(!destination.join("escape").exists());
    }

    #[test]
    fn tar_links_are_rejected() {
        let tmp = tempfile::tempdir().unwrap();
        let mut builder = tar::Builder::new(Vec::new());
        let mut header = tar::Header::new_gnu();
        header.set_size(0);
        header.set_entry_type(tar::EntryType::Symlink);
        header.set_mode(0o777);
        builder
            .append_link(&mut header, "link", "/etc/passwd")
            .unwrap();
        let tar = builder.into_inner().unwrap();
        let mut encoder = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::fast());
        encoder.write_all(&tar).unwrap();
        let archive = encoder.finish().unwrap();

        let error = extract(ArchiveKind::TarGz, &archive, tmp.path(), "agent").unwrap_err();
        assert!(error.to_string().contains("link"), "{error}");
        assert!(!tmp.path().join("link").exists());
    }

    #[test]
    fn tar_special_files_are_rejected() {
        let tmp = tempfile::tempdir().unwrap();
        let mut builder = tar::Builder::new(Vec::new());
        let mut header = tar::Header::new_gnu();
        header.set_size(0);
        header.set_entry_type(tar::EntryType::Fifo);
        header.set_mode(0o644);
        header.set_cksum();
        builder.append_data(&mut header, "pipe", &b""[..]).unwrap();
        let tar = builder.into_inner().unwrap();
        let mut encoder = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::fast());
        encoder.write_all(&tar).unwrap();
        let archive = encoder.finish().unwrap();

        let error = extract(ArchiveKind::TarGz, &archive, tmp.path(), "agent").unwrap_err();
        assert!(error.to_string().contains("regular file"), "{error}");
    }

    #[test]
    fn zip_extraction_and_traversal_rejection() {
        let tmp = tempfile::tempdir().unwrap();
        let archive = zip_bytes(&[("agent.exe", b"binary"), ("docs/readme.txt", b"hi")]);
        extract(ArchiveKind::Zip, &archive, tmp.path(), "agent").unwrap();
        assert_eq!(
            std::fs::read(tmp.path().join("agent.exe")).unwrap(),
            b"binary"
        );
        assert!(tmp.path().join("docs/readme.txt").is_file());

        let evil = tmp.path().join("evil");
        std::fs::create_dir_all(&evil).unwrap();
        let traversal = zip_bytes(&[("../escape.txt", b"x")]);
        assert!(extract(ArchiveKind::Zip, &traversal, &evil, "agent").is_err());
        assert!(!tmp.path().join("escape.txt").exists());
    }

    #[test]
    fn raw_downloads_become_one_executable_file() {
        let tmp = tempfile::tempdir().unwrap();
        extract(
            ArchiveKind::Raw,
            b"\x7fELF",
            tmp.path(),
            "sigit-linux-amd64",
        )
        .unwrap();
        let target = tmp.path().join("sigit-linux-amd64");
        assert!(target.is_file());
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let mode = std::fs::metadata(&target).unwrap().permissions().mode();
            assert_eq!(mode & 0o111, 0o111);
        }
        assert!(extract(ArchiveKind::Raw, b"x", tmp.path(), "../escape").is_err());
        assert!(extract(ArchiveKind::Raw, b"x", tmp.path(), "").is_err());
    }

    #[test]
    fn url_file_names_are_sanitized() {
        assert_eq!(
            file_name_from_url("https://e.invalid/releases/sigit-linux-amd64"),
            "sigit-linux-amd64"
        );
        assert_eq!(
            file_name_from_url("https://e.invalid/a/b.tar.gz?x=1"),
            "b.tar.gz"
        );
        assert_eq!(file_name_from_url("https://e.invalid/"), "agent");
    }

    #[test]
    fn relative_path_rules() {
        assert_eq!(
            safe_relative_path(Path::new("./bin/agent")).unwrap(),
            PathBuf::from("bin/agent")
        );
        assert!(safe_relative_path(Path::new("../x")).is_err());
        assert!(safe_relative_path(Path::new("/x")).is_err());
        assert!(safe_relative_path(Path::new("")).is_err());
        assert!(safe_relative_path(Path::new(".")).is_err());
    }

    #[test]
    fn extraction_needs_an_existing_directory() {
        let tmp = tempfile::tempdir().unwrap();
        let missing = tmp.path().join("missing");
        assert!(extract(ArchiveKind::Raw, b"x", &missing, "agent").is_err());
    }
}
