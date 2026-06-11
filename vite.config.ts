import path from "path";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react(), tailwindcss()],
    server: {
      allowedHosts: ["https://web-dev.xdtunnel.icu/"],
      proxy: {
        "/api": {
          target: (
            env.VITE_API_BASE_URL || "https://koko.xdtunnel.icu"
          ).replace(/\/$/, ""),
          changeOrigin: true,
          secure: false,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
