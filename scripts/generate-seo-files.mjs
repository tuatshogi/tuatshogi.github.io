import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pageDefinitionList, siteOrigin } from "../src/data/pageDefinitions.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = resolve(projectRoot, "dist");

await mkdir(distRoot, { recursive: true });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pageDefinitionList.map(
    (page) => `  <url>\n    <loc>${page.canonicalUrl}</loc>\n  </url>`,
  ),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "",
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  "",
].join("\n");

await Promise.all([
  writeFile(resolve(distRoot, "sitemap.xml"), sitemap),
  writeFile(resolve(distRoot, "robots.txt"), robots),
]);

console.log("Generated sitemap.xml and robots.txt.");
