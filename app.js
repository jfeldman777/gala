const FEEDBACK_EMAIL = "jfeldman777@gmail.com";
/** Optional extra silent channel: free key from https://web3forms.com */
const WEB3FORMS_KEY = "";

const state = {
  lang: "ru",
  pages: [],
  allPages: [],
  routes: [],
  routeId: null,
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
    bookTitle: "Дискурс Фельдмана",
    coverLine1: "Дискурс",
    coverLine2: "Фельдмана",
    coverAuthor: "Фельдмана",
    aboutAuthor: "Об авторе",
    bookmark: "Закладка",
    bookmarkGo: "К закладке",
    bookmarkEmpty: "Пока нет закладки — откройте любую страницу",
    coverHint: "обложка",
    coverEnter: "Открыть книгу",
    toCover: "К обложке",
    toc: "Оглавление",
    copyCover: "Скопировать ссылку на обложку",
    copyPage: "Скопировать ссылку на страницу",
    copyLink: "Скопировать ссылку",
    copyText: "Читалка",
    textCopied: "Текст скопирован — откройте читалку",
    textShared: "Откройте текст в приложении для чтения",
    textCopyEmpty: "Нечего копировать",
    textSpeaking: "Читаю…",
    textSpeakStop: "Остановлено",
    readAppTitle: "Читалка",
    readAppIntro: "Один раз выберите читалку. Где нет моей записи, «Слушать» откроет её. Долгое нажатие на □□ — снова настройки.",
    readAppSpeaktor: "Speaktor (рекомендую) — отправит текст в приложение",
    readAppShare: "Другое приложение — меню «Поделиться»",
    readAppSpeak: "Голос браузера (обычно хуже)",
    readAppClipboard: "Только скопировать текст страницы",
    readAppVoice: "Голос браузера",
    readAppSave: "Сохранить",
    readAppChange: "Настроить читалку",
    readAppInstall: "Сначала установите Speaktor",
    readAppHow1: "В книге нажмите «Слушать» (если нет моей записи).",
    readAppHow2: "Откроется Speaktor — текст уже отправлен (и лежит в буфере).",
    readAppHow3: "Если поле пустое: Write / Написать → долгий тап → Вставить.",
    readAppHow4: "Нажмите ▶ Play. Голос и скорость — в Speaktor.",
    speaktorHelpTitle: "Как слушать в Speaktor",
    speaktorHelpOk: "Понятно",
    speaktorOpened: "Открыл Speaktor с текстом",
    speaktorPasteText: "Текст скопирован — в Speaktor: вставка / Write",
    qrCover: "QR-код обложки",
    qrTitle: "QR-коды обложки",
    qrIntro: "Наведите камеру телефона — откроется русская или английская обложка книги.",
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
    listenMyVoice: "▶ Моим голосом",
    listenReader: "▶ Читалка",
    pause: "⏸ Пауза",
    autoAdvance: "Автопереход",
    autoShort: "Авто",
    noAudio: "Нет моей записи — сработает читалка",
    replyEmail: "Email для ответа",
    optional: "(необязательно)",
    message: "Сообщение",
    messagePlaceholder: "Замечание, вопрос, опечатка…",
    cancel: "Отмена",
    send: "Отправить",
    changesIntro: "Свойства системы и страницы, которые появились или изменились.",
    changesFeatures: "Свойства",
    changesPages: "Страницы",
    featuresShort: "свойства",
    pagesShort: "стр.",
    noChanges: "нет изменений",
    changesEmpty: "За этот срок ничего не появлялось.",
    period: "Период",
    periodSince: "с прошлого визита",
    period3: "3 дня",
    period7: "7 дней",
    period14: "14 дней",
    period30: "30 дней",
    period90: "90 дней",
    needName: "Сначала укажите имя",
    routeAll: "Вся книга",
    routeActive: "маршрут",
    routeSelect: "Маршрут",
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
    kindFeature: "система",
    firstVisitWeek: "первый визит — показана неделя",
    downloadBook: "Скачать книгу одним файлом",
    downloadBookShort: "Скачать",
    downloadBookProgress: "Скачиваю…",
    downloadBookDone: "Готово",
    downloadBookFail: "Не удалось скачать",
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
    coverLine1: "Discourse",
    coverLine2: "Feldman's",
    coverAuthor: "Feldman's",
    aboutAuthor: "About the author",
    bookmark: "Bookmark",
    bookmarkGo: "Go to bookmark",
    bookmarkEmpty: "No bookmark yet — open any page",
    coverHint: "cover",
    coverEnter: "Open the book",
    toCover: "To cover",
    toc: "Contents",
    copyCover: "Copy cover link",
    copyPage: "Copy page link",
    copyLink: "Copy link",
    copyText: "Reader",
    textCopied: "Text copied — open your reading app",
    textShared: "Open the text in a reading app",
    textCopyEmpty: "Nothing to copy",
    textSpeaking: "Reading…",
    textSpeakStop: "Stopped",
    readAppTitle: "Reading app",
    readAppIntro: "Pick a reader once. Where my recording is missing, Listen opens it. Long-press □□ to change.",
    readAppSpeaktor: "Speaktor (recommended) — sends page text to the app",
    readAppShare: "Another app — system Share sheet",
    readAppSpeak: "Browser voice (usually worse)",
    readAppClipboard: "Just copy the page text",
    readAppVoice: "Browser voice",
    readAppSave: "Save",
    readAppChange: "Configure reader",
    readAppInstall: "Install Speaktor first",
    readAppHow1: "In the book tap Listen (when my recording is missing).",
    readAppHow2: "Speaktor opens — the text is sent (and also on the clipboard).",
    readAppHow3: "If the field is empty: Write → long-press → Paste.",
    readAppHow4: "Tap ▶ Play. Voice and speed are in Speaktor.",
    speaktorHelpTitle: "How to listen in Speaktor",
    speaktorHelpOk: "Got it",
    speaktorOpened: "Opened Speaktor with text",
    speaktorPasteText: "Text copied — in Speaktor use Paste / Write",
    qrCover: "Cover QR code",
    qrTitle: "Cover QR codes",
    qrIntro: "Point your phone camera to open the Russian or English cover of the book.",
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
    listenMyVoice: "▶ My voice",
    listenReader: "▶ Reader",
    pause: "⏸ Pause",
    autoAdvance: "Auto-advance",
    autoShort: "Auto",
    noAudio: "No recording — reader will be used",
    replyEmail: "Email for a reply",
    optional: "(optional)",
    message: "Message",
    messagePlaceholder: "Note, question, typo…",
    cancel: "Cancel",
    send: "Send",
    changesIntro: "System features and pages that appeared or changed.",
    changesFeatures: "Features",
    changesPages: "Pages",
    featuresShort: "features",
    pagesShort: "pp.",
    noChanges: "no changes",
    changesEmpty: "Nothing appeared in this period.",
    period: "Period",
    periodSince: "since last visit",
    period3: "3 days",
    period7: "7 days",
    period14: "14 days",
    period30: "30 days",
    period90: "90 days",
    needName: "Please enter your name first",
    routeAll: "Whole book",
    routeActive: "route",
    routeSelect: "Route",
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
    kindFeature: "system",
    firstVisitWeek: "first visit — showing one week",
    downloadBook: "Download the book as one file",
    downloadBookShort: "Download",
    downloadBookProgress: "Downloading…",
    downloadBookDone: "Done",
    downloadBookFail: "Download failed",
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
  copyText: document.getElementById("copy-text"),
  readAppModal: document.getElementById("read-app-modal"),
  readAppForm: document.getElementById("read-app-form"),
  readAppVoice: document.getElementById("read-app-voice"),
  readAppModeSpeak: document.getElementById("read-app-mode-speak"),
  readAppModeClipboard: document.getElementById("read-app-mode-clipboard"),
  readAppModeSpeaktor: document.getElementById("read-app-mode-speaktor"),
  readAppModeShare: document.getElementById("read-app-mode-share"),
  speaktorHelp: document.getElementById("speaktor-help"),
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
  coverQr: document.getElementById("cover-qr"),
  coverChanges: document.getElementById("cover-changes"),
  coverBookmark: document.getElementById("cover-bookmark"),
  coverDownload: document.getElementById("cover-download"),
  sidebarDownload: document.getElementById("sidebar-download"),
  coverRoutes: document.getElementById("cover-routes"),
  coverRouteSelect: document.getElementById("cover-route-select"),
  sidebarRoutes: document.getElementById("sidebar-routes"),
  sidebarRouteSelect: document.getElementById("sidebar-route-select"),
  routeBadge: document.getElementById("route-badge"),
  sidebarChanges: document.getElementById("sidebar-changes"),
  changesModal: document.getElementById("changes-modal"),
  changesPeriod: document.getElementById("changes-period"),
  changesSummary: document.getElementById("changes-summary"),
  changesList: document.getElementById("changes-list"),
  qrModal: document.getElementById("qr-modal"),
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

/** Leading chapter number from page.section, e.g. "10. Система" → "10". */
function pageSectionNum(page) {
  const m = String(page.section || "").match(/^(\d+)/);
  return m ? m[1] : null;
}

/** Directory segments of page.md (everything except the filename). */
function pageDirSegments(page) {
  const md = String(page.md || "").replace(/\\/g, "/");
  const parts = md.split("/").filter(Boolean);
  return parts.slice(0, -1);
}

/** True if token names a real folder on disk, e.g. "3" → "3. Сэндвичи", "10.1" → "10.1. Кодировки". */
function isFolderToken(folderId) {
  const id = String(folderId);
  return state.allPages.some((page) =>
    pageDirSegments(page).some(
      (part) =>
        part === id || part.startsWith(`${id}.`) || part.startsWith(`${id} `)
    )
  );
}

function pagesInFolder(folderId) {
  const id = String(folderId);
  return state.allPages.filter((page) =>
    pageDirSegments(page).some(
      (part) =>
        part === id || part.startsWith(`${id}.`) || part.startsWith(`${id} `)
    )
  );
}

/**
 * Route list token:
 * - existing page id → one page
 * - folder number ("3", "10.1") → all pages in that folder (catalog order)
 * - not by id-prefix branches (1.3 does NOT pull 1.3.1)
 */
function parseRouteToken(token, byId) {
  const raw = String(token || "").trim();
  if (!raw) return null;

  const forced = raw.match(/^(.+)\.$/) || raw.match(/^(.+)\*$/);
  const folderId = forced ? forced[1] : raw;
  if (isFolderToken(folderId)) {
    return { type: "folder", id: folderId };
  }

  return { type: "page", id: forced ? forced[1] : raw };
}

function findRoute(routeId) {
  if (!routeId) return null;
  return state.routes.find((r) => r.id === routeId) || null;
}

function routeTitle(route) {
  if (!route) return t("routeAll");
  const title = route.title;
  if (title && typeof title === "object") {
    return title[state.lang] || title.ru || title.en || route.id;
  }
  return String(title || route.id);
}

/** Page belongs to route if listed directly or covered by an expanded folder/section. */
function pageMatchesRoute(page, route) {
  if (!route) return true;
  const byId = new Map(state.allPages.map((p) => [p.id, p]));
  const sn = pageSectionNum(page);

  for (const token of route.sections || []) {
    if (sn && String(token) === sn) return true;
  }
  for (const token of route.ids || []) {
    const parsed = parseRouteToken(token, byId);
    if (!parsed) continue;
    if (parsed.type === "folder") {
      if (
        pageDirSegments(page).some(
          (part) =>
            part === parsed.id ||
            part.startsWith(`${parsed.id}.`) ||
            part.startsWith(`${parsed.id} `)
        )
      ) {
        return true;
      }
      continue;
    }
    if (parsed.id === page.id) return true;
  }
  return false;
}

function pagesForRoute(route) {
  if (!route) return state.allPages.slice();
  const byId = new Map(state.allPages.map((p) => [p.id, p]));
  const ordered = [];
  const seen = new Set();

  function addPage(page) {
    if (!page || seen.has(page.id)) return;
    ordered.push(page);
    seen.add(page.id);
  }

  // Explicit tokens keep the author's order; folder numbers expand in place
  for (const token of route.ids || []) {
    const parsed = parseRouteToken(token, byId);
    if (!parsed) continue;
    if (parsed.type === "folder") {
      for (const page of pagesInFolder(parsed.id)) addPage(page);
      continue;
    }
    addPage(byId.get(parsed.id));
  }

  // Legacy route.sections: append remaining matching pages in catalog order
  for (const token of route.sections || []) {
    for (const page of state.allPages) {
      if (pageSectionNum(page) === String(token)) addPage(page);
    }
  }

  return ordered;
}

function applyRouteFilter() {
  const route = findRoute(state.routeId);
  if (!route) {
    state.routeId = null;
    state.pages = prependFrontPages(state.allPages.slice());
  } else {
    state.pages = prependFrontPages(pagesForRoute(route));
  }
  if (state.index >= state.pages.length) state.index = 0;
  updateStats();
  renderRoutePickers();
  updateRouteBadge();
}

function prependFrontPages(pages) {
  const rest = (pages || []).filter((p) => !p.isToc && !p.isCover);
  return [
    {
      id: "cover",
      title: "Обложка",
      section: "",
      md: "",
      isCover: true,
    },
    {
      id: "toc",
      title: "Оглавление",
      section: "",
      md: "",
      isToc: true,
    },
    ...rest,
  ];
}

function detectRouteId() {
  const fromUrl = new URLSearchParams(location.search).get("route");
  return findRoute(fromUrl) ? fromUrl : null;
}

async function loadRoutes() {
  try {
    const data = await fetch(`routes.json?v=${Date.now()}`, {
      cache: "no-store",
    }).then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    });
    state.routes = Array.isArray(data.routes) ? data.routes : [];
  } catch (err) {
    console.warn("routes.json unavailable", err);
    state.routes = [];
  }
}

