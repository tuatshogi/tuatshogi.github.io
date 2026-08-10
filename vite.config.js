import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const noticeDirectory = resolve(process.cwd(), "news");
let noticeEntries = [];
try {
  noticeEntries = readdirSync(noticeDirectory, { withFileTypes: true });
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const noticeInputs = Object.fromEntries(
  noticeEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => [`news/${entry.name.replace(/\.html$/, "")}`, resolve(noticeDirectory, entry.name)]),
);

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        top: resolve(process.cwd(), "top.html"),
        entry: resolve(process.cwd(), "entry.html"),
        record: resolve(process.cwd(), "record.html"),
        introduce: resolve(process.cwd(), "introduce.html"),
        news: resolve(process.cwd(), "news.html"),
        ...noticeInputs,
      },
    },
  },
});
