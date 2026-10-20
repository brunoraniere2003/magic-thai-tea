import { defineConfig, devices } from "@playwright/test";
import base from "./playwright.config";

// Cross-browser pass (brief G5/G6): Chrome, Safari (desktop, iPhone, iPad), Firefox.
// Runs against the production build (npm run build first): the dev server
// is too slow for several Safari workers at once.
export default defineConfig({
  ...base,
  use: { ...base.use, baseURL: "http://localhost:3100" },
  webServer: {
    command: "npx next start -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "safari", use: { ...devices["Desktop Safari"] } },
    { name: "iphone", use: { ...devices["iPhone 13"] } },
    { name: "ipad", use: { ...devices["iPad (gen 7)"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
  ],
});
