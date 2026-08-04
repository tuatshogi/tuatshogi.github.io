import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import {
  ogImage,
  pageDefinitionList,
  siteOrigin,
} from "../src/data/pageDefinitions.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const expectedBodyText = {
  home: "詰みは見える。",
  entry: "入部・見学方法",
  introduce: "日頃の活動",
  record: "2026年度（令和8年度）",
};

for (const page of pageDefinitionList) {
  const html = await readFile(resolve(projectRoot, page.outputFile), "utf8");

  assert(!html.includes("<!--ssr-outlet-->"), `${page.outputFile}: SSR outlet remains`);
  assert.match(html, /<div id="root"[^>]*>\s*</, `${page.outputFile}: root has no prerendered markup`);
  assert(html.includes(`<title>${page.title}</title>`), `${page.outputFile}: title mismatch`);
  assert(
    html.includes(`<meta name="description" content="${page.description}">`),
    `${page.outputFile}: description mismatch`,
  );
  assert(
    html.includes(`<link rel="canonical" href="${page.canonicalUrl}">`),
    `${page.outputFile}: canonical mismatch`,
  );
  assert(html.includes(`<meta property="og:url" content="${page.canonicalUrl}">`));
  assert(html.includes(`<meta property="og:image" content="${ogImage.url}">`));
  assert(html.includes('<meta name="twitter:card" content="summary_large_image">'));
  assert(html.includes("<h1"), `${page.outputFile}: h1 missing`);
  assert(html.includes(expectedBodyText[page.id]), `${page.outputFile}: expected body text missing`);
  assert(!html.includes("top.html"), `${page.outputFile}: legacy top.html link remains`);
  assert(!html.includes("/src/"), `${page.outputFile}: unbuilt source URL remains`);

  const jsonLdMatch = html.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
  if (page.id === "home") {
    assert(jsonLdMatch, "index.html: Organization JSON-LD missing");
    const structuredData = JSON.parse(jsonLdMatch[1]);
    assert.equal(structuredData["@type"], "Organization");
    assert.equal(structuredData.url, `${siteOrigin}/`);
  } else {
    assert.equal(jsonLdMatch, null, `${page.outputFile}: unexpected JSON-LD`);
  }
}

const topHtml = await readFile(resolve(projectRoot, "top.html"), "utf8");
assert(topHtml.includes('<meta http-equiv="refresh" content="0; url=/">'));
assert(topHtml.includes(`<link rel="canonical" href="${siteOrigin}/">`));
assert(topHtml.includes('<a href="/">'));
assert(!topHtml.includes("src/main.jsx"));

const sitemap = await readFile(resolve(projectRoot, "sitemap.xml"), "utf8");
for (const page of pageDefinitionList) {
  assert(sitemap.includes(`<loc>${page.canonicalUrl}</loc>`));
}
assert.equal((sitemap.match(/<loc>/g) || []).length, pageDefinitionList.length);
assert(!sitemap.includes("top.html"));

const robots = await readFile(resolve(projectRoot, "robots.txt"), "utf8");
assert(robots.includes("User-agent: *\nAllow: /"));
assert(robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`));

const ogPath = resolve(projectRoot, "og-image.jpg");
const [ogMetadata, ogStats] = await Promise.all([sharp(ogPath).metadata(), stat(ogPath)]);
assert.equal(ogMetadata.width, ogImage.width);
assert.equal(ogMetadata.height, ogImage.height);
assert(ogStats.size <= 300 * 1024, `og-image.jpg exceeds 300 kB: ${ogStats.size}`);

const organizationLogo = await sharp(resolve(projectRoot, "organization-logo.png")).metadata();
assert.equal(organizationLogo.width, 512);
assert.equal(organizationLogo.height, 512);

console.log(`SEO checks passed for ${pageDefinitionList.length} canonical pages.`);
