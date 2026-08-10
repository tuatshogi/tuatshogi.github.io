import { expect, test } from "@playwright/test";
import { pages, viewports, visitPage } from "./test-fixtures.js";

for (const pageDefinition of pages) {
  for (const viewport of viewports) {
    test(`${pageDefinition.id} ${viewport.id} has a stable layout`, async ({ page }) => {
      await visitPage(page, pageDefinition, viewport);

      const layout = await page.evaluate(() => {
        const { documentElement } = document;
        const viewportWidth = documentElement.clientWidth;
        const content = [...document.querySelectorAll("header, main, footer")];
        const overflowingElements = content
          .map((element) => ({
            name: element.tagName.toLowerCase(),
            right: element.getBoundingClientRect().right,
            left: element.getBoundingClientRect().left,
          }))
          .filter(({ right, left }) => right > viewportWidth + 1 || left < -1);

        return {
          hasHorizontalOverflow: documentElement.scrollWidth > viewportWidth,
          overflowingElements,
        };
      });

      expect(layout.hasHorizontalOverflow).toBe(false);
      expect(layout.overflowingElements).toEqual([]);

      const desktopNavigation = page.locator('nav[aria-label="メインナビゲーション"]');
      const mobileNavigation = page.locator("#mobile-navigation");
      const menuButton = page.locator("[data-menu-toggle]");

      if (viewport.width < 768) {
        await expect(desktopNavigation).toBeHidden();
        await expect(mobileNavigation).toBeHidden();
        await expect(menuButton).toBeVisible();
      } else {
        await expect(desktopNavigation).toBeVisible();
        await expect(mobileNavigation).toBeHidden();
        await expect(menuButton).toBeHidden();
      }
    });
  }
}
