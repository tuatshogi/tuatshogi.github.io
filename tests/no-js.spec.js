import { expect, test } from "@playwright/test";
import { pages } from "./test-fixtures.js";

for (const pageDefinition of pages) {
  test(`${pageDefinition.id} exposes its main content without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto(new URL(pageDefinition.path, baseURL).href);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      pageDefinition.heading,
    );
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator('nav[aria-label="メインナビゲーション"]')).toBeVisible();

    await context.close();
  });
}
