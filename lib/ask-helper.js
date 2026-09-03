import OpenAI from "openai";
import { optionalEnv } from "./env.js";
import { HELPER_INSTRUCTIONS } from "./instructions.js";
import { parseHelperResponse } from "./parse-response.js";
import { getCanonIndex, searchCanon, surprisePages } from "./local-canon.js";
import { formatLocalAnswer } from "./local-ask.js";

function getClient(apiKey) {
  return new OpenAI({ apiKey });
}

function helperBackend() {
  const v = (process.env.HELPERS_BACKEND || "local").trim().toLowerCase();
  if (v === "local" || v === "openai") return v;
  return "auto";
}

function readOpenAiConfig() {
  const apiKey = optionalEnv("OPENAI_API_KEY");
  const vectorStoreId = optionalEnv("OPENAI_VECTOR_STORE_ID");
  if (!apiKey || !vectorStoreId) return null;
  return {
    apiKey,
    vectorStoreId,
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
  };
}

let openaiBlockedUntil = 0;

function openaiBlocked() {
  return Date.now() < openaiBlockedUntil;
}

function markOpenaiBlocked() {
  openaiBlockedUntil = Date.now() + 10 * 60 * 1000;
}

function isModelAccessError(err) {
  const code = err?.code || err?.error?.code || "";
  const msg = err?.error?.message || err?.message || "";
  return (
    code === "model_not_found" ||
    msg.includes("does not have access to model") ||
    err?.status === 401 ||
    err?.status === 403
  );
}

async function askLocal(kind, question, lang) {
  const index = await getCanonIndex();
  const q = String(question || "").trim();
  const surprise =
    kind === "animator" &&
    (!q || /покажи что-нибудь интересн|show something interesting from the canon/i.test(q));
  const hits = surprise
    ? surprisePages(index, 3)
    : searchCanon(index, q, { limit: kind === "tutor" ? 5 : 6 });
  const formatted = formatLocalAnswer(kind, hits, lang);
  return { ...formatted, backend: "local" };
}

async function askOpenAi(kind, question, lang, cfg) {
  const instructions = HELPER_INSTRUCTIONS[kind];
  const client = getClient(cfg.apiKey);
  const langLine =
    lang === "en" ? "Answer in English." : "Отвечай по-русски.";
  const tools = [
    {
      type: "file_search",
      vector_store_ids: [cfg.vectorStoreId],
      max_num_results: Number(process.env.OPENAI_FILE_SEARCH_MAX_RESULTS || 10),
    },
  ];
  const response = await client.responses.create({
    model: cfg.model,
    instructions,
    input: `${langLine}\n\n${question}`,
    tools,
    include: ["file_search_call.results"],
  });

  const { answer, sources } = parseHelperResponse(response);
  if (!answer) {
    const err = new Error("Empty model response");
    err.statusCode = 502;
    err.publicMessage = "Empty response from helper";
    throw err;
  }
  return { answer, sources, backend: "openai" };
}

export async function askHelper(kind, question, { lang = "ru" } = {}) {
  if (!HELPER_INSTRUCTIONS[kind]) {
    const err = new Error(`Unknown helper: ${kind}`);
    err.statusCode = 400;
    err.publicMessage = "Unknown helper";
    throw err;
  }

  const mode = helperBackend();
  const cfg = readOpenAiConfig();

  if (mode === "local" || !cfg || openaiBlocked()) {
    return askLocal(kind, question, lang);
  }

  try {
    return await askOpenAi(kind, question, lang, cfg);
  } catch (err) {
    if (mode === "auto" && isModelAccessError(err)) {
      markOpenaiBlocked();
      console.warn(`[api/${kind}] OpenAI unavailable, using local Canon search`);
      return askLocal(kind, question, lang);
    }
    throw err;
  }
}
