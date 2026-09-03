/** Extract answer text and canon citations from a Responses API result. */

function uniqueBy(items, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function citationsFromMessage(messageItem) {
  const citations = [];
  for (const block of messageItem?.content || []) {
    for (const ann of block?.annotations || []) {
      if (ann?.type === "file_citation") {
        citations.push({
          fileId: ann.file_id || "",
          filename: ann.filename || "",
        });
      }
    }
  }
  return citations;
}

function resultsFromFileSearchCall(callItem) {
  const results = [];
  for (const hit of callItem?.results || callItem?.search_results || []) {
    results.push({
      fileId: hit.file_id || hit.fileId || "",
      filename: hit.filename || "",
      score: hit.score ?? null,
      text: hit.text || hit.content || "",
    });
  }
  return results;
}

export function parseHelperResponse(response) {
  const answer = response?.output_text?.trim() || "";
  const citations = [];
  const searchResults = [];

  for (const item of response?.output || []) {
    if (item?.type === "message") {
      citations.push(...citationsFromMessage(item));
    }
    if (item?.type === "file_search_call") {
      searchResults.push(...resultsFromFileSearchCall(item));
    }
  }

  const sources = uniqueBy(
    [
      ...searchResults.map((r) => ({
        fileId: r.fileId,
        filename: r.filename,
        excerpt: r.text ? String(r.text).slice(0, 400) : "",
        score: r.score,
      })),
      ...citations.map((c) => ({
        fileId: c.fileId,
        filename: c.filename,
        excerpt: "",
        score: null,
      })),
    ],
    (s) => `${s.fileId}:${s.filename}`,
  );

  return { answer, sources };
}
