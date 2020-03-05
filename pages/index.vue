<template>
  <div class="layout">
    <div class="container">
      <div>
        # 1
      </div>
      <div class="game" :class="{'press-Left': ArrowLeft, 'press-Down': ArrowDown, 'press-Right': ArrowRight, 'press-Up': ArrowUp}">
        <div v-for="row in mapClass" :key="JSON.stringify(row)" class="row-square">
          <div v-for="(el, i) in row" :key="[el, i].join('-')" class="square" :class="el" />
        </div>
      </div>
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
      const style = ['empty', '', 'player1']
      return this.map.map((row) => {
        return row.map(e => style[e])
      })
    }
  },
  mounted () {
    const valid = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp']
    document.body.onkeyup = (e) => {
      if (valid.includes(e.key)) {
        this[e.key] = false
      }
    }
    document.body.onkeydown = (e) => {
      if (valid.includes(e.key)) {
        this[e.key] = true
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
.square.player1::after {
  content: '○';
  color: #fff;
  font-size: 35px;
  transition: all 150ms ease-out;
}

.press-Left .square.player1::after {
  padding-right: 25px;
}
.press-Down .square.player1::after {
  padding-top: 25px;
}
.press-Right .square.player1::after {
  padding-left: 25px;
}
.press-Up .square.player1::after {
  padding-bottom: 25px;
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
