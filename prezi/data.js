/** Final board cards + reveal order from прези.txt */
window.PREZI = {
  title: "Карта Дискурса",
  // Visual board (approximate layout of the Miro-like final map)
  cards: [
    // left rail
    { id: "worldview", text: "Картина мира", kind: "rail-dark", row: "rail", col: 0 },
    { id: "examples", text: "примеры задачи кейсы", kind: "rail-dark", row: "rail", col: 0 },

    // right rail
    { id: "phil", text: "философия", kind: "rail-green", row: "rail", col: 2 },
    { id: "psych", text: "Психология", kind: "rail-green", row: "rail", col: 2 },
    { id: "hum", text: "Гуманитарное знание", kind: "rail-green", row: "rail", col: 2 },

    // row headers (same gray backdrop as «как это понимать»)
    { id: "h-problems", text: "ПРОСТРАНСТВО ПРОБЛЕМ", kind: "header-box caps", row: "problems" },
    { id: "h-models", text: "МОДЕЛИ", kind: "header-box caps", row: "models" },
    { id: "h-understand", text: "как это понимать", kind: "header-box", row: "understand" },
    { id: "h-optimal", text: "Что считать оптимальным и как это построить", kind: "header-box", row: "optimal" },

    // problems
    { id: "human", text: "проблемы с человеком", kind: "orange", row: "problems" },
    { id: "past-future", text: "прошлое будущее", kind: "rose", row: "problems" },
    { id: "think-do", text: "думать делать", kind: "rose", row: "problems" },
    { id: "one-many", text: "я один нас много", kind: "rose", row: "problems" },
    { id: "areas", text: "области", kind: "teal", row: "problems" },
    { id: "edges", text: "грани", kind: "teal", row: "problems" },
    { id: "flows", text: "потоки", kind: "teal", row: "problems" },

    // models
    { id: "levels", text: "уровни", kind: "pink", row: "models" },
    { id: "curves", text: "кривые разогрева", kind: "pink", row: "models" },
    { id: "codes", text: "кодировки", kind: "pink wide", row: "models" },
    { id: "context", text: "контекст", kind: "pink", row: "models" },
    { id: "conv-in", text: "конвейер внутренний", kind: "magenta wide", row: "models" },
    { id: "conv-out", text: "конвейер внешний", kind: "magenta", row: "models" },

    // understand
    { id: "truth", text: "Истина", kind: "yellow", row: "understand" },
    { id: "good-evil", text: "Добро и зло", kind: "yellow", row: "understand" },
    { id: "history", text: "История", kind: "yellow", row: "understand" },
    { id: "god", text: "Бог", kind: "yellow", row: "understand" },
    { id: "mat-ideal", text: "материальное идеальное", kind: "yellow", row: "understand" },
    { id: "mat-spirit", text: "материальное духовное", kind: "yellow", row: "understand" },

    // optimal
    { id: "state", text: "Государство", kind: "purple", row: "optimal" },
    { id: "life", text: "СВОЮ ЖИЗНЬ", kind: "blue", row: "optimal" },
    { id: "self", text: "Саморазвитие", kind: "purple", row: "optimal" },
    { id: "edu", text: "образование", kind: "blue", row: "optimal" },
    { id: "comm", text: "коммуникация", kind: "purple", row: "optimal" },
    { id: "discuss", text: "Дискуссия", kind: "blue wide", row: "optimal" },
  ],

  /**
   * Reveal order from прези.txt (aliases map spoken/list labels → card ids).
   * Steps without a card still advance the counter (spoken beat).
   */
  steps: [
    { match: "Картина мира", card: "worldview" },
    { match: "Философия", card: "phil" },
    { match: "Психология", card: "psych" },
    { match: "Гуманитарное знание", card: "hum" },
    { match: "Что считать оптимальным и как это построить", card: "h-optimal" },
    { match: "Государство", card: "state" },
    { match: "Образование", card: "edu" },
    { match: "Коммуникация", card: "comm" },
    { match: "Жизнь", card: "life" },
    { match: "Саморазвитие", card: "self" },
    { match: "Дискуссия", card: "discuss" },
    { match: "Как это понимать", card: "h-understand" },
    { match: "Истина", card: "truth" },
    { match: "Добро и Зло", card: "good-evil" },
    { match: "История", card: "history" },
    { match: "Бог", card: "god" },
    { match: "материальное - идеальное", card: "mat-ideal" },
    { match: "материальное - духовное", card: "mat-spirit" },
    { match: "Пространство проблем", card: "h-problems" },
    { match: "Проблемы с человеком", card: "human" },
    { match: "Прошлое - будущее", card: "past-future" },
    { match: "Думать - делать", card: "think-do" },
    { match: "Я один - нас много", card: "one-many" },
    { match: "Области", card: "areas" },
    { match: "Грани", card: "edges" },
    { match: "Потоки", card: "flows" },
    { match: "Модели", card: "h-models" },
    { match: "Конвейер внешний", card: "conv-out" },
    { match: "Конвейер внутренний", card: "conv-in" },
    { match: "Контекст", card: "context" },
    { match: "Кодировки", card: "codes" },
    { match: "Кривые разогрева", card: "curves" },
    { match: "Уровни", card: "levels" },
    { match: "Примеры Задачи Кейсы", card: "examples" },
  ],
};
