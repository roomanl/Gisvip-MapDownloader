import { Store } from '@tauri-apps/plugin-store';
import {  downloadDir } from '@tauri-apps/api/path';

const store = await Store.load('store.bin');
const tdtKey = 'tdt-key'
const downloadPathKey = 'download-path'

export const getTdtKey = async () => {
  const key = await store.get(tdtKey)
  return key.replaceAll(/\s/g,'');
}
export const setTdtKey = async (key: string) => {
  await store.set(tdtKey, key.replaceAll(/\s/g,''))
  await store.save()
}

export const getDownloadPath = async () => {
  const path = await store.get(downloadPathKey)
  if (!path) {
    return await downloadDir()
  }
  return path
}
export const setDownloadPath = async (path: string) => {
  await store.set(downloadPathKey, path)
  await store.save()
}

export const getSettings = async () => {
  return {
    tdtKey: await getTdtKey(),
    downloadPath: await getDownloadPath(),
  }
}