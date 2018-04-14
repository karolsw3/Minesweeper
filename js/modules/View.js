export default class View {
  constructor (options) {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
    this.tileWidth = options.tileWidth
  }

  drawBoard (board) {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        if (board[x][y].revealed && board[x][y].isBomb) {
          this._drawRectangle(x, y, '#333')
        } else if (board[x][y].revealed && !board[x][y].isBomb) {
          this._drawRectangle(x, y, 'white')
        } else {
          this._drawRectangle(x, y, '#ddd')
        }
        if (board[x][y].counter > 0) {
          this._drawText(x, y, board[x][y].counter)
        }

        if (board[x][y].flagged && !board[x][y].revealed) {
          this._drawText(x, y, '🚩')
        }
      }
    }
  }

  _drawText (x, y, text) {
    this.context.font = '14px Arial'
    this.context.fillStyle = 'red'
    this.context.textAlign = 'center'
    this.context.fillText(text, x * this.tileWidth + this.tileWidth / 2, y * this.tileWidth + this.tileWidth / 1.3)
  }

  _drawRectangle (x, y, color) {
    this.context.strokeStyle = '#eee'
    this.context.fillStyle = color
    this.context.beginPath()
    this.context.rect(x * this.tileWidth, y * this.tileWidth, this.tileWidth, this.tileWidth)
    this.context.fill()
    this.context.stroke()
  }
}