function updateRouteBadge() {
  const badge = els.routeBadge;
  if (!badge) return;
  const route = findRoute(state.routeId);
  if (!route) {
    badge.hidden = true;
    badge.textContent = "";
    return;
  }
  badge.hidden = false;
  badge.textContent = `${t("routeActive")}: ${routeTitle(route)}`;
}

function fillRouteSelect(select) {
  if (!select) return;
  const current = state.routeId || "";
  select.innerHTML = "";
  const all = document.createElement("option");
  all.value = "";
  all.textContent = t("routeAll");
  select.appendChild(all);
  state.routes.forEach((route) => {
    const opt = document.createElement("option");
    opt.value = route.id;
    opt.textContent = routeTitle(route);
    select.appendChild(opt);
  });
  select.value = findRoute(current) ? current : "";
  select.setAttribute("aria-label", t("routeSelect"));
}

function renderRoutePickers() {
  const hasRoutes = state.routes.length > 0;
  if (els.coverRoutes) els.coverRoutes.hidden = !hasRoutes;
  if (els.sidebarRoutes) els.sidebarRoutes.hidden = !hasRoutes;
  fillRouteSelect(els.coverRouteSelect);
  fillRouteSelect(els.sidebarRouteSelect);
}

function setRoute(routeId) {
  const next = findRoute(routeId) ? routeId : null;
  if (next === state.routeId) return;
  const wasCover = document.body.classList.contains("cover-open");
  const pageId = wasCover ? null : state.pages[state.index]?.id;
  state.routeId = next;
  applyRouteFilter();
  buildToc();

  if (wasCover || !pageId) {
    if (state.pages.length) loadPage(0, false);
    else showCoverScreen();
    return;
  }

  const idx = state.pages.findIndex((p) => p.id === pageId);
  if (idx >= 0) {
    loadPage(idx, false);
  } else if (state.pages.length) {
    loadPage(0, false);
  } else {
    showCoverScreen();
  }
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

function isMarkdownTableRow(line) {
  const t = String(line || "").trim();
  return t.startsWith("|") && t.indexOf("|", 1) !== -1;
}

function isMarkdownTableSep(line) {
  const t = String(line || "").trim();
  if (!t.includes("-")) return false;
  // | --- | :---: | ---: |
  return /^\|?[\s|:-]+$/.test(t) && /-+/.test(t);
}

function splitMarkdownTableCells(line) {
  let t = String(line || "").trim();
  if (t.startsWith("|")) t = t.slice(1);
  if (t.endsWith("|")) t = t.slice(0, -1);
  return t.split("|").map((cell) => cell.trim());
}

function renderMarkdownTable(rows) {
  if (!rows.length) return "";
  let header = null;
  let bodyStart = 0;
  if (rows.length >= 2 && isMarkdownTableSep(rows[1])) {
    header = splitMarkdownTableCells(rows[0]);
    bodyStart = 2;
  }
  const body = rows.slice(bodyStart).filter((r) => !isMarkdownTableSep(r));
  const parts = ['<div class="md-table-wrap"><table class="md-table">'];
  if (header) {
    parts.push("<thead><tr>");
    header.forEach((cell) => {
      parts.push(`<th>${renderInline(cell)}</th>`);
    });
    parts.push("</tr></thead>");
  }
  parts.push("<tbody>");
  body.forEach((row) => {
    const cells = splitMarkdownTableCells(row);
    parts.push("<tr>");
    cells.forEach((cell) => {
      parts.push(`<td>${renderInline(cell)}</td>`);
    });
    parts.push("</tr>");
  });
  parts.push("</tbody></table></div>");
  return parts.join("");
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

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.replace(/\r$/, "").trimEnd();

    if (!line.trim()) {
      flushParagraph();
      // Blank lines inside a list must not restart numbering.
      continue;
    }

    // GFM pipe tables
    if (isMarkdownTableRow(line)) {
      flushParagraph();
      flushLists();
      const tableRows = [line];
      while (i + 1 < lines.length) {
        const next = lines[i + 1].replace(/\r$/, "").trimEnd();
        if (!next.trim()) break;
        if (!isMarkdownTableRow(next) && !isMarkdownTableSep(next)) break;
        tableRows.push(next);
        i += 1;
      }
      parts.push(renderMarkdownTable(tableRows));
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
      const itemNum = ordered ? Number(listMatch[2]) : NaN;
      const body = renderInline(listMatch[3].trim());
      // Keep author numbers (1=object … 8=many systems) even after a mid-list break.
      const liOpen =
        ordered && Number.isFinite(itemNum) ? `<li value="${itemNum}">` : "<li>";
      const listOpen = () => {
        if (ordered && Number.isFinite(itemNum) && itemNum > 1) {
          return `<ol start="${itemNum}">`;
        }
        return `<${tag}>`;
      };

      closeListsUntil(level + 1);

      if (listStack.length === level + 1) {
        parts.push("</li>");
        if (listStack[listStack.length - 1].tag !== tag) {
          parts.push(`</${listStack.pop().tag}>`);
          parts.push(`${listOpen()}`);
          listStack.push({ tag });
        }
        parts.push(`${liOpen}${body}`);
      } else {
        // Open missing intermediate levels if indent jumps
        while (listStack.length < level) {
          const fill = tag;
          parts.push(`<${fill}><li>`);
          listStack.push({ tag: fill });
        }
        parts.push(`${listOpen()}${liOpen}${body}`);
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
function bookDownloadFilename() {
  const route = findRoute(state.routeId);
  if (route) {
    const safe = String(route.id || "route").replace(/[^\w.-]+/g, "-");
    return state.lang === "en"
      ? `discourse-${safe}.md`
      : `diskurs-${safe}.md`;
  }
  return state.lang === "en" ? "feldman-discourse.md" : "diskurs-feldmana.md";
}

function setDownloadBusy(busy, label) {
  for (const btn of [els.coverDownload, els.sidebarDownload]) {
    if (!btn) continue;
    btn.disabled = busy;
    if (busy) {
      btn.classList.add("is-busy");
      if (label) {
        btn.title = label;
        btn.setAttribute("aria-label", label);
      }
    } else {
      btn.classList.remove("is-busy");
      btn.title = t("downloadBook");
      btn.setAttribute("aria-label", t("downloadBook"));
    }
  }
}

async function downloadBookAsFile() {
  const pages = state.pages.filter((p) => !p.isCover && !p.isToc);
  if (!pages.length) return;
  if (downloadBookAsFile.busy) return;
  downloadBookAsFile.busy = true;
  setDownloadBusy(true, `${t("downloadBookProgress")} 0/${pages.length}`);

  const chunks = [`# ${t("bookTitle")}\n`];
  try {
    for (let i = 0; i < pages.length; i += 1) {
      const page = pages[i];
      setDownloadBusy(
        true,
        `${t("downloadBookProgress")} ${i + 1}/${pages.length}`,
      );
      const src = page.sourcePage || page;
      let body = "";
      if (src?.md) {
        try {
          const res = await fetch(`${encodeURI(src.md)}?v=${Date.now()}`, {
            cache: "no-store",
          });
          if (res.ok) body = (await res.text()).trim();
        } catch {
          body = "";
        }
      }
      const heading = page.title
        ? `## ${page.id}. ${page.title}`
        : `## ${page.id}`;
      chunks.push(`\n\n---\n\n${heading}\n\n${body || ""}\n`);
    }

    const blob = new Blob([chunks.join("")], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = bookDownloadFilename();
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setDownloadBusy(true, t("downloadBookDone"));
    setTimeout(() => setDownloadBusy(false), 1200);
  } catch (err) {
    console.error("downloadBookAsFile", err);
    setDownloadBusy(true, t("downloadBookFail"));
    setTimeout(() => setDownloadBusy(false), 1600);
  } finally {
    downloadBookAsFile.busy = false;
  }
}

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
  const merged = { ...query };
  if (state.routeId && merged.route === undefined) {
    merged.route = state.routeId;
  }
  if (merged.route === null || merged.route === "") {
    delete merged.route;
  }
  for (const [key, value] of Object.entries(merged)) {
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
  flashCopyButton(els.copyLink, t("linkCopied"), t("copyPage"));
}

function pagePlainText() {
  const page = state.pages[state.index];
  if (!page || page.isCover) return "";
  const title = (els.pageTitle?.textContent || page.title || "").trim();
  const body = (els.content?.innerText || "").trim();
  if (!title && !body) return "";
  if (!title) return body;
  if (!body) return title;
  return `${title}\n\n${body}`;
}

const READ_APP_KEY = "discourse-read-app";

function getReadAppSettings() {
  try {
    const raw = localStorage.getItem(READ_APP_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (
      data?.mode === "speaktor" ||
      data?.mode === "share" ||
      data?.mode === "speak" ||
      data?.mode === "clipboard"
    ) {
      return data;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveReadAppSettings(data) {
  try {
    localStorage.setItem(READ_APP_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
  updateCopyTextButtonTitle();
}

function updateCopyTextButtonTitle() {
  const btn = els.copyText;
  if (!btn) return;
  const settings = getReadAppSettings();
  let title = t("readAppChange");
  if (settings?.mode === "speaktor") title = `${t("copyText")}: Speaktor`;
  else if (settings?.mode === "share") title = `${t("copyText")}: ${t("readAppShare")}`;
  else if (settings?.mode === "speak") title = `${t("copyText")}: ${t("readAppSpeak")}`;
  else if (settings?.mode === "clipboard") {
    title = `${t("copyText")}: ${t("readAppClipboard")}`;
  }
  btn.title = title;
  btn.setAttribute("aria-label", title);
}

function currentPageShareLink() {
  const page = state.pages[state.index];
  if (!page || page.isCover) return coverUrl();
  return pageUrl(page);
}

function speaktorPayload() {
  const link = currentPageShareLink();
  const page = state.pages[state.index];
  const title = (
    els.pageTitle?.textContent ||
    page?.title ||
    t("bookTitle")
  ).trim();
  const body = pagePlainText();
  // Speaktor reads pasted/shared text best; keep Intent URLs from exploding
  const maxLen = 3500;
  if (!body) return { title, text: link, link };
  if (body.length <= maxLen) return { title, text: body, link };
  return {
    title,
    text: `${body.slice(0, maxLen)}\n\n…\n${link}`,
    link,
  };
}

async function openInSpeaktor() {
  const { title, text } = speaktorPayload();
  const btn = els.copyText;
  const restore = btn?.title || t("copyText");
  const isAndroid = /Android/i.test(navigator.userAgent || "");

  // Always leave text in clipboard as a silent backup
  try {
    await copyTextToClipboard(text);
  } catch {
    /* ignore */
  }

  // Android: open Speaktor with page TEXT (not a URL — Speaktor often ignores shared links)
  // No Play Store fallback — that was sending people to «Install»
  if (isAndroid) {
    const intent =
      "intent:#Intent;" +
      "action=android.intent.action.SEND;" +
      "type=text/plain;" +
      `S.android.intent.extra.SUBJECT=${encodeURIComponent(title)};` +
      `S.android.intent.extra.TEXT=${encodeURIComponent(text)};` +
      "package=com.speaktor.app;" +
      "end";
    const a = document.createElement("a");
    a.href = intent;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    flashCopyButton(btn, t("speaktorOpened"), restore);
    openSpeaktorHelp();
    return;
  }

  // iOS / other: share sheet with text — choose Speaktor
  if (typeof navigator.share === "function") {
    try {
      const data = { title, text };
      if (typeof navigator.canShare !== "function" || navigator.canShare(data)) {
        await navigator.share(data);
        flashCopyButton(btn, t("speaktorOpened"), restore);
        openSpeaktorHelp();
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
  }

  // Desktop: Speaktor web; text already copied
  window.open("https://app.speaktor.com/", "_blank", "noopener,noreferrer");
  flashCopyButton(btn, t("speaktorPasteText"), restore);
  openSpeaktorHelp();
}

function openSpeaktorHelp() {
  if (!els.speaktorHelp) return;
  els.speaktorHelp.hidden = false;
}

function closeSpeaktorHelp() {
  if (els.speaktorHelp) els.speaktorHelp.hidden = true;
}

async function sharePageToReaderApp() {
  const { title, text } = speaktorPayload();
  const btn = els.copyText;
  const restore = btn?.title || t("copyText");
  if (typeof navigator.share === "function") {
    try {
      const data = { title, text };
      if (typeof navigator.canShare !== "function" || navigator.canShare(data)) {
        await navigator.share(data);
        flashCopyButton(btn, t("textShared"), restore);
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
    }
  }
  await copyTextToClipboard(text);
  flashCopyButton(btn, t("textCopied"), restore);
}

function stopBrowserSpeech() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

function fillReadAppVoices() {
  const select = els.readAppVoice;
  if (!select || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices() || [];
  const preferredLang = state.lang === "en" ? "en" : "ru";
  const sorted = [...voices].sort((a, b) => {
    const aHit = a.lang?.toLowerCase().startsWith(preferredLang) ? 0 : 1;
    const bHit = b.lang?.toLowerCase().startsWith(preferredLang) ? 0 : 1;
    if (aHit !== bHit) return aHit - bHit;
    return String(a.name).localeCompare(String(b.name));
  });
  const current = select.value || getReadAppSettings()?.voiceURI || "";
  select.innerHTML = "";
  if (!sorted.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "—";
    select.appendChild(opt);
    return;
  }
  sorted.forEach((voice) => {
    const opt = document.createElement("option");
    opt.value = voice.voiceURI;
    opt.textContent = `${voice.name} (${voice.lang})`;
    select.appendChild(opt);
  });
  if (current && [...select.options].some((o) => o.value === current)) {
    select.value = current;
  } else {
    const firstPref = sorted.find((v) =>
      v.lang?.toLowerCase().startsWith(preferredLang),
    );
    select.value = (firstPref || sorted[0]).voiceURI;
  }
}

function openReadAppModal() {
  if (!els.readAppModal) return;
  fillReadAppVoices();
  const settings = getReadAppSettings();
  const mode = settings?.mode || "speaktor";
  if (els.readAppModeSpeaktor) {
    els.readAppModeSpeaktor.checked = mode === "speaktor";
  }
  if (els.readAppModeShare) els.readAppModeShare.checked = mode === "share";
  if (els.readAppModeSpeak) els.readAppModeSpeak.checked = mode === "speak";
  if (els.readAppModeClipboard) {
    els.readAppModeClipboard.checked = mode === "clipboard";
  }
  if (settings?.voiceURI && els.readAppVoice) {
    const has = [...els.readAppVoice.options].some(
      (o) => o.value === settings.voiceURI,
    );
    if (has) els.readAppVoice.value = settings.voiceURI;
  }
  els.readAppModal.hidden = false;
}

function closeReadAppModal() {
  if (els.readAppModal) els.readAppModal.hidden = true;
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

function speakPageText(text, voiceURI) {
  if (!window.speechSynthesis) {
    copyTextToClipboard(text).then(() => {
      flashCopyButton(
        els.copyText,
        t("textCopied"),
        els.copyText?.title || t("copyText"),
      );
    });
    return;
  }
  stopBrowserSpeech();
  audio.pause();
  const utter = new SpeechSynthesisUtterance(text);
  const voices = window.speechSynthesis.getVoices() || [];
  const voice =
    voices.find((v) => v.voiceURI === voiceURI) ||
    voices.find((v) =>
      v.lang?.toLowerCase().startsWith(state.lang === "en" ? "en" : "ru"),
    ) ||
    voices[0];
  if (voice) utter.voice = voice;
  utter.lang = voice?.lang || (state.lang === "en" ? "en-US" : "ru-RU");
  utter.rate = 1;
  utter.onstart = () => updatePlayerUi();
  utter.onend = () => updatePlayerUi();
  utter.onerror = () => updatePlayerUi();
  window.speechSynthesis.speak(utter);
  updatePlayerUi();
  flashCopyButton(
    els.copyText,
    t("textSpeaking"),
    els.copyText?.title || t("copyText"),
  );
}

async function runReadAppAction() {
  const btn = els.copyText;
  if (!btn) return;

  const settings = getReadAppSettings();
  if (!settings) {
    openReadAppModal();
    return;
  }

  if (settings.mode === "speaktor") {
    await openInSpeaktor();
    return;
  }
  if (settings.mode === "share") {
    await sharePageToReaderApp();
    return;
  }

  const text = pagePlainText();
  if (!text) {
    flashCopyButton(btn, t("textCopyEmpty"), btn.title || t("copyText"));
    return;
  }

  if (settings.mode === "speak") {
    if (window.speechSynthesis?.speaking) {
      stopBrowserSpeech();
      updatePlayerUi();
      flashCopyButton(btn, t("textSpeakStop"), btn.title || t("copyText"));
      return;
    }
    speakPageText(text, settings.voiceURI);
    return;
  }

  await copyTextToClipboard(text);
  flashCopyButton(btn, t("textCopied"), btn.title || t("copyText"));
}

function flashCopyButton(btn, doneTitle, restoreTitle) {
  if (!btn) return;
  const label = btn.querySelector("svg") ? null : btn.textContent;
  if (!btn.querySelector("svg")) {
    btn.textContent = "✓";
  }
  btn.classList.add("copied");
  btn.title = doneTitle;
  setTimeout(() => {
    if (label != null) btn.textContent = label;
    btn.classList.remove("copied");
    btn.title = restoreTitle;
    updateCopyTextButtonTitle();
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
  const contentPages = state.pages.filter((p) => !p.isToc && !p.isCover);
  els.statPages.textContent = String(contentPages.length);
  const visible = new Set(contentPages.map((p) => p.id));
  let audioCount = 0;
  for (const id of state.audioAvailable) {
    if (visible.has(id)) audioCount += 1;
  }
  els.statAudio.textContent = String(audioCount);
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
    if (page.isToc || page.isCover) return;
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
  if (page.isToc || page.isCover) {
    els.voteLike.disabled = true;
    els.voteDislike.disabled = true;
    els.voteLike.classList.remove("selected");
    els.voteDislike.classList.remove("selected");
    els.voteStatus.hidden = true;
    els.voteStatus.textContent = "";
    return;
  }

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

function pageHasRecording(page = state.pages[state.index]) {
  return Boolean(
    page &&
      !page.isCover &&
      !page.isToc &&
      state.lang !== "en" &&
      state.audioAvailable.has(page.id),
  );
}

function updatePlayerUi() {
  const page = state.pages[state.index];
  if (!page || !els.playBtn) return;
  const hasRecording = pageHasRecording(page);
  const canListen = !page.isCover && !page.isToc;
  const ttsSpeaking = Boolean(window.speechSynthesis?.speaking);
  const recordingPlaying = hasRecording && !audio.paused;

  els.playerInfo.textContent = page.isCover
    ? t("bookTitle")
    : page.isToc
      ? t("toc")
      : `${page.id}`;

  // Always show Listen on content pages: your voice if recorded, else reader
  els.playBtn.hidden = !canListen;
  els.noAudio.hidden = !canListen || hasRecording;
  els.progressWrap.hidden = !hasRecording;
  els.playerControls.hidden = false;
  if (els.autoAdvance?.closest("label")) {
    els.autoAdvance.closest("label").hidden = !hasRecording;
  }
  els.playBtn.textContent = recordingPlaying || ttsSpeaking
    ? t("pause")
    : hasRecording
      ? t("listenMyVoice")
      : t("listen");
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.disabled = state.index === state.pages.length - 1;
}

/** Tab title: book name on cover, otherwise current page. */
function updateDocumentTitle(page = state.pages[state.index]) {
  if (document.body.classList.contains("cover-open") || page?.isCover || !page) {
    document.title = t("bookTitle");
    return;
  }
  if (page.isToc) {
    document.title = `${t("toc")} — ${t("bookTitle")}`;
    return;
  }
  document.title = `${page.id} — ${page.title}`;
}

function renderTocContentPage() {
  const items = state.pages
    .map((page, index) => ({ page, index }))
    .filter(({ page }) => !page.isToc && !page.isCover);
  const coverIdx = state.pages.findIndex((p) => p.isCover);
  let html = `<div class="toc-page">`;
  if (coverIdx >= 0) {
    html += `<button type="button" class="toc-page-cover-link" data-index="${coverIdx}">← ${escapeHtml(t("toCover"))}</button>`;
  }
  let currentSection = null;
  for (const { page, index } of items) {
    if (page.section !== currentSection) {
      currentSection = page.section;
      html += `<h2 class="toc-page-section">${escapeHtml(currentSection)}</h2>`;
    }
    const title = page.sourcePage ? page.sourcePage.title : page.title;
    html += `<button type="button" class="toc-page-item" data-index="${index}"><span class="num">${escapeHtml(page.id)}</span><span class="title">${escapeHtml(title)}</span></button>`;
  }
  html += `</div>`;
  return html;
}

function bindTocContentPageClicks() {
  els.content.querySelectorAll(".toc-page-item, .toc-page-cover-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (swipeNav.didNav) {
        swipeNav.didNav = false;
        e.preventDefault();
        return;
      }
      const index = Number(btn.dataset.index);
      if (Number.isFinite(index)) goToPage(index, false);
    });
  });
}

async function loadPage(index, autoplay = false) {
  stopBrowserSpeech();
  state.index = index;
  const page = state.pages[index];
  if (!page) return;

  if (page.isCover) {
    showCoverScreen();
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    audio.load();
    buildToc();
    updatePlayerUi();
    updateVoteUi();
    updateDocumentTitle(page);
    return;
  }

  hideCoverScreen();

  if (page.isToc) {
    const tocTitle = t("toc");
    els.pageMeta.textContent = tocTitle;
    els.pageTitle.textContent = tocTitle;
    updateDocumentTitle(page);
    els.content.innerHTML = renderTocContentPage();
    resetPageFindForLoad(els.content.innerHTML);
    bindTocContentPageClicks();
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    audio.load();
    buildToc();
    updatePlayerUi();
    updateVoteUi();
    syncUrl(page);
    updateDocumentTitle(page);
    document.getElementById("reader").scrollTop = 0;
    return;
  }

  const title = page.title;

  els.pageMeta.textContent = `${page.section} · ${page.id}`;
  els.pageTitle.textContent = title;
  updateDocumentTitle(page);

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
      updateDocumentTitle(page);
      saveReadingBookmark(page);
      document.getElementById("reader").scrollTop = 0;
      return;
    }
    mdPath = page.sourcePage.md;
  }

  try {
    const res = await fetch(`${encodeURI(mdPath)}?v=${Date.now()}`, { cache: "no-store" });
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

  if (pageHasRecording(page)) {
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
    if (autoplay) {
      const settings = getReadAppSettings();
      if (settings?.mode === "speak") {
        const text = pagePlainText();
        if (text) speakPageText(text, settings.voiceURI);
      }
    }
  }

  buildToc();
  updatePlayerUi();
  updateVoteUi();
  syncUrl(page);
  updateDocumentTitle(page);
  saveReadingBookmark(page);
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
  if (!page || page.isCover || page.isToc) return;

  // Priority: your recorded voice when available
  if (pageHasRecording(page)) {
    stopBrowserSpeech();
    if (!audio.src) {
      audio.src = audioPath(page);
    }
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
    return;
  }

  // No recording → configured reader (browser voice / clipboard)
  runReadAppAction();
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

function isPhoneSwipeNav() {
  return window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
}

function swipeBlocked() {
  if (document.body.classList.contains("toc-open")) return true;
  if (els.feedbackModal && !els.feedbackModal.hidden) return true;
  if (els.changesModal && !els.changesModal.hidden) return true;
  if (els.qrModal && !els.qrModal.hidden) return true;
  if (els.readAppModal && !els.readAppModal.hidden) return true;
  if (els.speaktorHelp && !els.speaktorHelp.hidden) return true;
  if (state.pageFind?.open) return true;
  return false;
}

const swipeNav = { x: 0, y: 0, active: false, didNav: false };

document.addEventListener(
  "touchstart",
  (e) => {
    if (!isPhoneSwipeNav() || swipeBlocked()) return;
    if (e.touches.length !== 1) return;
    const target = e.target;
    if (
      target instanceof Element &&
      target.closest("input, textarea, select, button, a, .route-select") &&
      !target.closest(".toc-page-item")
    ) {
      return;
    }
    const t = e.touches[0];
    swipeNav.x = t.clientX;
    swipeNav.y = t.clientY;
    swipeNav.active = true;
    swipeNav.didNav = false;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    if (!swipeNav.active) return;
    swipeNav.active = false;
    if (!isPhoneSwipeNav() || swipeBlocked()) return;
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = t.clientX - swipeNav.x;
    const dy = t.clientY - swipeNav.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    // Need a clear horizontal swipe (not a vertical scroll)
    if (absX < 56 || absX < absY * 1.25) return;
    // Swipe left → next (forward); swipe right → previous
    swipeNav.didNav = true;
    if (dx < 0) goNext(false);
    else goPrev();
  },
  { passive: true }
);
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
els.copyText?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (copyTextLongPress.moved) return;
  runReadAppAction();
});

const copyTextLongPress = { timer: null, moved: false };
els.copyText?.addEventListener("pointerdown", (e) => {
  if (e.button != null && e.button !== 0) return;
  copyTextLongPress.moved = false;
  clearTimeout(copyTextLongPress.timer);
  copyTextLongPress.timer = setTimeout(() => {
    copyTextLongPress.moved = true;
    openReadAppModal();
  }, 550);
});
const clearCopyTextLongPress = () => {
  clearTimeout(copyTextLongPress.timer);
  copyTextLongPress.timer = null;
};
els.copyText?.addEventListener("pointerup", clearCopyTextLongPress);
els.copyText?.addEventListener("pointerleave", clearCopyTextLongPress);
els.copyText?.addEventListener("pointercancel", clearCopyTextLongPress);
els.copyText?.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  openReadAppModal();
});

els.readAppForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  let mode = "speaktor";
  if (els.readAppModeShare?.checked) mode = "share";
  else if (els.readAppModeSpeak?.checked) mode = "speak";
  else if (els.readAppModeClipboard?.checked) mode = "clipboard";
  else if (els.readAppModeSpeaktor?.checked) mode = "speaktor";
  const voiceURI = els.readAppVoice?.value || "";
  saveReadAppSettings({ mode, voiceURI });
  closeReadAppModal();
  runReadAppAction();
});
els.readAppModal?.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-read-app]")) closeReadAppModal();
});
els.speaktorHelp?.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-speaktor-help]")) closeSpeaktorHelp();
});

if (window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => {
    if (els.readAppModal && !els.readAppModal.hidden) fillReadAppVoices();
  });
}

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
  if (e.key === "Escape" && els.qrModal && !els.qrModal.hidden) {
    closeQrModal();
    return;
  }
  if (e.key === "Escape" && els.readAppModal && !els.readAppModal.hidden) {
    closeReadAppModal();
    return;
  }
  if (e.key === "Escape" && els.speaktorHelp && !els.speaktorHelp.hidden) {
    closeSpeaktorHelp();
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
  if (e.code === "Space") {
    if (document.body.classList.contains("cover-open")) return;
    e.preventDefault();
    togglePlay();
  }
});

async function loadCatalog() {
  const manifest = await fetch(`${manifestFile()}?v=${Date.now()}`, {
    cache: "no-store",
  }).then((r) => r.json());
  state.allPages = resolvePages(manifest.pages);
  applyRouteFilter();
  state.audioAvailable = new Set();
  if (state.lang !== "en") {
    await Promise.all(state.allPages.map((page) => checkAudio(page)));
  }
  await Promise.all(state.allPages.map((page) => indexPageText(page)));
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
  syncCoverAuthorLink();
  const moreProjects = document.getElementById("more-projects");
  if (moreProjects) {
    moreProjects.href = state.lang === "en" ? "12345.en.htm?v=47" : "12345.htm?v=49";
  }
  if (els.playBtn) {
    const page = state.pages[state.index];
    const hasRecording = pageHasRecording(page);
    const ttsSpeaking = Boolean(window.speechSynthesis?.speaking);
    const recordingPlaying = hasRecording && !audio.paused;
    els.playBtn.textContent =
      recordingPlaying || ttsSpeaking
        ? t("pause")
        : hasRecording
          ? t("listenMyVoice")
          : page && !page.isCover && !page.isToc
            ? t("listen")
            : t("listen");
  }
  updateDocumentTitle();
  renderRoutePickers();
  updateRouteBadge();
  updateCoverBookmarkBtn();
  updateCopyTextButtonTitle();
}

const ABOUT_AUTHOR_RU =
  "https://aromatic-keyboard-369.notion.site/22522db3cb0880f1a1fffd512d49ceba";

function syncCoverAuthorLink() {
  const el = document.getElementById("cover-author");
  if (!el) return;
  if (state.lang === "en") {
    if (el.tagName === "A") {
      el.removeAttribute("href");
      el.removeAttribute("target");
      el.removeAttribute("rel");
      el.removeAttribute("title");
    }
    el.classList.remove("cover-author");
    el.removeAttribute("data-i18n-title");
    return;
  }
  if (el.tagName === "A") {
    el.href = ABOUT_AUTHOR_RU;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
    el.setAttribute("data-i18n-title", "aboutAuthor");
    el.title = t("aboutAuthor");
  }
  el.classList.add("cover-author");
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

  if (wasCover || !pageId || pageId === "cover") {
    if (state.pages.length) await loadPage(0, false);
    else showCoverScreen();
    return;
  }

  const idx = state.pages.findIndex((p) => p.id === pageId);
  if (idx >= 0) {
    await loadPage(idx, false);
  } else if (state.pages.length) {
    await loadPage(0, false);
  } else {
    showCoverScreen();
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
    const route = params.get("route");
    const q = {};
    if (p) q.p = p;
    if (route) q.route = route;
    const next = Object.keys(q).length ? bookUrl(state.lang, q) : bookUrl(state.lang);
    history.replaceState(p ? { pageId: p } : { cover: true }, "", next.toString());
  }
  applyUiLang();

  await loadRoutes();
  state.routeId = detectRouteId();
  await Promise.all([loadCatalog(), loadChangesIndex()]);
  applyUiLang();
  renderRoutePickers();
  updateRouteBadge();

  const params = new URLSearchParams(location.search);
  const startId = params.get("p");
  const found = startId
    ? state.pages.findIndex((p) => p.id === startId)
    : -1;
  const startIndex = found >= 0 ? found : 0;

  if (state.pages.length) {
    await loadPage(startIndex, false);
  } else if (state.lang === "en") {
    // Empty EN catalog: stay on cover
    showCoverScreen();
  }
  if (!startId) updateDocumentTitle();
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLang(btn.dataset.lang);
  });
});

