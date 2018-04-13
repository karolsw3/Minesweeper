export default class View {
  constructor () {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
  }

  drawBoard (board) {
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        switch (board[x][y]) {
          
        }
      }
    }
  } 
}
