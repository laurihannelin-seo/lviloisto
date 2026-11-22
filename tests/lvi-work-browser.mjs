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
  for (const width of [320, 390, 768, 1024, 1100, 1101, 1280, 1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(process.env.UI_BASE_URL || "http://127.0.0.1:4322/lvi-tyot/");
    await page.evaluate(() => document.fonts.ready);
    const expectedOrder = ["monipuoliset-lvi-tyot", "palvelut", "korjaukset-ja-asennukset", "lammitys", "ilmanvaihto", "uudisrakentaminen", "saneeraustyot", "erikoisosaaminen", "kohteet", "yhteistyo", "toimialue", "yhteydenotto"];
    assert.deepEqual(await page.locator(".lvi-work-article > .lvi-work-article__section, .lvi-work-article > .lvi-work-service-nav").evaluateAll((items) => items.map((item) => item.id)), expectedOrder);
    assert.deepEqual(await page.locator(".lvi-work-hero__toc-list a").evaluateAll((items) => items.map((item) => item.hash.slice(1))), expectedOrder);
    const intro = page.locator(".lvi-work-intro");
    await intro.locator(".lvi-work-photo img").evaluate((image) => image.decode());
    const introLayout = await intro.evaluate((element) => {
      const copy = element.querySelector(".lvi-work-article__copy").getBoundingClientRect();
      const media = element.querySelector(".lvi-work-intro__media").getBoundingClientRect();
      const quote = element.querySelector(".lvi-work-quote").getBoundingClientRect();
      return { columns: getComputedStyle(element).gridTemplateColumns.split(" ").length, copyLeft: copy.left, copyBottom: copy.bottom, mediaLeft: media.left, mediaTop: media.top, mediaBottom: media.bottom, quoteBottom: quote.bottom, copyShare: copy.width / (copy.width + media.width) };
    });
    assert.equal(introLayout.columns, width <= 1100 ? 1 : 2);
    if (width <= 1100) assert.ok(introLayout.mediaTop >= introLayout.quoteBottom, "The image must follow the text and quotation on mobile/tablet");
    else {
      assert.ok(Math.abs(introLayout.copyShare - 0.55) < 0.01);
      assert.ok(Math.abs(introLayout.copyBottom - introLayout.mediaBottom) < 1);
      assert.ok(introLayout.mediaLeft > introLayout.copyLeft);
    }
    if (width === 390 || width === 1440) {
      await intro.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100));
      await page.screenshot({ path: join(output, `lvi-tyot-intro-${width}.png`) });
    }
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo(0, document.querySelector(".lvi-work-hero").getBoundingClientRect().bottom + window.scrollY - 400));
      await page.screenshot({ path: join(output, "lvi-tyot-hero-content-alignment.png") });
    }
    assert.equal(await page.locator(".service-accordion").count(), 4);
    assert.equal(await page.locator(".service-accordion__item").count(), 11);
    assert.equal(await page.locator(".service-accordion__item[open]").count(), 0);
    for (const id of ["lammitys", "ilmanvaihto"]) {
      const section = page.locator(`#${id}`);
      assert.equal(await section.locator(".lvi-work-photo, .lvi-work-section-lead--split").count(), 0);
      const fallback = await section.evaluate((element) => {
        const lead = element.querySelector(".lvi-work-section-lead");
        const copy = lead.querySelector(".lvi-work-article__copy").getBoundingClientRect();
        const accordion = element.querySelector(".service-accordion").getBoundingClientRect();
        const paragraph = lead.querySelector(".lvi-work-article__copy > p");
        return { display: getComputedStyle(lead).display, copyWidth: copy.width, leadBottom: lead.getBoundingClientRect().bottom, accordionTop: accordion.top, accordionWidth: accordion.width, sectionWidth: element.getBoundingClientRect().width, paragraphSize: parseFloat(getComputedStyle(paragraph).fontSize), paragraphLineHeight: parseFloat(getComputedStyle(paragraph).lineHeight) };
      });
      assert.equal(fallback.display, "block", "Missing images must not leave an empty image column");
      assert.ok(fallback.copyWidth <= 750);
      assert.ok(Math.abs(fallback.accordionWidth - fallback.sectionWidth) < 1);
      assert.ok(fallback.accordionTop > fallback.leadBottom);
      assert.ok(fallback.paragraphSize >= 16 && fallback.paragraphSize <= 17);
      assert.ok(Math.abs(fallback.paragraphLineHeight / fallback.paragraphSize - 1.6) < 0.01);
      if (width === 390 || width === 1440) {
        await section.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100));
        await page.screenshot({ path: join(output, `lvi-tyot-${id}-${width}.png`) });
      }
    }
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
      heroLeft: document.querySelector(".lvi-work-hero h1").getBoundingClientRect().left,
      heroRight: document.querySelector(".service-page-hero__inner").getBoundingClientRect().right,
      contentRight: document.querySelector(".lvi-work-content__layout").getBoundingClientRect().right,
      sectionLefts: [...document.querySelectorAll(".lvi-work-article__section, .lvi-work-service-nav, .service-accordion")].map((element) => element.getBoundingClientRect().left),
      sectionGaps: [...document.querySelector(".lvi-work-article").children].slice(1).map((element) => element.getBoundingClientRect().top - element.previousElementSibling.getBoundingClientRect().bottom),
    }));
    assert.equal(layout.overflow, 0);
    assert.equal(layout.audienceColumns, width <= 760 ? 1 : 2);
    assert.ok(layout.proseWidths.every((value) => value <= 750));
    assert.ok(layout.sectionGaps.every((value) => Math.abs(value - (width <= 760 ? 48 : 80)) < 1), "Sections must use a consistent vertical rhythm");
    assert.ok(layout.sectionLefts.every((value) => Math.abs(value - layout.heroLeft) < 1), "Content sections must align with the hero text");
    assert.ok(Math.abs(layout.contentRight - layout.heroRight) < 1, "Content and hero must share the same outer width");
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: join(output, `lvi-tyot-haitarit-${width}.png`) });
    }
    assert.equal(await page.locator(".lvi-work-photo img").count(), 4);
    assert.equal(await page.locator('.lvi-work-photo img[loading="lazy"]').count(), 4);
    assert.equal(await page.locator(".lvi-work-quote .person-identity__avatar img").count(), 1);
    for (const [index, photo] of (await page.locator(".lvi-work-photo").all()).entries()) {
      await photo.scrollIntoViewIfNeeded();
      await photo.locator("img").evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
      assert.equal(await photo.locator("img").evaluateAll((images) => images.every((image) => image.naturalWidth > 0)), true);
      if (width === 390 || width === 1440) {
        await photo.evaluate((element) => window.scrollTo(0, element.getBoundingClientRect().top + window.scrollY - 100));
        await page.screenshot({ path: join(output, `lvi-tyot-photo-${index + 1}-${width}.png`) });
      }
    }
    const imageShare = await page.evaluate(() => {
      const main = document.querySelector("main").getBoundingClientRect();
      const mediaArea = [...document.querySelectorAll(".lvi-work-hero, .lvi-work-photo__frames")].reduce((sum, element) => { const box = element.getBoundingClientRect(); return sum + box.width * box.height; }, 0);
      return Math.round(mediaArea / (main.width * main.height) * 100);
    });
    assert.ok(imageShare > 0 && imageShare <= 35, "Photography must stay secondary to service content");
    console.log(JSON.stringify({ width, imageShare, accordion: "click, Enter, Space and multi-open passed", ...layout }));
  }
  assert.equal(await page.locator('.lvi-work-reference, a[href="#villa-upinniemi"], a[href="#yrjonkatu"]').count(), 0);
  await page.locator("#palvelut").scrollIntoViewIfNeeded();
  await page.screenshot({ path: join(output, "lvi-tyot-palvelunavigaatio.png") });
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
