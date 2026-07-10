const FEEDBACK_EMAIL = "jfeldman777@gmail.com";

const state = {
  pages: [],
  index: 0,
  autoAdvance: false,
  audioAvailable: new Set(),
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
};

function audioPath(page) {
  return `audio/${page.section}/${page.id}.mp3`;
}

function titleFromMd(path) {
  const name = path.split("/").pop().replace(/\.md$/i, "");
  return name.replace(/^\d+(?:\.\d+)*\.?\s*/, "").trim();
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

function buildToc() {
  els.toc.innerHTML = "";
  let currentSection = "";

  state.pages.forEach((page, index) => {
    if (page.section !== currentSection) {
      currentSection = page.section;
      const sectionEl = document.createElement("div");
      sectionEl.className = "toc-section";
      sectionEl.textContent = currentSection;
      els.toc.appendChild(sectionEl);
    }

    const btn = document.createElement("button");
    btn.className = "toc-item";
    btn.dataset.index = String(index);
    if (state.audioAvailable.has(page.id)) {
      btn.classList.add("has-audio");
    }
    if (index === state.index) {
      btn.classList.add("active");
    }

    btn.innerHTML = `
      <span class="num">${page.id}</span>
      <span class="title">${escapeHtml(page.title)}</span>
      <span class="audio-dot" title="${state.audioAvailable.has(page.id) ? "Есть запись" : "Записи пока нет"}"></span>
    `;

    btn.addEventListener("click", () => goToPage(index, false));
    els.toc.appendChild(btn);
  });
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

  const res = await fetch(encodeURI(page.md));
  const text = await res.text();
  els.content.innerHTML = renderMarkdown(text);

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

window.addEventListener("keydown", (e) => {
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
  const manifest = await fetch("pages.json").then((r) => r.json());
  state.pages = manifest.pages.map((page) => ({
    ...page,
    title: titleFromMd(page.md),
  }));

  await Promise.all(state.pages.map((page) => checkAudio(page)));

  const startId = new URLSearchParams(location.search).get("p");
  const startIndex = startId
    ? Math.max(0, state.pages.findIndex((p) => p.id === startId))
    : 0;

  await loadPage(startIndex === -1 ? 0 : startIndex, false);
}

init();
