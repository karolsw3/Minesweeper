export default class View {
  constructor () {
    this.canvas = document.getElementById('canvas')
    this.context = this.canvas.getContext('2d')
  }
}
