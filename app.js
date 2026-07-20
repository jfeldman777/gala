const FEEDBACK_EMAIL = "jfeldman777@gmail.com";
/** Optional extra silent channel: free key from https://web3forms.com */
const WEB3FORMS_KEY = "";

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
  voteLike: document.getElementById("vote-like"),
  voteDislike: document.getElementById("vote-dislike"),
  voteStatus: document.getElementById("vote-status"),
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

/** Section title ending with `@` = draft, hide from reader/TOC */
function isDraftSection(section) {
  return /@$/.test(String(section || "").trim());
}

/** Filename ending with `@` before .md = unfinished page, hide */
function isDraftPage(mdPath) {
  const name = String(mdPath || "")
    .split("/")
    .pop()
    .replace(/\.md$/i, "")
    .trim();
  return /@$/.test(name);
}

function titleFromMd(path) {
  const name = path.split("/").pop().replace(/\.md$/i, "");
  // Strip "1.2." or include alias "5.3-3.1.", and trailing draft marker @
  const title = name
    .replace(/@$/, "")
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

  // Resolve includes against the full catalog (draft sources still count)
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

  // Hide unfinished sections (@ at end of section) and pages (…@.md)
  return pages.filter(
    (page) => !isDraftSection(page.section) && !isDraftPage(page.md),
  );
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

function safeHref(raw) {
  const href = String(raw || "").trim();
  // Allow http(s) and site-relative paths only (block javascript: etc.)
  if (/^https?:\/\//i.test(href) || /^\.?\//.test(href)) return href;
  return "";
}

function renderInline(text) {
  // Images first (![[…]] / ![alt](src)), then markdown links [text](url).
  const pattern =
    /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<]+)/g;
  let result = "";
  let last = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    result += escapeHtml(text.slice(last, match.index));
    if (match[1] !== undefined) {
      result += wikiImageHtml(match[1]);
    } else if (match[3] !== undefined) {
      result += `<img src="${encodeURI(match[3])}" alt="${escapeHtml(match[2])}">`;
    } else if (match[4] !== undefined) {
      const href = safeHref(match[5]);
      const label = escapeHtml(match[4]);
      result += href
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : label;
    } else {
      const href = safeHref(match[6]);
      const label = escapeHtml(match[6]);
      result += href
        ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : label;
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
  /** @type {{ tag: "ol" | "ul" }[]} */
  const listStack = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const body = paragraph.map((line) => renderInline(line)).join("<br>");
    parts.push(`<p>${body}</p>`);
    paragraph = [];
  };

  const closeListsUntil = (depth) => {
    while (listStack.length > depth) {
      parts.push("</li>");
      parts.push(`</${listStack.pop().tag}>`);
    }
  };

  const flushLists = () => closeListsUntil(0);

  const listLevel = (ws) =>
    Math.floor(ws.replace(/\t/g, "    ").length / 4);

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r$/, "").trimEnd();

    if (!line.trim()) {
      flushParagraph();
      // Blank lines inside a list must not restart numbering.
      continue;
    }

    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushLists();
      parts.push(`<h2>${escapeHtml(heading[1].trim())}</h2>`);
      continue;
    }

    const listMatch = line.match(/^([ \t]*)(?:(\d+)\.|[-*•])\s+(.*)$/);
    if (listMatch) {
      flushParagraph();
      const level = listLevel(listMatch[1]);
      const ordered = listMatch[2] != null;
      const tag = ordered ? "ol" : "ul";
      const body = renderInline(listMatch[3].trim());

      closeListsUntil(level + 1);

      if (listStack.length === level + 1) {
        parts.push("</li>");
        if (listStack[listStack.length - 1].tag !== tag) {
          parts.push(`</${listStack.pop().tag}>`);
          parts.push(`<${tag}>`);
          listStack.push({ tag });
        }
        parts.push(`<li>${body}`);
      } else {
        // Open missing intermediate levels if indent jumps
        while (listStack.length < level) {
          const fill = tag;
          parts.push(`<${fill}><li>`);
          listStack.push({ tag: fill });
        }
        parts.push(`<${tag}><li>${body}`);
        listStack.push({ tag });
      }
      continue;
    }

    // Indented continuation line inside an open list item
    if (listStack.length && /^[ \t]/.test(rawLine)) {
      flushParagraph();
      const contIndent = listLevel(rawLine.match(/^([ \t]*)/)[1]);
      closeListsUntil(contIndent + 1);
      if (listStack.length) {
        parts.push(`<br>${renderInline(line.trim())}`);
        continue;
      }
    }

    flushLists();

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
  flushLists();
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

