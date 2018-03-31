<template>
  <div class="progress-bar"
       ref="barWrap"
       @touchstart.prevent="touchBtnStart($event)"
       @touchend.prevent="touchBtnEnd($event)">
    <div class="progress-bar-inner"
         ref="bar"></div>
    <div class="progress-btn"
         ref="barBtn"
         @touchstart.prevent.stop="touchBtnStart($event)"
         @touchmove.prevent.stop="touchBtnMove($event)"
         @touchend.prevent.stop="touchBtnEnd($event)"
         ></div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'progressBar',
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      touchPercent: 0
    }
  },
  computed: {
    ...mapGetters([
      'playing'
    ])
  },
  watch: {
    percent (newVal) {
      if (this.isTouching) return
      if (this.barWrapWidth) {
        this._initialBarFigure()
      }
      const width = this.barWrapWidth * newVal
      this.$refs.bar.style.width = `${width}px`
      this.$refs.barBtn.style.transform = `translate3d(${width}px,0, 0)`
    }
  },
  created () {
    this.barWrapWidth = 1
    this.x = 0
    this.isTouching = false
  },
  mounted () {
    window.addEventListener('resize', this._initialBarFigure)
  },
  destroyed () {
    window.removeEventListener('resize', this._initialBarFigure)
  },
  methods: {
    touchBtnStart (e) {
      this.isTouching = true
      this._setPos(e.touches[0].clientX)
    },
    touchBtnMove (e) {
      this._setPos(e.touches[0].clientX)
    },
    touchBtnEnd (e) {
      this.isTouching = false
      this.$emit('change-time', this.touchPercent)
      if (!this.playing) {
        this.setPlaying(true)
      }
    },
    _setPos (clientX) {
      if (!this.barWrapWidth) {
        this._initialBarFigure()
      }
      let currentX = clientX - this.x
      if (currentX < 0) {
        currentX = 0
      } else if (currentX > this.barWrapWidth) {
        currentX = this.barWrapWidth
      }
      this.touchPercent = ((currentX / this.barWrapWidth) * 100 | 0) / 100
      this.$refs.bar.style.width = `${currentX}px`
      this.$refs.barBtn.style.transform = `translate3d(${currentX}px,0, 0)`
    },
    _initialBarFigure () {
      this.barWrapWidth = this.$refs.barWrap.clientWidth
      this.x = this.$refs.barWrap.getBoundingClientRect().left
    },
    ...mapMutations({
      setPlaying: 'SET_PLAYING_STATE'
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
.progress-bar {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  .progress-bar-inner {
    width: 0;
    height: 100%;
    background-color: $baseColor;
    border-radius: 2.5px;
  }
  .progress-btn {
    position: absolute;
    top: -7.5px;
    left: -10px;
    width: 20px;
    height: 20px;
    background-color: $baseColor;
    border-radius: 50%;
    border: 5px solid #fff;
  }
}
</style>
