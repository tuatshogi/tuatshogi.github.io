import { expect, test } from "@playwright/test";

test("initial empty notices are visible on the home page", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const newsSection = page.getByRole("region", { name: "お知らせ" });
  await expect(newsSection.getByText("現在、お知らせはありません。"))
    .toBeVisible();
  await expect(newsSection.locator("li")).toHaveCount(0);
});

test("initial empty notices are visible on the news index", async ({ page }) => {
  await page.goto("/news.html", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1, name: "お知らせ一覧" })).toBeVisible();
  await expect(page.getByText("現在、お知らせはありません。"))
    .toBeVisible();
  await expect(page.locator("article")).toHaveCount(0);
});
