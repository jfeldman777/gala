const FEEDBACK_EMAIL = "jfeldman777@gmail.com";
/** Optional extra silent channel: free key from https://web3forms.com */
const WEB3FORMS_KEY = "";

const state = {
  lang: "ru",
  pages: [],
  index: 0,
  autoAdvance: false,
  audioAvailable: new Set(),
  collapsedSections: loadCollapsedSections(),
  pageFind: {
    open: false,
    query: "",
    hits: [],
    current: -1,
    rawHtml: "",
  },
  changes: [],
  prevVisitAt: null,
};

const I18N = {
  ru: {
    bookTitle: "Дискурс",
    coverLine1: "Дискурс",
    coverLine2: "Фельдмана",
    coverHint: "обложка",
    coverEnter: "Открыть книгу",
    toCover: "К обложке",
    toc: "Оглавление",
    copyCover: "Скопировать ссылку на обложку",
    copyPage: "Скопировать ссылку на страницу",
    copyLink: "Скопировать ссылку",
    whatsNew: "Что нового",
    statsRead: "Читать",
    statsAndListen: "и слушать",
    more: "(еще)",
    tocSearch: "Поиск по книге…",
    tocSearchEmpty: "Ничего не найдено",
    pageFind: "Поиск на странице (Ctrl+F)",
    pageFindShort: "Поиск на странице",
    pageFindInput: "Найти на странице…",
    prevMatch: "Предыдущее совпадение",
    nextMatch: "Следующее совпадение",
    close: "Закрыть",
    closeFind: "Закрыть поиск",
    feedback: "Обратная связь",
    feedbackShort: "Отзыв",
    yourName: "Ваше имя",
    namePlaceholder: "для лайков и писем автору",
    pageUseful: "Страница полезна?",
    like: "Нравится",
    dislike: "Не нравится",
    haveComment: "Есть замечание или вопрос по этой странице?",
    writeAuthor: "Написать автору",
    prevPage: "Предыдущая страница",
    nextPage: "Следующая страница",
    back: "Назад",
    forward: "Вперёд",
    listen: "▶ Слушать",
    pause: "⏸ Пауза",
    autoAdvance: "Автопереход",
    autoShort: "Авто",
    noAudio: "Записи для этой страницы пока нет",
    replyEmail: "Email для ответа",
    optional: "(необязательно)",
    message: "Сообщение",
    messagePlaceholder: "Замечание, вопрос, опечатка…",
    cancel: "Отмена",
    send: "Отправить",
    changesIntro: "Страницы, которые появились или изменились за выбранный срок.",
    period: "Период",
    periodSince: "с прошлого визита",
    period3: "3 дня",
    period7: "7 дней",
    period14: "14 дней",
    period30: "30 дней",
    period90: "90 дней",
    needName: "Сначала укажите имя",
    thanksLike: "Спасибо за оценку",
    thanksDislike: "Спасибо, учтём",
    sending: "Отправляем…",
    openMail: "Откройте почту и нажмите «Отправить»",
    sendFail: "Не удалось отправить. Попробуйте ещё раз.",
    enterName: "Укажите имя",
    mailHint: "Откройте почту и нажмите «Отправить».",
    thanksSent: "Спасибо! Сообщение отправлено.",
    sendError: "Ошибка отправки. Попробуйте ещё раз или напишите на почту.",
    pageLabel: "Страница",
    hasAudio: "Есть запись",
    noAudioDot: "Записи пока нет",
    kindNew: "новое",
    kindChanged: "изменено",
    changesEmpty: "За этот срок страницы не менялись.",
    firstVisitWeek: "первый визит — показана неделя",
    pagesShort: "стр.",
    noChanges: "нет изменений",
    linkCopied: "Ссылка скопирована",
    loadError: "Не удалось загрузить текст страницы",
    refreshHint: "Обновите страницу (Ctrl+F5).",
    includeMissing: "страница-источник не найдена. Собственный текст файла игнорируется.",
    likeLabel: "лайк",
    dislikeLabel: "дизлайк",
    mailSubjectVote: "Дискурс",
    mailSubjectFeedback: "Дискурс",
    enEmpty: "",
  },
  en: {
    bookTitle: "Feldman's Discourse",
    coverLine1: "Feldman's",
    coverLine2: "Discourse",
    coverHint: "cover",
    coverEnter: "Open the book",
    toCover: "To cover",
    toc: "Contents",
    copyCover: "Copy cover link",
    copyPage: "Copy page link",
    copyLink: "Copy link",
    whatsNew: "What's new",
    statsRead: "Read",
    statsAndListen: "and listen",
    more: "(more)",
    tocSearch: "Search the book…",
    tocSearchEmpty: "Nothing found",
    pageFind: "Find on page (Ctrl+F)",
    pageFindShort: "Find on page",
    pageFindInput: "Find on page…",
    prevMatch: "Previous match",
    nextMatch: "Next match",
    close: "Close",
    closeFind: "Close search",
    feedback: "Feedback",
    feedbackShort: "Feedback",
    yourName: "Your name",
    namePlaceholder: "for likes and messages to the author",
    pageUseful: "Was this page useful?",
    like: "Like",
    dislike: "Dislike",
    haveComment: "A note or question about this page?",
    writeAuthor: "Write to the author",
    prevPage: "Previous page",
    nextPage: "Next page",
    back: "Back",
    forward: "Forward",
    listen: "▶ Listen",
    pause: "⏸ Pause",
    autoAdvance: "Auto-advance",
    autoShort: "Auto",
    noAudio: "No recording for this page yet",
    replyEmail: "Email for a reply",
    optional: "(optional)",
    message: "Message",
    messagePlaceholder: "Note, question, typo…",
    cancel: "Cancel",
    send: "Send",
    changesIntro: "Pages added or changed in the selected period.",
    period: "Period",
    periodSince: "since last visit",
    period3: "3 days",
    period7: "7 days",
    period14: "14 days",
    period30: "30 days",
    period90: "90 days",
    needName: "Please enter your name first",
    thanksLike: "Thanks for the rating",
    thanksDislike: "Thanks — noted",
    sending: "Sending…",
    openMail: "Open your mail app and press Send",
    sendFail: "Could not send. Please try again.",
    enterName: "Please enter your name",
    mailHint: "Open your mail app and press Send.",
    thanksSent: "Thanks! Message sent.",
    sendError: "Send failed. Try again or email the author.",
    pageLabel: "Page",
    hasAudio: "Recording available",
    noAudioDot: "No recording yet",
    kindNew: "new",
    kindChanged: "updated",
    changesEmpty: "No page changes in this period.",
    firstVisitWeek: "first visit — showing one week",
    pagesShort: "pp.",
    noChanges: "no changes",
    linkCopied: "Link copied",
    loadError: "Could not load page text",
    refreshHint: "Refresh the page (Ctrl+F5).",
    includeMissing: "source page not found. This file’s own text is ignored.",
    likeLabel: "like",
    dislikeLabel: "dislike",
    mailSubjectVote: "Feldman's Discourse",
    mailSubjectFeedback: "Feldman's Discourse",
    enEmpty: "English pages will appear here as they are translated. Switch to RU for the full book.",
  },
};

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ru[key] || key;
}

