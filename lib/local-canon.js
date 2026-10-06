/**
 * Local Canon index: the ~22 source documents, not the reader book.
 * The book is a presentation of part of the Canon.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCanonIndex } from "./canon-search.js";

export { searchCanon, surprisePages, canonHits } from "./canon-search.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CANON_DIR = path.join(ROOT, "canon");

let cached = null;

async function buildIndex() {
  const raw = await fs.readFile(path.join(CANON_DIR, "index.json"), "utf8");
  return buildCanonIndex(JSON.parse(raw), (file) => fs.readFile(path.join(ROOT, file), "utf8"));
}

export async function getCanonIndex() {
  if (!cached) cached = buildIndex();
  return cached;
}
