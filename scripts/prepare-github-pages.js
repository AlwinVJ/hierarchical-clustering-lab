import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";

const clientDir = resolve("dist/client");
const shellPath = join(clientDir, "_shell.html");

if (!existsSync(shellPath)) {
  console.error("Error: _shell.html not found in dist/client.");
  process.exit(1);
}

const shell = readFileSync(shellPath, "utf-8");

// 1. Create root index.html
writeFileSync(join(clientDir, "index.html"), shell, "utf-8");
console.log("Created dist/client/index.html");

// 2. Create 404.html for GitHub Pages SPA routing fallback
writeFileSync(join(clientDir, "404.html"), shell, "utf-8");
console.log("Created dist/client/404.html");

// 3. Create .nojekyll so GitHub Pages doesn't ignore files starting with underscores
writeFileSync(join(clientDir, ".nojekyll"), "", "utf-8");
console.log("Created dist/client/.nojekyll");

// 4. Pre-create route directories with index.html for direct URL navigation
const slugs = [
  "introduction",
  "fundamentals",
  "types",
  "agglomerative",
  "divisive",
  "linkage",
  "distance-metrics",
  "dendrograms",
  "mathematics",
  "implementation",
  "evaluation",
  "comparison",
  "limitations",
  "applications",
  "projects",
];

for (const slug of slugs) {
  const dir = join(clientDir, slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), shell, "utf-8");
}
console.log(`Created ${slugs.length} route directories with index.html`);
console.log("GitHub Pages preparation completed successfully!");
