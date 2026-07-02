import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "dist");
const entries = ["index.html", ".nojekyll", "assets"];

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

for (const entry of entries) {
  const from = path.join(root, entry);
  const to = path.join(outDir, entry);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, to, { recursive: true });
}

console.log(`Built static site to ${path.relative(root, outDir)}`);
