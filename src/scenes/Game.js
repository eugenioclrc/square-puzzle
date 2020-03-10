import Phaser from 'phaser'

let player

const map = `
1111111
1111111
1109018
1100011
1100011
`.trim().split('\n').map(e => e.trim().split('').map(e => parseInt(e, 10)))

const mapTiles = map.map(r => r.map(e => {
  return e === 0 ? -1 : 0
}))

const validMoves = map.map(r => r.map(e => e === 1))
console.log(validMoves)
const players = []
const gridSize = 128
window.players = players
function calculateMoves (player) {
  player.validMoves = {
    left: (validMoves[player.y] && validMoves[player.y][player.x - 1]) || false,
    right: (validMoves[player.y] && validMoves[player.y][player.x + 1]) || false,
    up: (validMoves[player.y - 1] && validMoves[player.y - 1][player.x]) || false,
    down: (validMoves[player.y + 1] && validMoves[player.y + 1][player.x]) || false
  }
  players.forEach(p => {
    player.validMoves.left = player.validMoves.left && (!(p.x === (player.x - 1) && p.y === player.y))
    player.validMoves.right = player.validMoves.right && (!(p.x === (player.x + 1) && p.y === player.y))
  })
}

const prev = []
export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' })
  }

  eat (j, i, from, pId) {
    let defaultSprite = 0
    if (from === 'left' && (prev[pId] === 'left' || !prev[pId])) {
      defaultSprite = 12
    }
    if (from === 'right' && (prev[pId] === 'right' || !prev[pId])) {
      defaultSprite = 12
    }
    if (from === 'left' && prev[pId] === 'up') {
      defaultSprite = 2
    }
    if (from === 'left' && prev[pId] === 'down') {
      defaultSprite = 14
    }
    if (from === 'right' && prev[pId] === 'down') {
      defaultSprite = 13
      // 9
      // 12
    }
    if (from === 'up' && prev[pId] === 'left') {
      defaultSprite = 13
    }
    if (from === 'up' && prev[pId] === 'right') {
      defaultSprite = 14
    }
    if (from === 'right' && prev[pId] === 'up') {
      defaultSprite = 1
    }
    if (from === 'down' && prev[pId] === 'left') {
      defaultSprite = 1
    }
    if (from === 'down' && prev[pId] === 'right') {
      defaultSprite = 2
    }
    validMoves[i][j] = false
    mapTiles[i][j] = defaultSprite
    window.group.add(this.add.sprite(gridSize * j, gridSize * i, 'roadTextures', defaultSprite).setOrigin(0.5))
    prev[pId] = from
  }

  create () {
    this.swipeInput = this.rexGestures.add.swipe({
      dir: '4dir',
      velocityThreshold: 1000
    })

    this.scale.lockOrientation('portrait')
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor('#67caf5')
    this.animationsEnd = true
    window.group = this.add.container()
    // window.group.setOrigin(0.5, 0.5)
    // window.group.setX(100)
    let r

    for (let i = 0; i < map.length; i += 1) {
      console.log(i)
      for (let j = 0; j < map[0].length; j += 1) {
        if (map[i][j] > 0) {
          // r = this.add.rectangle(gridSize * j, gridSize * i, gridSize, gridSize, 0x6666ff).setOrigin(0.5)
          r = this.add.sprite(gridSize * j, gridSize * i, 'roadTextures', 24).setOrigin(0.5)
          // r.setScale(0.5, 0.5)
          // r.setStrokeStyle(1, 0xffff00, 0.5)
          window.group.add(r)
        }
        if (map[i][j] === 2 || map[i][j] > 5) {
          // pintado
          // this.eat(j, i)
        }
        if (map[i][j] > 5) {
          player = this.add.container()
          window.p = player

          window.rect = this.add.rectangle(gridSize * j, gridSize * i, gridSize, gridSize, 0xff0000).setOrigin(0.5)
          player.add(window.rect)
          window.circle = this.add.circle(gridSize * j, gridSize * i, gridSize * 0.2, 0xffff00).setOrigin(0.5)
          player.add(window.circle)
          window.group.add(player)
          players.push({ player, x: j, y: i })
        }
      }
    }
    players.forEach(p => {
      window.group.bringToTop(p.player)
      calculateMoves(p)
    })

    window.group.setX(parseInt(((375 * 4) - ((map[0].length - 1) * gridSize)) / 2))
    window.group.setY(((667 * 4) - ((map.length - 1) * gridSize)) / 2)

    /*
    // window.group.add(this.add.rectangle(0, 0, 0, 40, 0x6666ff).setOrigin(0))
    // window.group.add(this.add.rectangle(0, 0, 40, 40, 0x6666ff).setOrigin(0))

    window.g = this.add.grid(screen.width / 2, screen.height / 2, gridWidth * gridSize, gridHeight * gridSize, gridSize, gridSize, 0x999999, 1, 0x666666).setOrigin(0.5, 0.5)

    this.logo = new Logo(this, 400, 150)
    this.tweens.add({
      targets: this.logo,
      y: 450,
      duration: 2000,
      ease: 'Power2',
      yoyo: true,
      loop: -1
    })

    this.mushroom = new Mushroom(this, 0, 0)
    Phaser.Display.Align.In.Center(this.mushroom, this.add.zone(400, 300, 800, 600))
    */
  }

  move (direction) {
    const onComplete = () => {
      this.animationsEnd = true
    }

    players.forEach((p, pId) => {
      if (!p.validMoves[direction]) {
        return
      }
      this.animationsEnd = false
      let x = p.player.x
      let y = p.player.y

      const mul = {
        up: -1,
        down: +1,
        left: -1,
        right: +1
      }
      this.eat(p.x, p.y, direction, pId)
      if (['up', 'down'].includes(direction)) {
        y = p.player.y + (mul[direction] * gridSize)
        p.y = p.y + mul[direction]
      } else {
        x = p.player.x + (mul[direction] * gridSize)
        p.x = p.x + mul[direction]
      }
      window.group.bringToTop(p.player)

      this.tweens.add({
        targets: p.player,
        x,
        y,
        onComplete,
        duration: 300,
        ease: 'Power2'
      })
    })

    // despues de mover a los jugadores
    players.forEach((p, pId) => {
      calculateMoves(p)
      if (Object.values(p.validMoves).filter(e => e).length === 0) {
        if (p.killed) {
          return
        }
        this.eat(p.x, p.y, direction, pId)
        window.group.bringToTop(p.player)
        this.tweens.add({
          targets: p.player,
          alpha: 0.4,
          duration: 300,
          ease: 'Power2'
        })
        p.killed = true
      }
    })
  }

  update () {
    if (!this.animationsEnd) {
      return
    }

    // this.mushroom.update()
    const cursors = this.input.keyboard.createCursorKeys()
    if (cursors.up.isDown) {
      this.move('up')
    } else if (cursors.down.isDown) {
      this.move('down')
    } else if (cursors.right.isDown) {
      this.move('right')
    } else if (cursors.left.isDown) {
      this.move('left')
    } else {
      // reset anims
    }

    if (this.swipeInput.isSwiped) {
      const directions = ['left', 'right', 'up', 'down']
      let dir
      for (let i = 0, cnt = directions.length; i < cnt; i++) {
        dir = directions[i]
        if (this.swipeInput[dir]) {
          this.move(dir)
        }
      }
    }
  }
}
