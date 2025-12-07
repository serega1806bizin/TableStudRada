// Готова мапа кураторів (прізвище + ініціали)
const curators = {
  // І курс
  "ПЗ-241": "Кучер Т.В.",
  "ПЗ-242": "Райко О.С.",
  "КС-241": "Міхайлова В.Г.",
  "РА-241": "Бойко В.С.",
  "РА-242": "Петелько Л.А.",
  "АВ-241": "Чернова Є.М.",
  "АП-241": "Гиря К.С.",
  "ОМ-241": "Гвоздецька В.В.",
  "ЮА-251": "Гончарова М.В.",

  // ІІ курс
  "ПЗ-231": "Трощій Ю.Г.",
  "ПЗ-232": "Гоцин О.Ф.",
  "КС-231": "Криворот В.Ю.",
  "АП-231": "Засядько І.І.",
  "РА-231": "Кирильчук Н.О.",
  "РА-232": "Мельничук А.Г.",
  "АВ-231": "Ільєнко О.А.",
  "ОМ-231": "Мітова С.А.",

  
  // ІІІ курс
  "ПЗ-221": "Чернявська Т.А.",
  "ПЗ-222": "Даценко А.А.",
  "КС-221": "Клішанець І.В.",
  "РА-221": "Стефанова Л.Є.",
  "РА-222": "Марченко І.М.",
  "ОМ-221": "Храпач В.М.",
  "АП-221": "Бублик О.В.",
  "АВ-221": "Жарова І.Б.",

  // ІV курс
  "ПЗ-211": "Федоренко Н.О.",
  "ПЗ-212": "Гончарова М.В.",
  "КС-211": "Мацак А.О.",
  "РА-211": "Король Т.С.",
  "РА-212": "Халявко Б.І.",
  "ОМ-211": "Гарасюта І.М.",
  "АП-211": "Радівілова В.В.",
  "АВ-211": "Яхшибаєва Л.П.",
};

(function fillCurators() {
  const unknown = new Set();
  document.querySelectorAll(".student").forEach((el) => {
    const text = (el.textContent || "").replace(/\s+/g, " ").trim();
    const group = (text.split(",").pop() || "").trim();
    const curator = curators[group];
    if (curator) {
      el.setAttribute("data-curator", `Куратор: ${curator}`);
    } else {
      el.setAttribute("data-curator", "Куратор: —");
      unknown.add(group);
    }
  });
  if (unknown.size) {
    console.warn("Немає кураторів для груп:", Array.from(unknown));
  }
})();
(function enableCuratorToggle() {
  const students = Array.from(document.querySelectorAll(".student"));

  students.forEach((el) => {
    el.setAttribute("tabindex", "0");

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      students.forEach((s) => {
        if (s !== el) s.classList.remove("curator-open");
      });
      el.classList.toggle("curator-open");
    });

    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        el.click();
      }
    });
  });

  document.addEventListener("click", () => {
    students.forEach((s) => s.classList.remove("curator-open"));
  });
})();

(function enablePathHighlighting() {
  const table = document.querySelector("table");
  const mainThead = table.querySelectorAll("thead")[0]; 
  const headRows = mainThead ? Array.from(mainThead.rows) : [];

  const students = Array.from(document.querySelectorAll(".student"));

  function clearHighlights() {
    table
      .querySelectorAll(
        ".row-head-active, .col-head-active, .sub-col-head-active"
      )
      .forEach((el) =>
        el.classList.remove(
          "row-head-active",
          "col-head-active",
          "sub-col-head-active"
        )
      );
  }

  function highlightPathFor(studentEl) {
    clearHighlights();
    if (!studentEl) return;

    const td = studentEl.closest("td");
    const tr = td?.parentElement;
    if (!td || !tr) return;

    const colIndex = td.cellIndex;
    const rowHead = tr.cells[0]; 
    if (rowHead) rowHead.classList.add("row-head-active");


    if (headRows.length >= 2) {
      if (colIndex === 1) {
        headRows[0].cells[1]?.classList.add("col-head-active");
      } else if (colIndex === 2) {
        headRows[0].cells[2]?.classList.add("col-head-active"); // груповой заголовок
        headRows[1].cells[0]?.classList.add("sub-col-head-active"); // подзаголовок
      } else if (colIndex === 3) {
        headRows[0].cells[2]?.classList.add("col-head-active");
        headRows[1].cells[1]?.classList.add("sub-col-head-active");
      }
    }
  }

  function updateFromOpen() {
    const current = document.querySelector(".student.curator-open");
    highlightPathFor(current);
  }

  students.forEach((el) => {
    el.addEventListener("click", () => {
      setTimeout(updateFromOpen, 0);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        setTimeout(updateFromOpen, 0);
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".student")) {
      clearHighlights();
    }
  });
})();