function manifestFile() {
  return state.lang === "en" ? "pages.en.json" : "pages.json";
}

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
  voteLike: document.getElementById("vote-like"),
  voteDislike: document.getElementById("vote-dislike"),
  voteStatus: document.getElementById("vote-status"),
  readerName: document.getElementById("reader-name"),
  tocOpen: document.getElementById("toc-open"),
  tocClose: document.getElementById("toc-close"),
  tocBackdrop: document.getElementById("toc-backdrop"),
  sidebar: document.getElementById("sidebar"),
  copyLink: document.getElementById("copy-link"),
  statPages: document.getElementById("stat-pages"),
  statAudio: document.getElementById("stat-audio"),
  tocSearch: document.getElementById("toc-search"),
  tocSearchEmpty: document.getElementById("toc-search-empty"),
  pageFindOpen: document.getElementById("page-find-open"),
  pageFindBar: document.getElementById("page-find-bar"),
  pageFindInput: document.getElementById("page-find-input"),
  pageFindCount: document.getElementById("page-find-count"),
  pageFindPrev: document.getElementById("page-find-prev"),
  pageFindNext: document.getElementById("page-find-next"),
  pageFindClose: document.getElementById("page-find-close"),
  reader: document.getElementById("reader"),
  coverScreen: document.getElementById("cover-screen"),
  coverEnter: document.getElementById("cover-enter"),
  coverToc: document.getElementById("cover-toc"),
  coverHome: document.getElementById("cover-home"),
  coverLink: document.getElementById("cover-link"),
  coverChanges: document.getElementById("cover-changes"),
  sidebarChanges: document.getElementById("sidebar-changes"),
  changesModal: document.getElementById("changes-modal"),
  changesPeriod: document.getElementById("changes-period"),
  changesSummary: document.getElementById("changes-summary"),
  changesList: document.getElementById("changes-list"),
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

