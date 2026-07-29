(() => {
  const data = window.PREZI;
  if (!data) return;

  const els = {
    title: document.getElementById("title"),
    stepLabel: document.getElementById("step-label"),
    progress: document.getElementById("progress"),
    board: document.getElementById("board"),
    stage: document.getElementById("stage"),
    railLeft: document.getElementById("rail-left"),
    railRight: document.getElementById("rail-right"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnReset: document.getElementById("btn-reset"),
    btnAll: document.getElementById("btn-all"),
  };

  const cardEls = new Map();
  let step = 0; // how many steps already revealed

  function mount() {
    els.title.textContent = data.title;

    const leftOrder = ["worldview", "examples"];
    const rightOrder = ["phil", "psych", "hum"];
    const byId = Object.fromEntries(data.cards.map((c) => [c.id, c]));

    for (const id of leftOrder) {
      els.railLeft.appendChild(makeCard(byId[id]));
    }
    for (const id of rightOrder) {
      els.railRight.appendChild(makeCard(byId[id]));
    }

    for (const card of data.cards) {
      if (card.kind === "rail-dark" || card.kind === "rail-green") continue;
      if (card.kind === "header" || card.kind.startsWith("header-box")) {
        const slot = document.getElementById(`slot-${card.id}`);
        if (slot) slot.appendChild(makeCard(card));
        continue;
      }
      makeCard(card);
    }

    // Visual lines (same-color groups stay on one line)
    fillLines("row-problems", [
      ["human"],
      ["past-future", "think-do", "one-many"],
      ["areas", "edges", "flows"],
    ]);
    // Conveyors above pink model cards
    fillLines("row-models", [
      ["conv-in", "conv-out"],
      ["levels", "curves", "codes", "context"],
    ]);
    fillLines("row-understand", [
      ["truth", "good-evil", "history", "god", "mat-ideal", "mat-spirit"],
    ]);
    fillLines("row-optimal", [["state", "life", "self", "edu", "comm", "discuss"]]);

    render();
    els.stage.focus();
  }

  function fillLines(rowId, lines) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.innerHTML = "";
    for (const ids of lines) {
      const line = document.createElement("div");
      line.className = "card-line";
      for (const id of ids) {
        const el = cardEls.get(id);
        if (el) line.appendChild(el);
      }
      row.appendChild(line);
    }
  }

  function makeCard(card) {
    const el = document.createElement("div");
    el.className = `card ${card.kind}`;
    el.dataset.id = card.id;
    el.textContent = card.text;
    cardEls.set(card.id, el);
    return el;
  }

  function revealedIds() {
    const ids = new Set();
    for (let i = 0; i < step; i++) {
      const s = data.steps[i];
      if (s?.card) ids.add(s.card);
    }
    return ids;
  }

  function render() {
    const shown = revealedIds();
    for (const [id, el] of cardEls) {
      const on = shown.has(id);
      el.classList.toggle("visible", on);
      el.classList.remove("flash");
    }

    const total = data.steps.length;
    els.progress.textContent = `${step} / ${total}`;

    if (step === 0) {
      els.stepLabel.textContent = "Готово к показу — нажмите «Дальше»";
    } else {
      const cur = data.steps[step - 1];
      els.stepLabel.textContent = cur.card
        ? cur.match
        : `${cur.match} (без новой карточки)`;
      if (cur.card) {
        const el = cardEls.get(cur.card);
        if (el) {
          el.classList.add("flash");
          window.setTimeout(() => el.classList.remove("flash"), 700);
        }
      }
    }

    els.btnPrev.disabled = step <= 0;
    els.btnNext.disabled = step >= total;
    els.stage?.classList.toggle("is-complete", step >= total && total > 0);
  }

  function next() {
    if (step >= data.steps.length) return;
    step += 1;
    render();
  }

  function prev() {
    if (step <= 0) return;
    step -= 1;
    render();
  }

  function reset() {
    step = 0;
    render();
  }

  function showAll() {
    step = data.steps.length;
    render();
  }

  els.btnNext.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
  });
  els.btnPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
  });
  els.btnReset.addEventListener("click", (e) => {
    e.stopPropagation();
    reset();
  });
  els.btnAll.addEventListener("click", (e) => {
    e.stopPropagation();
    showAll();
  });

  els.stage.addEventListener("click", (e) => {
    if (e.target.closest("button, a")) return;
    next();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowRight" || e.key === "PageDown") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Escape" || e.key === "Home") {
      e.preventDefault();
      reset();
    } else if (e.key === "End") {
      e.preventDefault();
      showAll();
    }
  });

  mount();
})();
