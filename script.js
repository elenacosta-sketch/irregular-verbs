const irregularVerbFamilies = [
  ["begin", "began", "begun"],
  ["eat", "ate", "eaten"],
  ["give", "gave", "given"],
  ["fly", "flew", "flown"],
  ["drink", "drank", "drunk"],
  ["wear", "wore", "worn"],
  ["take", "took", "taken"],
  ["write", "wrote", "written"],
  ["see", "saw", "seen"],
  ["go", "went", "gone"],
  ["speak", "spoke", "spoken"],
  ["break", "broke", "broken"],
  ["choose", "chose", "chosen"],
  ["drive", "drove", "driven"],
  ["fall", "fell", "fallen"],
  ["forget", "forgot", "forgotten"],
  ["grow", "grew", "grown"],
  ["know", "knew", "known"],
  ["ride", "rode", "ridden"],
  ["steal", "stole", "stolen"],
  ["swim", "swam", "swum"],
  ["throw", "threw", "thrown"],
  ["blow", "blew", "blown"],
  ["draw", "drew", "drawn"]
];

const forms = ["infinitive", "past", "participle"];
const familiesPerRound = 8;
let activeVerbs = [];

const bank = document.getElementById("popcornBank");
const boxes = [...document.querySelectorAll(".popcorn-box")];
const feedback = document.getElementById("feedback");
const score = document.getElementById("score");
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makePopcorn(item) {
  const button = document.createElement("button");
  button.className = "popcorn";
  button.type = "button";
  button.draggable = true;
  button.textContent = item.word;
  button.dataset.type = item.type;
  button.dataset.word = item.word;
  button.dataset.id = item.id;

  button.addEventListener("dragstart", event => {
    button.classList.add("dragging");
    event.dataTransfer.setData("text/plain", item.id);
  });

  button.addEventListener("dragend", () => {
    button.classList.remove("dragging");
  });

  button.addEventListener("click", () => {
    const nextBox = getNextBox(button);
    nextBox.appendChild(button);
    clearMarks();
  });

  return button;
}

function getNextBox(button) {
  const current = button.parentElement;
  if (current === bank) return boxes[0];
  const index = boxes.indexOf(current);
  return boxes[index + 1] || bank;
}

function clearMarks() {
  document.querySelectorAll(".popcorn").forEach(piece => {
    piece.classList.remove("correct", "wrong");
  });
  feedback.textContent = "Keep sorting. Then check your answers.";
}

function render() {
  bank.innerHTML = "";
  boxes.forEach(box => {
    box.innerHTML = "";
    box.classList.remove("drag-over");
  });

  activeVerbs = shuffle(irregularVerbFamilies)
    .slice(0, familiesPerRound)
    .flatMap(family => family.map((word, index) => ({
      id: `${family[0]}-${forms[index]}`,
      word,
      type: forms[index]
    })));

  shuffle(activeVerbs).forEach(item => {
    bank.appendChild(makePopcorn(item));
  });

  feedback.textContent = "Drag each popcorn verb into the correct box.";
  score.textContent = `Score: 0 / ${activeVerbs.length}`;
}

boxes.concat(bank).forEach(zone => {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    const id = event.dataTransfer.getData("text/plain");
    const piece = document.querySelector(`.popcorn[data-id="${id}"]`);
    if (piece) {
      zone.appendChild(piece);
      clearMarks();
    }
  });
});

function checkAnswers() {
  let correct = 0;

  document.querySelectorAll(".popcorn").forEach(piece => {
    const parentType = piece.parentElement.dataset.type;
    const isCorrect = parentType === piece.dataset.type;
    piece.classList.toggle("correct", isCorrect);
    piece.classList.toggle("wrong", !isCorrect);
    if (isCorrect) correct += 1;
  });

  score.textContent = `Score: ${correct} / ${activeVerbs.length}`;

  if (correct === activeVerbs.length) {
    feedback.textContent = "Perfect! Every popcorn verb is in the correct box.";
  } else {
    feedback.textContent = `${correct} correct. Move the highlighted verbs and try again.`;
  }
}

checkBtn.addEventListener("click", checkAnswers);
resetBtn.addEventListener("click", render);
shuffleBtn.addEventListener("click", render);

render();

