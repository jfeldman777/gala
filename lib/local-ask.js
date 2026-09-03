/** Format local Canon search hits as helper answers (markdown). */

function cite(hit) {
  return hit.title && hit.title !== hit.id ? `${hit.id}. ${hit.title}` : String(hit.id);
}

function sourcesFromHits(hits) {
  return hits.map((h) => ({
    fileId: "",
    filename: h.file || h.id,
    excerpt: h.excerpt,
    score: h.score ?? null,
  }));
}

const COPY = {
  ru: {
    none: "Канон не даёт достаточного ответа на этот вопрос.",
    oracleLead: "По Канону к этому ближе всего такие места:",
    tutorLead: "Можно идти так — по документам Канона:",
    animatorLead: "Смотрите, какая зацепка в Каноне:",
  },
  en: {
    none: "The Canon does not give a sufficient answer to this question.",
    oracleLead: "In the Canon, the closest places are:",
    tutorLead: "A path through the Canon, document by document:",
    animatorLead: "Look — here is a hook in the Canon:",
  },
};

function listHits(hits) {
  return hits
    .map((h, i) => `${i + 1}. ${cite(h)} — ${h.excerpt}`)
    .join("\n");
}

export function formatLocalAnswer(kind, hits, lang) {
  const L = lang === "en" ? COPY.en : COPY.ru;
  if (!hits.length) {
    return { answer: L.none, sources: [] };
  }

  if (kind === "tutor") {
    return {
      answer: `${L.tutorLead}\n\n${listHits(hits)}`,
      sources: sourcesFromHits(hits),
    };
  }

  if (kind === "animator") {
    const head = hits[0];
    const rest = hits.slice(1);
    const extra = rest.length
      ? rest.map((h) => `- ${cite(h)} — ${h.excerpt}`).join("\n")
      : "";
    const answer = extra
      ? `${L.animatorLead}\n\n${cite(head)} — ${head.excerpt}\n\n${extra}`
      : `${L.animatorLead}\n\n${cite(head)} — ${head.excerpt}`;
    return { answer, sources: sourcesFromHits(hits) };
  }

  return {
    answer: `${L.oracleLead}\n\n${listHits(hits)}`,
    sources: sourcesFromHits(hits),
  };
}
