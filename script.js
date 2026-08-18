const levels = [
  {
    name: "Satellite Parade",
    instruction: "Line up the satellites from left to right. Leave equal space between them and center them vertically in the docking lane.",
    target: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    defaults: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "row · space-between · center",
    tip: "justify-content controls the main axis. In a row, that means left-to-right spacing.",
    items: [
      { symbol: "🛰️", name: "Scout" },
      { symbol: "🛰️", name: "Relay" },
      { symbol: "🛰️", name: "Beacon" },
      { symbol: "🛰️", name: "Probe" }
    ]
  },
  {
    name: "Capsule Lift",
    instruction: "Stack the crew capsules from top to bottom. Keep them centered across the width of the launch bay.",
    target: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    defaults: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "column · flex-start · center",
    tip: "flex-direction changes the main axis. A column makes the main axis vertical.",
    items: [
      { symbol: "🧑‍🚀", name: "Pilot" },
      { symbol: "🧑‍🚀", name: "Engineer" },
      { symbol: "🧑‍🚀", name: "Scientist" },
      { symbol: "🧑‍🚀", name: "Medic" }
    ]
  },
  {
    name: "Rover Recovery",
    instruction: "Park the rovers from right to left along the bottom edge. Give each rover equal breathing room around it.",
    target: {
      flexDirection: "row-reverse",
      justifyContent: "space-around",
      alignItems: "flex-end",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    defaults: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "row-reverse · space-around · flex-end",
    tip: "row-reverse reverses the main-axis order. align-items controls the cross-axis edge.",
    items: [
      { symbol: "🤖", name: "Rover A" },
      { symbol: "🤖", name: "Rover B" },
      { symbol: "🤖", name: "Rover C" },
      { symbol: "🤖", name: "Rover D" }
    ]
  },
  {
    name: "Reverse Orbit",
    instruction: "Send the planets upward in reverse order. Space them evenly along the vertical axis and keep them against the left wall.",
    target: {
      flexDirection: "column-reverse",
      justifyContent: "space-evenly",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    defaults: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "column-reverse · space-evenly · flex-start",
    tip: "space-evenly gives every gap, including the outside gaps, the same amount of space.",
    items: [
      { symbol: "🪐", name: "Saturn" },
      { symbol: "🌍", name: "Earth" },
      { symbol: "🔴", name: "Mars" },
      { symbol: "🌙", name: "Moon" }
    ]
  },
  {
    name: "Cargo Gridlock",
    instruction: "Wrap all six cargo crates into rows. Center the crates inside each row and spread the rows from the top of the bay to the bottom.",
    target: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      alignContent: "space-between"
    },
    defaults: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "row · center · center · wrap · space-between",
    tip: "When flex-wrap creates multiple lines, align-content controls the space between the lines.",
    items: [
      { symbol: "📦", name: "Fuel" },
      { symbol: "📦", name: "Water" },
      { symbol: "📦", name: "Food" },
      { symbol: "📦", name: "Tools" },
      { symbol: "📦", name: "Parts" },
      { symbol: "📦", name: "Medkits" }
    ]
  },
  {
    name: "Beacon Finale",
    instruction: "Stack the beacons from top to bottom, keep maximum space between them, and align them to the right edge of the command deck.",
    target: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    defaults: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "nowrap",
      alignContent: "stretch"
    },
    summary: "column · space-between · flex-end",
    tip: "The main-axis and cross-axis work together: column + space-between + flex-end makes a vertical right-edge stack.",
    items: [
      { symbol: "📡", name: "North" },
      { symbol: "📡", name: "East" },
      { symbol: "📡", name: "South" },
      { symbol: "📡", name: "West" }
    ]
  }
];

const board = document.querySelector("#game-board");
const controls = [...document.querySelectorAll("[data-control]")];
const controlsForm = document.querySelector("#controls");
const resetButton = document.querySelector("#reset-button");
const checkButton = document.querySelector("#check-button");
const nextButton = document.querySelector("#next-button");
const feedback = document.querySelector("#feedback");
const stageLabel = document.querySelector("#stage-label");
const stageName = document.querySelector("#stage-name");
const briefingIndex = document.querySelector("#briefing-index");
const briefingTitle = document.querySelector("#briefing-title");
const stageState = document.querySelector("#stage-state");
const instruction = document.querySelector("#instruction");
const targetSummary = document.querySelector("#target-summary");
const tipText = document.querySelector("#tip-text");
const progressBar = document.querySelector("#progress-bar");
const scoreValue = document.querySelector("#score-value");
const attemptsValue = document.querySelector("#attempts-value");
const previousButton = document.querySelector("#previous-button");

let currentLevel = 0;
let totalAttempts = 0;
let levelAttempts = 0;
let score = 0;
let levelSolved = false;
let unlockedLevel = 0;
let completedLevels = levels.map(() => false);
let levelAttemptsByLevel = levels.map(() => 0);
let levelValues = levels.map((level) => ({ ...level.defaults }));

function formatTargetValues(target) {
  return [
    `flex-direction: ${target.flexDirection}`,
    `justify-content: ${target.justifyContent}`,
    `align-items: ${target.alignItems}`,
    `flex-wrap: ${target.flexWrap}`,
    `align-content: ${target.alignContent}`
  ].join("\n");
}

function setControlValues(values) {
  controls.forEach((control) => {
    control.value = values[control.dataset.control];
  });
}

function getControlValues() {
  return controls.reduce((values, control) => {
    values[control.dataset.control] = control.value;
    return values;
  }, {});
}

