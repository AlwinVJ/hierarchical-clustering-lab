import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const basePath =
  process.env["BASE_PATH"] ||
  (process.env["NODE_ENV"] === "production" ? "/hierarchical-clustering-lab/" : "/");

export default defineConfig({
  base: basePath,
  plugins: [
    tailwindcss(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      spa: { enabled: true },
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }),
  ],
});
