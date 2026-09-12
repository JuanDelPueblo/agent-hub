//! Embedded static files handler

use axum::{
    body::Body,
    http::{header, Response, StatusCode, Uri},
    response::IntoResponse,
};
use rust_embed::Embed;

#[derive(Embed)]
#[folder = "static/"]
struct StaticAssets;

pub async fn static_handler(uri: Uri) -> impl IntoResponse {
    let path = uri.path().trim_start_matches('/');
    let path = if path.is_empty() { "index.html" } else { path };

    let (target_path, is_fallback) = match StaticAssets::get(path) {
        Some(_) => (path, false),
        None => ("index.html", true),
    };

    match StaticAssets::get(target_path) {
        Some(content) => {
            let mime = mime_guess::from_path(target_path).first_or_octet_stream();
            let cache_control = if !is_fallback && target_path.starts_with("assets/") {
                "public, max-age=31536000, immutable"
            } else {
                "no-cache, must-revalidate"
            };
            Response::builder()
                .status(StatusCode::OK)
                .header(header::CONTENT_TYPE, mime.as_ref())
                .header(header::CACHE_CONTROL, cache_control)
                .body(Body::from(content.data.into_owned()))
                .unwrap()
        }
        None => Response::builder()
            .status(StatusCode::NOT_FOUND)
            .body(Body::from("Not Found"))
            .unwrap(),
    }
}
