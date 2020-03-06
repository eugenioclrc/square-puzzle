<template>
  <div class="layout">
    <div class="container">
      <div>
        # 1
      </div>
      <div class="game" :class="{'pressLeft': ArrowLeft, 'pressDown': ArrowDown, 'pressRight': ArrowRight, 'pressUp': ArrowUp}">
        <div
          v-for="(row, j) in map"
          :key="JSON.stringify([j, row])"
          class="row-square"
        >
          <div v-for="(el, i) in row" :key="[el, i].join('-')" class="square" :class="['empty', 'painted', 'player1'][el]" />
        </div>
      </div>
      <pre>
        {{ validMoves }}
      </pre>
      <div>
        &#x21bb;
      </div>
    </div>
  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  data () {
    return {
      map: [
        [0, 0],
        [2, 0]
      ],
      ArrowLeft: false,
      ArrowDown: false,
      ArrowRight: false,
      ArrowUp: false
    }
  },
  computed: {
    mapClass () {
      const style = ['empty', 'painted', 'player1']
      return this.map.map((row) => {
        return row.map(e => style[e])
      })
    },
    validMoves () {
      const h = this.map.length
      const w = this.map[0].length
      let hPos = 0
      let wPos = 0
      for (hPos = 0; hPos < h; hPos += 1) {
        wPos = this.map[hPos].indexOf(2)
        if (wPos > -1) {
          break
        }
      }
      return {
        up: hPos > 0 || (this.map[hPos - 1] && this.map[hPos - 1][wPos] === 0),
        down: hPos < h - 1 || (this.map[hPos + 1] && this.map[hPos + 1][wPos] === 0),
        left: wPos > 0 || this.map[hPos][wPos - 1] === 0,
        right: wPos < w - 1 || this.map[hPos][wPos + 1] === 0,
        wPos,
        hPos
      }
    }
  },
  watch: {
    ArrowLeft () {
      if (this.validMoves.left && !this.ArrowRight && !this.ArrowUp && !this.ArrowDown && !this.ArrowLeft) {
        const { wPos, hPos } = this.validMoves
        this.map[hPos][wPos - 1] = this.map[hPos][wPos]
        this.map[hPos][wPos] = 1
      }
    },
    ArrowDown () {
      if (this.validMoves.down && !this.ArrowRight && !this.ArrowUp && !this.ArrowDown && !this.ArrowLeft) {
        const { wPos, hPos } = this.validMoves
        this.map[hPos + 1][wPos] = this.map[hPos][wPos]
        this.map[hPos][wPos] = 1
      }
    },
    ArrowRight () {
      if (this.validMoves.right && !this.ArrowRight && !this.ArrowUp && !this.ArrowDown && !this.ArrowLeft) {
        const { wPos, hPos } = this.validMoves
        this.map[hPos][wPos + 1] = this.map[hPos][wPos]
        this.map[hPos][wPos] = 1
      }
    },
    ArrowUp () {
      if (this.validMoves.up && !this.ArrowRight && !this.ArrowUp && !this.ArrowDown && !this.ArrowLeft) {
        const { wPos, hPos } = this.validMoves
        // debugger
        this.map[hPos - 1][wPos] = this.map[hPos][wPos]
        this.map[hPos][wPos] = 1
        console.log('move up', this.mapClass)
      }
    }
  },
  // :class="{ vUp: validMoves.up, vDown: validMoves.down, vLeft: validMoves.left, vRight: validMoves.right }"
  mounted () {
    const valid = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp']
    document.body.onkeyup = (e) => {
      if (valid.includes(e.key)) {
        this.$nextTick(() => {
          this[e.key] = false
        })
      }
    }
    document.body.onkeydown = (e) => {
      if (valid.includes(e.key)) {
        this.$nextTick(() => {
          this[e.key] = true
        })
      }
    }
  }
}
</script>

<style scoped>
.row-square {
  display: flex;
  flex-direction: row;
}
.square.player1 {
  background: red;
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
}

.square.painted {
  background: pink;
}

.square.player1::after {
  content: '○';
  color: #fff;
  font-size: 35px;
  transition: all 150ms ease-out;
}

.pressLeft .square.player1::after {
  padding-right: 25px;
}
.pressDown .square.player1::after {
  padding-top: 25px;
}
.pressRight .square.player1::after {
  padding-left: 25px;
}
.pressUp .square.player1::after {
  padding-bottom: 25px;
}

.pressUp .vUp .square {
  box-shadow: 30px 0px 8px -1px rgba(0,0,0,0.75);
}

.square {
  width: 50px;
  height: 50px;
  background: gray;
}
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.container {
  max-width: 411px;
  max-height: 823px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  flex: 1;
  margin: auto;
}

.item--top {
  align-self: flex-start;
}

.item--bottom {
  align-self: flex-end;
}

</style>
