import { defineConfig } from "vite";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const noticeDirectory = resolve(root, "news");
let noticeEntries = [];
try {
  noticeEntries = readdirSync(noticeDirectory, { withFileTypes: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const noticeInputs = Object.fromEntries(
  noticeEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => [
      `news/${entry.name.replace(/\.html$/, "")}`,
      resolve(noticeDirectory, entry.name),
    ]),
);

export default defineConfig({
  base: "./",
  publicDir: resolve(root, "public"),
  build: {
    assetsInlineLimit: 0,
    emptyOutDir: true,
    outDir: resolve(root, "node_modules/.cache/hero-intro-preview"),
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        top: resolve(root, "top.html"),
        entry: resolve(root, "entry.html"),
        record: resolve(root, "record.html"),
        introduce: resolve(root, "introduce.html"),
        news: resolve(root, "news.html"),
        heroIntroPreview: resolve(root, "hero-intro-preview.html"),
        ...noticeInputs,
      },
    },
  },
});
