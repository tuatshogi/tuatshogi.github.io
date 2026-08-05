import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import { basename, dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = resolve(projectRoot, "assets");
const pageDefinitions = [
  { file: "index.html", page: "home", text: "詰みは見える。", currentHref: "/" },
  { file: "entry.html", page: "entry", text: "入部案内", currentHref: "/entry.html" },
  { file: "record.html", page: "record", text: "大会記録", currentHref: "/record.html" },
  { file: "introduce.html", page: "introduce", text: "活動紹介", currentHref: "/introduce.html" },
];
const htmlFiles = [...pageDefinitions.map(({ file }) => file), "top.html"];
const referencedAssets = new Set();

function isExternalReference(value) {
  return /^(?:[a-z]+:|#|\/\/)/i.test(value) && !value.startsWith("/");
}

function resolveLocalReference(htmlFile, value) {
  const cleanValue = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  if (!cleanValue || cleanValue.startsWith("data:") || isExternalReference(cleanValue)) {
    return null;
  }

  const relativePath = cleanValue.startsWith("/")
    ? cleanValue.slice(1)
    : cleanValue.replace(/^\.\//, "");
  const absolutePath = cleanValue.startsWith("/")
    ? resolve(projectRoot, relativePath)
    : resolve(projectRoot, dirname(htmlFile), relativePath);

  const assetPath = relative(assetsRoot, absolutePath);
  if (assetPath && !assetPath.startsWith("..") && !assetPath.includes("/")) {
    referencedAssets.add(assetPath);
  }
  return absolutePath;
}

function imageBudget(fileName) {
  if (fileName.startsWith("hero-")) return 150 * 1024;
  if (fileName.startsWith("activity-")) return 200 * 1024;
  if (fileName.startsWith("campus-map-")) return 150 * 1024;
  if (fileName.startsWith("emblem-")) return 50 * 1024;
  if (fileName.startsWith("logo-")) return 30 * 1024;
  return 300 * 1024;
}

function imageTagByAlt(html, alt) {
  return [...html.matchAll(/<img\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find((tag) => tag.includes(`alt="${alt}"`));
}

function imageTagByAsset(html, assetName) {
  return [...html.matchAll(/<img\b[^>]*>/gi)]
    .map(([tag]) => tag)
    .find((tag) => tag.includes(`/assets/${assetName}-`));
}

function assertImageAttributes(tag, label, attributes) {
  assert(tag, `${label}: image is missing`);
  for (const [name, value] of Object.entries(attributes)) {
    assert.match(
      tag,
      new RegExp(`\\b${name}="${value}"`, "i"),
      `${label}: expected ${name}="${value}"`,
    );
  }
}

for (const page of pageDefinitions) {
  const html = await readFile(resolve(projectRoot, page.file), "utf8");
  assert.match(
    html,
    new RegExp(`<div id="root" data-page="${page.page}">\\s*<`),
    `${page.file}: prerendered root is empty or data-page is incorrect`,
  );
  assert.match(html, /<h1[\s>]/, `${page.file}: h1 is missing`);
  assert(html.includes(page.text), `${page.file}: expected prerendered text is missing`);
  assert(!/<link\b[^>]*rel="preload"[^>]*as="image"/i.test(html), `${page.file}: image preload remains`);
  assert(
    html.includes(`href="${page.currentHref}" aria-current="page"`),
    `${page.file}: current navigation item is not exposed`,
  );

  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(tag, /\bwidth="\d+"/i, `${page.file}: image width is missing: ${tag}`);
    assert.match(tag, /\bheight="\d+"/i, `${page.file}: image height is missing: ${tag}`);
  }
}

const entryHtml = await readFile(resolve(projectRoot, "entry.html"), "utf8");
const campusMapTag = imageTagByAlt(
  entryHtml,
  "小金井キャンパス内のサークル棟B棟までの案内図",
);
assertImageAttributes(campusMapTag, "entry.html: campus map", {
  width: "2017",
  height: "1712",
  loading: "lazy",
  decoding: "async",
});
assert.match(entryHtml, /<source\b[^>]*type="image\/avif"/, "entry.html: AVIF source is missing");

const introduceHtml = await readFile(resolve(projectRoot, "introduce.html"), "utf8");
const activityRoomTag = imageTagByAlt(introduceHtml, "部室での活動風景");
const tournamentTag = imageTagByAlt(introduceHtml, "大会参加時の集合写真");
assertImageAttributes(activityRoomTag, "introduce.html: primary activity image", {
  width: "1600",
  height: "1200",
  loading: "eager",
  decoding: "async",
  fetchPriority: "high",
});
assertImageAttributes(tournamentTag, "introduce.html: secondary activity image", {
  width: "1350",
  height: "1080",
  loading: "lazy",
  decoding: "async",
});
assert.equal(
  (introduceHtml.match(/<source\b[^>]*type="image\/avif"/g) || []).length,
  2,
  "introduce.html: expected two AVIF sources",
);

const indexHtml = await readFile(resolve(projectRoot, "index.html"), "utf8");
assert.match(indexHtml, /<source\b[^>]*type="image\/avif"/, "index.html: Hero AVIF source is missing");
assertImageAttributes(imageTagByAsset(indexHtml, "hero"), "index.html: Hero image", {
  width: "1254",
  height: "1254",
  loading: "eager",
  decoding: "async",
  fetchPriority: "high",
});
assertImageAttributes(imageTagByAsset(indexHtml, "emblem"), "index.html: header emblem", {
  width: "72",
  height: "72",
  fetchPriority: "low",
});
assertImageAttributes(imageTagByAsset(indexHtml, "logo"), "index.html: header logo", {
  width: "560",
  height: "99",
  fetchPriority: "low",
});
assert(!indexHtml.includes("fonts.googleapis.com"), "index.html: external font stylesheet remains");

for (const htmlFile of htmlFiles) {
  const html = await readFile(resolve(projectRoot, htmlFile), "utf8");
  const references = [];

  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/gi)) {
    references.push(match[1]);
  }
  for (const match of html.matchAll(/\bsrcSet="([^"]+)"/gi)) {
    for (const candidate of match[1].split(",")) {
      references.push(candidate.trim().split(/\s+/, 1)[0]);
    }
  }

  for (const reference of references) {
    const absolutePath = resolveLocalReference(htmlFile, reference);
    if (!absolutePath) continue;
    await assert.doesNotReject(
      access(absolutePath),
      `${htmlFile}: referenced file does not exist: ${reference}`,
    );
  }
}

for (const cssFile of [...referencedAssets].filter((fileName) => extname(fileName) === ".css")) {
  const css = await readFile(resolve(assetsRoot, cssFile), "utf8");
  for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
    const reference = match[1];
    const absolutePath = resolveLocalReference(`assets/${cssFile}`, reference);
    if (!absolutePath) continue;
    await assert.doesNotReject(
      access(absolutePath),
      `assets/${cssFile}: referenced file does not exist: ${reference}`,
    );
  }
}