init();

const BOOKMARK_KEY = "discourse-bookmark";

function readReadingBookmark() {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.pageId) return null;
    return data;
  } catch {
    return null;
  }
}

function saveReadingBookmark(page) {
  if (!page?.id || page.isToc || page.isCover || document.body.classList.contains("cover-open")) return;
  try {
    localStorage.setItem(
      BOOKMARK_KEY,
      JSON.stringify({
        pageId: page.id,
        routeId: state.routeId || null,
        lang: state.lang,
        title: page.title || "",
        at: Date.now(),
      })
    );
  } catch {
    /* ignore */
  }
  updateCoverBookmarkBtn();
}

function updateCoverBookmarkBtn() {
  const btn = els.coverBookmark;
  if (!btn) return;
  const bm = readReadingBookmark();
  const has = Boolean(bm?.pageId);
  btn.hidden = false;
  btn.classList.toggle("has-bookmark", has);
  if (!has) {
    btn.title = t("bookmark");
    btn.setAttribute("aria-label", t("bookmark"));
    return;
  }
  const label = bm.title
    ? `${t("bookmarkGo")}: ${bm.pageId} — ${bm.title}`
    : `${t("bookmarkGo")}: ${bm.pageId}`;
  btn.title = label;
  btn.setAttribute("aria-label", label);
}

