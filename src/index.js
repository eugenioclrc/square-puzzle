import Phaser from 'phaser'
import { Boot, Game } from 'scenes'

import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js'

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  parent: 'phaser-example',
  width: 375 * 4,
  height: 667 * 4,
  scene: [
    Boot,
    Game
  ],
  plugins: {
    scene: [{
      key: 'rexGestures',
      plugin: GesturesPlugin,
      mapping: 'rexGestures'
    }]
  }
}

const game = new Phaser.Game(config) // eslint-disable-line no-unused-vars
