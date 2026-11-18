import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

// Optional browser test: point PLAYWRIGHT_PATH to an installed Playwright package.
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PATH || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH, headless: true });
const output = process.env.UI_OUTPUT_DIR || "artifacts/ui";
await mkdir(output, { recursive: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(process.env.UI_BASE_URL || "http://127.0.0.1:4322/lvi-tyot/");
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator(".service-accordion").count(), 4);
    assert.equal(await page.locator(".service-accordion__item").count(), 11);
    assert.equal(await page.locator(".service-accordion__item[open]").count(), 0);
    const first = page.locator(".service-accordion__item").nth(0);
    const second = page.locator(".service-accordion__item").nth(1);
    await first.locator("summary").click();
    assert.equal(await first.evaluate((element) => element.open), true);
    assert.equal(await first.locator(".service-accordion__body").isVisible(), true);
    await second.locator("summary").click();
    assert.equal(await first.evaluate((element) => element.open), true);
    assert.equal(await second.evaluate((element) => element.open), true);
    await first.locator("summary").press("Enter");
    assert.equal(await first.evaluate((element) => element.open), false);
    await first.locator("summary").press("Space");
    assert.equal(await first.evaluate((element) => element.open), true);
    assert.equal(await first.locator(".service-accordion__indicator").evaluate((element) => getComputedStyle(element, "::after").content), "none");
    await first.locator("summary").click();
    await second.locator("summary").click();
    const links = page.locator(".lvi-work-service-nav__links a");
    assert.equal(await links.count(), 6);
    await links.first().click();
    assert.equal(new URL(page.url()).hash, "#korjaukset-ja-asennukset");
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      audienceColumns: getComputedStyle(document.querySelector(".lvi-work-audience-links")).gridTemplateColumns.split(" ").length,
      proseWidths: [...document.querySelectorAll(".lvi-work-article__copy")].map((element) => element.getBoundingClientRect().width),
    }));
    assert.equal(layout.overflow, 0);
    assert.equal(layout.audienceColumns, width <= 760 ? 1 : 2);
    assert.ok(layout.proseWidths.every((value) => value <= 820));
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: join(output, `lvi-tyot-haitarit-${width}.png`) });
    }
    console.log(JSON.stringify({ width, accordion: "click, Enter, Space and multi-open passed", ...layout }));
  }
  await page.locator("#villa-upinniemi").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(output, "lvi-tyot-referenssi.png") });
  await page.locator("#palvelut").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(output, "lvi-tyot-palvelunavigaatio.png") });
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
