import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), "index.html"),
        top: resolve(process.cwd(), "top.html"),
        entry: resolve(process.cwd(), "entry.html"),
        record: resolve(process.cwd(), "record.html"),
        introduce: resolve(process.cwd(), "introduce.html"),
      },
    },
  },
});
