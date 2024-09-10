const X_CLASS = 'x';
const O_Class = 'o';
let o_turn;
let GRID_SIZE = 20; // Default value
const WIN_LENGTH = 5;

let cellElements;
const board = document.getElementById('board');
const winningMessageTextElement = document.querySelector('[data-result-text]');
const resultElement = document.getElementById('result');
const restartButton = document.getElementById('restartButton');
const startGameButton = document.getElementById('startGameButton');
const gridSizeInput = document.getElementById('grid-size');

startGameButton.addEventListener('click', () => {
    GRID_SIZE = parseInt(gridSizeInput.value); // Get the grid size from input
    startGame();
});

restartButton.addEventListener('click', startGame);

function generateBoard() {
    board.style.gridTemplateColumns = `repeat(${GRID_SIZE}, auto)`;

    // Clear any existing cells
    board.innerHTML = '';

    // Generate the grid cells based on the GRID_SIZE
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-cell', '');
        board.appendChild(cell);
    }

    // Update the cellElements to include the newly created cells
    cellElements = document.querySelectorAll('[data-cell]');
}

function startGame() {
    generateBoard();
    o_turn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_Class);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    resultElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = o_turn ? O_Class : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchTurns();
        setBoardHoverClass();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function switchTurns() {
    o_turn = !o_turn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_Class);
    if (o_turn) board.classList.add(O_Class);
    else board.classList.add(X_CLASS);
}

function checkWin(currentClass) {
    return checkRows(currentClass) || checkCols(currentClass) || checkDiagonals(currentClass);
}

function checkRows(currentClass) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col <= GRID_SIZE - WIN_LENGTH; col++) {
            let consecutiveMarks = 0;
            for (let i = 0; i < WIN_LENGTH; i++) {
                if (cellElements[(row * GRID_SIZE) + (col + i)].classList.contains(currentClass)) {
                    consecutiveMarks++;
                } else {
                    break;
                }
            }
            if (consecutiveMarks === WIN_LENGTH) {
                return true;
            }
        }
    }
    return false;
}

function checkCols(currentClass) {
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row <= GRID_SIZE - WIN_LENGTH; row++) {
            if (checkConsecutive(row, col, 1, 0, currentClass)) {
                return true;
            }
        }
    }
    return false;
}

function checkDiagonals(currentClass) {
    // Top-left to bottom-right
    for (let row = 0; row <= GRID_SIZE - WIN_LENGTH; row++) {
        for (let col = 0; col <= GRID_SIZE - WIN_LENGTH; col++) {
            if (checkConsecutive(row, col, 1, 1, currentClass)) {
                return true;
            }
        }
    }

    // Top-right to bottom-left
    for (let row = 0; row <= GRID_SIZE - WIN_LENGTH; row++) {
        for (let col = WIN_LENGTH - 1; col < GRID_SIZE; col++) {
            if (checkConsecutive(row, col, 1, -1, currentClass)) {
                return true;
            }
        }
    }

    return false;
}

function checkConsecutive(startRow, startCol, rowIncrement, colIncrement, currentClass) {
    for (let i = 0; i < WIN_LENGTH; i++) {
        const index = (startRow + i) * GRID_SIZE + (startCol + i * colIncrement);
        if (!cellElements[index].classList.contains(currentClass)) {
            return false;
        }
    }
    return true;
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_Class);
    });
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = `It's a draw!`;
    } else {
        winningMessageTextElement.innerText = `${o_turn ? "O's" : "X's"} Wins!`;
    }
    resultElement.classList.add('show');
}