/** Server-side environment (never import from frontend). */

const PLACEHOLDER_VALUES = new Set(["sk-...", "vs_...", ""]);

export function isEnvPlaceholder(value) {
  const v = String(value ?? "").trim();
  if (!v || PLACEHOLDER_VALUES.has(v)) return true;
  if (v.includes("...")) return true;
  return false;
}

export function optionalEnv(name) {
  const value = process.env[name]?.trim();
  if (isEnvPlaceholder(value)) return "";
  return value || "";
}

export function requireEnv(name) {
  const value = optionalEnv(name);
  if (!value) {
    const err = new Error(`Missing environment variable: ${name}`);
    err.statusCode = 500;
    err.publicMessage = "Server configuration error";
    throw err;
  }
  return value;
}

export function getOpenAiConfig() {
  return {
    apiKey: requireEnv("OPENAI_API_KEY"),
    vectorStoreId: requireEnv("OPENAI_VECTOR_STORE_ID"),
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4o",
  };
}

export function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS?.trim();
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
