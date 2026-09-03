/**
 * Upload Canon documents into an OpenAI Vector Store.
 *
 * The Canon is the ~22 source files in /canon (extracted from the .docx corpus).
 * The reader book is a presentation of part of the Canon — do not upload book
 * pages as if they were the Canon.
 *
 * Usage:
 *   npm run extract-canon   # from the .docx folder
 *   npm run upload-canon
 */
import { promises as fs } from "node:fs";
import { createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";
import { config as loadEnv } from "dotenv";
import { requireEnv, optionalEnv } from "../lib/env.js";

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const BATCH = 5;

async function readCanonDocs() {
  const raw = await fs.readFile(path.join(ROOT, "canon", "index.json"), "utf8");
  const data = JSON.parse(raw);
  return data.files || [];
}

function canonFilename(doc) {
  const safeId = String(doc.id).replace(/[^\w.-]+/g, "_");
  return `canon-${safeId}.md`;
}

async function uploadDoc(openai, vectorStoreId, doc) {
  const abs = path.join(ROOT, doc.file);
  let content;
  try {
    content = await fs.readFile(abs, "utf8");
  } catch {
    console.warn(`skip missing file: ${doc.file}`);
    return null;
  }

  const filename = canonFilename(doc);
  const tmpPath = path.join(ROOT, ".tmp-canon-upload", filename);
  await fs.mkdir(path.dirname(tmpPath), { recursive: true });
  await fs.writeFile(tmpPath, content, "utf8");

  const uploaded = await openai.files.create({
    file: createReadStream(tmpPath),
    purpose: "assistants",
  });

  await openai.vectorStores.files.create(vectorStoreId, {
    file_id: uploaded.id,
    attributes: {
      doc_id: String(doc.id),
      title: String(doc.title || ""),
      md_path: String(doc.file),
    },
  });

  return uploaded.id;
}

async function pollVectorStore(openai, vectorStoreId) {
  for (let i = 0; i < 120; i++) {
    const store = await openai.vectorStores.retrieve(vectorStoreId);
    const pending =
      (store.file_counts?.in_progress || 0) + (store.file_counts?.queued || 0);
    process.stdout.write(
      `\rIndexing… completed ${store.file_counts?.completed || 0}, pending ${pending}   `,
    );
    if (pending === 0) {
      console.log("\nVector store ready.");
      return;
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.warn("\nTimed out waiting for vector store indexing (may still finish).");
}

async function runPool(items, worker) {
  const results = [];
  let index = 0;
  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: BATCH }, next));
  return results;
}

async function main() {
  const apiKey = requireEnv("OPENAI_API_KEY");
  const openai = new OpenAI({ apiKey });

  let vectorStoreId = optionalEnv("OPENAI_VECTOR_STORE_ID");
  if (!vectorStoreId) {
    const store = await openai.vectorStores.create({
      name: "Discourse Feldman Canon",
    });
    vectorStoreId = store.id;
    console.log(`Created vector store: ${vectorStoreId}`);
    console.log("Add to .env: OPENAI_VECTOR_STORE_ID=" + vectorStoreId);
  } else {
    console.log(`Using vector store: ${vectorStoreId}`);
  }

  const docs = await readCanonDocs();
  console.log(`Uploading ${docs.length} Canon documents…`);

  let done = 0;
  await runPool(docs, async (doc) => {
    const id = await uploadDoc(openai, vectorStoreId, doc);
    done += 1;
    if (done % 5 === 0 || done === docs.length) {
      console.log(`Uploaded ${done}/${docs.length}`);
    }
    return id;
  });

  await pollVectorStore(openai, vectorStoreId);
  console.log("\nDone. Set OPENAI_VECTOR_STORE_ID=" + vectorStoreId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
