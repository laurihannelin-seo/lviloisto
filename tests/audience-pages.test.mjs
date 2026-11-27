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
    assert.equal(content.extraSections.length, 4);
    assert.ok(content.extraSections.every((section) => typeof section.title === "string" && Array.isArray(section.body)));
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

test("built audience pages retain SEO and breadcrumbs without discussion CTAs", () => {
  for (const slug of slugs) {
    const html = readFileSync(new URL(`dist/${slug}/index.html`, root), "utf8");
    const content = JSON.parse(readFileSync(new URL(`src/content/cms/${slug}.json`, root), "utf8"));
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
    assert.equal(html.includes('name="robots" content="noindex, follow"'), content.noindex);
    assert.match(html, new RegExp(`rel="canonical" href="https://lviloisto.fi/${slug}/"`));
    assert.match(html, /property="og:title"/);
    assert.match(html, /aria-label="Murupolku"/);
    const working = html.split('id="toimintatapa"')[1].split("</section>")[0];
    for (const href of ["/lvi-tyot/", "/lvi-urakointi/"]) {
      assert.equal(working.includes(`href="${href}"`), slug !== "arvoasunnot");
    }
    content.extraSections.forEach((section, index) => {
      const visible = Boolean(section.title.trim() && section.body.some((paragraph) => paragraph.trim()));
      assert.equal(html.includes(`id="lisaosio-${index + 1}"`), visible);
    });
    assert.doesNotMatch(html, /audience-hero-contact|audience-final-contact|audience-contact-heading|Keskustele kohteestasi/);
  }
});

test("Arvoasunnot shows one project photo after the body of each illustrated section", () => {
  const content = JSON.parse(readFileSync(new URL("src/content/cms/arvoasunnot.json", root), "utf8"));
  const html = readFileSync(new URL("dist/arvoasunnot/index.html", root), "utf8");
  for (const [id, photo] of [["palvelu", content.introPhoto], ["lvi-ratkaisut", content.referencePhoto]]) {
    assert.ok(existsSync(new URL(`public${photo.image}`, root)));
    const section = html.split(`id="${id}"`)[1].split("</section>")[0];
    const images = [...section.matchAll(/<img\b[^>]*class="audience-page__photo"[^>]*>/g)];
    assert.equal(images.length, 1, id);
    assert.ok(images[0][0].includes(`alt="${photo.imageAlt}"`));
    assert.match(section.slice(images[0].index + images[0][0].length), /^\s*<\/div>\s*$/);
  }
});

test("homepage links and every header expose the four real audience routes", () => {
  const home = JSON.parse(readFileSync(new URL("src/content/cms/home.json", root), "utf8"));
  assert.deepEqual(home.services.items.map((item) => item.href).filter(Boolean).sort(), slugs.map((slug) => `/${slug}/`).sort());
  const services = config.content.find((entry) => entry.name === "home").fields.find((field) => field.name === "services");
  assert.ok(services.fields[0].fields.some((field) => field.name === "href" && field.hidden));
  const homepage = readFileSync(new URL("dist/index.html", root), "utf8");
  for (const slug of slugs) assert.match(homepage, new RegExp(`class="text-link solution-feature__link" href="/${slug}/"`));
  for (const route of ["", "lvi-tyot/", "lvi-urakointi/", "tietoa-meista/", "yhteystiedot/", ...slugs.map((slug) => `${slug}/`)]) {
    const html = readFileSync(new URL(`dist/${route}index.html`, root), "utf8");
    const header = html.match(/<header\b[\s\S]*?<\/header>/)?.[0];
    assert.ok(header);
    assert.match(header, /<button\b[^>]*aria-controls="service-navigation"[^>]*>\s*Palvelumme/);
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer);
    assert.doesNotMatch(header + footer, /href="\/tietoa-meista\//);
    for (const slug of slugs) assert.match(header, new RegExp(`href="/${slug}/"`));
  }
});
