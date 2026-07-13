const FEEDBACK_EMAIL = "jfeldman777@gmail.com";

const state = {
  pages: [],
  index: 0,
  autoAdvance: false,
  audioAvailable: new Set(),
  collapsedSections: loadCollapsedSections(),
};

const audio = new Audio();

const els = {
  toc: document.getElementById("toc"),
  pageMeta: document.getElementById("page-meta"),
  pageTitle: document.getElementById("page-title"),
  content: document.getElementById("content"),
  playBtn: document.getElementById("play-btn"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  progress: document.getElementById("progress"),
  time: document.getElementById("time"),
  playerInfo: document.getElementById("player-info"),
  noAudio: document.getElementById("no-audio"),
  autoAdvance: document.getElementById("auto-advance"),
  progressWrap: document.getElementById("progress-wrap"),
  playerControls: document.getElementById("player-controls"),
  feedbackModal: document.getElementById("feedback-modal"),
  feedbackForm: document.getElementById("feedback-form"),
  feedbackContext: document.getElementById("feedback-context"),
  feedbackStatus: document.getElementById("feedback-status"),
  feedbackOpenPage: document.getElementById("feedback-open-page"),
  feedbackOpenPlayer: document.getElementById("feedback-open-player"),
  tocOpen: document.getElementById("toc-open"),
  tocClose: document.getElementById("toc-close"),
  tocBackdrop: document.getElementById("toc-backdrop"),
  sidebar: document.getElementById("sidebar"),
  copyLink: document.getElementById("copy-link"),
  statPages: document.getElementById("stat-pages"),
  statAudio: document.getElementById("stat-audio"),
};

function audioPath(page) {
  const src = page.sourcePage || page;
  return `audio/${src.section}/${src.id}.mp3`;
}

/** `5.3-3.1 Title.md` → slot 5.3 includes page 3.1 */
function parseIncludeFromMd(path) {
  const name = path.split("/").pop().replace(/\.md$/i, "");
  const match = name.match(/^(\d+(?:\.\d+)*)-(\d+(?:\.\d+)*)/);
  if (!match) return null;
  return { id: match[1], include: match[2] };
}

function titleFromMd(path) {
  const name = path.split("/").pop().replace(/\.md$/i, "");
  // Strip "1.2." or include alias "5.3-3.1."
  const title = name
    .replace(/^\d+(?:\.\d+)*(?:-\d+(?:\.\d+)*)?\.?\s*/, "")
    .trim();
  return title;
}

function resolvePages(rawPages) {
  const pages = rawPages.map((page) => {
    const parsed = parseIncludeFromMd(page.md);
    const include = page.include || parsed?.include || null;
    // Slot id only: "5.3-3.1.md" → id "5.3" (never show the second index)
    const id = include && parsed?.id ? parsed.id : page.id;
    return {
      ...page,
      id,
      include,
      title: titleFromMd(page.md),
      sourcePage: null,
    };
  });

  const byId = new Map(pages.map((p) => [p.id, p]));

  for (const page of pages) {
    if (!page.include) continue;
    const source = byId.get(page.include);
    if (!source || source.include) {
      console.warn(
        `Include ${page.id}→${page.include}: source page not found`,
      );
      continue;
    }
    page.sourcePage = source;
    // Always the original page title (for reader + TOC)
    page.title = source.title;
  }

  return pages;
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function wikiImageHtml(rawTarget) {
  // Obsidian: ![[file.png]] or ![[file.png|663]]
  const file = rawTarget.split("|")[0].trim();
  if (!file) return "";
  const width = rawTarget.includes("|")
    ? rawTarget.split("|")[1].trim()
    : "";
  const widthAttr =
    width && /^\d+$/.test(width) ? ` style="max-width:${width}px"` : "";
  return `<img src="${encodeURI(file)}" alt=""${widthAttr}>`;
}

function renderInline(text) {
  // Expand Obsidian wiki images and markdown images anywhere in the line.
  const pattern =
    /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;
  let result = "";
  let last = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    result += escapeHtml(text.slice(last, match.index));
    if (match[1] !== undefined) {
      result += wikiImageHtml(match[1]);
    } else {
      result += `<img src="${encodeURI(match[3])}" alt="${escapeHtml(match[2])}">`;
    }
    last = match.index + match[0].length;
  }

  result += escapeHtml(text.slice(last));
  return result;
}

function renderMarkdown(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const parts = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const body = paragraph.map((line) => renderInline(line)).join("<br>");
    parts.push(`<p>${body}</p>`);
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      flushParagraph();
      parts.push(`<h2>${escapeHtml(heading[1].trim())}</h2>`);
      continue;
    }

    // Whole-line image(s) without other text → separate block(s)
    const onlyImages = line.match(/^(!\[\[[^\]]+\]\]|!\[[^\]]*\]\([^)]+\))+$/);
    if (onlyImages) {
      flushParagraph();
      parts.push(`<div class="images">${renderInline(line)}</div>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  return parts.join("\n");
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function checkAudio(page) {
  const path = audioPath(page);
  try {
    const res = await fetch(path, { method: "HEAD" });
    if (res.ok) state.audioAvailable.add(page.id);
  } catch {
    // no audio yet
  }
}

function pageUrl(page) {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";
  // Keep path to index.html or directory root
  url.searchParams.set("p", page.id);
  return url.toString();
}

function syncUrl(page) {
  const url = pageUrl(page);
  history.replaceState({ pageId: page.id }, "", url);
}

async function copyPageLink() {
  const page = state.pages[state.index];
  if (!page) return;
  const link = pageUrl(page);
  try {
    await navigator.clipboard.writeText(link);
  } catch {
    const input = document.createElement("input");
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }
  const btn = els.copyLink;
  const prev = btn.textContent;
  btn.textContent = "✓";
  btn.classList.add("copied");
  btn.title = "Ссылка скопирована";
  setTimeout(() => {
    btn.textContent = prev;
    btn.classList.remove("copied");
    btn.title = "Скопировать ссылку на страницу";
  }, 1400);
}

function loadCollapsedSections() {
  try {
    const raw = localStorage.getItem("discourse-toc-collapsed");
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveCollapsedSections() {
  localStorage.setItem(
    "discourse-toc-collapsed",
    JSON.stringify([...state.collapsedSections]),
  );
}

function updateStats() {
  els.statPages.textContent = String(state.pages.length);
  els.statAudio.textContent = String(state.audioAvailable.size);
}

function buildToc() {
  els.toc.innerHTML = "";

  const groups = [];
  let current = null;

  state.pages.forEach((page, index) => {
    if (!current || current.section !== page.section) {
      current = { section: page.section, items: [] };
      groups.push(current);
    }
    current.items.push({ page, index });
  });

  // Keep the section with the current page expanded
  const activeSection = state.pages[state.index]?.section;
  if (activeSection) {
    state.collapsedSections.delete(activeSection);
  }

  groups.forEach((group) => {
    const isCollapsed = state.collapsedSections.has(group.section);
    const groupEl = document.createElement("div");
    groupEl.className = "toc-group" + (isCollapsed ? " collapsed" : "");
    groupEl.dataset.section = group.section;

    const headerBtn = document.createElement("button");
    headerBtn.type = "button";
    headerBtn.className = "toc-section";
    headerBtn.setAttribute("aria-expanded", String(!isCollapsed));
    headerBtn.innerHTML = `
      <span class="toc-chevron" aria-hidden="true"></span>
      <span class="toc-section-title">${escapeHtml(group.section)}</span>
    `;
    headerBtn.addEventListener("click", () => {
      const collapsed = groupEl.classList.toggle("collapsed");
      headerBtn.setAttribute("aria-expanded", String(!collapsed));
      if (collapsed) {
        state.collapsedSections.add(group.section);
      } else {
        state.collapsedSections.delete(group.section);
      }
      saveCollapsedSections();
    });

    const itemsEl = document.createElement("div");
    itemsEl.className = "toc-group-items";

    group.items.forEach(({ page, index }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "toc-item";
      btn.dataset.index = String(index);
      if (state.audioAvailable.has(page.id)) {
        btn.classList.add("has-audio");
      }
      if (index === state.index) {
        btn.classList.add("active");
      }

      const tocId = page.id;
      const tocTitle = page.sourcePage ? page.sourcePage.title : page.title;

      btn.innerHTML = `
        <span class="num">${escapeHtml(tocId)}</span>
        <span class="title">${escapeHtml(tocTitle)}</span>
        <span class="audio-dot" title="${state.audioAvailable.has(page.id) ? "Есть запись" : "Записи пока нет"}"></span>
      `;

      btn.addEventListener("click", () => {
        closeToc();
        goToPage(index, false);
      });
      itemsEl.appendChild(btn);
    });

    groupEl.appendChild(headerBtn);
    groupEl.appendChild(itemsEl);
    els.toc.appendChild(groupEl);
  });
}

function openToc() {
  document.body.classList.add("toc-open");
  els.sidebar.classList.add("is-open");
  els.tocBackdrop.hidden = false;
  els.tocBackdrop.setAttribute("aria-hidden", "false");
  els.sidebar.setAttribute("aria-hidden", "false");
}

function closeToc() {
  document.body.classList.remove("toc-open");
  els.sidebar.classList.remove("is-open");
  els.tocBackdrop.hidden = true;
  els.tocBackdrop.setAttribute("aria-hidden", "true");
  els.sidebar.setAttribute("aria-hidden", "true");
}

function toggleToc() {
  if (document.body.classList.contains("toc-open")) {
    closeToc();
  } else {
    openToc();
  }
}

function currentPageLabel() {
  const page = state.pages[state.index];
  return `${page.id} — ${page.title} (${page.section})`;
}

function openFeedbackModal() {
  els.feedbackContext.textContent = `Страница: ${currentPageLabel()}`;
  els.feedbackStatus.hidden = true;
  els.feedbackStatus.className = "feedback-status";
  els.feedbackModal.hidden = false;
  els.feedbackForm.message.focus();
}

function closeFeedbackModal() {
  els.feedbackModal.hidden = true;
}

async function submitFeedback(event) {
  event.preventDefault();

  const form = els.feedbackForm;
  const submitBtn = form.querySelector('button[type="submit"]');
  const page = state.pages[state.index];
  const data = new FormData(form);

  if (data.get("_honey")) return;

  submitBtn.disabled = true;
  els.feedbackStatus.hidden = true;

  const payload = {
    _subject: `Дискурс: отзыв — ${page.id} ${page.title}`,
    _template: "table",
    _captcha: "false",
    page: currentPageLabel(),
    name: data.get("name") || "—",
    reply_email: data.get("reply_email") || "—",
    message: data.get("message"),
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("send failed");

    els.feedbackStatus.textContent = "Спасибо! Сообщение отправлено.";
    els.feedbackStatus.className = "feedback-status success";
    els.feedbackStatus.hidden = false;
    form.message.value = "";
    setTimeout(closeFeedbackModal, 1800);
  } catch {
    els.feedbackStatus.textContent =
      "Не удалось отправить. Попробуйте позже или напишите на jfeldman777@gmail.com";
    els.feedbackStatus.className = "feedback-status error";
    els.feedbackStatus.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
}

function updatePlayerUi() {
  const page = state.pages[state.index];
  const hasAudio = state.audioAvailable.has(page.id);

  els.playerInfo.textContent = `${page.id}`;
  els.noAudio.hidden = hasAudio;
  els.progressWrap.hidden = !hasAudio;
  els.playerControls.hidden = !hasAudio;
  els.playBtn.textContent = audio.paused ? "▶ Слушать" : "⏸ Пауза";
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.disabled = state.index === state.pages.length - 1;
}

async function loadPage(index, autoplay = false) {
  state.index = index;
  const page = state.pages[index];
  const title = page.title;

  els.pageMeta.textContent = `${page.section} · ${page.id}`;
  els.pageTitle.textContent = title;
  document.title = `${page.id} — ${title}`;

  // Include pages (5.3-3.1): always use source text; ignore own .md body
  let mdPath = page.md;
  if (page.include) {
    if (!page.sourcePage) {
      els.content.innerHTML = `<p class="load-error">Вставка <code>${escapeHtml(page.id)}←${escapeHtml(page.include)}</code>: страница-источник не найдена. Собственный текст файла игнорируется.</p>`;
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      buildToc();
      updatePlayerUi();
      syncUrl(page);
      document.getElementById("reader").scrollTop = 0;
      return;
    }
    mdPath = page.sourcePage.md;
  }

  try {
    const res = await fetch(encodeURI(mdPath), { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    els.content.innerHTML = renderMarkdown(text);
  } catch (err) {
    els.content.innerHTML = `<p class="load-error">Не удалось загрузить текст страницы <code>${escapeHtml(mdPath)}</code>. Обновите страницу (Ctrl+F5).</p>`;
    console.error("loadPage failed", mdPath, err);
  }

  audio.pause();
  audio.currentTime = 0;

  if (state.audioAvailable.has(page.id)) {
    audio.src = audioPath(page);
    if (autoplay) {
      try {
        await audio.play();
      } catch {
        // autoplay blocked
      }
    }
  } else {
    audio.removeAttribute("src");
    audio.load();
  }

  buildToc();
  updatePlayerUi();
  syncUrl(page);
  document.getElementById("reader").scrollTop = 0;
}

function goToPage(index, autoplay) {
  if (index < 0 || index >= state.pages.length) return;
  loadPage(index, autoplay);
}

function goNext(autoplay = false) {
  goToPage(state.index + 1, autoplay);
}

function goPrev() {
  goToPage(state.index - 1, false);
}

function togglePlay() {
  const page = state.pages[state.index];
  if (!state.audioAvailable.has(page.id)) return;

  if (!audio.src) {
    audio.src = audioPath(page);
  }

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

audio.addEventListener("play", updatePlayerUi);
audio.addEventListener("pause", updatePlayerUi);
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  els.progress.value = String((audio.currentTime / audio.duration) * 100);
  els.time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});
audio.addEventListener("ended", () => {
  if (state.autoAdvance && state.index < state.pages.length - 1) {
    goNext(true);
  }
});

els.progress.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (Number(els.progress.value) / 100) * audio.duration;
});

els.playBtn.addEventListener("click", togglePlay);
els.prevBtn.addEventListener("click", goPrev);
els.nextBtn.addEventListener("click", () => goNext(false));
els.autoAdvance.addEventListener("change", (e) => {
  state.autoAdvance = e.target.checked;
});

els.feedbackOpenPage.addEventListener("click", openFeedbackModal);
els.feedbackOpenPlayer.addEventListener("click", openFeedbackModal);
els.feedbackForm.addEventListener("submit", submitFeedback);
els.feedbackModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]")) closeFeedbackModal();
});

els.tocOpen.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleToc();
});
els.tocClose.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeToc();
});
els.tocBackdrop.addEventListener("click", closeToc);
els.copyLink.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  copyPageLink();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("toc-open")) {
    closeToc();
    return;
  }
  if (e.key === "Escape" && !els.feedbackModal.hidden) {
    closeFeedbackModal();
    return;
  }
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }
  if (e.code === "ArrowRight") goNext(false);
  if (e.code === "ArrowLeft") goPrev();
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
});

async function init() {
  const manifest = await fetch(`pages.json?v=${Date.now()}`, {
    cache: "no-store",
  }).then((r) => r.json());
  state.pages = resolvePages(manifest.pages);

  await Promise.all(state.pages.map((page) => checkAudio(page)));
  updateStats();

  const startId = new URLSearchParams(location.search).get("p");
  const startIndex = startId
    ? Math.max(0, state.pages.findIndex((p) => p.id === startId))
    : 0;

  await loadPage(startIndex === -1 ? 0 : startIndex, false);
}

init();
