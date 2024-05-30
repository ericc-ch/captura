import path from "node:path";
import { chromium, devices, type BrowserContext } from "playwright";

const URL = "https://desacode.vercel.app/";
const DIR_VIEW = path.join(process.cwd(), "src/view");
const DIR_OUT = path.join(process.cwd(), "out");

const STRING_DESKTOP = "desktop";
const STRING_MOBILE = "mobile";

const DEVICES = {
  [STRING_DESKTOP]: devices["Desktop Chrome"],
  [STRING_MOBILE]: devices["Pixel 7"],
};

const PATHS_MOCKUP = {
  [STRING_DESKTOP]: path.join(DIR_VIEW, `${STRING_DESKTOP}.html`),
  [STRING_MOBILE]: path.join(DIR_VIEW, `${STRING_MOBILE}.html`),
};

const PATHS_RAW_SCREENSHOT = {
  [STRING_DESKTOP]: path.join(DIR_VIEW, `${STRING_DESKTOP}.png`),
  [STRING_MOBILE]: path.join(DIR_VIEW, `${STRING_MOBILE}.png`),
};

const PATHS_OUT = {
  [STRING_DESKTOP]: path.join(DIR_OUT, `${STRING_DESKTOP}.png`),
  [STRING_MOBILE]: path.join(DIR_OUT, `${STRING_MOBILE}.png`),
};

const browser = await chromium.launch({ headless: false });

async function createMockup(type: keyof typeof DEVICES) {
  const context = await browser.newContext(DEVICES[type]);
  const page = await context.newPage();

  const fileUrl = Bun.pathToFileURL(PATHS_MOCKUP[type]);

  await page.goto(URL, { waitUntil: "networkidle" });
  await page.screenshot({ path: PATHS_RAW_SCREENSHOT[type] });

  await page.goto(fileUrl.toString(), {
    waitUntil: "networkidle",
  });
  await page.screenshot({
    path: PATHS_OUT[type],
    fullPage: true,
    omitBackground: true,
  });

  await context.close();
}

const selectedDevices = [STRING_DESKTOP, STRING_MOBILE] as const;
const processes = selectedDevices.map(createMockup);
await Promise.all(processes);

await browser.close();
