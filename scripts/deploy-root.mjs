import { cp, copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");
const pages = ["index.html", "top.html", "entry.html", "record.html", "introduce.html"];

await rm(resolve(projectRoot, "assets"), { recursive: true, force: true });
await mkdir(resolve(projectRoot, "assets"), { recursive: true });
await cp(resolve(distRoot, "assets"), resolve(projectRoot, "assets"), {
  recursive: true,
  force: true,
});
await Promise.all(
  pages.map((page) =>
    copyFile(resolve(distRoot, page), resolve(projectRoot, page)),
  ),
);

console.log("Static site deployed to the project root.");