async function indexPageText(page) {
  const src = page.sourcePage || page;
  try {
    const res = await fetch(encodeURI(src.md), { cache: "no-store" });
    if (!res.ok) {
      page.searchText = "";
      return;
    }
    const text = await res.text();
    page.searchText = `${page.id} ${page.title} ${page.section} ${text}`.toLowerCase();
  } catch {
    page.searchText = `${page.id} ${page.title} ${page.section}`.toLowerCase();
  }
}

function pageMatchesQuery(page, query) {
  if (!query) return true;
  const hay = page.searchText
    || `${page.id} ${page.title} ${page.section}`.toLowerCase();
  return hay.includes(query);
}

function applyTocFilter() {
  const query = (els.tocSearch?.value || "").trim().toLowerCase();
  let visibleCount = 0;

  els.toc.querySelectorAll(".toc-item").forEach((btn) => {
    const index = Number(btn.dataset.index);
    const page = state.pages[index];
    const match = page && pageMatchesQuery(page, query);
    btn.classList.toggle("toc-filter-hide", !match);
    if (match) visibleCount += 1;
  });

  els.toc.querySelectorAll(".toc-subgroup").forEach((sub) => {
    const hasVisible = [...sub.querySelectorAll(".toc-item")].some(
      (btn) => !btn.classList.contains("toc-filter-hide"),
    );
    sub.classList.toggle("toc-filter-hide", !hasVisible);
    if (query && hasVisible) sub.classList.remove("collapsed");
  });

  els.toc.querySelectorAll(".toc-group").forEach((group) => {
    const hasVisible = [...group.querySelectorAll(".toc-item")].some(
      (btn) => !btn.classList.contains("toc-filter-hide"),
    );
    group.classList.toggle("toc-filter-hide", !hasVisible);
    if (query && hasVisible) {
      group.classList.remove("collapsed");
      group.querySelectorAll(".toc-section, .toc-subsection").forEach((header) => {
        header.setAttribute("aria-expanded", "true");
      });
    }
  });

  if (els.tocSearchEmpty) {
    els.tocSearchEmpty.hidden = !query || visibleCount > 0;
  }
}

function entryFileForLang(lang) {
  return lang === "en" ? "en.html" : "index.html";
}

function isEnEntryPath() {
  return /(?:^|\/)en\.html$/i.test(location.pathname);
}

/** Build URL on the RU/EN entry HTML so link previews get the right <title>. */
function bookUrl(lang = state.lang, query = {}) {
  const url = new URL(location.href);
  const parts = url.pathname.split("/");
  const last = parts[parts.length - 1] || "";
  if (/\.html?$/i.test(last)) {
    parts[parts.length - 1] = entryFileForLang(lang);
  } else {
    // Directory URL: /gala/ → /gala/en.html or /gala/index.html
    parts[parts.length - 1] = entryFileForLang(lang);
  }
  url.pathname = parts.join("/") || "/";
  url.search = "";
  url.hash = "";
  for (const [key, value] of Object.entries(query)) {
    if (value != null && value !== "") url.searchParams.set(key, String(value));
  }
  // lang is encoded in the entry file; drop redundant ?lang=
  url.searchParams.delete("lang");
  return url;
}

function pageUrl(page) {
  return bookUrl(state.lang, { p: page.id }).toString();
}

