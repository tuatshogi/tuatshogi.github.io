import { copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = ["index.html", "top.html", "entry.html", "record.html", "introduce.html"];

await Promise.all(
  pages.map((page) =>
    copyFile(resolve(projectRoot, "templates", page), resolve(projectRoot, page)),
  ),
);