function applyFlexboxValues() {
  const values = getControlValues();
  board.style.flexDirection = values.flexDirection;
  board.style.justifyContent = values.justifyContent;
  board.style.alignItems = values.alignItems;
  board.style.flexWrap = values.flexWrap;
  board.style.alignContent = values.alignContent;
}

function createBoardItems(items) {
  board.replaceChildren();
  items.forEach((item) => {
    const object = document.createElement("div");
    object.className = "game-item";
    object.setAttribute("role", "listitem");
    object.setAttribute("aria-label", item.name);

    const symbol = document.createElement("span");
    symbol.className = "item-symbol";
    symbol.setAttribute("aria-hidden", "true");
    symbol.textContent = item.symbol;

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;

    object.append(symbol, name);
    board.append(object);
  });
}

function setFeedback(message, type = "neutral") {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`;
}

function updateProgress() {
  const levelNumber = currentLevel + 1;
  stageLabel.textContent = `Stage ${levelNumber} of ${levels.length}`;
  briefingIndex.textContent = String(levelNumber).padStart(2, "0");
  progressBar.style.width = `${(levelNumber / levels.length) * 100}%`;
  scoreValue.textContent = String(score).padStart(4, "0");
  attemptsValue.textContent = String(totalAttempts);
}

function updateNavigation() {
  const stageCompleted = completedLevels[currentLevel];
  const nextStageUnlocked = currentLevel < unlockedLevel;
  const canGoForward = stageCompleted || nextStageUnlocked;

  previousButton.disabled = currentLevel === 0;
  nextButton.disabled = !canGoForward;
  nextButton.textContent = canGoForward
    ? (currentLevel === levels.length - 1 ? "Complete mission" : "Next stage →")
    : "Locked · solve stage first";

  stageState.className = "stage-state";
  if (stageCompleted) {
    stageState.classList.add("completed");
    stageState.textContent = currentLevel === levels.length - 1
      ? "Completed · mission ready to finish."
      : "Completed · next stage unlocked."
  } else {
    stageState.textContent = "Next stage locked · solve this challenge to continue.";
  }
}

function renderLevel() {
  const level = levels[currentLevel];
  stageName.textContent = level.name;
  briefingTitle.textContent = level.name;
  instruction.textContent = level.instruction;
  targetSummary.textContent = formatTargetValues(level.target);
  tipText.textContent = level.tip;
  createBoardItems(level.items);
  setControlValues(levelValues[currentLevel]);
  applyFlexboxValues();
  levelAttempts = levelAttemptsByLevel[currentLevel];
  levelSolved = completedLevels[currentLevel];
  setFeedback(
    levelSolved
      ? "This stage is complete. You can replay it or move between unlocked stages."
      : "Match all five target values, then press Check solution."
  );
  updateProgress();
  updateNavigation();
}

function isSolutionCorrect() {
  const current = getControlValues();
  const target = levels[currentLevel].target;
  return Object.keys(target).every((property) => current[property] === target[property]);
}

function checkSolution() {
  totalAttempts += 1;
  levelAttempts += 1;
  levelAttemptsByLevel[currentLevel] = levelAttempts;
  updateProgress();

  if (isSolutionCorrect()) {
    const stageScore = Math.max(100, 300 - ((levelAttempts - 1) * 25));
    const alreadyCompleted = completedLevels[currentLevel];
    if (!alreadyCompleted) {
      score += stageScore;
      completedLevels[currentLevel] = true;
      if (currentLevel === unlockedLevel && currentLevel < levels.length - 1) {
        unlockedLevel += 1;
      }
    }
    levelSolved = true;
    updateProgress();
    updateNavigation();
    setFeedback(
      alreadyCompleted
        ? "Formation correct. This stage was already completed, so its progress is preserved."
        : `Formation locked. +${stageScore} points. You can continue to the next stage.`,
      "success"
    );
    return;
  }

  updateNavigation();
  setFeedback("Not quite yet. Read the briefing, adjust the controls, and try again.", "error");
}

function resetLevel() {
  levelValues[currentLevel] = { ...levels[currentLevel].defaults };
  setControlValues(levelValues[currentLevel]);
  applyFlexboxValues();
  levelSolved = false;
  updateNavigation();
  setFeedback(
    completedLevels[currentLevel]
      ? "Stage reset. Your previous completion is preserved."
      : "Stage reset. Match all five target values and check again."
  );
}

function goToNextLevel() {
  const canGoForward = completedLevels[currentLevel] || currentLevel < unlockedLevel;
  if (!canGoForward) {
    return;
  }

  if (currentLevel === levels.length - 1) {
    nextButton.disabled = true;
    setFeedback(`Mission complete. Final score: ${score} points.`, "success");
    return;
  }

  currentLevel += 1;
  renderLevel();
}

function goToPreviousLevel() {
  if (currentLevel === 0) {
    return;
  }

  currentLevel -= 1;
  renderLevel();
}

controls.forEach((control) => {
  control.addEventListener("change", () => {
    applyFlexboxValues();
    levelValues[currentLevel] = getControlValues();
    levelSolved = isSolutionCorrect();
    updateNavigation();
    setFeedback("Change applied. Check the formation when you are ready.");
  });
});

controlsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkSolution();
});

resetButton.addEventListener("click", resetLevel);
nextButton.addEventListener("click", goToNextLevel);
previousButton.addEventListener("click", goToPreviousLevel);

renderLevel();
