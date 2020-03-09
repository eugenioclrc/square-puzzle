import Phaser from 'phaser'

let player

const map = `
1111111
1111111
1109018
1100011
1100011
`.trim().split('\n').map(e => e.trim().split('').map(e => parseInt(e, 10)))

const validMoves = map.map(r => r.map(e => e === 1))
console.log(validMoves)
const players = []
const gridSize = 30
window.players = players
function calculateMoves (player) {
  player.validMoves = {
    left: (validMoves[player.y] && validMoves[player.y][player.x - 1]) || false,
    right: (validMoves[player.y] && validMoves[player.y][player.x + 1]) || false,
    up: (validMoves[player.y - 1] && validMoves[player.y - 1][player.x]) || false,
    down: (validMoves[player.y + 1] && validMoves[player.y + 1][player.x]) || false
  }
}

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' })
  }

  eat (j, i) {
    validMoves[i][j] = false
    window.group.add(this.add.rectangle(gridSize * j, gridSize * i, gridSize, gridSize, 0xff0000).setOrigin(0.5))
  }

  create () {
    this.animationsEnd = true
    window.group = this.add.container()
    // window.group.setOrigin(0.5, 0.5)
    // window.group.setX(100)
    let r

    for (let i = 0; i < map.length; i += 1) {
      console.log(i)
      for (let j = 0; j < map[0].length; j += 1) {
        if (map[i][j] > 0) {
          r = this.add.rectangle(gridSize * j, gridSize * i, gridSize, gridSize, 0x6666ff).setOrigin(0.5)
          // r.setStrokeStyle(1, 0xffff00, 0.5)
          window.group.add(r)
        }
        if (map[i][j] === 2 || map[i][j] > 5) {
          // pintado
          this.eat(j, i)
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

    window.group.setX(parseInt((411 - ((map[0].length - 1) * gridSize)) / 2))
    window.group.setY((731 - ((map.length - 1) * gridSize)) / 2)

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
    players.forEach(p => {
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
      this.eat(p.x, p.y)
      if (['up', 'down'].includes(direction)) {
        y = p.player.y + (mul[direction] * gridSize)
        p.y = p.y + mul[direction]
      } else {
        x = p.player.x + (mul[direction] * gridSize)
        p.x = p.x + mul[direction]
      }

      this.tweens.add({
        targets: p.player,
        x,
        y,
        onComplete,
        duration: 300,
        ease: 'Power2'
      })
      calculateMoves(p)
      console.log(p.validMoves)
      console.log(validMoves)
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
  }
}
