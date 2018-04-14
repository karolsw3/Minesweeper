/**
 * Contains information about default game variables
 */
export default class Options {
  constructor () {
    this.board = {
      sizeX: 20,
      sizeY: 20
    }
    this.theme = {
      background: 'black',
      tile: '#333',
      border: false
    }
  }
}
