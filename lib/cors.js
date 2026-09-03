import { getAllowedOrigins } from "./env.js";

export function setCorsHeaders(req, res) {
  const origin = req.headers?.origin;
  const allowed = getAllowedOrigins();

  if (!origin) return;

  if (allowed.length === 0 || allowed.includes("*") || allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
