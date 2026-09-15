//! Bounded, stable ACP v1 rich-content handling shared by web, sessions, and events.
//!
//! Content blocks are deliberately the schema crate's types.  Batey adds policy
//! (size, media and URI safety), not a second hand-maintained wire schema.
use ::agent_client_protocol_schema::v1 as acp;
use acp::{ContentBlock, EmbeddedResourceResource};
use base64::{engine::general_purpose::STANDARD, Engine as _};

pub const MAX_MEDIA_BYTES: usize = 2 * 1024 * 1024;
pub const MAX_EMBEDDED_RESOURCE_BYTES: usize = 512 * 1024;
pub const MAX_RICH_PROMPT_BYTES: usize = 4 * 1024 * 1024;
pub const MAX_DURABLE_RICH_EVENT_BYTES: usize = 4 * 1024 * 1024;
/// JSON/base64 transport allowance for a 4 MiB decoded prompt plus its
/// stable ACP envelope. This is deliberately route-local rather than a
/// global relaxation of Axum's JSON extractor limit.
pub const MAX_RICH_PROMPT_HTTP_BYTES: usize = 6 * 1024 * 1024;

pub fn text(text: impl Into<String>) -> ContentBlock {
    ContentBlock::Text(acp::TextContent::new(text))
}

/// Validates content before it is persisted or sent to an ACP agent.
pub fn validate_prompt(blocks: &[ContentBlock]) -> anyhow::Result<()> {
    validate(blocks, MAX_RICH_PROMPT_BYTES, true)
}

/// Agent output uses the same conservative payload rules before it can enter
/// the durable event log. Links are retained but are never fetched by Batey.
pub fn validate_durable(blocks: &[ContentBlock]) -> anyhow::Result<()> {
    validate(blocks, MAX_DURABLE_RICH_EVENT_BYTES, false)
}

pub fn validate(
    blocks: &[ContentBlock],
    total_limit: usize,
    sent_by_user: bool,
) -> anyhow::Result<()> {
    anyhow::ensure!(
        !blocks.is_empty(),
        "Prompt must contain at least one content block"
    );
    let mut total = 0usize;
    for block in blocks {
        match block {
            ContentBlock::Text(text) => {
                total = total.saturating_add(text.text.len());
            }
            ContentBlock::Image(image) => {
                let bytes = decode(&image.data, "image")?;
                anyhow::ensure!(
                    bytes.len() <= MAX_MEDIA_BYTES,
                    "Image exceeds {MAX_MEDIA_BYTES} bytes"
                );
                let mime = image.mime_type.as_ref();
                anyhow::ensure!(
                    matches!(
                        mime,
                        "image/png" | "image/jpeg" | "image/gif" | "image/webp"
                    ),
                    "Unsupported image MIME type: {mime}"
                );
                anyhow::ensure!(
                    image_matches(mime, &bytes),
                    "Image data does not match its MIME type"
                );
                total = total.saturating_add(bytes.len());
            }
            ContentBlock::Audio(audio) => {
                let bytes = decode(&audio.data, "audio")?;
                anyhow::ensure!(
                    bytes.len() <= MAX_MEDIA_BYTES,
                    "Audio exceeds {MAX_MEDIA_BYTES} bytes"
                );
                let mime = audio.mime_type.as_ref();
                anyhow::ensure!(
                    matches!(
                        mime,
                        "audio/mpeg" | "audio/wav" | "audio/ogg" | "audio/webm"
                    ),
                    "Unsupported audio MIME type: {mime}"
                );
                anyhow::ensure!(
                    audio_matches(mime, &bytes),
                    "Audio data does not match its MIME type"
                );
                total = total.saturating_add(bytes.len());
            }
            ContentBlock::Resource(resource) => match &resource.resource {
                EmbeddedResourceResource::TextResourceContents(resource) => {
                    anyhow::ensure!(
                        resource.text.len() <= MAX_EMBEDDED_RESOURCE_BYTES,
                        "Embedded resource exceeds {MAX_EMBEDDED_RESOURCE_BYTES} bytes"
                    );
                    validate_mime(resource.mime_type.as_ref().map(AsRef::as_ref))?;
                    total = total.saturating_add(resource.text.len());
                }
                EmbeddedResourceResource::BlobResourceContents(resource) => {
                    let bytes = decode(&resource.blob, "embedded resource")?;
                    anyhow::ensure!(
                        bytes.len() <= MAX_EMBEDDED_RESOURCE_BYTES,
                        "Embedded resource exceeds {MAX_EMBEDDED_RESOURCE_BYTES} bytes"
                    );
                    validate_mime(resource.mime_type.as_ref().map(AsRef::as_ref))?;
                    total = total.saturating_add(bytes.len());
                }
                _ => anyhow::bail!("Unsupported embedded resource type"),
            },
            ContentBlock::ResourceLink(link) => {
                if sent_by_user {
                    anyhow::ensure!(
                        safe_external_uri(&link.uri),
                        "Resource links must use http or https URLs"
                    );
                }
                total = total.saturating_add(
                    link.name.len()
                        + link.uri.len()
                        + link.title.as_ref().map_or(0, String::len)
                        + link.description.as_ref().map_or(0, String::len),
                );
            }
            _ => anyhow::bail!("Unsupported ACP content block"),
        }
    }
    anyhow::ensure!(
        total <= total_limit,
        "Rich content exceeds {total_limit} bytes"
    );
    Ok(())
}

