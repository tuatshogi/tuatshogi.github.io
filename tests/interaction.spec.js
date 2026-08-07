import { expect, test } from "@playwright/test";
import { visitPage } from "./test-fixtures.js";

test("mobile menu keeps its keyboard and breakpoint behavior", async ({ page }) => {
  await visitPage(page, { path: "/" }, { width: 375, height: 812 });

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
