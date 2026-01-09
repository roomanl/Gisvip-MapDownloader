
import { getCurrentWindow } from '@tauri-apps/api/window';
import { exit } from '@tauri-apps/plugin-process';
import { invoke } from '@tauri-apps/api/core';
/**
 * 
 * @param name 
 * @returns 
 */
export const greet = async (name: string): Promise<string> => {
    return await invoke("greet", { name });
}

export const getCurrentWindowInstance = async () => {
    return await getCurrentWindow();
}
/**
 * 退出应用
 */
export const  exitApp = async () => {
    try {
        await exit(1);
    } catch (error) {
        console.warn('Process plugin not available, using alternative exit method:', error);
        // Fallback to closing the window if plugin is not available
        await getCurrentWindow().close();
    }
}