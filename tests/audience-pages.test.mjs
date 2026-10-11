import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import yaml from "js-yaml";

const slugs = ["arvoasunnot", "omakotitalot", "taloyhtiot", "rakennusliikkeet"];
const config = yaml.load(readFileSync(new URL("../.pages.yml", import.meta.url), "utf8"));
const root = new URL("../", import.meta.url);

test("all audience pages have editable content and valid owned hero images", () => {
  for (const slug of slugs) {
    const content = JSON.parse(readFileSync(new URL(`src/content/cms/${slug}.json`, root), "utf8"));
    assert.equal(typeof content.noindex, "boolean");
    assert.ok(content.hero.title && content.hero.imageAlt);
    assert.ok(existsSync(new URL(`public${content.hero.image}`, root)));
    assert.ok(content.services.items.length >= 1 && content.services.items.length <= 6);
    const entry = config.content.find((entry) => entry.name === slug);
    assert.equal(entry.path, `src/content/cms/${slug}.json`);
    assert.deepEqual(entry.fields.map((field) => field.name).sort(), Object.keys(content).sort());
    for (const field of entry.fields) {
      if (field.component) assert.ok(config.components[field.component]);
    }
  }
});

test("built audience pages have a single H1, SEO, breadcrumbs, and working contact targets", () => {
  for (const slug of slugs) {
    const html = readFileSync(new URL(`dist/${slug}/index.html`, root), "utf8");
    const content = JSON.parse(readFileSync(new URL(`src/content/cms/${slug}.json`, root), "utf8"));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal(html.includes('name="robots" content="noindex, follow"'), content.noindex);
    assert.match(html, new RegExp(`rel="canonical" href="https://lviloisto.fi/${slug}/"`));
    assert.match(html, /property="og:title"/);
    assert.match(html, /aria-label="Murupolku"/);
    assert.match(html, /href="\/yhteystiedot\/#contact-heading"/);
    assert.match(html, /id="audience-hero-contact"/);
    assert.match(html, /id="audience-final-contact"/);
  }
});

test("homepage links and every header expose the four real audience routes", () => {
  const home = JSON.parse(readFileSync(new URL("src/content/cms/home.json", root), "utf8"));
  assert.deepEqual(home.services.items.map((item) => item.href).filter(Boolean).sort(), slugs.map((slug) => `/${slug}/`).sort());
  const services = config.content.find((entry) => entry.name === "home").fields.find((field) => field.name === "services");
  assert.ok(services.fields[0].fields.some((field) => field.name === "href" && field.hidden));
  const homepage = readFileSync(new URL("dist/index.html", root), "utf8");
  for (const slug of slugs) assert.match(homepage, new RegExp(`class="text-link solution-feature__link" href="/${slug}/"`));
  for (const route of ["", "lvi-tyot/", "lvi-urakointi/", "yhteystiedot/", ...slugs.map((slug) => `${slug}/`)]) {
    const html = readFileSync(new URL(`dist/${route}index.html`, root), "utf8");
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header);
    assert.match(header, /aria-controls="service-navigation"/);
    for (const slug of slugs) assert.match(header, new RegExp(`href="/${slug}/"`));
  }
});
