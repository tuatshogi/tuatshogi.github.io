import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import {
  ogImage,
  organizationStructuredData,
  pageDefinitionList,
} from "../src/data/pageDefinitions.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const verificationToken = "Huue_-aFmgh6HdhPvxhdEA5aeZYsDr5MvZvjtjCK0N4";

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function buildSeoHead(page) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonicalUrl = escapeHtml(page.canonicalUrl);
  const imageAlt = escapeHtml(ogImage.alt);
  const organizationJson = JSON.stringify(organizationStructuredData).replaceAll("<", "\\u003c");

  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    '<meta name="robots" content="index,follow">',
    `<link rel="canonical" href="${canonicalUrl}">`,
    '<meta property="og:site_name" content="東京農工大学将棋部">',
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonicalUrl}">`,
    `<meta property="og:image" content="${ogImage.url}">`,
    `<meta property="og:image:width" content="${ogImage.width}">`,
    `<meta property="og:image:height" content="${ogImage.height}">`,
    `<meta property="og:image:alt" content="${imageAlt}">`,
    '<meta property="og:locale" content="ja_JP">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${ogImage.url}">`,
    `<meta name="twitter:image:alt" content="${imageAlt}">`,
    page.id === "home"
      ? `<meta name="google-site-verification" content="${verificationToken}">`
      : "",
    page.id === "home"
      ? `<script type="application/ld+json">${organizationJson}</script>`
      : "",
  ]
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join("\n");
}

const vite = await createServer({
  root: projectRoot,
  appType: "custom",
  logLevel: "error",
  server: { middlewareMode: true, hmr: false, ws: false },
});

try {
  const { render } = await vite.ssrLoadModule("/src/entry-server.jsx");

  for (const page of pageDefinitionList) {
    const filePath = resolve(projectRoot, page.outputFile);
    await mkdir(dirname(filePath), { recursive: true });
    const templatePath = page.page === "notice"
      ? resolve(projectRoot, "templates", "notice.html")
      : filePath;
    const template = await readFile(templatePath, "utf8");

    if (!template.includes("<!--seo-head-->") || !template.includes("<!--ssr-outlet-->")) {
      throw new Error(`${page.outputFile} is missing a prerender placeholder.`);
    }

    const appHtml = render(page.page ?? page.id, page.articleId);
    const html = template
      .replace("  <!--seo-head-->", buildSeoHead(page))
      .replace("<!--ssr-outlet-->", appHtml);

    await writeFile(filePath, html);
  }
} finally {
  await vite.close();
}

console.log(`Prerendered ${pageDefinitionList.length} pages.`);
