let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

let moveHistory = [];

let scoreX = 0;
let scoreO = 0;
let scoreDraws = 0;
let lastResult = null;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const cells = document.querySelectorAll(".game-cell");
const statusText = document.getElementById("gameStatus");
const resetButton = document.getElementById("resetButton");
const undoButton = document.getElementById("undoButton");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawsEl = document.getElementById("scoreDraws");
const scoreCardX = document.getElementById("scoreCardX");
const scoreCardO = document.getElementById("scoreCardO");

cells.forEach((cell, index) => {
  cell.setAttribute("aria-label", `Cell ${index + 1}, empty`);
  cell.addEventListener("click", handleCellClick);
});

resetButton.addEventListener("click", resetGame);
undoButton.addEventListener("click", undoMove);

updateScoreboard();
updateCurrentPlayerHighlight();
updateUndoState();
statusText.textContent = "Player X's turn";

function handleCellClick(e) {
  const cell = e.currentTarget;
  const index = Number(cell.getAttribute("data-cell-index"));

  if (!gameActive || board[index] !== "") return;

  moveHistory.push({ index, player: currentPlayer });

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === "X" ? "is-x" : "is-o");
  cell.setAttribute("aria-label", `Cell ${index + 1}, ${currentPlayer}`);

  if (checkWin()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    statusText.classList.add("is-finished");
    gameActive = false;

    if (currentPlayer === "X") scoreX++;
    else scoreO++;
    lastResult = currentPlayer;
    updateScoreboard();
  } else if (isDraw()) {
    statusText.textContent = "It's a draw.";
    statusText.classList.add("is-finished");
    gameActive = false;

    scoreDraws++;
    lastResult = "draw";
    updateScoreboard();
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    lastResult = null;
  }

  updateCurrentPlayerHighlight();
  updateUndoState();
}

function checkWin() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combo.forEach((i) => {
        const winCell = document.querySelector(
          `.game-cell[data-cell-index="${i}"]`
        );
        if (winCell) winCell.classList.add("is-win");
      });
      return true;
    }
  }
  return false;
}

function isDraw() {
  return board.every((cell) => cell !== "");
}

function resetGame() {
  currentPlayer = "X";
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];
  moveHistory = [];
  lastResult = null;

  statusText.textContent = "Player X's turn";
  statusText.classList.remove("is-finished");

  cells.forEach((cell, index) => {
    cell.textContent = "";
    cell.classList.remove("is-x", "is-o", "is-win");
    cell.setAttribute("aria-label", `Cell ${index + 1}, empty`);
  });

  updateCurrentPlayerHighlight();
  updateUndoState();
}

function undoMove() {
  if (moveHistory.length === 0) return;

  if (lastResult !== null) {
    if (lastResult === "X" && scoreX > 0) scoreX--;
    else if (lastResult === "O" && scoreO > 0) scoreO--;
    else if (lastResult === "draw" && scoreDraws > 0) scoreDraws--;
    lastResult = null;
    updateScoreboard();
  }

  const last = moveHistory.pop();
  
  cells.forEach((cell) => cell.classList.remove("is-win"));
  statusText.classList.remove("is-finished");
  gameActive = true;


  board[last.index] = "";
  const cell = document.querySelector(
    `.game-cell[data-cell-index="${last.index}"]`
  );
  if (cell) {
    cell.textContent = "";
    cell.classList.remove("is-x", "is-o");
    cell.setAttribute("aria-label", `Cell ${last.index + 1}, empty`);
  }


  currentPlayer = last.player;
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  updateCurrentPlayerHighlight();
  updateUndoState();
}

function updateScoreboard() {
  scoreXEl.textContent = scoreX;
  scoreOEl.textContent = scoreO;
  scoreDrawsEl.textContent = scoreDraws;
}

function updateCurrentPlayerHighlight() {
  if (!scoreCardX || !scoreCardO) return;

  if (currentPlayer === "X") {
    scoreCardX.classList.add("is-current");
    scoreCardO.classList.remove("is-current");
  } else {
    scoreCardO.classList.add("is-current");
    scoreCardX.classList.remove("is-current");
  }
}

function updateUndoState() {
  if (!undoButton) return;
  undoButton.disabled = moveHistory.length === 0;
}
