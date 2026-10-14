import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import yaml from "js-yaml";

const root = new URL("../", import.meta.url);
const json = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const config = yaml.load(readFileSync(new URL(".pages.yml", root), "utf8"));
const company = json("src/content/cms/yrityksemme.json");
const profiles = json("src/content/cms/contact-people.json");
const routes = ["", "yrityksemme/", "yhteystiedot/", "tietoa-meista/", "lvi-tyot/", "lvi-urakointi/", "arvoasunnot/", "omakotitalot/", "taloyhtiot/", "rakennusliikkeet/"];

test("company values section has two optional owner photos and editable descriptions", () => {
  assert.equal(typeof company.valuesSection.text, "string");
  assert.equal(company.valuesSection.items, undefined);
  const fields = config.content.find((entry) => entry.name === "company_page").fields;
  assert.equal(fields.find((field) => field.name === "valuesSection").fields.find((field) => field.name === "text").type, "text");
  const ownersField = fields.find((field) => field.name === "valuesSection").fields.find((field) => field.name === "owners");
  assert.equal(ownersField.component, "company_owner");
  assert.equal(ownersField.list.min, 2);
  assert.equal(ownersField.list.max, 2);
  assert.equal(company.valuesSection.owners.length, 2);
  assert.notEqual(config.components.company_owner.fields.find((field) => field.name === "image").required, true);
  for (const owner of company.valuesSection.owners) {
    assert.ok(owner.name);
    assert.equal(typeof owner.text, "string");
    if (owner.image) assert.ok(existsSync(new URL(`public${owner.image}`, root)));
  }
  const html = readFileSync(new URL("dist/yrityksemme/index.html", root), "utf8");
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/class="company-owner"/g) ?? []).length, 2);
  assert.equal((html.match(/class="company-owner__image"/g) ?? []).length, 2);
  assert.equal((html.match(/class="company-owner__text"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /company-stories|company-values__grid|<img\b[^>]*\ssrc=""/);
});

test("shared profile settings expose optional photos and roles in Pages CMS", () => {
  const entry = config.content.find((entry) => entry.name === "contact_people");
  assert.equal(entry.path, "src/content/cms/contact-people.json");
  assert.deepEqual(entry.fields.map((field) => field.name).sort(), Object.keys(profiles).sort());
  const photo = config.components.contact_profile.fields.find((field) => field.name === "photo");
  assert.equal(photo.type, "image");
  assert.notEqual(photo.required, true);
  for (const profile of Object.values(profiles)) {
    assert.ok(profile.role);
    if (profile.photo) assert.ok(existsSync(new URL(`public${profile.photo}`, root)));
  }
});

test("all pages share both identities, roles, phone links and safe empty-photo fallbacks", () => {
  for (const route of routes) {
    const html = readFileSync(new URL(`dist/${route}index.html`, root), "utf8");
    for (const [id, profile] of Object.entries(profiles)) {
      assert.ok(html.includes(`data-contact-person="${id}"`), `${route}: ${id}`);
      assert.ok(html.includes(profile.role.replaceAll("&", "&amp;")), `${route}: role`);
    }
    assert.match(html, /href="tel:\+358469214415"/);
    assert.match(html, /href="tel:\+358504796544"/);
    assert.doesNotMatch(html, /<img\b[^>]*\ssrc=""/);
    assert.doesNotMatch(html, /aria-label="Matias - Arvoasunnot ja rakennusliikkeet"/);
  }
});
