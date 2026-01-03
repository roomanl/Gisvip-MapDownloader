use tauri::Manager;
// use tokio::time::{sleep, Duration};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[tauri::command]
async fn close_splashscreen(window: tauri::Window) -> Result<(), ()> {
    if let Some(splash_window) = window.get_webview_window("splashscreen") {
        splash_window.close().unwrap();
    }
    let main_window = window.get_webview_window("main").unwrap();
    main_window.show().unwrap();

    Ok(())
}
// 显示主窗口
#[tauri::command]
async fn show_main_window(window: tauri::Window) -> Result<(), String> {
    // sleep(Duration::from_millis(200)).await;
    let main_window = window.get_webview_window("main").unwrap();
    main_window.show().unwrap();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            close_splashscreen,
            show_main_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