function syncUrl(page) {
  // Keep bare cover URL while the cover is up, so refresh shows the cover again.
  if (document.body.classList.contains("cover-open")) return;
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
  btn.title = t("linkCopied");
  setTimeout(() => {
    btn.textContent = prev;
    btn.classList.remove("copied");
    btn.title = t("copyPage");
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
    <span class="audio-dot" title="${state.audioAvailable.has(page.id) ? t("hasAudio") : t("noAudioDot")}"></span>
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

  applyTocFilter();
}

function openToc() {
  document.body.classList.add("toc-open");
  els.sidebar.classList.add("is-open");
  els.tocBackdrop.hidden = false;
  els.tocBackdrop.setAttribute("aria-hidden", "false");
  els.sidebar.setAttribute("aria-hidden", "false");
  queueMicrotask(() => els.tocSearch?.focus());
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

function clearPageFindHighlights() {
  if (state.pageFind.rawHtml) {
    els.content.innerHTML = state.pageFind.rawHtml;
  }
  const page = state.pages[state.index];
  if (page) els.pageTitle.textContent = page.title;
  state.pageFind.hits = [];
  state.pageFind.current = -1;
  if (els.pageFindCount) els.pageFindCount.textContent = "";
}

function highlightTextInRoot(root, query) {
  const q = query.trim();
  if (!q || !root) return [];
  const marks = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const lowerQ = q.toLowerCase();

  for (const node of nodes) {
    const text = node.nodeValue;
    if (!text || !text.trim()) continue;
    const lower = text.toLowerCase();
    let pos = 0;
    let idx = lower.indexOf(lowerQ, pos);
    if (idx === -1) continue;

    const frag = document.createDocumentFragment();
    while (idx !== -1) {
      if (idx > pos) {
        frag.appendChild(document.createTextNode(text.slice(pos, idx)));
      }
      const mark = document.createElement("mark");
      mark.className = "page-find-hit";
      mark.textContent = text.slice(idx, idx + q.length);
      frag.appendChild(mark);
      marks.push(mark);
      pos = idx + q.length;
      idx = lower.indexOf(lowerQ, pos);
    }
    if (pos < text.length) {
      frag.appendChild(document.createTextNode(text.slice(pos)));
    }
    node.parentNode.replaceChild(frag, node);
  }
  return marks;
}

function updatePageFindCurrent() {
  state.pageFind.hits.forEach((mark, i) => {
    mark.classList.toggle("current", i === state.pageFind.current);
  });
  const total = state.pageFind.hits.length;
  if (!els.pageFindCount) return;
  if (!state.pageFind.query.trim()) {
    els.pageFindCount.textContent = "";
  } else if (total === 0) {
    els.pageFindCount.textContent = "0";
  } else {
    els.pageFindCount.textContent = `${state.pageFind.current + 1}/${total}`;
  }
  const current = state.pageFind.hits[state.pageFind.current];
  if (current) {
    current.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

function runPageFind(query) {
  clearPageFindHighlights();
  state.pageFind.query = query;
  const q = query.trim();
  if (!q) {
    updatePageFindCurrent();
    return;
  }

  const titleHits = highlightTextInRoot(els.pageTitle, q);
  const contentHits = highlightTextInRoot(els.content, q);
  state.pageFind.hits = [...titleHits, ...contentHits];
  state.pageFind.current = state.pageFind.hits.length ? 0 : -1;
  updatePageFindCurrent();
}

function stepPageFind(delta) {
  const total = state.pageFind.hits.length;
  if (!total) return;
  state.pageFind.current = (state.pageFind.current + delta + total) % total;
  updatePageFindCurrent();
}

function openPageFind() {
  state.pageFind.open = true;
  els.pageFindBar.hidden = false;
  els.pageFindOpen.classList.add("active");
  queueMicrotask(() => {
    els.pageFindInput.focus();
    els.pageFindInput.select();
  });
  if (els.pageFindInput.value.trim()) {
    runPageFind(els.pageFindInput.value);
  }
}

function closePageFind() {
  state.pageFind.open = false;
  els.pageFindBar.hidden = true;
  els.pageFindOpen.classList.remove("active");
  clearPageFindHighlights();
  state.pageFind.query = "";
  if (els.pageFindInput) els.pageFindInput.value = "";
  if (els.pageFindCount) els.pageFindCount.textContent = "";
}

function resetPageFindForLoad(html) {
  state.pageFind.rawHtml = html;
  state.pageFind.hits = [];
  state.pageFind.current = -1;
  state.pageFind.query = "";
  if (els.pageFindInput) els.pageFindInput.value = "";
  if (els.pageFindCount) els.pageFindCount.textContent = "";
  if (state.pageFind.open) {
    // keep bar open but clear matches until user types again
  }
}

function voteStorageKey(pageId) {
  return `discourse-vote:${pageId}`;
}

const READER_NAME_KEY = "discourse-reader-name";

function getReaderName() {
  try {
    return String(localStorage.getItem(READER_NAME_KEY) || "").trim();
  } catch {
    return "";
  }
}

function setReaderName(name) {
  const clean = String(name || "").trim().slice(0, 80);
  try {
    if (clean) localStorage.setItem(READER_NAME_KEY, clean);
    else localStorage.removeItem(READER_NAME_KEY);
  } catch {
    // ignore
  }
  if (els.readerName && els.readerName.value.trim() !== clean) {
    els.readerName.value = clean;
  }
  const formName = els.feedbackForm?.elements?.name;
  if (formName && formName.value.trim() !== clean) {
    formName.value = clean;
  }
  return clean;
}

function syncReaderNameFromUi(source) {
  const raw =
    source === "form"
      ? els.feedbackForm?.elements?.name?.value
      : els.readerName?.value;
  return setReaderName(raw);
}

function requireReaderName() {
  const name = syncReaderNameFromUi("page") || getReaderName();
  if (name) return name;
  els.voteStatus.hidden = false;
  els.voteStatus.textContent = t("needName");
  els.readerName?.focus();
  return "";
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
    els.voteStatus.textContent = t("thanksLike");
    els.voteStatus.hidden = false;
  } else if (vote === "dislike") {
    els.voteStatus.textContent = t("thanksDislike");
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
            from_name: t("bookTitle"),
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

  const readerName = requireReaderName();
  if (!readerName) return;

  els.voteLike.disabled = true;
  els.voteDislike.disabled = true;
  els.voteStatus.hidden = false;
  els.voteStatus.textContent = t("sending");

  const label = vote === "like" ? t("likeLabel") : t("dislikeLabel");
  const subject = `${t("mailSubjectVote")}: ${label} — ${readerName} — ${page.id} ${page.title}`;
  const fields = {
    name: readerName,
    vote,
    page: currentPageLabel(),
    page_id: page.id,
    section: page.section,
    lang: state.lang,
  };

  try {
    const result = await sendToAuthor({ subject, fields });
    setStoredVote(page.id, vote);
    updateVoteUi();
    if (result.via === "mailto") {
      els.voteStatus.textContent = t("openMail");
      els.voteStatus.hidden = false;
    }
  } catch {
    els.voteLike.disabled = false;
    els.voteDislike.disabled = false;
    els.voteStatus.textContent = t("sendFail");
  }
}

function currentPageLabel() {
  const page = state.pages[state.index];
  return `${page.id} — ${page.title} (${page.section})`;
}

function openFeedbackModal() {
  els.feedbackContext.textContent = `${t("pageLabel")}: ${currentPageLabel()}`;
  els.feedbackStatus.hidden = true;
  els.feedbackStatus.className = "feedback-status";
  const saved = getReaderName();
  if (els.feedbackForm?.name) {
    els.feedbackForm.name.value = saved;
  }
  els.feedbackModal.hidden = false;
  if (saved) els.feedbackForm.message.focus();
  else els.feedbackForm.name.focus();
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

  const readerName = setReaderName(data.get("name"));
  if (!readerName) {
    els.feedbackStatus.hidden = false;
    els.feedbackStatus.className = "feedback-status error";
    els.feedbackStatus.textContent = t("enterName");
    form.name.focus();
    return;
  }

  submitBtn.disabled = true;
  els.feedbackStatus.hidden = true;

  const subject = `${t("mailSubjectFeedback")}: ${readerName} — ${page.id} ${page.title}`;
  const fields = {
    page: currentPageLabel(),
    name: readerName,
    reply_email: data.get("reply_email") || "—",
    message: data.get("message"),
    lang: state.lang,
  };

  try {
    const result = await sendToAuthor({ subject, fields });
    if (result.via === "mailto") {
      els.feedbackStatus.textContent = t("mailHint");
      els.feedbackStatus.className = "feedback-status success";
      els.feedbackStatus.hidden = false;
    } else {
      els.feedbackStatus.textContent = t("thanksSent");
      els.feedbackStatus.className = "feedback-status success";
      els.feedbackStatus.hidden = false;
      form.message.value = "";
      setTimeout(closeFeedbackModal, 1800);
    }
  } catch {
    openMailto(subject, fields);
    els.feedbackStatus.textContent = t("mailHint");
    els.feedbackStatus.className = "feedback-status success";
    els.feedbackStatus.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
}

function updatePlayerUi() {
  const page = state.pages[state.index];
  const hasAudio = state.lang !== "en" && state.audioAvailable.has(page.id);

  els.playerInfo.textContent = `${page.id}`;
  // EN: no audio UI at all (no "missing recording", slider, Listen, auto-advance)
  els.noAudio.hidden = state.lang === "en" || hasAudio;
  els.progressWrap.hidden = !hasAudio;
  els.playBtn.hidden = !hasAudio;
  els.playerControls.hidden = false;
  if (els.autoAdvance?.closest("label")) {
    els.autoAdvance.closest("label").hidden = !hasAudio;
  }
  els.playBtn.textContent = audio.paused ? t("listen") : t("pause");
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
      const html = `<p class="load-error">${t("bookTitle")}: <code>${escapeHtml(page.id)}←${escapeHtml(page.include)}</code>: ${t("includeMissing")}</p>`;
      els.content.innerHTML = html;
      resetPageFindForLoad(html);
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
    const html = renderMarkdown(text);
    els.content.innerHTML = html;
    resetPageFindForLoad(html);
  } catch (err) {
    const html = `<p class="load-error">${t("loadError")} <code>${escapeHtml(mdPath)}</code>. ${t("refreshHint")}</p>`;
    els.content.innerHTML = html;
    resetPageFindForLoad(html);
    console.error("loadPage failed", mdPath, err);
  }

  audio.pause();
  audio.currentTime = 0;

  if (state.lang !== "en" && state.audioAvailable.has(page.id)) {
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
els.feedbackForm.addEventListener("submit", submitFeedback);
els.voteLike.addEventListener("click", () => submitVote("like"));
els.voteDislike.addEventListener("click", () => submitVote("dislike"));
els.readerName?.addEventListener("change", () => syncReaderNameFromUi("page"));
els.readerName?.addEventListener("blur", () => syncReaderNameFromUi("page"));
const feedbackNameInput = els.feedbackForm?.elements?.name;
feedbackNameInput?.addEventListener?.("change", () => syncReaderNameFromUi("form"));
feedbackNameInput?.addEventListener?.("blur", () => syncReaderNameFromUi("form"));
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

els.tocSearch?.addEventListener("input", () => {
  applyTocFilter();
});

els.pageFindOpen?.addEventListener("click", () => {
  if (state.pageFind.open) closePageFind();
  else openPageFind();
});
els.pageFindClose?.addEventListener("click", closePageFind);
els.pageFindPrev?.addEventListener("click", () => stepPageFind(-1));
els.pageFindNext?.addEventListener("click", () => stepPageFind(1));
els.pageFindInput?.addEventListener("input", () => {
  runPageFind(els.pageFindInput.value);
});
els.pageFindInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    stepPageFind(e.shiftKey ? -1 : 1);
  } else if (e.key === "Escape") {
    e.preventDefault();
    closePageFind();
  }
});

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
    e.preventDefault();
    openPageFind();
    return;
  }
  if (e.key === "Escape" && state.pageFind.open) {
    closePageFind();
    return;
  }
  if (e.key === "Escape" && els.changesModal && !els.changesModal.hidden) {
    closeChangesModal();
    return;
  }
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
  if (e.code === "Space" && state.lang !== "en") {
    e.preventDefault();
    togglePlay();
  }
});

async function loadCatalog() {
  const manifest = await fetch(`${manifestFile()}?v=${Date.now()}`, {
    cache: "no-store",
  }).then((r) => r.json());
  state.pages = resolvePages(manifest.pages);
  state.audioAvailable = new Set();
  if (state.lang !== "en") {
    await Promise.all(state.pages.map((page) => checkAudio(page)));
  }
  await Promise.all(state.pages.map((page) => indexPageText(page)));
  updateStats();
}

function detectLang() {
  if (isEnEntryPath()) return "en";
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "en" || fromUrl === "ru") return fromUrl;
  try {
    const saved = localStorage.getItem("discourse-lang");
    if (saved === "en" || saved === "ru") return saved;
  } catch {
    /* ignore */
  }
  return "ru";
}

