import { defineConfig } from "@playwright/test";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    colorScheme: "light",
    locale: "ja-JP",
    launchOptions: executablePath ? { executablePath } : {},
    reducedMotion: "no-preference",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER
    ? undefined
    : {
        command: "python3 -m http.server 4173 --bind 127.0.0.1 > /dev/null 2>&1",
        reuseExistingServer: true,
        url: "http://127.0.0.1:4173/",
      },
});
