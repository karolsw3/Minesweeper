/**
 * Contains information about default game variables
 */
export default class Options {
  constructor () {
    this.board = {
      sizeX: 40,
      sizeY: 40,
      tileWidth: 10
    }
    this.theme = {
      background: 'black',
      tile: '#333',
      border: false
    }
  }
}
