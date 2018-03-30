<template>
  <div class="music-list">
    <div class="back">
      <div class="icon-back"
           @click="back"></div>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image"
         :style="bgStyle"
         ref="bgImage">
      <div class="mask" ref="mask"></div>
    </div>
    <transition name="up">
      <div v-show="showPlayWrap">
        <div v-if="songs.length"
             class="player-btn-wrapper"
             ref="playWrap">
            <i class="player-btn-icon"></i>
            <span class="player-btn-text">点击随机播放歌曲</span>
        </div>
      </div>
    </transition>
    <scroll :data="songs"
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            @scroll="scroll"
            class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   @select="select"></song-list>
      </div>
      <div class="loading-wrapper" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
    <div class="bg-layer"
         ref="bgLayer"></div>
  </div>
</template>

<script>
import Scroll from 'base/scroll'
import SongList from 'base/songlist'
import Loading from 'components/Loading'
import {mapActions} from 'vuex'

const PAD_TOP_HEIGHT = 70

export default {
  name: 'music-list',
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollY: 0,
      probeType: 3,
      listenScroll: true,
      showPlayWrap: true
    }
  },
  watch: {
    scrollY (newVal) {
      let scale = 1
      let blur = 0
      const percent = Math.abs(newVal / this.bgHeight)
      if (newVal >= 0) {
        scale += percent
        this.showPlayWrap = true
      } else {
        blur = Math.min(20 * percent, 20)
        this.showPlayWrap = false
      }
      if (-newVal > this.TOP_SCROLL_MAP) {
        this.$refs.bgImage.style.zIndex = 120
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${PAD_TOP_HEIGHT}px`
      } else {
        this.$refs.bgImage.style.zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = '0'
      }
      this.$refs.bgImage.style.transform = `scale(${scale})`
      this.$refs.mask.style['backdrop-filter'] = `blur(${blur}px)`
      this.$refs.mask.style['webkitBackdrop-filter'] = `blur(${blur}px)`
      this.$refs.bgLayer.style.transform = `translate3d(0,${newVal}px,0)`
    }
  },
  created () {
  },
  mounted () {
    this.bgHeight = this.$refs.bgImage.clientHeight
    this.TOP_SCROLL_MAP = this.bgHeight - PAD_TOP_HEIGHT
    this.$refs.list.$el.style.top = `${this.bgHeight}px`
    this.$refs.bgLayer.style.top = `${this.bgHeight}px`
    this.$refs.list.refresh()
  },
  methods: {
    back () {
      this.$router.go(-1)
      this.$emit('back')
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    select (song, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ])
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/base';
.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 15vw;
  height: 15vw;
  z-index: 130;
}
.icon-back {
   position: absolute;
   right: 0;
   bottom: 0;
   width: 80%;
   height: 80%;
   background: url('~common/img/back.svg') no-repeat;
   background-size: cover;
 }
.title {
  position: absolute;
  top: 0;
  left: 50%;
  margin: 1vh 0 0;
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 0.1em;
  color: rgba(230,230,230,1);
  transform: translateX(-50%);
  text-align: center;
  z-index: 130;
}
.player-btn-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 28vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;
  height: 40px;
  padding: 0 20px;
  border: 2px solid $baseColor;
  border-radius: 20px;
}
.player-btn-icon {
  display: inline-block;
  width: 30px;
  height: 30px;
}
.player-btn-icon:before {
  content: '';
  display: block;
  height: 100%;
  background: url('~common/img/play.svg') center/cover no-repeat;
}
.player-btn-icon
.player-btn-text {
  vertical-align: middle;
}
.player-btn-text {
  margin-left: 1em;
  color: $baseColor;
  white-space: nowrap;
}
.bg-image{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding-top: 70%;
  height: 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .25);
}

.list {
  position: absolute;
  left: 0;
  bottom: 0;
  width:100%;
  z-index: 110;
}
.bg-layer {
  position: absolute;
  top:0;
  bottom:0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
}
.loading-wrapper {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
}

.up-enter-active {
  transition: all .2s;
}
.up-leave-active {
  transition: all .5s;
}
.up-enter {
  transform: translate3d(-900px, 0, 0);
}
.up-leave-to {
  transform: translate3d(900px, 0, 0);
}
</style>