function applyUiLang() {
  document.documentElement.lang = state.lang;
  document.body.classList.toggle("lang-en", state.lang === "en");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.setAttribute("placeholder", t(key));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key) el.setAttribute("title", t(key));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
  if (els.playBtn) {
    els.playBtn.textContent = audio.paused ? t("listen") : t("pause");
  }
  if (!document.body.classList.contains("cover-open") && state.pages[state.index]) {
    document.title = `${state.pages[state.index].id} — ${state.pages[state.index].title}`;
  } else {
    document.title = t("bookTitle");
  }
}

async function setLang(lang, { keepPage = true } = {}) {
  if (lang !== "ru" && lang !== "en") return;
  const pageId = keepPage ? state.pages[state.index]?.id : null;
  const wasCover = document.body.classList.contains("cover-open");
  state.lang = lang;
  try {
    localStorage.setItem("discourse-lang", lang);
  } catch {
    /* ignore */
  }
  // Switch entry file so shared links preview the correct title.
  const next = wasCover || !pageId
    ? bookUrl(lang)
    : bookUrl(lang, { p: pageId });
  history.replaceState(wasCover || !pageId ? { cover: true } : { pageId }, "", next.toString());

  applyUiLang();
  await loadCatalog();
  applyUiLang();

  if (wasCover || !pageId) {
    showCoverScreen();
    if (state.pages.length) await loadPage(0, false);
    return;
  }

  const idx = state.pages.findIndex((p) => p.id === pageId);
  if (idx >= 0) {
    enterFromCover();
    await loadPage(idx, false);
  } else {
    showCoverScreen();
    if (state.pages.length) await loadPage(0, false);
  }
}

