/** In-browser Canon search for static hosting (GitHub Pages), where /api/* does not exist. */
import { buildCanonIndex, canonHits } from "./canon-search.js";
import { formatLocalAnswer } from "./local-ask.js";

let cached = null;

async function fetchText(file) {
  const res = await fetch(encodeURI(file), { cache: "no-cache" });
  if (!res.ok) throw new Error(`${res.status} ${file}`);
  return res.text();
}

async function getIndex() {
  if (!cached) {
    cached = fetchText("canon/index.json")
      .then((raw) => buildCanonIndex(JSON.parse(raw), fetchText))
      .catch((err) => {
        cached = null;
        throw err;
      });
  }
  return cached;
}

export async function askHelperInBrowser(kind, question, lang = "ru") {
  const index = await getIndex();
  const hits = canonHits(index, kind, question);
  return { ...formatLocalAnswer(kind, hits, lang), backend: "local" };
}
