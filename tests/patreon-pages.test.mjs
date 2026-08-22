import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load patreon-logic.js as CommonJS export
const logicPath = join(__dirname, "..", "patreon-logic.js");
require(logicPath);
const {
  injectPatreonPages,
  normalizeConfig,
  isHiddenPatreonPageId,
  remapIndexAfterPatreonRemoval,
  findInsertIndex,
} = require(logicPath);

const config = normalizeConfig({
  ...JSON.parse(readFileSync(join(__dirname, "..", "patreon.json"), "utf8")),
  enabled: true,
});

function page(id) {
  return { id, title: id, section: "S", md: `${id}.md` };
}

// --- injection ---
const sample = [page("0"), page("1"), page("1.1"), page("2"), page("3")];
const withInvites = injectPatreonPages(sample, config, false);
assert.equal(withInvites.length, sample.length + 3);
assert.equal(withInvites[2].id, "patreon-early");
assert.equal(withInvites[1].id, "1");
assert.equal(withInvites[withInvites.length - 1].id, "patreon-final");

const midIdx = withInvites.findIndex((p) => p.id === "patreon-mid");
assert.ok(midIdx > 2 && midIdx < withInvites.length - 1);

// --- subscribe hides early/mid ---
const subscribed = injectPatreonPages(sample, config, true);
assert.equal(subscribed.length, sample.length + 1);
assert.ok(!subscribed.some((p) => p.id === "patreon-early"));
assert.ok(!subscribed.some((p) => p.id === "patreon-mid"));
assert.equal(subscribed[subscribed.length - 1].id, "patreon-final");

// --- placement helpers ---
assert.equal(findInsertIndex(sample, { afterPageId: "1" }), 2);
assert.equal(findInsertIndex(sample, { atEnd: true }), sample.length);
assert.equal(findInsertIndex(sample, { atFraction: 0.5 }), 3);

// --- hidden page ids ---
assert.equal(isHiddenPatreonPageId("patreon-early", config, true), true);
assert.equal(isHiddenPatreonPageId("patreon-final", config, true), false);

// --- index remap after removal ---
const oldPages = injectPatreonPages(sample, config, false);
const newPages = injectPatreonPages(sample, config, true);
const patreonIdx = oldPages.findIndex((p) => p.id === "patreon-early");
const remapped = remapIndexAfterPatreonRemoval(oldPages, patreonIdx, newPages);
assert.equal(newPages[remapped].id, "1.1");

console.log("patreon-pages.test.mjs: all tests passed");
