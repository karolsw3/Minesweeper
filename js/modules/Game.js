import Options from './Options.js'
import Cell from './Cell.js'
import View from './View.js'

export default class Game {
  constructor () {
    this.options = new Options()
    this.view = new View(this.options.board)
    this.board = this._createMatrix(this.options.board.sizeX, this.options.board.sizeY)
    this.score = 0
    this.mouseX = 0
    this.mouseY = 0

    this._mouseClicked = this._mouseClicked.bind(this)
  }

  init () {
    this.score = 0
    this._placeBombs(10)
    this._drawBoard()

    // Events
    this.view.canvas.addEventListener('click', e => this._mouseClicked(e))
  }

  _mouseClicked (e) {
    this.mouseX = Math.floor((e.x - this.view.canvas.offsetLeft) / this.options.board.tileWidth)
    this.mouseY = Math.floor((e.y - this.view.canvas.offsetTop + window.pageYOffset) / this.options.board.tileWidth)

    let clickedCell = this.board[this.mouseX][this.mouseY]
    clickedCell.revealed = true
    if (!clickedCell.isBomb) {
      this._revealNeighbours(this.mouseX, this.mouseY)
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
