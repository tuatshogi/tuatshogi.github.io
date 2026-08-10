import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rootFiles = (await readdir(projectRoot, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
  .map((entry) => entry.name);
let noticeFiles = [];
try {
  noticeFiles = (await readdir(resolve(projectRoot, "news"), { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => resolve(projectRoot, "news", entry.name));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const files = [...rootFiles.map((file) => resolve(projectRoot, file)), ...noticeFiles];
if (files.length === 0) throw new Error("No HTML files found.");
await execFileAsync("npx", ["html-validate", ...files], { cwd: projectRoot, stdio: "inherit" });
console.log(`HTML checks passed for ${files.length} files.`);
