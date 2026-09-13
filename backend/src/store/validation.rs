//! Input validation shared by the HTTP layer and the service layer.
use anyhow::{bail, Context, Result};
use std::path::Path;

pub fn validate_name(name: &str) -> Result<()> {
    if name.trim().is_empty() || name.len() > 200 {
        bail!("Name must contain 1–200 bytes")
    }
    Ok(())
}

pub fn validate_project_path(path: &str, roots: &[String]) -> Result<String> {
    let input = Path::new(path);
    if !input.is_absolute() {
        bail!("Project path must be absolute")
    }
    let canonical = input
        .canonicalize()
        .context("Project directory does not exist")?;
    if !canonical.is_dir() {
        bail!("Project path must be a directory")
    }
    if !roots
        .iter()
        .filter_map(|r| Path::new(r).canonicalize().ok())
        .any(|r| canonical.starts_with(r))
    {
        bail!("Project directory is outside the configured project roots")
    }
    Ok(canonical.to_string_lossy().into_owned())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn paths_must_exist_and_stay_inside_roots() {
        let tmp = tempfile::tempdir().unwrap();
        let roots = vec![tmp.path().display().to_string()];
        assert!(validate_project_path(&roots[0], &roots).is_ok());
        assert!(validate_project_path("/", &roots).is_err());
        assert!(validate_project_path("relative", &roots).is_err());
        assert!(validate_name(" ").is_err());
    }
}