async function init() {
  rememberVisit();
  setReaderName(getReaderName());
  state.lang = detectLang();
  // Migrate ?lang=en on index.html → en.html (correct link preview title)
  const pathLast = location.pathname.split("/").pop() || "";
  const onWrongEntry =
    (state.lang === "en" && !isEnEntryPath()) ||
    (state.lang === "ru" && /^en\.html$/i.test(pathLast));
  if (onWrongEntry) {
    const params = new URLSearchParams(location.search);
    const p = params.get("p");
    const next = p ? bookUrl(state.lang, { p }) : bookUrl(state.lang);
    history.replaceState(p ? { pageId: p } : { cover: true }, "", next.toString());
  }
  applyUiLang();

  await Promise.all([loadCatalog(), loadChangesIndex()]);
  applyUiLang();

  const params = new URLSearchParams(location.search);
  const startId = params.get("p");
  const startIndex = startId
    ? Math.max(0, state.pages.findIndex((p) => p.id === startId))
    : 0;
  const showCover = !startId;

  if (showCover) showCoverScreen();

  if (state.pages.length) {
    await loadPage(startIndex === -1 ? 0 : startIndex, false);
  } else if (state.lang === "en") {
    // Empty EN catalog: stay on cover
    showCoverScreen();
  }
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLang(btn.dataset.lang);
  });
});

