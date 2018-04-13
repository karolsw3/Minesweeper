import Options from './Options.js'
import Cell from './Cell.js'
import View from './View.js'

export default class Game {
  constructor () {
    this.options = new Options()
    this.view = new View(this.options.board)
    this.board = this._createMatrix(this.options.board.sizeX, this.options.board.sizeY)
    this.score = 0
  }

  init () {
    this.score = 0
    this._placeBombs(10)
    this.board[3][3].isBomb = false
    this._drawBoard()
  }

  _placeBombs (percentage) {
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        if (Math.random() >= 0.5) {
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
