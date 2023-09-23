import randomInt from './helpers/randomInt'

/*

  TODO:

  - Need to enforce code style
  - Need to enforce random move function
  - Need to add difficulty/speed levels UI/Tech
  - And more... more... MORE OTHER IMPROVMENTS!!! 😊😊😊😊

*/

const bottleImg = new Image()
bottleImg.src = '/assets/bottle.svg'

class BottleBox {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #size: number
  #x: number
  #y: number
  #vx: number
  #vy: number
  #opacity: number
  isTrue: boolean

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, i: number, isTrue: boolean = false) {
    this.#canvas = canvas
    this.#ctx = ctx

    this.#size = this.#canvas.width / 20

    this.#x = i * this.#size + i * 20 + this.#canvas.width / 2 - this.#size * 1.5
    this.#y = this.#canvas.height / 2 - this.#size / 2

    this.#vx = Math.round(Math.random()) === 0 ? -randomInt(20, 30) : randomInt(20, 30)
    this.#vy = Math.round(Math.random()) === 0 ? -randomInt(20, 30) : randomInt(20, 30)

    this.#opacity = 0

    this.isTrue = isTrue
  }

  drawBottle (): void {
    this.#ctx.drawImage(bottleImg, this.#x + this.#size / 4, this.#y + this.#size / 4, this.#size / 2, this.#size / 2)
  }

  draw (): void {
    if (this.isTrue) this.drawBottle()

    this.#ctx.fillStyle = `hsla(222, 50%, 20%, ${this.#opacity})`
    this.#ctx.fillRect(this.#x, this.#y, this.#size, this.#size)
  }

  move (): void {
    this.#x += this.#vx

    if (this.#x + this.#size > this.#canvas.width || this.#x < 0) {
      this.#vx *= -1
    }

    this.#y += this.#vy

    if (this.#y + this.#size > this.#canvas.height || this.#y < 0) {
      this.#vy *= -1
    }
  }

  hideHalf (): boolean {
    if (this.#opacity > 0.5) {
      this.#opacity -= 0.01
    }

    return this.#opacity < 0.5
  }

  show (): boolean {
    if (this.#opacity < 1) {
      this.#opacity += 0.01
    }

    return this.#opacity > 1
  }
}

class BottleMenu {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #opacity: number

  constructor (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.#canvas = canvas
    this.#ctx = ctx

    this.#opacity = 0
  }

  drawText (): void {
    this.#ctx.font = 'bold 48px Helvetica, sans-serif'
    this.#ctx.fillStyle = `hsla(222, 50%, 100%, ${this.#opacity})`
    this.#ctx.fillText('Click to Start', this.#canvas.width / 2 - 150, this.#canvas.height / 2)
  }

  drawBg (): void {
    this.#ctx.fillStyle = `hsla(222, 50%, 15%, ${this.#opacity})`
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  draw (): void {
    this.drawBg()
    this.drawText()
  }

  hide (): boolean {
    if (this.#opacity > 0) {
      this.#opacity -= 0.01
    }

    return this.#opacity < 0
  }

  show (): boolean {
    if (this.#opacity < 1) {
      this.#opacity += 0.01
    }

    return this.#opacity > 1
  }
}

class BottleGame {
  #canvas: HTMLCanvasElement
  #ctx: CanvasRenderingContext2D
  #bottleBoxes: BottleBox[]
  #bottleMenu: BottleMenu
  #state: BottleGameState
  #stateBlocked: boolean
  #animationFrame: any

  constructor (canvas: HTMLCanvasElement) {
    this.#canvas = canvas
    this.#ctx = this.#canvas.getContext('2d') as CanvasRenderingContext2D

    this.#bottleBoxes = []
    this.#bottleMenu = new BottleMenu(this.#canvas, this.#ctx)

    this.#state = 'initial'
    this.#stateBlocked = false

    this.#animationFrame = null
  }

  init (): void {
    this.handleEvents()

    const randomTrueBottleBox = Math.round(Math.random() * 2)

    for (let i = 0; i < 3; i++) {
      this.#bottleBoxes.push(new BottleBox(this.#canvas, this.#ctx, i, randomTrueBottleBox === i))
    }

    this.drawLoop()
  }

  stop (): void {
    cancelAnimationFrame(this.#animationFrame)
  }

  drawBg (): void {
    this.#ctx.fillStyle = 'hsl(222, 50%, 5%)'
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
  }

  drawLoop (): void {
    this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

    this.drawBg()

    this.handleState()

    this.#animationFrame = requestAnimationFrame(this.drawLoop.bind(this))
  }

  handleState (): void {
    if (this.#state === 'initial') {
      this.changeState('menu-initial')
    }

    if (this.#state === 'menu-initial') {
      this.changeState('menu-showing')
    }

    if (this.#state === 'menu-showing') {
      this.#bottleMenu.draw()
      this.#bottleMenu.show()
    }

    if (this.#state === 'menu-hiding') {
      this.#bottleMenu.draw()

      if (this.#bottleMenu.hide()) {
        this.changeState('game-initial')
      }
    }

    if (this.#state === 'game-initial') {
      this.#bottleBoxes.forEach(bottleBox => {
        bottleBox.draw()

        if (bottleBox.show()) {
          this.changeState('game-active', 1)
        }
      })
    }

    if (this.#state === 'game-active') {
      this.#bottleBoxes.forEach(bottleBox => {
        bottleBox.draw()
        bottleBox.move()
      })

      this.changeState('game-stopped', 10)
    }

    if (this.#state === 'game-stopped') {
      this.#bottleBoxes.forEach(bottleBox => {
        bottleBox.draw()
      })
    }

    if (this.#state === 'ended') {
      this.#bottleBoxes.forEach(bottleBox => {
        bottleBox.draw()
        bottleBox.hideHalf()
      })

      setTimeout(() => {
        location.reload()
      }, 3000)
    }
  }

  changeState (state: BottleGameState, delay: number = 0): void {
    if (this.#stateBlocked) return

    console.log(`State changing: ${state}`)

    this.#stateBlocked = true

    setTimeout(() => {
      this.#state = state

      this.#stateBlocked = false
    }, delay * 1000)
  }

  handleEvents (): void {
    this.#canvas.width = window.innerWidth
    this.#canvas.height = window.innerHeight

    window.addEventListener('resize', () => {
      this.#canvas.width = window.innerWidth
      this.#canvas.height = window.innerHeight
    })

    window.addEventListener('click', () => {
      if (this.#state === 'menu-showing') {
        this.changeState('menu-hiding')
      }

      if (this.#state === 'game-stopped') {
        this.changeState('ended')
      }
    })
  }
}

export default BottleGame
