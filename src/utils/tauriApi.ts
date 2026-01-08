
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
    await exit();
}