import { defineConfig } from "vite";

// eslint-disable-next-line import/no-unresolved
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // Konfigurasi untuk Testing (Vitest)
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./vitest.setup.js",
  },
});
