/**
 * Local dev: static book + /api/* helpers on one origin.
 *   npm run dev
 *   open http://localhost:8787/?p=helpers-oracle
 */
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { handleHelperRequest } from "../lib/handle-helper-request.js";
import { getCanonIndex } from "../lib/local-canon.js";

loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8787);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".mp3": "audio/mpeg",
  ".woff2": "font/woff2",
};

function mockRes() {
  const headers = {};
  let statusCode = 200;
  let body = "";
  return {
    status(code) {
      statusCode = code;
      return this;
    },
    setHeader(k, v) {
      headers[k] = v;
    },
    json(obj) {
      headers["Content-Type"] = "application/json; charset=utf-8";
      body = JSON.stringify(obj);
      return this;
    },
    end(chunk) {
      if (chunk) body = chunk;
      return { statusCode, headers, body };
    },
    get ended() {
      return { statusCode, headers, body };
    },
  };
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

async function handleApi(req, res, kind) {
  req.body = await readBody(req);
  await handleHelperRequest(req, res, kind);
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(ROOT)) return null;
  return abs;
}

async function serveStatic(req, res) {
  let urlPath = req.url || "/";
  if (urlPath === "/") urlPath = "/index.html";
  const abs = safePath(urlPath);
  if (!abs) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const stat = await fs.stat(abs);
    if (stat.isDirectory()) {
      return serveStatic({ ...req, url: path.posix.join(urlPath, "index.html") }, res);
    }
    const ext = path.extname(abs).toLowerCase();
    const data = await fs.readFile(abs);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";

  if (url.startsWith("/api/oracle")) {
    const mock = mockRes();
    await handleApi(req, mock, "oracle");
    const out = mock.ended;
    res.writeHead(out.statusCode, out.headers);
    res.end(out.body);
    return;
  }
  if (url.startsWith("/api/tutor")) {
    const mock = mockRes();
    await handleApi(req, mock, "tutor");
    const out = mock.ended;
    res.writeHead(out.statusCode, out.headers);
    res.end(out.body);
    return;
  }
  if (url.startsWith("/api/animator")) {
    const mock = mockRes();
    await handleApi(req, mock, "animator");
    const out = mock.ended;
    res.writeHead(out.statusCode, out.headers);
    res.end(out.body);
    return;
  }

  await serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Discourse dev server: http://localhost:${PORT}`);
  console.log(`Helpers: http://localhost:${PORT}/?p=helpers`);
  getCanonIndex()
    .then((docs) => {
      console.log(`Canon index ready: ${docs.length} documents`);
    })
    .catch((err) => console.warn("Canon index failed", err.message));
});
