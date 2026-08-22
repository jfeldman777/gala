import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const logicPath = join(__dirname, "..", "patreon-logic.js");
require(logicPath);
const {
  injectPatreonPages,
  normalizeConfig,
  isPatreonActive,
  parseEnableQuery,
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

const sample = [page("0"), page("1"), page("1.1"), page("2"), page("3")];

// --- injection (desktop) ---
const withInvites = injectPatreonPages(sample, config, false);
assert.equal(withInvites.length, sample.length + 3);
assert.equal(withInvites[2].id, "patreon-early");
assert.equal(withInvites[withInvites.length - 1].id, "patreon-final");

// --- mobile off unless QR / preview param ---
assert.equal(
  injectPatreonPages(sample, config, false, { isMobile: true }).length,
  sample.length,
);
assert.equal(
  injectPatreonPages(sample, config, false, { isMobile: true, forceEnable: true }).length,
  sample.length + 3,
);

// --- subscribed: all off (even on mobile with QR) ---
const subscribed = injectPatreonPages(sample, config, true);
assert.equal(subscribed.length, sample.length);
assert.ok(!subscribed.some((p) => p.isPatreon));
assert.equal(
  injectPatreonPages(sample, config, true, { isMobile: true, forceEnable: true }).length,
  sample.length,
);

assert.equal(isPatreonActive(config, { subscribed: true }), false);
assert.equal(isPatreonActive(config, { isMobile: true }), false);
assert.equal(isPatreonActive(config, { isMobile: true, forceEnable: true }), true);

// --- query param helper ---
assert.equal(parseEnableQuery("?patreon=1", "patreon"), true);
assert.equal(parseEnableQuery("?patreon=true", "patreon"), true);
assert.equal(parseEnableQuery("", "patreon"), false);

// --- placement helpers ---
assert.equal(findInsertIndex(sample, { afterPageId: "1" }), 2);
assert.equal(findInsertIndex(sample, { atEnd: true }), sample.length);

// --- hidden page ids ---
assert.equal(isHiddenPatreonPageId("patreon-early", config, true), true);
assert.equal(isHiddenPatreonPageId("patreon-final", config, true), true);
assert.equal(isHiddenPatreonPageId("patreon-final", config, false), false);

// --- index remap after full removal ---
const oldPages = injectPatreonPages(sample, config, false);
const newPages = injectPatreonPages(sample, config, true);
const patreonIdx = oldPages.findIndex((p) => p.id === "patreon-early");
const remapped = remapIndexAfterPatreonRemoval(oldPages, patreonIdx, newPages);
assert.equal(newPages[remapped].id, "1.1");

console.log("patreon-pages.test.mjs: all tests passed");
