import Options from './Options.js'
import Cell from './Cell.js'
import View from './View.js'

export default class Game {
  constructor () {
    this.options = new Options()
    this.view = new View(this.options)
    this.board = this._createMatrix(this.options.sizeX, this.options.sizeY)
    this.score = 0
    this.mouseX = 0
    this.mouseY = 0
    this.bombs = 0
    this.revealedTiles = 0
    this.isGameOver = false
    this.isGameWon = false

    this._mouseClicked = this._mouseClicked.bind(this)
    this._mouseDoubleClicked = this._mouseDoubleClicked.bind(this)
  }

  // Initialize the game
  init () {
    this._reset()
    // Events
    this.view.canvas.addEventListener('mousedown', e => this._mouseClicked(e), false)
    this.view.canvas.addEventListener('dblclick', e => this._mouseDoubleClicked(e), false)
    this.view.canvas.oncontextmenu = (e) => {
      e.preventDefault()
    }
    this.view.buttonNewGame.onclick = () => {
      this.view.optionsPanel.style.display = 'none'
      this.options.sizeX = parseInt(document.getElementById('input__sizeX').value)
      this.options.sizeY = parseInt(document.getElementById('input__sizeY').value)
      this.options.bombPercentage = parseInt(document.getElementById('input__bombPercentage').value)
      this.view.resetTimer()
      this.view.startTimer()
      this._reset()
    }

    this.view.buttonHideResult.onclick = () => {
      this.view.resultPanel.style.display = 'none'
      this.view.optionsPanel.style.display = 'block'
    }
  }

  // Set all default variables to their default values
  _reset () {
    this.isGameOver = false
    this.board = this._createMatrix(this.options.sizeX, this.options.sizeY)
    this.view = new View(this.options)
    this.score = 0
    this.isGameWon = false
    this.revealedTiles = 0
    this.view.resizeCanvas()
    this._placeBombs(this.options.bombPercentage)
    this._drawBoard()
  }

  _mouseClicked (e) {
    this.mouseX = Math.floor((e.x - this.view.canvas.offsetLeft) / this.view.tileWidth)
    this.mouseY = Math.floor((e.y - this.view.canvas.offsetTop + window.pageYOffset) / this.view.tileWidth)

    let clickedCell = this.board[this.mouseX][this.mouseY]
    if (e.which === 1 && !this.isGameOver) { // Left button clicked
      // Make sure that player will not be given a bomb on a very start of the game
      if (this.revealedTiles === 0) {
        clickedCell.isBomb = false
      }

      clickedCell.revealed = true
      this.revealedTiles++
      if (!clickedCell.isBomb) {
        this._revealNeighbours(this.mouseX, this.mouseY)
        this.score += 8
        if (this._checkIfGameWon()) {
          this.isGameWon = true
          this.isGameOver = true
          this._onGameOver()
        }
      } else {
        this.isGameOver = true
        this._onGameOver()
      }
    } else if (e.which === 3 && !this.isGameOver) { // Right button clicked
      clickedCell.flagged = !clickedCell.flagged
    }
    this._drawBoard()
  }

  _mouseDoubleClicked (e) {
    this.mouseX = Math.floor((e.x - this.view.canvas.offsetLeft) / this.view.tileWidth)
    this.mouseY = Math.floor((e.y - this.view.canvas.offsetTop + window.pageYOffset) / this.view.tileWidth)

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        try {
          let cell = this.board[this.mouseX + x][this.mouseY + y]
          if (!cell.flagged) {
            cell.revealed = true
            if (cell.isBomb) {
              this.isGameOver = true
              this._onGameOver()
            }
          }
        } catch (err) {}
      }
    }
    this._drawBoard()
  }

  _revealNeighbours (x, y) {
    this.board[x][y].counter = 0

    // For first check how many bombs are neighbouring the cell
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        try {
          let neighbour = this.board[x + i][y + j]
          if (neighbour.isBomb) {
            this.board[x][y].counter++
          }
        } catch (e) {}
      }
    }
    // Then if there are no bombs near the cell = reveal it
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        try {
          let neighbour = this.board[x + i][y + j]
          // Avoid corners
          if (!((i === -1 && j === -1) || (i === 1 && j === 1) || (i === -1 && j === 1) || (i === 1 && j === -1))) {
            if (!neighbour.isBomb && !neighbour.revealed && this.board[x][y].counter === 0) {
              neighbour.revealed = true
              this.revealedTiles++
              this._revealNeighbours(x + i, y + j)
            }
          }
        } catch (e) {}
      }
    }
  }

  _placeBombs (bombPercentage) {
    this.bombs = 0
    if (bombPercentage > 100 || bombPercentage < 0) {
      bombPercentage = 40
    }
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        if (Math.random() <= (bombPercentage / 100)) {
          this.board[x][y].isBomb = true
          this.bombs++
        }
      }
    }
  }

  _checkIfGameWon () {
    return this.bombs === (this.options.sizeX * this.options.sizeY - this.revealedTiles)
  }

  _drawBoard () {
    this.view.drawBoard(this.board)
  }

  _onGameOver () {
    this.view.stopTimer()
    this.view.resultPanel.style.display = 'block'
    if (this.isGameWon) {
      document.getElementById('output__result').innerText = 'You won! 😀 Score: ' + this.score
    } else {
      document.getElementById('output__result').innerText = 'You lost! 😰 Score: ' + this.score
    }
  }

  // Create matrix with specified width and height and fill it with new Cells
  _createMatrix (width, height) {
    let matrix = []
    for (let x = 0; x < width; x++) {
      matrix[x] = []
      for (let y = 0; y < height; y++) {
        matrix[x][y] = new Cell()
      }
    }
    return matrix
  }
}
