<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dot-wrapper">
      <span v-for="index of dotLength"
            :key="index"
            class="dot"
            :class="{'dot-active': currentPageIndex + 1 === index}"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'

export default {
  name: 'slider',
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data () {
    return {
      currentPageIndex: 0,
      dotLength: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initDotLength()
      this._initBScroll()
      if (this.autoplay) {
        this._play()
      }
    })

    window.addEventListener('resize', this._resizeHandler)
  },
  activated () {
    if (this.autoplay) {
      this._play()
    }
  },
  deactivated () {
    clearInterval(this.timer)
  },
  beforeDestroy () {
    clearInterval(this.timer)
    window.removeEventListener('resize', this._resizeHandler)
  },
  methods: {
    _setSliderWidth (isResize) {
      this.children = Array.from(this.$refs.sliderGroup.children)
      const sliderWidth = this.$refs.slider.clientWidth
      let sliderGroutWidth = sliderWidth * this.children.length
      if (this.loop && !isResize) {
        sliderGroutWidth += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = sliderGroutWidth + 'px'
      this.children.forEach((item) => {
        item.style.width = sliderWidth + 'px'
      })
    },
    _initBScroll () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on('beforeScrollStart', () => {
        clearInterval(this.timer)
      })

      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX
        clearInterval(this.timer)
        if (this.loop) {
          this._play()
        }
      })
    },
    _initDotLength () {
      this.dotLength = this.children.length
    },
    _play () {
      this.timer = setInterval(() => {
        let pageIndex = this.currentPageIndex + 1
        let len = this.children.length
        if (pageIndex >= len) {
          if (this.loop) {
            pageIndex %= this.children.length
          } else {
            pageIndex = this.currentPageIndex
          }
        }
        this.slider.goToPage(pageIndex, 0, 400)
        this.currentPageIndex = pageIndex
      }, this.interval)
    },
    _resizeHandler () {
      if (!this.slider) return
      this._setSliderWidth(true)
      this.slider.refresh()
    }
  }
}
</script>
<style lang="scss">
  @import "~common/style/base";

  .slider {
    position: relative;
    overflow: hidden;
  }

  .slider-group {
    display: flex;
    overflow: hidden;
  }

  .dot-wrapper {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    width: min-content;
  }

  .dot {
    width: 6px;
    height: 6px;
    margin-left: 6px;
    background-color: $baseColorLighterGray;
    border-radius: 50%;
  }

  .dot-active {
    background-color: $baseWhite;
  }
</style>
