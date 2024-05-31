import path from "node:path";
import { chromium, devices, type BrowserContext } from "playwright";

const DIR_OUT = path.join(process.cwd(), "out");

const outPath = (url: string) =>
  path.join(DIR_OUT, `${url.replace(/\//g, "_")}.png`);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext(devices["Desktop Chrome"]);

async function fullScreenshot(url: string) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  await new Promise((resolve) => setTimeout(resolve, 60000));

  await page.screenshot({ path: outPath(url), fullPage: true });
}

const urls = [
  "http://localhost:5173/home",
  "http://localhost:3000/id",
  "http://localhost:5174/signin",
];
const processes = urls.map(fullScreenshot);
await Promise.all(processes);

await context.close();
await browser.close();
