/**
 * Variables to be used to play the game
 */

let origBoard;
let huPlayer = 'X';
let comPlayer = 'O';    

/**
 * Array containing arrays to determine winning combinations on the board cells
 */
let winWays = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

let cells = document.getElementsByClassName('cell');

/** Calling function to start the game */
startGame();

/** 
 * Determine function to start the game 
 * Stablish behivor to "replay" button at end of each game
 * Load values from winWays array to origBoard variable
 * The for loop restart the grid to play again
*/
function startGame() {
    document.getElementById('endgame').style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

/** Identify the id of the square when cliked */
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), comPlayer);
    }
}

/** 
 * Insert the player selection to the grid
 * checkWin seeks if a winning combination from the array happened
 * Stablish the end of the game
 */
function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player)
    if (gameWon) gameOver(gameWon)
}
/**
 * the function find places in the board where the user had already played
 * reduce "a"dd "i"ndexes to an empty array to be filled with "e"lements in the board
 * The for loop verify if any value in winComb array matches
 * if the winCombo array matches, gameWon sets combination and player
 */
function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
      (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winWays.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

/**
 * first loop sets color to the winning combination
 * second loop cuts the option to keep cliking cells
 * declares winning statement at end of the game 
 */
function gameOver(gameWon)  {
    for (let index of winWays [gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
        gameWon.player == huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false)
    }
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "AI Wins");
}

function declareWinner(who) {
    document.getElementById("endgame").style.display = "block";
    document.getElementById("text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return emptySquares()[0];
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner(`
        Draw! 
        Play Again!?
        `)
        return true;
    }
   return false;
}