use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

struct AppState {
    cascade_offset: Mutex<i32>,
}

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
    let id = params.id.trim();
    let label = format!("widget-{}", id);
    
    if let Some(window) = app.get_webview_window(&label) {
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }

    let width = params.width.unwrap_or(360.0);
    let height = params.height.unwrap_or(220.0);
    
    let x = params.x.unwrap_or(100.0);
    let y = params.y.unwrap_or(100.0);

    let window_title = match params.widget_type.as_str() {
        "clock" => "Clock",
        "notes" => "Notes",
        _ => "Widget",
    };

    let hash_path = format!("#/widget/{}?id={}", params.widget_type, id);
    
    // Use app protocol for both dev and prod; dev will resolve via devUrl automatically.
    println!("OPENING WIDGET label={} hash={}", label, hash_path);
        let init_script = format!(
                r#"window.addEventListener('DOMContentLoaded', () => {{
    if (window.location.hash !== "{hash}") {{
        window.location.hash = "{hash}";
    }}
}});"#,
                hash = hash_path
        );

        let builder = tauri::WebviewWindowBuilder::new(&app, &label, tauri::WebviewUrl::App("index.html".into()))
                .initialization_script(&init_script)
    .on_page_load(|window, _| {
        #[cfg(debug_assertions)]
        {
            println!("on_page_load triggered!");
            window.open_devtools();
            let _ = window.eval(
                r#"document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;top:6px;left:6px;z-index:999999;background:#f00;color:#fff;padding:4px 6px;font:12px monospace;border:1px solid #fff;">WIDGET BOOT</div>');"#,
            );
        }
    });

    let window = builder
        .title(window_title)
        .inner_size(width, height)
        .position(x, y)
        .decorations(false)
        .resizable(true)
        .skip_taskbar(true)
        .build()
        .map_err(|e| e.to_string())?;

    #[cfg(debug_assertions)]
    {
        window.set_focus().ok();
        match window.eval(
            r#"document.body.innerHTML = '<div style="font:14px monospace;color:#fff;background:#222;padding:8px;">EVAL OK</div>';"#,
        ) {
            Ok(_) => println!("eval after build: OK"),
            Err(err) => println!("eval after build: ERR {}", err),
        }
    }

    Ok(())
}

fn create_widget(app: &tauri::AppHandle, widget_type: &str, state: &AppState) -> Result<(), String> {
    let id = uuid::Uuid::new_v4().to_string();
    
    let mut offset = state.cascade_offset.lock().unwrap();
    let cascade = *offset * 30;
    *offset = (*offset + 1) % 10;
    drop(offset);
    
    let (width, height) = match widget_type {
        "clock" => (360.0, 220.0),
        "notes" => (400.0, 300.0),
        _ => (360.0, 220.0),
    };
    
    let params = OpenWidgetParams {
        id,
        widget_type: widget_type.to_string(),
        x: Some(100.0 + cascade as f64),
        y: Some(100.0 + cascade as f64),
        width: Some(width),
        height: Some(height),
    };
    
    open_widget_window(app.clone(), params)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let add_clock = MenuItem::with_id(app, "add_clock", "Add Clock Widget", true, None::<&str>)?;
            let add_notes = MenuItem::with_id(app, "add_notes", "Add Notes Widget", true, None::<&str>)?;
            let toggle_host = MenuItem::with_id(app, "toggle_host", "Show/Hide Host Window", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            
            let menu = Menu::with_items(app, &[&add_clock, &add_notes, &toggle_host, &quit])?;
            
            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .on_menu_event(|app, event| {
                    let state = app.state::<AppState>();
                    match event.id.as_ref() {
                        "add_clock" => {
                            let _ = create_widget(app, "clock", &state);
                        }
                        "add_notes" => {
                            let _ = create_widget(app, "notes", &state);
                        }
                        "toggle_host" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = match window.is_visible() {
                                    Ok(true) => window.hide(),
                                    _ => window.show(),
                                };
                            }
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .build(app)?;
            
            Ok(())
        })
        .manage(AppState {
            cascade_offset: Mutex::new(0),
        })
        .invoke_handler(tauri::generate_handler![open_widget_window])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
