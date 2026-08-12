import { expect, test } from "@playwright/test";
import { pages, viewports } from "./test-fixtures.js";

const hideMutableText = `
  header nav a, header button,
  main h1, main h2, main p, main a, main time, main span, main figcaption,
  footer nav a, footer a[href^="mailto:"], footer small {
    color: transparent !important;
    text-decoration-color: transparent !important;
    text-shadow: none !important;
  }
`;

for (const pageDefinition of pages) {
  for (const viewport of viewports) {
    test(`${pageDefinition.id} ${viewport.id} visual baseline`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(pageDefinition.path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        pageDefinition.heading,
      );
      // The hosted Chromium runner has a small, stable antialiasing variance on this page.
      const maxDiffPixelRatio = pageDefinition.id === "news" && viewport.id === "tablet-1024"
        ? 0.015
        : 0.01;
      await expect(page).toHaveScreenshot(
        `${pageDefinition.id}-${viewport.id}.png`,
        {
          fullPage: true,
          style: hideMutableText,
          maxDiffPixelRatio,
        },
      );
    });
  }
}
