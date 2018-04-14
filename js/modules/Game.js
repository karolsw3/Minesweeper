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
    this.isGameOver = false

    // Buttons
    this.buttonNewGame = document.getElementById('button__newGame')

    this._mouseClicked = this._mouseClicked.bind(this)
  }

  // Initialize the game
  init () {
    this._reset()
    // Events
    this.view.canvas.addEventListener('mousedown', e => this._mouseClicked(e), false)
    this.view.canvas.oncontextmenu = (e) => {
      e.preventDefault()
    }
    this.buttonNewGame.onclick = () => {
      this.options.sizeX = parseInt(document.getElementById('input__sizeX').value)
      this.options.sizeY = parseInt(document.getElementById('input__sizeY').value)
      this._reset()
    }
  }

  // Set all default variables to their default values
  _reset () {
    this.isGameOver = false
    this.board = this._createMatrix(this.options.sizeX, this.options.sizeY)
    this.view = new View(this.options)
    this.score = 0
    this.view.resizeCanvas()
    this._placeBombs(10)
    this._drawBoard()
  }

  _mouseClicked (e) {
    this.mouseX = Math.floor((e.x - this.view.canvas.offsetLeft) / this.view.tileWidth)
    this.mouseY = Math.floor((e.y - this.view.canvas.offsetTop + window.pageYOffset) / this.view.tileWidth)

    let clickedCell = this.board[this.mouseX][this.mouseY]
    if (e.which === 1 && !this.isGameOver) { // Left button clicked
      clickedCell.revealed = true
      if (!clickedCell.isBomb) {
        this._revealNeighbours(this.mouseX, this.mouseY)
      } else {
        this.isGameOver = true
      }
    } else if (e.which === 3 && !this.isGameOver) { // Right button clicked
      clickedCell.flagged = !clickedCell.flagged
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
              this._revealNeighbours(x + i, y + j)
            }
          }
        } catch (e) {}
      }
    }
  }

  _placeBombs (chancesOfBomb) {
    if (chancesOfBomb > 100 || chancesOfBomb < 0) {
      chancesOfBomb = 40
    }
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        if (Math.random() <= (chancesOfBomb / 100)) {
          this.board[x][y].isBomb = true
        }
      }
    }
  }

  _drawBoard () {
    this.view.drawBoard(this.board)
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
