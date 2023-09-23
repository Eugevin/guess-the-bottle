import './style.css'
import BottleGame from './game.ts'

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('#app canvas') as HTMLCanvasElement

  const bottleGame = new BottleGame(canvas)
  bottleGame.init()
})
