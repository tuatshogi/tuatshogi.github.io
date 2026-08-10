export const pages = [
  { id: "home", path: "/", heading: "詰みは見える。" },
  { id: "entry", path: "/entry.html", heading: "入部案内" },
  { id: "record", path: "/record.html", heading: "大会記録" },
  { id: "introduce", path: "/introduce.html", heading: "活動紹介" },
  { id: "news", path: "/news.html", heading: "お知らせ一覧" },
];

export const viewports = [
  { id: "mobile-320", width: 320, height: 568 },
  { id: "mobile", width: 375, height: 812 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "tablet-1024", width: 1024, height: 768 },
  { id: "desktop", width: 1440, height: 900 },
];

export async function visitPage(page, pageDefinition, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(pageDefinition.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}