init();

function showCoverScreen() {
  document.body.classList.add("cover-open");
  if (els.coverScreen) {
    els.coverScreen.classList.remove("cover-hidden");
    els.coverScreen.setAttribute("aria-hidden", "false");
  }
  closeToc();
  audio.pause();
  // Keep language entry file; drop page id so refresh shows the cover.
  const cover = bookUrl(state.lang);
  history.replaceState({ cover: true }, "", cover.toString());
  document.title = t("bookTitle");
  applyUiLang();
}

function enterFromCover({ openTocAfter = false } = {}) {
  document.body.classList.remove("cover-open");
  if (els.coverScreen) {
    els.coverScreen.classList.add("cover-hidden");
    els.coverScreen.setAttribute("aria-hidden", "true");
  }
  const page = state.pages[state.index];
  if (page) {
    syncUrl(page);
    document.title = `${page.id} — ${page.title}`;
  }
  if (openTocAfter) {
    openToc();
    queueMicrotask(() => els.tocSearch?.focus());
  }
}

function coverUrl() {
  return bookUrl(state.lang).toString();
}

async function copyCoverLink() {
  const link = coverUrl();
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
  const btn = els.coverLink;
  if (!btn) return;
  const prev = btn.textContent;
  btn.textContent = "✓";
  btn.classList.add("copied");
  btn.title = t("linkCopied");
  setTimeout(() => {
    btn.textContent = prev;
    btn.classList.remove("copied");
    btn.title = t("copyCover");
  }, 1400);
}

