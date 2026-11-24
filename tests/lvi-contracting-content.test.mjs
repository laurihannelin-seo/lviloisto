import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import yaml from "js-yaml";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const content = JSON.parse(read("src/content/cms/lvi-urakointi.json"));
const html = read("dist/lvi-urakointi/index.html");
const config = yaml.load(read(".pages.yml"));

test("contracting copy, SEO and client photos render from Pages CMS", () => {
  const entry = config.content.find(({ name }) => name === "lvi_contracting_page");
  assert.deepEqual(entry.fields.map(({ name }) => name).sort(), Object.keys(content).sort());
  assert.ok(html.includes(`<title>${content.seo.title}</title>`));
  assert.ok(html.includes(`content="${content.seo.description}"`));
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes(`<p>${content.trust.intro}</p>`));
  const quote = html.match(/<figure class="lvi-work-quote">[\s\S]*?<\/figure>/)?.[0];
  assert.ok(quote?.includes(`<blockquote><p>”${content.trust.quote}”</p></blockquote>`));
  assert.match(quote, /<figcaption>[\s\S]*?class="person-identity__avatar"[\s\S]*?<cite>Matias Ryynänen<\/cite>/);
  const sections = [
    content.introSection, content.services, ...content.services.items,
    content.newBuild, content.renovation, content.audiences, ...content.audiences.items,
    ...content.process.items, content.trust, content.cities,
  ];
  for (const section of sections) {
    assert.ok(html.includes(section.title), section.title);
    for (const paragraph of section.body) assert.ok(html.includes(paragraph), paragraph);
  }
  for (const { question, answer } of content.faq.items) {
    assert.ok(html.includes(question), question);
    for (const paragraph of answer) assert.ok(html.includes(paragraph), paragraph);
  }
  for (const photo of [content.hero, content.introSection, content.newBuild, content.renovation]) {
    assert.ok(existsSync(new URL(`../public${photo.image}`, import.meta.url)));
    assert.ok(html.includes(`alt="${photo.imageAlt}"`), photo.image);
  }
});

test("contracting navigation links to real sections and audience pages", () => {
  assert.equal((html.match(/<details class="service-accordion__item">/g) ?? []).length, 5);
  assert.equal((html.match(/<details class="faq-item">/g) ?? []).length, 4);
  assert.deepEqual(content.process.items.map(({ number }) => number), ["01", "02", "03", "04"]);
  for (const { href } of content.serviceNavigation.items) {
    assert.ok(html.includes(`href="${href}"`));
    assert.ok(html.includes(`id="${href.slice(1)}"`));
  }
  for (const { href, linkLabel } of content.audiences.items) {
    assert.ok(html.includes(`href="${href}">${linkLabel}</a>`));
    assert.ok(existsSync(new URL(`../dist${href}index.html`, import.meta.url)));
  }
  assert.doesNotMatch(html, /keskustele-urakasta|Keskustele LVI-urakastasi/);
  assert.ok(html.includes('href="/yhteystiedot/#contact-heading"'));
  assert.ok(read("dist/yhteystiedot/index.html").includes('id="contact-heading"'));
});
