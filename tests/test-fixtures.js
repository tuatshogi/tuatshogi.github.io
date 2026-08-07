export const pages = [
  { id: "home", path: "/", heading: "詰みは見える。" },
  { id: "entry", path: "/entry.html", heading: "入部案内" },
  { id: "record", path: "/record.html", heading: "大会記録" },
  { id: "introduce", path: "/introduce.html", heading: "活動紹介" },
];

export const viewports = [
  { id: "mobile", width: 375, height: 812 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "desktop", width: 1440, height: 900 },
];

export async function visitPage(page, pageDefinition, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(pageDefinition.path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}
