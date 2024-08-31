const X_CLASS = 'x'
const O_Class = 'o'
let o_turn
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
]

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageTextElement = document.querySelector('[data-result-text]')
const resultElement = document.getElementById('result')
const restartButton = document.getElementById('restartButton')

startGame()

function startGame(){
    o_turn = false
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS)
        cell.classList.remove(O_Class)
        cell.removeEventListener('click', handleClick)
        cell.addEventListener('click', handleClick, {once: true})
    })
    setBoardHoverClass()
    resultElement.classList.remove('show')

}

function handleClick(e){
    const cell = e.target
    const currentClass = o_turn ? O_Class : X_CLASS
    placeMark(cell, currentClass)
    if(checkWin(currentClass)){
        endGame(false)
    } else if(isDraw()){
        endGame(true)
    } else {
        switchTurns()
        setBoardHoverClass()
    }
}

function placeMark(cell, currentClass){
    cell.classList.add(currentClass)
}

function switchTurns(){
    o_turn = !o_turn
}

function setBoardHoverClass(){
    board.classList.remove(X_CLASS)
    board.classList.remove(O_Class)
    if(o_turn) board.classList.add(O_Class)
    else board.classList.add(X_CLASS)
}

function checkWin(currentClass){
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass)
        })
    })
}

function isDraw(){
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_Class)
    })
}

function endGame(draw){
    if(draw){
            winningMessageTextElement.innerText = `It's a draw!`
    } else {
            winningMessageTextElement.innerText = `${o_turn ? "O's" : "X's"} Wins!`
    }
    resultElement.classList.add('show')
}

restartButton.addEventListener('click', startGame)