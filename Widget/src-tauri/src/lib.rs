use tauri::{Manager, Window};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct OpenWidgetParams {
    id: String,
    widget_type: String,
    x: Option<f64>,
    y: Option<f64>,
    width: Option<f64>,
    height: Option<f64>,
}

#[tauri::command]
fn open_widget_window(
    app: tauri::AppHandle,
    params: OpenWidgetParams,
) -> Result<(), String> {
    let label = format!("widget-{}", params.id);
    
    if let Some(window) = app.get_webview_window(&label) {
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    let url = format!("/#/widget/{}?id={}", params.widget_type, params.id);
    let width = params.width.unwrap_or(360.0);
    let height = params.height.unwrap_or(220.0);
    
    let x = params.x.unwrap_or(100.0);
    let y = params.y.unwrap_or(100.0);

    tauri::WebviewWindowBuilder::new(&app, &label, tauri::WebviewUrl::App(url.into()))
        .title(&label)
        .inner_size(width, height)
        .position(x, y)
        .decorations(false)
        .resizable(true)
        .skip_taskbar(true)
        .always_on_top(false)
        .transparent(true)
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_widget_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