pub fn safe_external_uri(value: &str) -> bool {
    let lower = value.trim().to_ascii_lowercase();
    (lower.starts_with("https://") || lower.starts_with("http://"))
        && !value.chars().any(char::is_control)
}

fn decode(value: &str, name: &str) -> anyhow::Result<Vec<u8>> {
    STANDARD
        .decode(value)
        .map_err(|_| anyhow::anyhow!("{name} must be base64 encoded"))
}

fn validate_mime(mime: Option<&str>) -> anyhow::Result<()> {
    if let Some(mime) = mime {
        anyhow::ensure!(
            mime.contains('/') && !mime.chars().any(char::is_control),
            "Invalid resource MIME type"
        );
    }
    Ok(())
}

fn image_matches(mime: &str, bytes: &[u8]) -> bool {
    match mime {
        "image/png" => bytes.starts_with(b"\x89PNG\r\n\x1a\n"),
        "image/jpeg" => bytes.starts_with(&[0xff, 0xd8, 0xff]),
        "image/gif" => bytes.starts_with(b"GIF87a") || bytes.starts_with(b"GIF89a"),
        "image/webp" => bytes.len() >= 12 && &bytes[..4] == b"RIFF" && &bytes[8..12] == b"WEBP",
        _ => false,
    }
}

fn audio_matches(mime: &str, bytes: &[u8]) -> bool {
    match mime {
        "audio/mpeg" => {
            bytes.starts_with(b"ID3")
                || bytes.starts_with(&[0xff, 0xfb])
                || bytes.starts_with(&[0xff, 0xf3])
                || bytes.starts_with(&[0xff, 0xf2])
        }
        "audio/wav" => bytes.len() >= 12 && &bytes[..4] == b"RIFF" && &bytes[8..12] == b"WAVE",
        "audio/ogg" => bytes.starts_with(b"OggS"),
        "audio/webm" => bytes.starts_with(&[0x1a, 0x45, 0xdf, 0xa3]),
        _ => false,
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn rejects_bad_mime_and_data() {
        let image = acp::ImageContent::new("aGVsbG8=", "image/png");
        assert!(validate_prompt(&[ContentBlock::Image(image)]).is_err());
    }
    #[test]
    fn never_treats_javascript_as_a_resource_link() {
        assert!(!safe_external_uri("javascript:alert(1)"));
    }

    #[test]
    fn accepts_verified_image_and_rejects_oversized_resource() {
        let png = acp::ImageContent::new("iVBORw0KGgo=", "image/png");
        assert!(validate_prompt(&[ContentBlock::Image(png)]).is_ok());
        let resource = acp::TextResourceContents::new(
            "x".repeat(MAX_EMBEDDED_RESOURCE_BYTES + 1),
            "attachment://large.txt",
        );
        assert!(
            validate_prompt(&[ContentBlock::Resource(acp::EmbeddedResource::new(
                EmbeddedResourceResource::TextResourceContents(resource),
            ))])
            .is_err()
        );
    }

    #[test]
    fn user_resource_links_need_safe_uris() {
        let link = acp::ResourceLink::new("bad", "javascript:alert(1)");
        assert!(validate_prompt(&[ContentBlock::ResourceLink(link)]).is_err());
    }

    #[test]
    fn audio_mime_must_match_its_decoded_data() {
        let valid = acp::AudioContent::new("SUQz", "audio/mpeg");
        assert!(validate_prompt(&[ContentBlock::Audio(valid)]).is_ok());
        let mislabeled = acp::AudioContent::new("SUQz", "audio/wav");
        assert!(validate_prompt(&[ContentBlock::Audio(mislabeled)]).is_err());
    }

    #[test]
    fn blob_resources_are_bounded_and_base64_validated() {
        let blob = acp::BlobResourceContents::new("aGVsbG8=", "attachment://note.bin")
            .mime_type("application/octet-stream");
        assert!(
            validate_prompt(&[ContentBlock::Resource(acp::EmbeddedResource::new(
                EmbeddedResourceResource::BlobResourceContents(blob),
            ))])
            .is_ok()
        );
        let malformed = acp::BlobResourceContents::new("not base64", "attachment://note.bin");
        assert!(
            validate_prompt(&[ContentBlock::Resource(acp::EmbeddedResource::new(
                EmbeddedResourceResource::BlobResourceContents(malformed),
            ))])
            .is_err()
        );
    }

    #[test]
    fn mixed_blocks_cannot_exceed_the_total_prompt_budget() {
        let half_plus_one = "x".repeat(MAX_RICH_PROMPT_BYTES / 2 + 1);
        assert!(validate_prompt(&[
            ContentBlock::Text(acp::TextContent::new(half_plus_one.clone())),
            ContentBlock::Text(acp::TextContent::new(half_plus_one)),
        ])
        .is_err());
    }
}