async function openReadingBookmark() {
  const bm = readReadingBookmark();
  const btn = els.coverBookmark;
  if (!bm?.pageId) {
    if (btn) {
      btn.classList.add("is-flash");
      btn.title = t("bookmarkEmpty");
      setTimeout(() => {
        btn.classList.remove("is-flash");
        updateCoverBookmarkBtn();
      }, 1600);
    }
    return;
  }

  if (bm.routeId && findRoute(bm.routeId)) {
    setRoute(bm.routeId);
  } else if (state.routeId) {
    setRoute(null);
  }

  enterFromCover({ startAtToc: false });

  let idx = state.pages.findIndex((p) => p.id === bm.pageId);
  if (idx < 0 && state.routeId) {
    setRoute(null);
    idx = state.pages.findIndex((p) => p.id === bm.pageId);
  }
  if (idx >= 0) await loadPage(idx, false);
}

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
  updateDocumentTitle();
  applyUiLang();
  updateCoverBookmarkBtn();
}

function hideCoverScreen() {
  document.body.classList.remove("cover-open");
  if (els.coverScreen) {
    els.coverScreen.classList.add("cover-hidden");
    els.coverScreen.setAttribute("aria-hidden", "true");
  }
}

function enterFromCover({ openTocAfter = false, startAtToc = true } = {}) {
  if (startAtToc) {
    const tocIdx = state.pages.findIndex((p) => p.isToc);
    if (tocIdx >= 0) {
      loadPage(tocIdx, false);
    } else {
      hideCoverScreen();
      goNext(false);
    }
  } else {
    hideCoverScreen();
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

els.coverEnter?.addEventListener("click", (e) => {
  if (swipeNav.didNav) {
    swipeNav.didNav = false;
    return;
  }
  if (e.target instanceof Element && e.target.closest("#cover-author, .cover-author")) {
    return;
  }
  enterFromCover();
});
els.coverEnter?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  if (e.target instanceof Element && e.target.closest("#cover-author, .cover-author")) {
    return;
  }
  e.preventDefault();
  enterFromCover();
});
els.coverAuthor = document.getElementById("cover-author");
els.coverAuthor?.addEventListener("click", (e) => {
  e.stopPropagation();
  if (state.lang === "en" || !(els.coverAuthor instanceof HTMLAnchorElement) || !els.coverAuthor.href) {
    e.preventDefault();
  }
});
els.coverToc?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  enterFromCover({ startAtToc: true });
});
els.coverBookmark?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openReadingBookmark();
});
els.coverLink?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  copyCoverLink();
});
els.coverHome?.addEventListener("click", (e) => {
  e.preventDefault();
  const idx = state.pages.findIndex((p) => p.isCover);
  if (idx >= 0) loadPage(idx, false);
  else showCoverScreen();
});
function onRouteSelectChange(e) {
  e.stopPropagation();
  const value = e.target.value || null;
  setRoute(value);
}
els.coverRouteSelect?.addEventListener("change", onRouteSelectChange);
els.sidebarRouteSelect?.addEventListener("change", onRouteSelectChange);
els.coverChanges?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openChangesModal();
});
els.coverDownload?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  downloadBookAsFile();
});
els.sidebarDownload?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  downloadBookAsFile();
});
els.coverQr?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openQrModal();
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
els.qrModal?.addEventListener("click", (e) => {
  if (e.target.matches("[data-close-qr]")) closeQrModal();
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
    const data = await fetch(`changes.json?v=20260821b`, {
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

function formatChangesDate(iso) {
  const raw = String(iso || "");
  // Full ISO from git %cI, or legacy day-only YYYY-MM-DD
  const ms = Date.parse(raw.includes("T") ? raw : `${raw}T12:00:00`);
  if (!Number.isFinite(ms)) return raw;
  const d = new Date(ms);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return raw.includes("T") ? `${dd}.${mm}.${yyyy} ${hh}:${mi}` : `${dd}.${mm}.${yyyy}`;
}

function kindLabel(kind) {
  if (kind === "added") return t("kindNew");
  if (kind === "changed") return t("kindChanged");
  if (kind === "feature") return t("kindFeature");
  return kind || "";
}

function entryTimestamp(entry) {
  const raw = String(entry?.date || "");
  const ms = Date.parse(raw.includes("T") ? raw : `${raw}T23:59:59`);
  return Number.isFinite(ms) ? ms : 0;
}

function isSystemChange(entry) {
  if (!entry) return false;
  if (entry.kind === "feature") return true;
  const section = String(entry.section || "");
  return (
    section === "Система" ||
    section === "Маршруты" ||
    section === "Проекты"
  );
}

function filteredChanges() {
  const cutoff = changesCutoff();
  const visibleIds = new Set(state.pages.map((p) => p.id));
  return state.changes
    .filter((entry) => {
      if (entryTimestamp(entry) < cutoff) return false;
      if (entry.href) {
        if (entry.lang && entry.lang !== state.lang) return false;
        if (Array.isArray(entry.langs) && !entry.langs.includes(state.lang)) return false;
        return true;
      }
      return visibleIds.has(entry.id);
    })
    .sort((a, b) => entryTimestamp(b) - entryTimestamp(a) || String(b.id).localeCompare(String(a.id), "ru"));
}

function makeChangesItemButton(entry, titleById) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "changes-item";
  if (isSystemChange(entry)) btn.classList.add("is-feature");
  const title =
    titleById.get(entry.id) ||
    (state.lang === "en" && entry.title_en ? entry.title_en : entry.title);
  const summary =
    (state.lang === "en" ? entry.summary_en : entry.summary) ||
    entry.summary ||
    "";
  btn.innerHTML = `
    <span class="changes-item-meta">
      <span>${escapeHtml(formatChangesDate(entry.date))}</span>
      <span class="changes-kind">${escapeHtml(kindLabel(entry.kind))}</span>
    </span>
    <span class="changes-item-id">${escapeHtml(
      isSystemChange(entry) ? entry.section || t("kindFeature") : entry.id,
    )}</span>
    <span class="changes-item-title">${escapeHtml(title)}</span>
    ${summary ? `<span class="changes-item-summary">${escapeHtml(summary)}</span>` : ""}
  `;
  btn.addEventListener("click", () => {
    if (entry.href) {
      closeChangesModal();
      const href =
        state.lang === "en" && entry.href_en ? entry.href_en : entry.href;
      location.href = href;
      return;
    }
    openChangedPage(entry.id);
  });
  return btn;
}

function appendChangesSection(listEl, title, items, titleById) {
  if (!items.length) return;
  const heading = document.createElement("h4");
  heading.className = "changes-section-title";
  heading.textContent = title;
  listEl.appendChild(heading);
  items.forEach((entry) => {
    listEl.appendChild(makeChangesItemButton(entry, titleById));
  });
}

function renderChangesList() {
  if (!els.changesList) return;
  const items = filteredChanges();
  const features = items.filter(isSystemChange);
  const pages = items.filter((entry) => !isSystemChange(entry));
  const mode = els.changesPeriod?.value || "7";
  if (els.changesSummary) {
    if (mode === "since" && !state.prevVisitAt) {
      els.changesSummary.textContent = t("firstVisitWeek");
    } else if (!items.length) {
      els.changesSummary.textContent = t("noChanges");
    } else {
      const parts = [];
      if (features.length) parts.push(`${features.length} ${t("featuresShort")}`);
      if (pages.length) parts.push(`${pages.length} ${t("pagesShort")}`);
      els.changesSummary.textContent = parts.join(" · ");
    }
  }

  if (!items.length) {
    els.changesList.innerHTML = `<p class="changes-empty">${t("changesEmpty")}</p>`;
    return;
  }

  els.changesList.innerHTML = "";
  const titleById = new Map(state.allPages.map((p) => [p.id, p.title]));
  appendChangesSection(els.changesList, t("changesFeatures"), features, titleById);
  appendChangesSection(els.changesList, t("changesPages"), pages, titleById);
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

const CANONICAL_COVER = {
  ru: "https://jfeldman777.github.io/gala/index.html",
  en: "https://jfeldman777.github.io/gala/en.html",
};

function openQrModal() {
  if (!els.qrModal) return;
  const ru = document.getElementById("qr-link-ru");
  const en = document.getElementById("qr-link-en");
  if (ru) {
    ru.href = CANONICAL_COVER.ru;
    ru.textContent = "jfeldman777.github.io/gala";
  }
  if (en) {
    en.href = CANONICAL_COVER.en;
    en.textContent = "jfeldman777.github.io/gala/en.html";
  }
  els.qrModal.hidden = false;
}

function closeQrModal() {
  if (els.qrModal) els.qrModal.hidden = true;
}

async function openChangedPage(pageId) {
  closeChangesModal();
  const index = state.pages.findIndex((p) => p.id === pageId);
  if (index >= 0) await loadPage(index, false);
}
