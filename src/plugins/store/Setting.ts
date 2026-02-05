import { Store } from '@tauri-apps/plugin-store';
import {  resourceDir,join   } from '@tauri-apps/api/path';

const store = await Store.load('store.bin');
const tdtKey = 'tdt-key'
const downloadPathKey = 'download-path'
const downLimitKey = 'download-limit'

export const getTdtKey = async () => {
  const key = await store.get(tdtKey)
  return key;
}
export const setTdtKey = async (key: string) => {
  await store.set(tdtKey, key.replaceAll(/\s/g,''))
  await store.save()
}

export const getDownloadPath = async () => {
  const path = await store.get(downloadPathKey)
  return path?path:join(await resourceDir(),'map')
}
export const setDownloadPath = async (path: string) => {
  await store.set(downloadPathKey, path)
  await store.save()
}
export const getDownloadLimit = async () => {
  const limit = await store.get(downLimitKey)
  return limit?limit:1
}
export const setDownloadLimit = async (limit: number) => {
  await store.set(downLimitKey, limit)
  await store.save()
}

export const getSettings = async () => {
  return {
    tdtKey: await getTdtKey(),
    downloadPath: await getDownloadPath(),
    downLimit: await getDownloadLimit(),
  }
}