/** `10. Система/10.1. Кодировки/file.md` → `10.1. Кодировки` */
function pageSubsection(page) {
  const parts = String(page.md || "").split("/");
  if (parts.length < 3) return null;
  return parts[parts.length - 2];
}

function collapseKey(section, subsection) {
  return subsection ? `${section}::${subsection}` : section;
}

function makeTocItemButton(page, index) {
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

  const tocTitle = page.sourcePage ? page.sourcePage.title : page.title;
  btn.innerHTML = `
    <span class="num">${escapeHtml(page.id)}</span>
    <span class="title">${escapeHtml(tocTitle)}</span>
    <span class="audio-dot" title="${state.audioAvailable.has(page.id) ? "Есть запись" : "Записи пока нет"}"></span>
  `;

  btn.addEventListener("click", () => {
    closeToc();
    goToPage(index, false);
  });
  return btn;
}

function makeCollapsibleHeader(label, key, groupEl, className) {
  const isCollapsed = state.collapsedSections.has(key);
  if (isCollapsed) groupEl.classList.add("collapsed");

  const headerBtn = document.createElement("button");
  headerBtn.type = "button";
  headerBtn.className = className;
  headerBtn.setAttribute("aria-expanded", String(!isCollapsed));
  headerBtn.innerHTML = `
    <span class="toc-chevron" aria-hidden="true"></span>
    <span class="toc-section-title">${escapeHtml(label)}</span>
  `;
  headerBtn.addEventListener("click", () => {
    const collapsed = groupEl.classList.toggle("collapsed");
    headerBtn.setAttribute("aria-expanded", String(!collapsed));
    if (collapsed) {
      state.collapsedSections.add(key);
    } else {
      state.collapsedSections.delete(key);
    }
    saveCollapsedSections();
  });
  return headerBtn;
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

  // Keep the section (and subsection) with the current page expanded
  const activePage = state.pages[state.index];
  if (activePage) {
    state.collapsedSections.delete(activePage.section);
    const activeSub = pageSubsection(activePage);
    if (activeSub) {
      state.collapsedSections.delete(collapseKey(activePage.section, activeSub));
    }
  }

  groups.forEach((group) => {
    const sectionKey = collapseKey(group.section, null);
    const groupEl = document.createElement("div");
    groupEl.className = "toc-group";
    groupEl.dataset.section = group.section;
    groupEl.appendChild(
      makeCollapsibleHeader(group.section, sectionKey, groupEl, "toc-section"),
    );

    const itemsEl = document.createElement("div");
    itemsEl.className = "toc-group-items";

    // Nest by subdirectory for section 10 (and any section with subfolders)
    const subgroups = [];
    let flatItems = [];
    let currentSub = null;

    group.items.forEach(({ page, index }) => {
      const sub = pageSubsection(page);
      if (!sub) {
        currentSub = null;
        flatItems.push({ page, index });
        return;
      }
      if (!currentSub || currentSub.name !== sub) {
        currentSub = { name: sub, items: [] };
        subgroups.push(currentSub);
      }
      currentSub.items.push({ page, index });
    });

    flatItems.forEach(({ page, index }) => {
      itemsEl.appendChild(makeTocItemButton(page, index));
    });

    subgroups.forEach((sub) => {
      const key = collapseKey(group.section, sub.name);
      const subEl = document.createElement("div");
      subEl.className = "toc-subgroup";
      subEl.dataset.subsection = sub.name;
      subEl.appendChild(
        makeCollapsibleHeader(sub.name, key, subEl, "toc-subsection"),
      );

      const subItems = document.createElement("div");
      subItems.className = "toc-subgroup-items";
      sub.items.forEach(({ page, index }) => {
        subItems.appendChild(makeTocItemButton(page, index));
      });
      subEl.appendChild(subItems);
      itemsEl.appendChild(subEl);
    });

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

function voteStorageKey(pageId) {
  return `discourse-vote:${pageId}`;
}

function getStoredVote(pageId) {
  try {
    return localStorage.getItem(voteStorageKey(pageId));
  } catch {
    return null;
  }
}

function setStoredVote(pageId, vote) {
  try {
    localStorage.setItem(voteStorageKey(pageId), vote);
  } catch {
    // ignore quota / private mode
  }
}

function updateVoteUi() {
  const page = state.pages[state.index];
  if (!page || !els.voteLike) return;

  const vote = getStoredVote(page.id);
  els.voteLike.classList.toggle("selected", vote === "like");
  els.voteDislike.classList.toggle("selected", vote === "dislike");
  els.voteLike.disabled = Boolean(vote);
  els.voteDislike.disabled = Boolean(vote);

  if (vote === "like") {
    els.voteStatus.textContent = "Спасибо за оценку";
    els.voteStatus.hidden = false;
  } else if (vote === "dislike") {
    els.voteStatus.textContent = "Спасибо, учтём";
    els.voteStatus.hidden = false;
  } else {
    els.voteStatus.hidden = true;
    els.voteStatus.textContent = "";
  }
}

function openMailto(subject, fields) {
  const lines = Object.entries(fields)
    .filter(([key, value]) => value != null && value !== "" && !String(key).startsWith("_"))
    .map(([key, value]) => `${key}: ${value}`);
  let body = lines.join("\n");
  if (body.length > 1600) body = `${body.slice(0, 1600)}…`;
  const url = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function isApiSuccess(res, data) {
  if (!res.ok) return false;
  if (data == null || typeof data !== "object") return true;
  return String(data.success).toLowerCase() !== "false";
}

async function fetchWithTimeout(url, options, ms = 5000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function trySilentSend(subject, clean) {
  // 1) FormSubmit — старый экономный канал
  try {
    const res = await fetchWithTimeout(
      `https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _captcha: "false",
          ...clean,
        }),
      },
      5000
    );
    const data = await res.json().catch(() => ({}));
    if (isApiSuccess(res, data)) return { ok: true, via: "formsubmit" };
  } catch {
    /* try next */
  }

  // 2) Optional Web3Forms key
  if (WEB3FORMS_KEY) {
    try {
      const res = await fetchWithTimeout(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject,
            from_name: "Дискурс",
            ...clean,
          }),
        },
        5000
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) return { ok: true, via: "web3forms" };
    } catch {
      /* fallback below */
    }
  }

  return null;
}

async function sendToAuthor({ subject, fields }) {
  const clean = { ...fields };
  delete clean._subject;
  delete clean._template;
  delete clean._captcha;

  const silent = await trySilentSend(subject, clean);
  if (silent) return silent;

  // 3) Fallback: open mail client
  openMailto(subject, clean);
  return { ok: true, via: "mailto" };
}

async function submitVote(vote) {
  const page = state.pages[state.index];
  if (!page) return;
  if (getStoredVote(page.id)) {
    updateVoteUi();
    return;
  }

  els.voteLike.disabled = true;
  els.voteDislike.disabled = true;
  els.voteStatus.hidden = false;
  els.voteStatus.textContent = "Отправляем…";

  const label = vote === "like" ? "лайк" : "дизлайк";
  const subject = `Дискурс: ${label} — ${page.id} ${page.title}`;
  const fields = {
    vote,
    page: currentPageLabel(),
    page_id: page.id,
    section: page.section,
  };

  try {
    const result = await sendToAuthor({ subject, fields });
    setStoredVote(page.id, vote);
    updateVoteUi();
    if (result.via === "mailto") {
      els.voteStatus.textContent = "Откройте почту и нажмите «Отправить»";
      els.voteStatus.hidden = false;
    }
  } catch {
    els.voteLike.disabled = false;
    els.voteDislike.disabled = false;
    els.voteStatus.textContent = "Не удалось отправить. Попробуйте ещё раз.";
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

  const subject = `Дискурс: отзыв — ${page.id} ${page.title}`;
  const fields = {
    page: currentPageLabel(),
    name: data.get("name") || "—",
    reply_email: data.get("reply_email") || "—",
    message: data.get("message"),
  };

  try {
    const result = await sendToAuthor({ subject, fields });
    if (result.via === "mailto") {
      els.feedbackStatus.textContent =
        "Откройте почту и нажмите «Отправить».";
      els.feedbackStatus.className = "feedback-status success";
      els.feedbackStatus.hidden = false;
    } else {
      els.feedbackStatus.textContent = "Спасибо! Сообщение отправлено.";
      els.feedbackStatus.className = "feedback-status success";
      els.feedbackStatus.hidden = false;
      form.message.value = "";
      setTimeout(closeFeedbackModal, 1800);
    }
  } catch {
    openMailto(subject, fields);
    els.feedbackStatus.textContent =
      "Откройте почту и нажмите «Отправить».";
    els.feedbackStatus.className = "feedback-status success";
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
      updateVoteUi();
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
  updateVoteUi();
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
els.voteLike.addEventListener("click", () => submitVote("like"));
els.voteDislike.addEventListener("click", () => submitVote("dislike"));
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
