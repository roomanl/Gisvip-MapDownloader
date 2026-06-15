import { Store } from '@tauri-apps/plugin-store';

const store = await Store.load('downstore.bin');

const downZxyKey = 'downZxy';
const downErrorZxyKey = 'downErrorZxy';

export const getDownZxy = async (taskId: string) => {
  return await store.get(`${downZxyKey}-${taskId}`);
};
export const setDownZxy = async (taskId: string, value: any) => {
  await store.set(`${downZxyKey}-${taskId}`, value);
  await store.save();
};

export const getDownErrorZxy = async (taskId: string) => {
  return await store.get(`${downErrorZxyKey}-${taskId}}`);
};
export const setDownErrorZxy = async (taskId: string, value: any) => {
  await store.set(`${downErrorZxyKey}-${taskId}}`, value);
  await store.save();
};