const regularVerbCards = [
  { word: "play", kind: "regular" },
  { word: "visit", kind: "regular" },
  { word: "watch", kind: "regular" },
  { word: "study", kind: "regular" },
  { word: "clean", kind: "regular" },
  { word: "open", kind: "regular" },
  { word: "want", kind: "regular" },
  { word: "live", kind: "regular" },
  { word: "stop", kind: "regular" },
  { word: "listen", kind: "regular" },
  { word: "cook", kind: "regular" },
  { word: "talk", kind: "regular" },
  { word: "eat", kind: "irregular" },
  { word: "go", kind: "irregular" },
  { word: "buy", kind: "irregular" },
  { word: "see", kind: "irregular" },
  { word: "write", kind: "irregular" },
  { word: "make", kind: "irregular" },
  { word: "take", kind: "irregular" },
  { word: "give", kind: "irregular" },
  { word: "come", kind: "irregular" },
  { word: "begin", kind: "irregular" },
  { word: "drink", kind: "irregular" },
  { word: "fly", kind: "irregular" }
];

const verbBank = document.getElementById("verbBank");
const sortTrays = [...document.querySelectorAll(".sort-tray")];
const regularScore = document.getElementById("regularScore");
const regularFeedback = document.getElementById("regularFeedback");
const regularCheckBtn = document.getElementById("regularCheckBtn");
const regularResetBtn = document.getElementById("regularResetBtn");
const regularShuffleBtn = document.getElementById("regularShuffleBtn");

function makeVerbChip(item) {
  const button = document.createElement("button");
  button.className = "verb-chip";
  button.type = "button";
  button.draggable = true;
  button.textContent = item.word;
  button.dataset.kind = item.kind;
  button.dataset.word = item.word;
  button.dataset.id = `${item.kind}-${item.word}`;

  button.addEventListener("dragstart", event => {
    button.classList.add("dragging");
    event.dataTransfer.setData("text/plain", `${item.kind}-${item.word}`);
  });

  button.addEventListener("dragend", () => {
    button.classList.remove("dragging");
  });

  button.addEventListener("click", () => {
    const nextZone = getNextRegularZone(button);
    nextZone.appendChild(button);
    clearRegularMarks();
  });

  return button;
}

function getNextRegularZone(button) {
  const current = button.parentElement;
  if (current === verbBank) return sortTrays[0];
  const index = sortTrays.indexOf(current);
  return sortTrays[index + 1] || verbBank;
}

function clearRegularMarks() {
  document.querySelectorAll(".verb-chip").forEach(chip => {
    chip.classList.remove("correct", "wrong");
  });
  regularFeedback.textContent = "Keep sorting. Then check your verbs.";
}

function renderRegularActivity() {
  verbBank.innerHTML = "";
  sortTrays.forEach(tray => {
    tray.innerHTML = "";
    tray.classList.remove("drag-over");
  });

  shuffle(regularVerbCards).forEach(item => {
    verbBank.appendChild(makeVerbChip(item));
  });

  regularScore.textContent = `Score: 0 / ${regularVerbCards.length}`;
  regularFeedback.textContent = "Sort each verb into regular or irregular.";
}

[verbBank, ...sortTrays].forEach(zone => {
  zone.addEventListener("dragover", event => {
    event.preventDefault();
    zone.classList.add("drag-over");
  });

  zone.addEventListener("dragleave", () => {
    zone.classList.remove("drag-over");
  });

  zone.addEventListener("drop", event => {
    event.preventDefault();
    zone.classList.remove("drag-over");
    const id = event.dataTransfer.getData("text/plain");
    const chip = document.querySelector(`.verb-chip[data-id="${id}"]`);
    if (chip) {
      zone.appendChild(chip);
      clearRegularMarks();
    }
  });
});

function checkRegularAnswers() {
  let correct = 0;

  document.querySelectorAll(".verb-chip").forEach(chip => {
    const parentKind = chip.parentElement.dataset.kind;
    const isCorrect = parentKind === chip.dataset.kind;
    chip.classList.toggle("correct", isCorrect);
    chip.classList.toggle("wrong", !isCorrect);
    if (isCorrect) correct += 1;
  });

  regularScore.textContent = `Score: ${correct} / ${regularVerbCards.length}`;

  if (correct === regularVerbCards.length) {
    regularFeedback.textContent = "Excellent! All verbs are sorted correctly.";
  } else {
    regularFeedback.textContent = `${correct} correct. Move the highlighted verbs and check again.`;
  }
}

regularCheckBtn.addEventListener("click", checkRegularAnswers);
regularResetBtn.addEventListener("click", renderRegularActivity);
regularShuffleBtn.addEventListener("click", renderRegularActivity);

renderRegularActivity();