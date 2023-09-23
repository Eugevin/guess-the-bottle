interface BottleBoxParams {
  x: number
  y: number
}

type BottleGameState = 'initial' | 'menu-initial' | 'menu-showing' | 'menu-hiding' | 'game-initial' | 'game-active' | 'game-stopped' | 'ended'
