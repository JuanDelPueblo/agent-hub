//! Host platform resolution for binary distributions.
//!
//! The ACP Registry keys binary distributions by `<os>-<arch>`. Batey
//! resolves the host target explicitly and reports an unsupported host or an
//! unsupported distribution instead of guessing a near match.
use serde::{Deserialize, Serialize};
use std::fmt;
use std::str::FromStr;

/// The six platform targets the registry format defines.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum PlatformTarget {
    #[serde(rename = "darwin-aarch64")]
    DarwinAarch64,
    #[serde(rename = "darwin-x86_64")]
    DarwinX86_64,
    #[serde(rename = "linux-aarch64")]
    LinuxAarch64,
    #[serde(rename = "linux-x86_64")]
    LinuxX86_64,
    #[serde(rename = "windows-aarch64")]
    WindowsAarch64,
    #[serde(rename = "windows-x86_64")]
    WindowsX86_64,
}

pub const ALL_PLATFORM_TARGETS: &[PlatformTarget] = &[
    PlatformTarget::DarwinAarch64,
    PlatformTarget::DarwinX86_64,
    PlatformTarget::LinuxAarch64,
    PlatformTarget::LinuxX86_64,
    PlatformTarget::WindowsAarch64,
    PlatformTarget::WindowsX86_64,
];

impl PlatformTarget {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::DarwinAarch64 => "darwin-aarch64",
            Self::DarwinX86_64 => "darwin-x86_64",
            Self::LinuxAarch64 => "linux-aarch64",
            Self::LinuxX86_64 => "linux-x86_64",
            Self::WindowsAarch64 => "windows-aarch64",
            Self::WindowsX86_64 => "windows-x86_64",
        }
    }

    pub fn is_windows(self) -> bool {
        matches!(self, Self::WindowsAarch64 | Self::WindowsX86_64)
    }

    /// The target of the machine this build runs on, or `None` when the
    /// registry format has no name for it.
    pub fn host() -> Option<Self> {
        Self::for_host(std::env::consts::OS, std::env::consts::ARCH)
    }

    /// Resolution is a table lookup on the values `std::env::consts` reports.
    /// It is separate from `host` so tests can check every combination.
    pub fn for_host(os: &str, arch: &str) -> Option<Self> {
        match (os, arch) {
            ("macos", "aarch64") => Some(Self::DarwinAarch64),
            ("macos", "x86_64") => Some(Self::DarwinX86_64),
            ("linux", "aarch64") => Some(Self::LinuxAarch64),
            ("linux", "x86_64") => Some(Self::LinuxX86_64),
            ("windows", "aarch64") => Some(Self::WindowsAarch64),
            ("windows", "x86_64") => Some(Self::WindowsX86_64),
            _ => None,
        }
    }

    /// The name this build reports for an unsupported host.
    pub fn host_description() -> String {
        format!("{}-{}", std::env::consts::OS, std::env::consts::ARCH)
    }
}

impl fmt::Display for PlatformTarget {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(self.as_str())
    }
}

impl FromStr for PlatformTarget {
    type Err = String;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        ALL_PLATFORM_TARGETS
            .iter()
            .copied()
            .find(|target| target.as_str() == value)
            .ok_or_else(|| format!("Unknown platform target '{value}'"))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_documented_target_round_trips() {
        for target in ALL_PLATFORM_TARGETS {
            assert_eq!(target.as_str().parse::<PlatformTarget>().unwrap(), *target);
            let json = serde_json::to_string(target).unwrap();
            assert_eq!(json, format!("\"{}\"", target.as_str()));
            assert_eq!(
                serde_json::from_str::<PlatformTarget>(&json).unwrap(),
                *target
            );
        }
        assert_eq!(ALL_PLATFORM_TARGETS.len(), 6);
    }

    #[test]
    fn host_resolution_is_an_explicit_table() {
        assert_eq!(
            PlatformTarget::for_host("linux", "x86_64"),
            Some(PlatformTarget::LinuxX86_64)
        );
        assert_eq!(
            PlatformTarget::for_host("macos", "aarch64"),
            Some(PlatformTarget::DarwinAarch64)
        );
        assert_eq!(
            PlatformTarget::for_host("windows", "x86_64"),
            Some(PlatformTarget::WindowsX86_64)
        );
        // Unsupported hosts are reported, never mapped onto a near match.
        assert_eq!(PlatformTarget::for_host("freebsd", "x86_64"), None);
        assert_eq!(PlatformTarget::for_host("linux", "riscv64"), None);
        assert_eq!(PlatformTarget::for_host("linux", "arm"), None);
    }

    #[test]
    fn unknown_target_names_are_rejected() {
        assert!("linux-armv7".parse::<PlatformTarget>().is_err());
        assert!("".parse::<PlatformTarget>().is_err());
        assert!(serde_json::from_str::<PlatformTarget>("\"linux-arm\"").is_err());
    }

    #[test]
    fn windows_targets_are_named_explicitly() {
        assert!(PlatformTarget::WindowsX86_64.is_windows());
        assert!(PlatformTarget::WindowsAarch64.is_windows());
        assert!(!PlatformTarget::LinuxX86_64.is_windows());
        assert!(!PlatformTarget::DarwinAarch64.is_windows());
    }
}
