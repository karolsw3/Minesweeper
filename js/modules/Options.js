/**
 * Contains information about default game variables
 */
export default class Options {
  constructor () {
    this.board = {
      sizeX: 40,
      sizeY: 25,
      tileWidth: 11
    }
    this.theme = {
      background: 'black',
      tile: '#333',
      border: false
    }
  }
}
