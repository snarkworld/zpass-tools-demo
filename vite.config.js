import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import wasm from "vite-plugin-wasm";
import WebWorkerPlugin from 'vite-plugin-webworker-service';

// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: "es",
  },
  plugins: [
    wasm(),
    WebWorkerPlugin(),
    react()
  ],
  build: {
    target: "esnext",
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["@aleohq/wasm", "@aleohq/sdk"],
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
});
