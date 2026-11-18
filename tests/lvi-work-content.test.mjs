import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { micromark } from "micromark";
import yaml from "js-yaml";

const root = new URL("../", import.meta.url);
const content = JSON.parse(readFileSync(new URL("src/content/cms/lvi-tyot.json", root)));
const html = readFileSync(new URL("dist/lvi-tyot/index.html", root), "utf8");
const config = yaml.load(readFileSync(new URL(".pages.yml", root), "utf8"));

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
      for (const paragraph of item.body) assert.ok(html.includes(micromark(paragraph)), paragraph);
    }
  }
  for (const paragraph of content.finalCta.body) assert.ok(html.includes(micromark(paragraph)));
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
