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
    
    println!("OPENING WIDGET label={} hash={}", label, hash_path);

    let builder = if cfg!(debug_assertions) {
        // Dev mode: load base URL and navigate to hash via script
        let url = tauri::Url::parse("http://localhost:1420/").map_err(|e| format!("URL parse error: {}", e))?;
        tauri::WebviewWindowBuilder::new(&app, &label, tauri::WebviewUrl::External(url))
            .initialization_script(&format!(
                "console.log('Widget init script running'); window.location.hash = '{}'; console.log('Hash set to:', window.location.hash);",
                hash_path
            ))
    } else {
        // Prod mode: load index.html and set hash via script
        tauri::WebviewWindowBuilder::new(
            &app,
            &label,
            tauri::WebviewUrl::App("index.html".into()),
        )
        .initialization_script(&format!(
            "window.location.hash = '{}';",
            hash_path
        ))
    };

    let _window = builder
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
        if let Some(window) = app.get_webview_window(&label) {
            window.open_devtools();
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
