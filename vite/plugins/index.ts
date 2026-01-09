import vue from '@vitejs/plugin-vue';
import topLevelAwait from 'vite-plugin-top-level-await'

import createSvgIconsPlugin from './svg-icon';
import path from 'path';

export default (viteEnv: any, isBuild = false): [] => {
  const vitePlugins: any = [];
  vitePlugins.push(vue());
  vitePlugins.push(createSvgIconsPlugin(path));
  vitePlugins.push(topLevelAwait({
      // The default value is 1000
      promiseExportName: '__tla',
      // The default value is '__tla'
      promiseImportName: i => `__tla_${i}`
  }));
  return vitePlugins;
};
