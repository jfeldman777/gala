/**
 * Patreon invite pages — shared logic (browser + Node tests).
 * Config: patreon.json · Texts: I18N in app.js
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.PatreonLogic = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_CONFIG = {
    enabled: false,
    url: "https://www.patreon.com/cw/jacobfeldman",
    storageKey: "discourse-patreon-subscribed",
    hideEarlyAndMidAfterSubscribe: true,
    placements: [
      { slot: "early", afterPageId: "1" },
      { slot: "mid", atFraction: 0.5 },
      { slot: "final", atEnd: true },
    ],
  };

  function normalizeConfig(raw) {
    const src = raw && typeof raw === "object" ? raw : {};
    const placements = Array.isArray(src.placements) ? src.placements : DEFAULT_CONFIG.placements;
    return {
      enabled: src.enabled === true,
      url: String(src.url || DEFAULT_CONFIG.url).trim(),
      storageKey: String(src.storageKey || DEFAULT_CONFIG.storageKey).trim(),
      hideEarlyAndMidAfterSubscribe:
        src.hideEarlyAndMidAfterSubscribe !== false,
      placements: placements.map((p) => ({ ...p })),
    };
  }

  function makePatreonPage(slot) {
    return {
      id: `patreon-${slot}`,
      title: "",
      section: "",
      md: "",
      isPatreon: true,
      patreonSlot: slot,
    };
  }

  function findInsertIndex(contentPages, placement) {
    if (!placement || !contentPages.length) return null;
    if (placement.atEnd) return contentPages.length;
    if (placement.afterPageId) {
      const idx = contentPages.findIndex((p) => p.id === placement.afterPageId);
      return idx >= 0 ? idx + 1 : null;
    }
    if (typeof placement.atFraction === "number" && Number.isFinite(placement.atFraction)) {
      const n = contentPages.length;
      const at = Math.round(n * Math.max(0, Math.min(1, placement.atFraction)));
      return Math.max(0, Math.min(n, at));
    }
    return null;
  }

  function shouldHidePlacement(placement, config, subscribed) {
    if (!subscribed || !config.hideEarlyAndMidAfterSubscribe) return false;
    return placement.slot === "early" || placement.slot === "mid";
  }

  function injectPatreonPages(contentPages, config, subscribed) {
    const cfg = normalizeConfig(config);
    if (!cfg.enabled) return (contentPages || []).filter((p) => !p.isPatreon);
    const base = (contentPages || []).filter((p) => !p.isPatreon);
    const inserts = [];

    for (const placement of cfg.placements) {
      if (shouldHidePlacement(placement, cfg, subscribed)) continue;
      const at = findInsertIndex(base, placement);
      if (at == null) continue;
      inserts.push({ at, page: makePatreonPage(placement.slot) });
    }

    inserts.sort((a, b) => b.at - a.at);
    const result = base.slice();
    for (const { at, page } of inserts) {
      result.splice(at, 0, page);
    }
    return result;
  }

  function isHiddenPatreonPageId(pageId, config, subscribed) {
    if (!pageId || !String(pageId).startsWith("patreon-")) return false;
    const cfg = normalizeConfig(config);
    if (!subscribed || !cfg.hideEarlyAndMidAfterSubscribe) return false;
    return pageId === "patreon-early" || pageId === "patreon-mid";
  }

  function remapIndexAfterPatreonRemoval(oldPages, oldIndex, newPages) {
    const cur = oldPages[oldIndex];
    let removedBefore = 0;
    for (let i = 0; i < oldIndex; i += 1) {
      const p = oldPages[i];
      if (p?.isPatreon && p.patreonSlot !== "final") removedBefore += 1;
    }
    if (cur?.isPatreon && cur.patreonSlot !== "final") {
      return Math.max(0, Math.min(newPages.length - 1, oldIndex - removedBefore));
    }
    const id = cur?.id;
    if (id) {
      const idx = newPages.findIndex((p) => p.id === id);
      if (idx >= 0) return idx;
    }
    return Math.max(0, Math.min(newPages.length - 1, oldIndex - removedBefore));
  }

  return {
    DEFAULT_CONFIG,
    normalizeConfig,
    makePatreonPage,
    findInsertIndex,
    injectPatreonPages,
    shouldHidePlacement,
    isHiddenPatreonPageId,
    remapIndexAfterPatreonRemoval,
  };
});
