const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameIsActive = true;

// All possible winning combinations
const winPatterns = [
  [0, 1, 2], //rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // diagonals
  [2, 4, 6],
];

function checkWin() {
  return winPatterns.some(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}

function checkDraw() {
  return board.every((cell) => cell !== "");
}

function updatePlayerPosition(index) {
  board[index] = currentPlayer;
}

function showMove(cell, index) {
  cell.textContent = board[index];
}

function playTurn(cell, index) {
  updatePlayerPosition(index);
  showMove(cell, index);
}

function showStatusMessage(message) {
  statusText.textContent = message;
}

function switchPlayer() {
  if (currentPlayer === "X") {
    currentPlayer = "O";
  } else {
    currentPlayer = "X";
  }
  showStatusMessage(`It's ${currentPlayer}'s turn`);
}

function endGame(message) {
  gameIsActive = false;
  showStatusMessage(message);
}

function checkGameResult() {
  if (checkWin()) {
    endGame(`Player ${currentPlayer} wins!`);
  } else if (checkDraw()) {
    endGame("It's a draw!");
  } else {
    switchPlayer();
  }
}

function isMoveAllowed(index) {
  return board[index] === "" && gameIsActive;
}

function onCellClick(event) {
  const index = parseInt(event.target.getAttribute("data-index"));
  if (!isMoveAllowed(index) || currentPlayer !== "X") return; // Only let human play X
  playTurn(event.target, index);
  checkGameResult();
  // Computer's turn if the game is still active and now O's turn
  if (gameIsActive && currentPlayer === "O") {
    setTimeout(computerMove, 500); // Add a small delay for realism
  }
}

function computerMove() {
  // Only play if O's turn and game is active
  if (!gameIsActive || currentPlayer !== "O") return;
  // Collect all empty cells
  let emptyIndices = board.map((cell, idx) => cell === "" ? idx : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;
  let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[move] = currentPlayer;
  // Update cell visually
  cells[move].textContent = currentPlayer;
  checkGameResult();
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameIsActive = true;
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  showStatusMessage(`It's ${currentPlayer}'s turn`);
}

function setupEventListeners() {
  cells.forEach((cell) => {
    cell.removeEventListener("click", onCellClick); // Avoid duplicate listeners
    cell.addEventListener("click", onCellClick);
  });
  resetButton.removeEventListener("click", resetGame);
  resetButton.addEventListener("click", resetGame);
}

function startGame() {
  setupEventListeners();
  showStatusMessage(`It's ${currentPlayer}'s turn`);
}

startGame();
