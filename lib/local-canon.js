/**
 * Local Canon index: the ~22 source documents, not the reader book.
 * The book is a presentation of part of the Canon.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CANON_DIR = path.join(ROOT, "canon");

const STOP = new Set(
  `кто такой какая какие какой какое какие-то что это как почему зачем
   где когда чем кем кому чем кто-то что-то ли бы же вот уже или либо
   the a an is are was were be to of in on for and or who what which
   how why where when whose whom that this these those can could should
   show something interesting from canon book page`.split(/\s+/),
);

let cached = null;

function normalize(text) {
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

async function buildIndex() {
  const raw = await fs.readFile(path.join(CANON_DIR, "index.json"), "utf8");
  const catalog = JSON.parse(raw);
  const items = [];
  for (const entry of catalog.files || []) {
    const abs = path.join(ROOT, entry.file);
    let content = "";
    try {
      content = await fs.readFile(abs, "utf8");
    } catch {
      continue;
    }
    const body = content.replace(/^#\s+.+$/m, "").replace(/^- \w+:.+$/gm, "").trim();
    items.push({
      id: String(entry.id),
      title: String(entry.title || entry.id),
      file: entry.file,
      source: entry.source || "",
      body,
      search: normalize(`${entry.id} ${entry.title} ${body}`),
    });
  }
  return items;
}

export async function getCanonIndex() {
  if (!cached) cached = buildIndex();
  return cached;
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
