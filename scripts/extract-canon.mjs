/**
 * Extract Canon .docx files to canon/*.md for local helpers.
 *
 *   CANON_DIR="C:\Users\jfeld\Downloads\КАНОН_ЧИСТЫЙ_22_файла\КАНОН" npm run extract-canon
 */
import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "canon");
const DEFAULT_DIR = "C:\\Users\\jfeld\\Downloads\\КАНОН_ЧИСТЫЙ_22_файла\\КАНОН";

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

function docxToText(docxPath) {
  const xml = execFileSync("tar", ["-xOf", docxPath, "word/document.xml"], {
    encoding: "utf8",
    maxBuffer: 30e6,
    windowsHide: true,
  });
  return decodeEntities(
    xml
      .replace(/<w:tab\b[^/]*\/>/g, "\t")
      .replace(/<w:br\b[^/]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\r/g, "")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

function parseName(filename) {
  const stem = filename.replace(/\.docx$/i, "");
  const m = stem.match(/^(\d+(?:\.\d+)?)_(.+)$/);
  const id = m ? m[1] : stem;
  const title = (m ? m[2] : stem).replace(/_/g, " ");
  return { id, title, stem };
}

async function main() {
  const srcDir = process.env.CANON_DIR || DEFAULT_DIR;
  const names = (await fs.readdir(srcDir))
    .filter((f) => f.toLowerCase().endsWith(".docx"))
    .sort();
  if (!names.length) {
    throw new Error(`No .docx files in ${srcDir}`);
  }

  await fs.mkdir(OUT, { recursive: true });
  const old = await fs.readdir(OUT);
  await Promise.all(
    old
      .filter((f) => f.endsWith(".md"))
      .map((f) => fs.unlink(path.join(OUT, f))),
  );

  const catalog = [];
  for (const name of names) {
    const abs = path.join(srcDir, name);
    const { id, title, stem } = parseName(name);
    const body = docxToText(abs);
    const md = [`# ${title}`, "", `- id: ${id}`, `- source: ${name}`, "", body, ""].join(
      "\n",
    );
    const outName = `${stem}.md`;
    await fs.writeFile(path.join(OUT, outName), md, "utf8");
    catalog.push({ id, title, file: `canon/${outName}`, source: name, chars: body.length });
    console.log(`${id}\t${title}\t${body.length} chars`);
  }

  await fs.writeFile(
    path.join(OUT, "index.json"),
    JSON.stringify({ generated: new Date().toISOString(), files: catalog }, null, 2),
    "utf8",
  );
  console.log(`\nWrote ${catalog.length} files to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
