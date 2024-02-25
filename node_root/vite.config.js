import { defineConfig } from "vite";

// https://vitejs.dev/config/

export default defineConfig({
  server: {
    host: "0.0.0.0",
    strictPort: true,
    port: 5173,
  },
});