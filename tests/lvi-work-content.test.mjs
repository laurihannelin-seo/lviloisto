import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { micromark } from "micromark";
import yaml from "js-yaml";

const root = new URL("../", import.meta.url);
const content = JSON.parse(readFileSync(new URL("src/content/cms/lvi-tyot.json", root)));
const html = readFileSync(new URL("dist/lvi-tyot/index.html", root), "utf8");
const config = yaml.load(readFileSync(new URL(".pages.yml", root), "utf8"));

test("LVI work retains owned photographs and labels the two approved generic service images", () => {
  assert.equal(content.hero.image, "/images/home/hero-imgl1743.jpg");
  assert.doesNotMatch(html, /tekninen-tila-hero|uudisrakentamisen-putkiasennukset/);
  assert.equal((html.match(/class="lvi-work-photo(?:\s[^"]*)?"/g) ?? []).length, 5);
  const photos = content.sections.filter((section) => section.image);
  assert.deepEqual(photos.map((section) => section.id), ["monipuoliset-lvi-tyot", "lammitys", "ilmanvaihto", "saneeraustyot", "erikoisosaaminen"]);
  for (const section of photos) {
    assert.ok(readFileSync(new URL(`public${section.image}`, root)).length > 0);
    assert.ok(html.includes(section.imageAlt));
    if (section.imageCaption) assert.ok(html.includes(section.imageCaption));
    if (section.supportingImage) {
      assert.ok(readFileSync(new URL(`public${section.supportingImage}`, root)).length > 0);
      assert.ok(html.includes(section.supportingImageAlt));
    }
  }
  const fields = config.content.find((entry) => entry.name === "lvi_work_page").fields.find((field) => field.name === "sections").fields;
  for (const name of ["image", "imageAlt", "supportingImage", "supportingImageAlt", "imageCaption", "imageLayout"]) {
    assert.ok(fields.some((field) => field.name === name));
  }
  assert.deepEqual(fields.find((field) => field.name === "imageLayout").options.values.map((option) => option.name), ["below", "right", "left"]);
  const sources = JSON.parse(readFileSync(new URL("public/images/lvi-tyot/image-sources.json", root)));
  for (const [id, layout] of [["lammitys", "right"], ["ilmanvaihto", "left"]]) {
    const section = content.sections.find((item) => item.id === id);
    assert.equal(section.imageLayout, layout);
    assert.ok(section.imageCaption.startsWith("Kuvituskuva:"));
    assert.ok(sources.images.some((image) => section.image.endsWith(image.file) && image.license === "CC0 1.0"));
  }
  assert.ok(!content.sections.find((section) => section.id === "korjaukset-ja-asennukset").image);
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
  assert.ok(html.includes('id="yhteydenotto"'));
  assert.ok(html.includes(content.finalCta.title));
  for (const paragraph of content.finalCta.body) assert.ok(html.includes(micromark(paragraph)));
  assert.notEqual(config.content.find((entry) => entry.name === "lvi_work_page").fields.find((field) => field.name === "finalCta").hidden, true);
});

test("introduction, service-first order and condensed copy match the new structure", () => {
  const expected = ["monipuoliset-lvi-tyot", "korjaukset-ja-asennukset", "lammitys", "ilmanvaihto", "uudisrakentaminen", "saneeraustyot", "erikoisosaaminen", "kohteet", "yhteistyo", "toimialue"];
  assert.deepEqual(content.sections.map((section) => section.id), expected);
  const introduction = content.sections[0];
  assert.equal(introduction.title, "LVI-työt koteihin ja kiinteistöihin");
  assert.equal(introduction.body.length, 2);
  assert.equal(introduction.image, "/images/lvi-tyot/kylpyhuone-image00058.webp");
  assert.ok(html.includes(introduction.quote.text));
  assert.ok(html.includes(introduction.quote.author));
  assert.ok(html.includes('class="lvi-work-quote"'));
  const order = [expected[0], "palvelut", ...expected.slice(1), "yhteydenotto"];
  let previous = -1;
  for (const id of order) {
    const position = html.indexOf(`id="${id}"`);
    assert.ok(position > previous, `${id} must appear after the preceding section`);
    previous = position;
  }
  for (const id of ["uudisrakentaminen", "saneeraustyot"]) {
    const section = content.sections.find((item) => item.id === id);
    assert.equal(section.body.length, 2);
    assert.equal(section.subsections.length, 0);
  }
  const fields = config.content.find((entry) => entry.name === "lvi_work_page").fields.find((field) => field.name === "sections").fields;
  assert.deepEqual(fields.find((field) => field.name === "quote").fields.map((field) => field.name), ["text", "author"]);
});

test("service disclosures and navigation remain intact without removed reference callouts", () => {
  assert.equal((html.match(/class="service-accordion"/g) ?? []).length, 4);
  assert.equal((html.match(/<details class="service-accordion__item">/g) ?? []).length, 11);
  assert.doesNotMatch(html, /<details class="service-accordion__item"[^>]*\sopen/);
  assert.equal(content.serviceNavigation.items.length, 6);
  for (const item of content.serviceNavigation.items) {
    assert.ok(html.includes(`href="${item.href}"`));
    if (item.href.startsWith("#")) assert.ok(html.includes(`id="${item.href.slice(1)}"`));
  }
  assert.doesNotMatch(html, /lvi-work-reference|villa-upinniemi|yrjonkatu|Villa Upinniemi|Yrjönkadun kattohuoneisto/);
  const fields = config.content.find((entry) => entry.name === "lvi_work_page").fields;
  assert.ok(fields.some((field) => field.name === "serviceNavigation"));
  assert.ok(!fields.some((field) => field.name === "references"));
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
