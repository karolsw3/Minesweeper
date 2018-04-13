import Options from './modules/Options.js'
import Cell from './modules/Cell.js'
import View from './modules/View.js'

export default class Game {
  constructor () {
    this.options = new Options()
    this.view = new View()
    this.board = this._createMatrix(this.options.board.sizeX, this.options.board.sizeY)
    this.score = 0
  }

  init () {
    this.score = 0
    this._placeBombs(20)
  }

  _placeBombs (percentage) {
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length; y++) {
        if (Math.round(Math.random() * 100) < percentage) {
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
    let matrix = Array(...Array(width)).map(() => Array(height).fill(new Cell()))
    return matrix
  }
}
