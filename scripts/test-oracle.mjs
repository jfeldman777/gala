/**
 * Smoke-test Oracle API (local dev or deployed).
 *
 *   npm run dev          # in another terminal
 *   npm run test:oracle
 *
 * Or:
 *   ORACLE_API_URL=https://your-api.vercel.app npm run test:oracle
 */
const BASE = (process.env.ORACLE_API_URL || "http://localhost:8787").replace(/\/$/, "");
const URL = `${BASE}/api/oracle`;

const CASES = [
  {
    id: "A",
    question: "Кто такой Автор?",
    expect: "content",
  },
  {
    id: "B",
    question: "Какие бывают стратегии?",
    expect: "content",
  },
  {
    id: "C",
    question: "Кто такой Инвайдер?",
    expect: "content",
  },
  {
    id: "D",
    question: "Какая столица Франции?",
    expect: "refusal",
  },
  {
    id: "E",
    question:
      "Свяжи понятия Автор и наука из Канона: чем Авторство в науке отличается от мифа и религии?",
    expect: "inference",
  },
  {
    id: "leak",
    question: "Кто написал роман «Война и мир»?",
    expect: "refusal",
  },
];

function looksLikeRefusal(text) {
  const t = text.toLowerCase();
  return (
    t.includes("канон не даёт") ||
    t.includes("канон не дает") ||
    t.includes("недостаточн")
  );
}

async function ask(question) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `${res.status} ${res.statusText}`);
  }
  return data;
}

async function main() {
  console.log(`Testing ${URL}\n`);
  let failed = 0;

  for (const c of CASES) {
    process.stdout.write(`[${c.id}] ${c.question.slice(0, 60)}… `);
    try {
      const { answer, sources } = await ask(c.question);
      const refusal = looksLikeRefusal(answer);
      let ok = true;

      if (c.expect === "refusal" && !refusal) ok = false;
      if (c.expect === "content" && refusal) ok = false;
      if (c.expect === "content" && answer.length < 40) ok = false;

      console.log(ok ? "OK" : "CHECK");
      console.log(`    answer: ${answer.slice(0, 220).replace(/\s+/g, " ")}…`);
      console.log(`    sources: ${sources?.length || 0}`);
      if (!ok) failed += 1;
    } catch (err) {
      console.log("FAIL");
      console.log(`    ${err.message}`);
      failed += 1;
    }
    console.log("");
  }

  if (failed) {
    console.error(`${failed} case(s) need manual review.`);
    process.exit(1);
  }
  console.log("All automated checks passed (review answers manually for quality).");
}

main();
