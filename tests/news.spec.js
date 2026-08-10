import { expect, test } from "@playwright/test";

const fixtureSite = Boolean(process.env.NEWS_TEST_SITE);

const expectedTitles = [
  "最新のお知らせ",
  "次のお知らせ",
  "三番目のお知らせ",
  "四番目のお知らせ",
];

test("home shows only the three newest notice titles and detail buttons", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const newsSection = page.getByRole("region", { name: "お知らせ" });
  const notices = newsSection.locator("li");

  if (!fixtureSite) {
    await expect(notices).toHaveCount(0);
    await expect(newsSection.getByText("現在、お知らせはありません。"))
      .toBeVisible();
    return;
  }

  await expect(notices).toHaveCount(3);
  await expect(notices.nth(0)).toContainText(expectedTitles[0]);
  await expect(notices.nth(1)).toContainText(expectedTitles[1]);
  await expect(notices.nth(2)).toContainText(expectedTitles[2]);
  await expect(newsSection.getByText(expectedTitles[3])).toHaveCount(0);
  await expect(newsSection.getByText("下書きのお知らせ")).toHaveCount(0);
  await expect(newsSection.locator("time, img, article")).toHaveCount(0);

  for (const notice of await notices.all()) {
    await expect(notice.getByRole("link")).toHaveCount(2);
    await expect(notice.getByRole("link", { name: "詳細を見る", exact: true })).toBeVisible();
  }
});

test("news index shows four published notices in published date order", async ({ page }) => {
  await page.goto("/news.html", { waitUntil: "networkidle" });
  const notices = page.locator("main li");

  if (!fixtureSite) {
    await expect(notices).toHaveCount(0);
    await expect(page.getByText("現在、お知らせはありません。"))
      .toBeVisible();
    return;
  }

  await expect(notices).toHaveCount(4);
  for (const [index, title] of expectedTitles.entries()) {
    await expect(notices.nth(index)).toContainText(title);
    await expect(notices.nth(index).locator("time")).toBeVisible();
    await expect(notices.nth(index).getByRole("link", { name: "詳細を見る", exact: true }))
      .toHaveAttribute("href", `/news/${["notice-newest", "notice-second", "notice-third", "notice-oldest"][index]}.html`);
  }
  await expect(page.getByText("下書きのお知らせ")).toHaveCount(0);
});

test("notice detail renders content, metadata, links, image, and returns to the index", async ({ page }) => {
  if (!fixtureSite) {
    await page.goto("/news.html", { waitUntil: "networkidle" });
    await expect(page.getByText("現在、お知らせはありません。"))
      .toBeVisible();
    return;
  }

  await page.goto("/news/notice-newest.html", { waitUntil: "networkidle" });
  const article = page.locator("article");
  const body = article.locator(":scope > div").first();

  await expect(page.getByRole("heading", { level: 1, name: "最新のお知らせ" })).toBeVisible();
  await expect(article.locator("time")).toHaveText("2026年8月1日");
  await expect(body.locator("p")).toHaveCount(2);
  await expect(body.locator("p").first()).toContainText("一行目の本文です。");
  await expect(body.locator("p").first()).toContainText("二行目の本文です。");
  await expect(body.locator("p").first().locator("br")).toHaveCount(1);
  await expect(body.locator("p").nth(1)).toContainText("空行の後の段落です。");
  await expect(body.locator('a[href="https://example.com/news-info"]'))
    .toHaveAttribute("href", "https://example.com/news-info");
  await expect(article.getByRole("link", { name: "関連リンク" }))
    .toHaveAttribute("href", "https://example.com/related");

  const image = article.locator("img");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("alt", "テスト用のお知らせ画像");
  await expect(image).toHaveAttribute("width", "4624");
  await expect(image).toHaveAttribute("height", "3468");
  await expect(image).toHaveJSProperty("naturalWidth", 4624);
  await expect(image).toHaveJSProperty("naturalHeight", 3468);

  await page.getByRole("link", { name: "お知らせ一覧へ戻る" }).click();
  await expect(page).toHaveURL(/\/news\.html$/);
});

test("notice detail has canonical and OGP metadata and sitemap excludes drafts", async ({ page }) => {
  if (!fixtureSite) {
    await page.goto("/news.html", { waitUntil: "networkidle" });
    await expect(page.getByText("現在、お知らせはありません。"))
      .toBeVisible();
    return;
  }

  await page.goto("/news/notice-newest.html", { waitUntil: "networkidle" });
  const detailUrl = "https://tuatshogi.github.io/news/notice-newest.html";
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", detailUrl);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", detailUrl);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /最新のお知らせ/);

  const sitemap = await page.request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  for (const id of ["notice-newest", "notice-second", "notice-third", "notice-oldest"]) {
    expect(sitemapText).toContain(`https://tuatshogi.github.io/news/${id}.html`);
  }
  expect(sitemapText).not.toContain("notice-draft");
});

test("notice detail remains visible when JavaScript is disabled", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(new URL(fixtureSite ? "/news/notice-newest.html" : "/news.html", baseURL).href);

  if (fixtureSite) {
    await expect(page.getByRole("heading", { level: 1, name: "最新のお知らせ" })).toBeVisible();
    await expect(page.getByText("一行目の本文です。")).toBeVisible();
    await expect(page.locator('img[alt="テスト用のお知らせ画像"]')).toBeVisible();
    await expect(page.getByRole("link", { name: "お知らせ一覧へ戻る" })).toBeVisible();
  } else {
    await expect(page.getByRole("heading", { level: 1, name: "お知らせ一覧" })).toBeVisible();
    await expect(page.getByText("現在、お知らせはありません。"))
      .toBeVisible();
  }
  await context.close();
});
