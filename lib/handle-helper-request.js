import { setCorsHeaders } from "./cors.js";
import { askHelper } from "./ask-helper.js";
import { HELPER_INSTRUCTIONS } from "./instructions.js";

const MAX_QUESTION_LEN = 2000;

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body.trim()) {
    return JSON.parse(req.body);
  }
  return {};
}

function defaultQuestion(kind, lang) {
  if (kind !== "animator") return "";
  return lang === "en"
    ? "Show something interesting from the Canon."
    : "Покажи что-нибудь интересное из Канона.";
}

export async function handleHelperRequest(req, res, kind) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!HELPER_INSTRUCTIONS[kind]?.trim()) {
    res.status(501).json({ error: `${kind} is not implemented yet` });
    return;
  }

  try {
    const body = readJsonBody(req);
    const lang = body?.lang === "en" ? "en" : "ru";
    let question = String(body?.question || "").trim();
    if (!question) question = defaultQuestion(kind, lang);

    if (!question) {
      res.status(400).json({ error: "question is required" });
      return;
    }

    if (question.length > MAX_QUESTION_LEN) {
      res.status(400).json({ error: `question must be at most ${MAX_QUESTION_LEN} characters` });
      return;
    }

    const result = await askHelper(kind, question, { lang });
    res.status(200).json(result);
  } catch (err) {
    console.error(`[api/${kind}]`, err);
    const status = err.status || err.statusCode || 500;
    const openaiMsg = err?.error?.message || err?.message || "";
    let error = err.publicMessage || "Request failed";
    if (openaiMsg.includes("does not have access to model")) {
      error =
        "OpenAI: у проекта нет доступа к модели. На platform.openai.com → Settings → Billing добавьте оплату и включите модель (например gpt-4o-mini), затем укажите OPENAI_MODEL в .env.";
    } else if (openaiMsg && !/sk-/.test(openaiMsg)) {
      error = openaiMsg;
    }
    res.status(status >= 400 && status < 600 ? status : 500).json({ error });
  }
}
