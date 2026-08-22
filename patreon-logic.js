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
    disableOnMobile: true,
    enableQueryParam: "patreon",
    hideAllAfterSubscribe: true,
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
      disableOnMobile: src.disableOnMobile !== false,
      enableQueryParam: String(src.enableQueryParam || DEFAULT_CONFIG.enableQueryParam).trim(),
      hideAllAfterSubscribe: src.hideAllAfterSubscribe !== false,
      placements: placements.map((p) => ({ ...p })),
    };
  }

  function isTruthyParam(value) {
    if (value == null || value === "") return false;
    const v = String(value).trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }

  /** URL / session flag: QR links use ?patreon=1 to enable invites on phone. */
  function parseEnableQuery(search, paramName) {
    if (!paramName) return false;
    try {
      return isTruthyParam(new URLSearchParams(search || "").get(paramName));
    } catch {
      return false;
    }
  }

  /**
   * Whether Patreon invite pages should appear.
   * - subscribed → off (even via QR)
   * - mobile + disableOnMobile → off unless forceEnable (QR / preview param)
   */
  function isPatreonActive(config, runtime = {}) {
    const cfg = normalizeConfig(config);
    const { subscribed = false, isMobile = false, forceEnable = false } = runtime;
    if (!cfg.enabled) return false;
    if (subscribed && cfg.hideAllAfterSubscribe) return false;
    if (cfg.disableOnMobile && isMobile && !forceEnable) return false;
    return true;
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

  function injectPatreonPages(contentPages, config, subscribed, runtime = {}) {
    const cfg = normalizeConfig(config);
    const rt = { subscribed, isMobile: false, forceEnable: false, ...runtime };
    if (!isPatreonActive(cfg, rt)) {
      return (contentPages || []).filter((p) => !p.isPatreon);
    }
    const base = (contentPages || []).filter((p) => !p.isPatreon);
    const inserts = [];

    for (const placement of cfg.placements) {
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
    if (subscribed && cfg.hideAllAfterSubscribe) return true;
    return false;
  }

  function remapIndexAfterPatreonRemoval(oldPages, oldIndex, newPages) {
    const cur = oldPages[oldIndex];
    let removedBefore = 0;
    for (let i = 0; i < oldIndex; i += 1) {
      if (oldPages[i]?.isPatreon) removedBefore += 1;
    }
    if (cur?.isPatreon) {
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
    isPatreonActive,
    parseEnableQuery,
    makePatreonPage,
    findInsertIndex,
    injectPatreonPages,
    isHiddenPatreonPageId,
    remapIndexAfterPatreonRemoval,
  };
});
