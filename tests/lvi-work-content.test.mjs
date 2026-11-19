import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { micromark } from "micromark";
import yaml from "js-yaml";

const root = new URL("../", import.meta.url);
const content = JSON.parse(readFileSync(new URL("src/content/cms/lvi-tyot.json", root)));
const html = readFileSync(new URL("dist/lvi-tyot/index.html", root), "utf8");
const config = yaml.load(readFileSync(new URL(".pages.yml", root), "utf8"));

test("LVI work uses owned photographs with editable, lazy-loaded content imagery", () => {
  assert.equal(content.hero.image, "/images/home/hero-imgl1743.jpg");
  assert.doesNotMatch(html, /tekninen-tila-hero|uudisrakentamisen-putkiasennukset/);
  assert.equal((html.match(/class="lvi-work-photo"/g) ?? []).length, 2);
  const photos = content.sections.filter((section) => section.image);
  assert.deepEqual(photos.map((section) => section.id), ["saneeraustyot", "erikoisosaaminen"]);
  for (const section of photos) {
    assert.ok(readFileSync(new URL(`public${section.image}`, root)).length > 0);
    assert.ok(html.includes(section.imageAlt));
    assert.ok(html.includes(section.imageCaption));
    if (section.supportingImage) {
      assert.ok(readFileSync(new URL(`public${section.supportingImage}`, root)).length > 0);
      assert.ok(html.includes(section.supportingImageAlt));
    }
  }
  const fields = config.content.find((entry) => entry.name === "lvi_work_page").fields.find((field) => field.name === "sections").fields;
  for (const name of ["image", "imageAlt", "supportingImage", "supportingImageAlt", "imageCaption"]) {
    assert.ok(fields.some((field) => field.name === name));
  }
});

test("LVI work copy retains all CMS paragraphs and a single H1", () => {
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(content.seo.title));
  assert.equal(content.sections.length, 10);
  assert.equal(content.sections.reduce((sum, section) => sum + section.subsections.length, 0), 15);
  for (const section of content.sections) {
    assert.ok(html.includes(`id="${section.id}"`));
    assert.ok(html.includes(`href="#${section.id}"`));
    assert.ok(html.includes(section.title));
    for (const item of [section, ...section.subsections]) {
      if (section.id === "kohteet" && item !== section) {
        assert.ok(html.includes(item.summary));
        assert.ok(html.includes(`href="${item.href}"`));
        continue;
      }
      for (const paragraph of item.body) assert.ok(html.includes(micromark(paragraph)), paragraph);
    }
  }
  assert.doesNotMatch(html, /lvi-work-final-cta|id="lvi-work-cta-heading"/);
  assert.ok(!html.includes(content.finalCta.title));
  assert.equal(config.content.find((entry) => entry.name === "lvi_work_page").fields.find((field) => field.name === "finalCta").hidden, true);
});

test("service disclosures, navigation and reference placement have real HTML structure", () => {
  assert.equal((html.match(/class="service-accordion"/g) ?? []).length, 4);
  assert.equal((html.match(/<details class="service-accordion__item">/g) ?? []).length, 11);
  assert.doesNotMatch(html, /<details class="service-accordion__item"[^>]*\sopen/);
  assert.equal(content.serviceNavigation.items.length, 6);
  for (const item of content.serviceNavigation.items) {
    assert.ok(html.includes(`href="${item.href}"`));
    if (item.href.startsWith("#")) assert.ok(html.includes(`id="${item.href.slice(1)}"`));
  }
  for (const reference of content.references) {
    const position = html.indexOf(`id="${reference.id}"`);
    const parent = content.sections.findIndex((section) => section.id === reference.afterSection);
    assert.ok(position > html.indexOf(`id="${reference.afterSection}"`));
    assert.ok(position < html.indexOf(`id="${content.sections[parent + 1].id}"`));
    assert.ok(html.includes(reference.text));
  }
  const fields = config.content.find((entry) => entry.name === "lvi_work_page").fields;
  assert.ok(fields.some((field) => field.name === "serviceNavigation"));
  assert.ok(fields.some((field) => field.name === "references"));
});

test("LVI work CMS fields match content, links and safe formatting work", () => {
  const entry = config.content.find((entry) => entry.name === "lvi_work_page");
  assert.deepEqual(entry.fields.map((field) => field.name).sort(), Object.keys(content).sort());
  for (const slug of ["arvoasunnot", "omakotitalot", "taloyhtiot", "rakennusliikkeet"]) {
    assert.ok(html.includes(`href="/${slug}/"`));
  }
  assert.ok(html.includes('href="#palvelut"'));
  assert.ok(html.includes('id="palvelut"'));
  assert.ok(html.includes('id="lvi-work-hero-contact-popover"'));
  assert.ok(html.includes("<strong>"));
  assert.equal(micromark("<script>alert(1)</script>").includes("<script>"), false);
});
