import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/scripts/scroll-reveal.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function fixture({ reduced = false, supported = true } = {}) {
  class Element {
    constructor(top, media = false) {
      this.top = top;
      this.media = media;
      this.dataset = {};
      this.classes = new Set();
      this.classList = { add: (name) => this.classes.add(name), remove: (name) => this.classes.delete(name) };
    }
    getBoundingClientRect() { return { top: this.top }; }
    matches() { return this.media; }
    closest() { return this.classes.has("is-reveal-pending") ? this : null; }
  }
  const elements = [new Element(100, true), new Element(1200, true), new Element(1250)];
  const observed = new Set();
  const handlers = {};
  let intersection;
  const motion = { matches: reduced, addEventListener: (_, handler) => { handlers.motion = handler; } };
  class Observer {
    constructor(callback) { intersection = callback; }
    observe(element) { observed.add(element); }
    unobserve(element) { observed.delete(element); }
  }
  const window = { innerHeight: 900, matchMedia: () => motion, addEventListener: (name, handler) => { handlers[name] = handler; } };
  if (supported) window.IntersectionObserver = Observer;
  const context = {
    exports: {}, window, Element, IntersectionObserver: Observer,
    document: { querySelectorAll: () => elements, addEventListener: (name, handler) => { handlers[name] = handler; } },
  };
  runInNewContext(compiled, context);
  context.exports.setupScrollReveal();
  return { elements, observed, handlers, motion, intersect: (target, isIntersecting) => intersection([{ target, isIntersecting }]) };
}

test("initially visible content stays visible; only off-screen media and copy are enhanced", () => {
  const { elements, observed } = fixture();
  assert.equal(elements[0].classes.size, 0);
  assert.equal(observed.size, 2);
  assert.equal(elements[1].dataset.reveal, "media");
  assert.equal(elements[2].dataset.reveal, "copy");
});

test("entrance is one-shot and waits for intersection", () => {
  const { elements, observed, intersect } = fixture();
  intersect(elements[1], false);
  assert.ok(elements[1].classes.has("is-reveal-pending"));
  intersect(elements[1], true);
  assert.ok(!elements[1].classes.has("is-reveal-pending"));
  assert.ok(!observed.has(elements[1]));
});

test("keyboard focus reveals content immediately", () => {
  const { elements, handlers } = fixture();
  handlers.focusin({ target: elements[2] });
  assert.ok(!elements[2].classes.has("is-reveal-pending"));
  assert.ok(elements[2].classes.has("reveal-immediate"));
});

test("reduced-motion and unsupported browsers never hide content", () => {
  for (const options of [{ reduced: true }, { supported: false }]) {
    const { elements, observed } = fixture(options);
    assert.equal(observed.size, 0);
    assert.ok(elements.every((element) => element.classes.size === 0));
  }
});

test("changing to reduced-motion or restoring history reveals remaining content", () => {
  for (const mode of ["motion", "history"]) {
    const { elements, observed, handlers, motion } = fixture();
    if (mode === "motion") { motion.matches = true; handlers.motion(); }
    else handlers.pageshow({ persisted: true });
    assert.equal(observed.size, 0);
    assert.ok(elements.every((element) => !element.classes.has("is-reveal-pending")));
  }
});
