import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const snapshotRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "visual.spec.js-snapshots",
);

const pages = [
  { id: "home", path: "/", heading: "詰みは見える。" },
  { id: "entry", path: "/entry.html", heading: "入部案内" },
  { id: "record", path: "/record.html", heading: "大会記録" },
  { id: "introduce", path: "/introduce.html", heading: "活動紹介" },
];

const viewports = [
  { id: "mobile", width: 375, height: 812 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "desktop", width: 1440, height: 900 },
];

function roundBox(box) {
  if (!box) return null;
  return Object.fromEntries(
    Object.entries(box).map(([key, value]) => [key, Math.round(value)]),
  );
}

async function expectLayoutToMatchBaseline(actual, snapshotName) {
  const baseline = JSON.parse(
    await readFile(resolve(snapshotRoot, `${snapshotName}-${process.platform}.json`), "utf8"),
  );

  expect(actual).toHaveLength(baseline.length);
  for (const [index, item] of actual.entries()) {
    expect(item.tag).toBe(baseline[index].tag);
    expect(item.text).toBe(baseline[index].text);
    for (const key of Object.keys(item.box)) {
      expect(Math.abs(item.box[key] - baseline[index].box[key])).toBeLessThanOrEqual(1);
    }
  }
}

for (const pageDefinition of pages) {
  for (const viewport of viewports) {
    test(`${pageDefinition.id} ${viewport.id} visual baseline`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(pageDefinition.path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        pageDefinition.heading,
      );

      const layout = await page.locator("header, main, footer, h1, main section, main figure, main ul").evaluateAll(
        (elements) => elements.map((element) => ({
          tag: element.tagName.toLowerCase(),
          text: element.textContent.trim().slice(0, 40),
          box: element.getBoundingClientRect().toJSON(),
        })),
      );
      const normalizedLayout = layout.map((item) => ({
        ...item,
        box: roundBox(item.box),
      }));

      await expectLayoutToMatchBaseline(
        normalizedLayout,
        `${pageDefinition.id}-${viewport.id}-layout`,
      );
      await expect(page).toHaveScreenshot(
        `${pageDefinition.id}-${viewport.id}.png`,
        { fullPage: true },
      );
    });
  }
}

test("mobile menu keeps its existing keyboard and breakpoint behavior", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/", { waitUntil: "networkidle" });

  const button = page.locator("[data-menu-toggle]");
  const navigation = page.locator("#mobile-navigation");

  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toHaveAttribute("aria-hidden", "true");

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toHaveAttribute("aria-hidden", "false");
  await expect(navigation).toHaveClass(/max-h-96/);

  await navigation.evaluate((element) => {
    element.addEventListener("click", (event) => event.preventDefault(), {
      capture: true,
      once: true,
    });
  });
  await navigation.locator("[data-menu-link]").first().click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toHaveAttribute("aria-hidden", "true");

  await button.click();
  await page.keyboard.press("Escape");
  await expect(button).toBeFocused();
  await expect(button).toHaveAttribute("aria-expanded", "false");

  await button.click();
  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

for (const pageDefinition of pages) {
  test(`${pageDefinition.id} exposes its main content without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173${pageDefinition.path}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      pageDefinition.heading,
    );
    await context.close();
  });
}
