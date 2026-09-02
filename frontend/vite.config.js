import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    // Serve auth.html and its companion assets directly from /public
    // without being swallowed by Vite's SPA HTML-fallback middleware.
    {
      name: "serve-auth-html",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Exact match for /auth.html
          if (req.url === "/auth.html" || req.url.startsWith("/auth.html?")) {
            const filePath = path.resolve(__dirname, "public", "auth.html");
            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
