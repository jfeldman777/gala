/**
 * Canon search shared by the Node API and the browser (no Node imports here).
 * The Canon is the ~22 source documents, not the reader book.
 */

const STOP = new Set(
  `кто такой такая такое такие какая какие какой какое какие-то что это как почему зачем
   значит означает есть про для расскажи объясни
   где когда чем кем кому чем кто-то что-то ли бы же вот уже или либо
   the a an is are was were be to of in on for and or who what which
   how why where when whose whom that this these those can could should
   show something interesting from canon book page`.split(/\s+/),
);

export function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const TERM_END =
  "(?:ы|а|е|у|ой|ом|ов|ам|ами|ах|ев|ем|ей|ям|ями|ях|ство|ства|стве|ская|ские|ский|ское|скую)?";

function countTerm(hay, term) {
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRe(term)}${TERM_END}(?![\\p{L}\\p{N}])`,
    "gu",
  );
  return hay.match(re)?.length || 0;
}

function termIndex(hay, term) {
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRe(term)}${TERM_END}`,
    "u",
  );
  const m = hay.match(re);
  return m ? m.index : -1;
}

function countCapitalTerm(body, term) {
  if (!term) return 0;
  const head = term.charAt(0).toUpperCase() + term.slice(1);
  const re = new RegExp(
    `(?<![\\p{L}\\p{N}])${escapeRe(head)}${TERM_END}(?![\\p{L}\\p{N}])`,
    "g",
  );
  return body.match(re)?.length || 0;
}

function tokens(text) {
  return normalize(text)
    .split(/[^\p{L}\p{N}.-]+/u)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((w) => w.length >= 3 && !STOP.has(w));
}

function excerptAround(text, queryTokens, maxLen = 360) {
  const clean = (p) =>
    p.replace(/^#+\s+/gm, "").replace(/^- \w+:.+$/gm, "").replace(/\s+/g, " ").trim();
  let paras = String(text || "")
    .split(/\n{2,}/)
    .map(clean)
    .filter((p) => p.length > 40);
  if (paras.length < 3) {
    paras = String(text || "")
      .split(/\n/)
      .map(clean)
      .filter((p) => p.length > 40);
  }
  let best = paras[0] || String(text || "").slice(0, maxLen);
  let bestScore = -1;
  for (const p of paras) {
    const hay = normalize(p);
    let score = 0;
    for (const t of queryTokens) {
      if (countTerm(hay, t)) score += 1;
      if (countCapitalTerm(p, t)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }
  if (best.length <= maxLen) return best;
  const hay = normalize(best);
  let cut = 0;
  for (const t of queryTokens) {
    const i = termIndex(hay, t);
    if (i >= 0) {
      cut = Math.max(0, i - 80);
      break;
    }
  }
  const slice = best.slice(cut, cut + maxLen).trim();
  return (cut > 0 ? "…" : "") + slice + (cut + maxLen < best.length ? "…" : "");
}

/** readFile(relativePath) resolves to file text, or rejects if missing. */
export async function buildCanonIndex(catalog, readFile) {
  const entries = catalog?.files || [];
  const contents = await Promise.all(
    entries.map((entry) => readFile(entry.file).catch(() => null)),
  );
  const items = [];
  entries.forEach((entry, i) => {
    const content = contents[i];
    if (content == null) return;
    const body = content.replace(/^#\s+.+$/m, "").replace(/^- \w+:.+$/gm, "").trim();
    items.push({
      id: String(entry.id),
      title: String(entry.title || entry.id),
      file: entry.file,
      source: entry.source || "",
      body,
      search: normalize(`${entry.id} ${entry.title} ${body}`),
    });
  });
  return items;
}

export function searchCanon(index, question, { limit = 6, minScore = 6 } = {}) {
  const q = String(question || "").trim();
  const qNorm = normalize(q);
  const qTokens = tokens(q);
  if (!qNorm) return [];

  const scored = [];
  for (const doc of index) {
    let score = 0;
    if (qNorm.length >= 6 && doc.search.includes(qNorm)) score += 40;
    if (doc.id && qTokens.includes(normalize(doc.id))) score += 18;
    for (const t of qTokens) {
      if (countTerm(normalize(doc.title), t)) score += 10;
      if (normalize(doc.id) === t) score += 12;
      const hits = countTerm(doc.search, t);
      if (hits > 0) score += Math.min(10, hits);
      const caps = countCapitalTerm(doc.body, t);
      if (caps > 0) score += 8 + Math.min(6, caps);
    }
    if (score >= minScore) {
      scored.push({
        id: doc.id,
        title: doc.title,
        file: doc.file,
        score,
        excerpt: excerptAround(doc.body, qTokens.length ? qTokens : [qNorm]),
      });
    }
  }
  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id, "en"));
  return scored.slice(0, limit);
}

export function surprisePages(index, limit = 3) {
  const pool = index.filter((p) => p.body.length > 280);
  if (!pool.length) return [];
  const seed = pool[Math.floor(Math.random() * pool.length)];
  const seedTokens = tokens(seed.title).slice(0, 4);
  const related = searchCanon(index, `${seed.title} ${seedTokens.join(" ")}`, {
    limit: limit + 2,
    minScore: 4,
  }).filter((h) => h.id !== seed.id);
  const seedHit = {
    id: seed.id,
    title: seed.title,
    file: seed.file,
    score: 100,
    excerpt: excerptAround(seed.body, seedTokens),
  };
  return [seedHit, ...related].slice(0, limit);
}

export function isSurpriseRequest(kind, question) {
  const q = String(question || "").trim();
  return (
    kind === "animator" &&
    (!q || /покажи что-нибудь интересн|show something interesting from the canon/i.test(q))
  );
}

export function canonHits(index, kind, question) {
  return isSurpriseRequest(kind, question)
    ? surprisePages(index, 3)
    : searchCanon(index, question, { limit: kind === "tutor" ? 5 : 6 });
}
