import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import { imagetools } from "vite-imagetools";
import path from "path";
import fs from "fs";

/**
 * `vercel.json` redirects are a platform feature — Vercel applies them at the
 * edge, and the dev server knows nothing about them. That meant /review (the
 * URL printed on the review card and encoded in its QR) 404'd locally while
 * working perfectly in production, which reads as a broken feature.
 *
 * This replays them in dev, reading vercel.json directly so the destination
 * never has to be written down twice.
 */
function vercelRedirects(): Plugin {
  return {
    name: "vercel-redirects-in-dev",
    apply: "serve",
    configureServer(server) {
      let redirects: { source: string; destination: string; permanent?: boolean }[] = [];
      try {
        redirects = JSON.parse(fs.readFileSync("vercel.json", "utf8")).redirects ?? [];
      } catch {
        /* no vercel.json, or malformed — dev just behaves as before */
      }
      if (!redirects.length) return;
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        const hit = redirects.find((r) => r.source === pathname);
        if (!hit) return next();
        res.statusCode = hit.permanent ? 308 : 307;
        res.setHeader("Location", hit.destination);
        res.end();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://firmfoundationsc.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [
    react(),
    // Generates the resized WebP variants behind the `?w=…&as=srcset` imports.
    // The site ships 4.79 MB of media against 0.79 MB of code and had no
    // srcset at all, so a phone on cellular was downloading desktop-sized
    // photographs of an excavator.
    imagetools(),
    vercelRedirects(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