const assetFiles = await readdir(assetsRoot);
const imageAssetFiles = assetFiles.filter((fileName) =>
  [".avif", ".webp", ".jpg", ".jpeg", ".png"].includes(extname(fileName).toLowerCase()),
);
assert.equal(imageAssetFiles.length, 33, "assets/: expected exactly 33 responsive image files");

const expectedImageWidths = {
  "activity-room": { avif: [640, 960, 1280, 1600], webp: [640, 960, 1280, 1600] },
  "activity-tournament": { avif: [640, 960, 1280], webp: [640, 960, 1280] },
  "campus-map": { avif: [640, 960, 1280], webp: [640, 960, 1280] },
  emblem: { webp: [72, 144] },
  hero: { avif: [480, 768, 1024, 1254], webp: [480, 768, 1024, 1254] },
  logo: { webp: [160, 280, 560] },
};

for (const [assetName, formats] of Object.entries(expectedImageWidths)) {
  for (const [format, widths] of Object.entries(formats)) {
    const actualWidths = imageAssetFiles
      .map((fileName) => fileName.match(new RegExp(`^${assetName}-(\\d+)-.+\\.${format}$`)))
      .filter(Boolean)
      .map((match) => Number(match[1]))
      .sort((a, b) => a - b);
    assert.deepEqual(actualWidths, widths, `assets/: unexpected ${assetName} ${format} widths`);
  }
}

for (const fileName of assetFiles) {
  const filePath = resolve(assetsRoot, fileName);
  const stats = await stat(filePath);
  assert(stats.isFile(), `assets/${fileName}: unexpected directory`);
  assert(referencedAssets.has(fileName), `assets/${fileName}: stale or unreferenced build asset`);
  assert(stats.size < 3 * 1024 * 1024, `assets/${fileName}: asset exceeds 3 MB`);

  if (imageAssetFiles.includes(fileName)) {
    assert(
      [".avif", ".webp"].includes(extname(fileName).toLowerCase()),
      `assets/${fileName}: responsive images must be AVIF or WebP`,
    );
    assert(
      stats.size <= imageBudget(fileName),
      `assets/${fileName}: image exceeds its ${Math.round(imageBudget(fileName) / 1024)} kB budget`,
    );
  }
}

const javaScriptFiles = assetFiles.filter((fileName) => extname(fileName) === ".js");
assert(javaScriptFiles.length > 0, "No client JavaScript bundle was generated");
for (const fileName of javaScriptFiles) {
  const source = await readFile(resolve(assetsRoot, fileName));
  const gzipBytes = gzipSync(source).length;
  assert(gzipBytes <= 5 * 1024, `assets/${fileName}: gzip size exceeds 5 kB (${gzipBytes} bytes)`);
}

console.log(
  `Build checks passed for ${pageDefinitions.length} pages and ${assetFiles.length} referenced assets.`,
);
