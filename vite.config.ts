import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from "node:url";
import path from "path";
import createVitePlugins from './vite/plugins'


// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  // @ts-expect-error process is a nodejs global
  const host = process.env.TAURI_DEV_HOST;
  const env = loadEnv(mode, process.cwd());
  return {
  //  base:'./',
  plugins: createVitePlugins(env, command === 'build'),

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus/es/components/**/css',
        "src/types/*.d.ts"
      ]
    }
}
});
