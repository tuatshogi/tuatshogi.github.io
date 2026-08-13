import { expect, test } from "@playwright/test";

const cmsSnapshotUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/snapshot";
const cmsNoticesUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/notices";
const cmsRecordsUrl = "https://mycraft-cms.tuatshogi.workers.dev/api/public/records";
const snapshot = {
  notices: [
    {
      id: "cms-notice",
      title: "CMSからのお知らせ",
      body: "自動同期された本文です。",
      linkUrl: "/record.html",
      publishedAt: "2026-08-10T13:10:00.000Z",
      attachments: [],
    },
  ],
  records: [
    {
      year: "CMS同期年度",
      sourceUrl: "https://example.com/results",
      publishedAt: "2026-08-10T13:10:00.000Z",
      sortOrder: 0,
      items: [
        { date: "2026.05.24", event: "CMS同期大会", result: "優勝", detail: "自動同期", highlight: true },
      ],
    },
  ],
};

async function mockCms(page) {
  const fulfill = (route, body) => route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: { "access-control-allow-origin": "*" },
    body: JSON.stringify(body),
  });
  await page.route(cmsSnapshotUrl, (route) => fulfill(route, snapshot));
  await page.route(cmsNoticesUrl, (route) => fulfill(route, { notices: snapshot.notices }));
  await page.route(`${cmsNoticesUrl}/cms-notice`, (route) => fulfill(route, { notice: snapshot.notices[0] }));
  await page.route(cmsRecordsUrl, (route) => fulfill(route, { records: snapshot.records }));
}

test("CMS snapshot replaces news and records and opens a dynamic notice detail", async ({ page }) => {
  await mockCms(page);

  await page.goto("/?cms-preview=1");
  await expect(page.locator("#root")).toHaveAttribute("data-cms-sync", "ready");
  await expect(page.getByRole("region", { name: "お知らせ" }).getByText("CMSからのお知らせ")).toBeVisible();

  await page.goto("/record.html?cms-preview=1");
  await expect(page.locator("#root")).toHaveAttribute("data-cms-sync", "ready");
  await expect(page.getByRole("heading", { level: 2, name: "CMS同期年度" })).toBeVisible();
  await expect(page.getByText("CMS同期大会")).toBeVisible();

  await page.goto("/news.html?id=cms-notice&cms-preview=1");
  await expect(page.locator("#root")).toHaveAttribute("data-cms-sync", "ready");
  await expect(page.getByRole("heading", { level: 1, name: "CMSからのお知らせ" })).toBeVisible();
  await expect(page.getByText("自動同期された本文です。")).toBeVisible();
  await expect(page).toHaveTitle("CMSからのお知らせ｜お知らせ｜東京農工大学将棋部");
});

test("CMS failure retains prerendered fallback records", async ({ page }) => {
  await page.route(cmsRecordsUrl, (route) => route.abort());
  await page.goto("/record.html?cms-preview=1");
  await expect(page.locator("#root")).toHaveAttribute("data-cms-sync", "fallback");
  await expect(page.getByRole("heading", { level: 2, name: "2026年度（令和8年度）" })).toBeVisible();
});

test("CMS synchronization starts after the initial prerender and suppresses repeated focus requests", async ({ page }) => {
  let requests = 0;
  await page.route(cmsNoticesUrl, (route) => {
    requests += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify({ notices: snapshot.notices }),
    });
  });
  await page.goto("/news.html?cms-preview=1");
  await expect(page.locator("[data-cms-notice-list]")).toBeVisible();
  await expect(page.locator("#root")).toHaveAttribute("data-cms-sync", "ready");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await page.waitForTimeout(50);
  expect(requests).toBe(1);
});
