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

    this.board[this.mouseX][this.mouseY].revealed = true
    this._drawBoard()
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
