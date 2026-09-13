//! Input validation shared by the HTTP layer and the service layer.
use super::{StoreError, StoreResult};
use std::path::Path;

pub fn validate_name(name: &str) -> StoreResult<()> {
    if name.trim().is_empty() || name.len() > 200 {
        return Err(StoreError::Validation(
            "Name must contain 1–200 bytes".into(),
        ));
    }
    Ok(())
}

pub fn validate_project_path(path: &str, roots: &[String]) -> StoreResult<String> {
    let input = Path::new(path);
    if !input.is_absolute() {
        return Err(StoreError::Validation(
            "Project path must be absolute".into(),
        ));
    }
    let canonical = input
        .canonicalize()
        .map_err(|_| StoreError::Validation("Project directory does not exist".into()))?;
    if !canonical.is_dir() {
        return Err(StoreError::Validation(
            "Project path must be a directory".into(),
        ));
    }
    if !roots
        .iter()
        .filter_map(|r| Path::new(r).canonicalize().ok())
        .any(|r| canonical.starts_with(r))
    {
        return Err(StoreError::Validation(
            "Project directory is outside the configured project roots".into(),
        ));
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