els.coverEnter?.addEventListener("click", () => enterFromCover());
els.coverToc?.addEventListener("click", () => enterFromCover({ openTocAfter: true }));
els.coverLink?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  copyCoverLink();
});
els.coverHome?.addEventListener("click", (e) => {
  e.preventDefault();
  showCoverScreen();
});
els.coverChanges?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openChangesModal();
});
els.sidebarChanges?.addEventListener("click", (e) => {
  e.preventDefault();
  openChangesModal();
});
els.changesPeriod?.addEventListener("change", () => {
  renderChangesList();
});
els.changesModal?.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-changes]")) closeChangesModal();
});

const VISIT_KEY = "discourse-last-visit";
const PREV_VISIT_KEY = "discourse-prev-visit";
const VISIT_SESSION_KEY = "discourse-visit-touched";

function rememberVisit() {
  try {
    const last = Number(localStorage.getItem(VISIT_KEY) || 0);
    if (!sessionStorage.getItem(VISIT_SESSION_KEY)) {
      if (last) localStorage.setItem(PREV_VISIT_KEY, String(last));
      localStorage.setItem(VISIT_KEY, String(Date.now()));
      sessionStorage.setItem(VISIT_SESSION_KEY, "1");
    }
    const prev = Number(localStorage.getItem(PREV_VISIT_KEY) || 0);
    state.prevVisitAt = prev || null;
  } catch {
    state.prevVisitAt = null;
  }
}

async function loadChangesIndex() {
  try {
    const data = await fetch(`changes.json?v=${Date.now()}`, {
      cache: "no-store",
    }).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    state.changes = Array.isArray(data.entries) ? data.entries : [];
  } catch (err) {
    console.warn("changes.json unavailable", err);
    state.changes = [];
  }
}

function changesCutoff() {
  const mode = els.changesPeriod?.value || "7";
  if (mode === "since") {
    if (state.prevVisitAt) return state.prevVisitAt;
    // First visit ever — fall back to a week
    return Date.now() - 7 * 24 * 60 * 60 * 1000;
  }
  const days = Number(mode) || 7;
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function formatChangesDate(isoDay) {
  const [y, m, d] = String(isoDay).split("-").map(Number);
  if (!y || !m || !d) return isoDay;
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

function kindLabel(kind) {
  if (kind === "added") return t("kindNew");
  if (kind === "changed") return t("kindChanged");
  return kind || "";
}

function filteredChanges() {
  const cutoff = changesCutoff();
  const visibleIds = new Set(state.pages.map((p) => p.id));
  return state.changes.filter((entry) => {
    if (!visibleIds.has(entry.id)) return false;
    const t = Date.parse(`${entry.date}T23:59:59`);
    return Number.isFinite(t) && t >= cutoff;
  });
}

function renderChangesList() {
  if (!els.changesList) return;
  const items = filteredChanges();
  const mode = els.changesPeriod?.value || "7";
  if (els.changesSummary) {
    if (mode === "since" && !state.prevVisitAt) {
      els.changesSummary.textContent = t("firstVisitWeek");
    } else {
      els.changesSummary.textContent = items.length
        ? `${items.length} ${t("pagesShort")}`
        : t("noChanges");
    }
  }

  if (!items.length) {
    els.changesList.innerHTML = `<p class="changes-empty">${t("changesEmpty")}</p>`;
    return;
  }

  els.changesList.innerHTML = "";
  items.forEach((entry) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "changes-item";
    btn.innerHTML = `
      <span class="changes-item-meta">
        <span>${escapeHtml(formatChangesDate(entry.date))}</span>
        <span class="changes-kind">${escapeHtml(kindLabel(entry.kind))}</span>
      </span>
      <span class="changes-item-id">${escapeHtml(entry.id)}</span>
      <span class="changes-item-title">${escapeHtml(entry.title)}</span>
    `;
    btn.addEventListener("click", () => openChangedPage(entry.id));
    els.changesList.appendChild(btn);
  });
}

function openChangesModal() {
  if (!els.changesModal) return;
  if (els.changesPeriod) {
    els.changesPeriod.value = state.prevVisitAt ? "since" : "7";
  }
  renderChangesList();
  els.changesModal.hidden = false;
}

function closeChangesModal() {
  if (els.changesModal) els.changesModal.hidden = true;
}

async function openChangedPage(pageId) {
  closeChangesModal();
  if (document.body.classList.contains("cover-open")) {
    enterFromCover();
  }
  const index = state.pages.findIndex((p) => p.id === pageId);
  if (index >= 0) await loadPage(index, false);
}
