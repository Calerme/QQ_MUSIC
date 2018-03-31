<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">-->
      <div class="normal-player" v-show="fullScreen">
        <div class="normal-player-bg"
             :style="styleBg"></div>
        <div class="top">
          <h3 class="song-name" v-html="currentSong.name"></h3>
          <h4 class="author" v-html="currentSong.singer"></h4>
          <div class="back"
               @click="back">
            <i class="icon-back"></i>
          </div>
        </div>
        <div class="middle">
          <div class="disc_bg"
               ref="normalDisc">
            <div class="disc rotate"
                 :class="{'pause': !playing}"
                 :style="styleBg"></div>
          </div>
          <div class="progress-wrapper">
            <span class="progress-time progress-current-time">{{currentTime | formatTime}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent"
                            @change-time="changeTime"></progress-bar>
            </div>
            <span class="progress-time progress-duration-time">
              {{duration | formatTime}}
            </span>
          </div>
        </div>
        <div class="bottom">
        <i class="icon"
           :class="iconMode"
           @click.stop="changeMode"></i>
        <i class="icon icon-prev"
           :class="{'disable': !songReady}"
           @click="prev"></i>
        <i class="icon"
           :class="[playing ? 'icon-pause' : 'icon-play',{disable: !songReady}]"
           @click="togglePlaying"></i>
        <i class="icon icon-next"
           @click="next"
           :class="{'disable': !songReady}"></i>
        <i class="icon icon-favo-empty"></i>
      </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click="show">
        <div class="disc_bg rotate"
             :class="{'pause': !playing}">
          <div class="disc"
               :style="styleBg"></div>
        </div>
        <div class="info">
          <h3 class="song-name" v-html="currentSong.name"></h3>
          <h4 class="author" v-html="currentSong.singer"></h4>
        </div>
        <div class="btns">
          <progress-circle
            @click.native.stop="togglePlaying"
            :percent="percent">
            <i class="icon ctrl"
               :class="playing ? 'icon-pause' : 'icon-play'"></i>
          </progress-circle>
          <i class="icon icon-list"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready($event)"
           @timeupdate="updateTime($event)"
           @error="error"
           @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'pages/ProgressBar'
import ProgressCircle from 'base/progresscircle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'

const MODE_CLASS = {
  [playMode.sequence]: 'icon-mode-sequence',
  [playMode.loop]: 'icon-mode-loop',
  [playMode.random]: 'icon-mode-random'
}

export default {
  name: 'player',
  data () {
    return {
      styleBg: {},
      songReady: false,
      currentTime: 0,
      duration: 0,
      currentLyric: null
    }
  },
  computed: {
    imgURL () {
      return `url(${this.currentSong.image})`
    },
    percent () {
      const percent = this.currentTime / this.duration
      return percent
    },
    iconMode () {
      return MODE_CLASS[this.mode]
    },
    ...mapGetters([
      'singer',
      'currentSong',
      'fullScreen',
      'sequencelist',
      'playlist',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  watch: {
    imgURL (newVal) {
      this.styleBg.backgroundImage = newVal
    },
    currentSong (newSong, oldSOng) {
      this.$nextTick(() => {
        if (newSong.id === oldSOng.id) return
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    playing (newVal) {
      this.$nextTick(() => {
        if (newVal) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      })
    }
  },
  methods: {
    back () {
      this.setFullScreen(false)
      console.log(this.imgURL)
    },
    show () {
      this.setFullScreen(true)
    },
    enter (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      const animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.normalDisc, 'move', done)
    },
    afterEnter (el) {
      animations.unregisterAnimation('move')
      this.$refs.normalDisc.style.animation = ''
    },
    leave (el, done) {
      const {x, y, scale} = this._getPosAndScale()
      const animation = {
        0: {
          transform: `translate3d(0, 0, 0) scale(0)`
        },
        60: {
          transform: `translate3d(${x}px,${y}px,0) scale(0.2)`
        },
        100: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        }
      }
      animations.registerAnimation({
        name: 'toMini',
        animation,
        presets: {
          duration: 300,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.normalDisc, 'toMini', done)
    },
    afterLeave (el) {
      animations.unregisterAnimation('toMini')
      this.$refs.normalDisc.style.animation = ''
    },
    togglePlaying () {
      this.setPlaying(!this.playing)
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    next () {
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) return
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
      console.log(this.playlist)
    },
    ready (e) {
      this.songReady = true
      this.duration = e.target.duration
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    changeTime (percent) {
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
    },
    error () {
      this.songReady = true
      this.next()
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequencelist)
      } else {
        list = this.playlist
      }
      this._resetCurrentIndex(list)
      this.setPlayList(list)
    },
    end () {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    getLyric () {
      this.currentSong.getLyric()
        .then(lyric => {
          this.currentLyric = new Lyric(lyric)
          console.log(this.currentLyric)
        })
    },
    _resetCurrentIndex (list) {
      const newIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      console.log(newIndex)
      this.setCurrentIndex(newIndex)
    },
    _getPosAndScale () {
      const targetWidth = 50
      const paddingLeft = 35 // 中心坐标距左边的宽度
      const paddingBottom = 30 // 中心坐标距底部的宽度
      const paddingTop = 100 // 大碟片上边缘距离顶部距离
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - (width / 2 + paddingTop) - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  },
  filters: {
    formatTime (interval) {
      let s = interval | 0
      let minute = String((s / 60) | 0)
      s = String(s % 60)
      return `${minute.padStart(2, '0')}:${s.padStart(2, '0')}`
    }
  },
  components: {
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
.normal-player {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #777;
}
.normal-player-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent no-repeat center/cover;
  filter: blur(40px);
}
.top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.top .song-name,
.top .author {
  margin: 0;
  text-align: center;
  color: #e1e1e1;
}
.top .song-name {
  margin: 0.4em 0;
}
.top .back {
  position: absolute;
  top: 10px;
  left: 15px;
  width: 40px;
  height: 40px;
}
.top .icon-back {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  background: url("~common/img/back_down.svg") no-repeat center/cover;
}
.middle {
  position: absolute;
  top: 100px;
  bottom: 120px;
  left: 0;
  width: 100%;
  .disc_bg {
    width: 80vw;
    height: 80vw;
    margin: 0 auto;
    border-radius: 50%;
    background: url("~common/img/disc.png") no-repeat center/cover;
    box-shadow: 0 0 10px 5px rgba(0, 0, 0, .5);
    overflow: hidden;
    .disc {
      width: 100%;
      height: 100%;
      border: 8px solid #000;
      border-radius: 50%;
    }
  }
  .progress-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    .progress-time {
      font-size: $baseFontSize;
      font-weight: bold;
      color: #333;
    }
    .progress-bar-wrapper {
      width: 70%;
      height: 5px;
      margin: 0 10px;
      background-color: $baseColorLighterGray;
      border-radius: 2.5px;
    }
  }
}
.bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 30px 0;
}
.icon {
  width: 50px;
  height: 50px;
  border: 2px solid $baseColor;
  border-radius: 50%;
  padding: 5px;
}
.icon.icon-play,
.icon.icon-pause {
  width: 60px;
  height: 60px;
}
.icon:before {
  content: ' ';
  display: block;
  width: 100%;
  height: 100%;
  background: transparent no-repeat center/cover;
}
.icon-prev:before,
.icon-next:before {
  background-image: url("~common/img/prev_next.svg");
}
.icon-prev:before {
  transform: rotateY(180deg);
}

.icon-play:before {
  background-image: url("~common/img/player_play.svg");
  transform: translateX(6%)
}
.icon-pause:before {
  background-image: url("~common/img/player_pause.svg");
}

.icon-favo-empty,
.icon-favo-solid {
  border: none;
  padding: 0;
}

.icon-favo-empty:before {
  background-image: url("~common/img/favo_empty.svg")
}
.icon-favo-solid:before {
  background-image: url("~common/img/favo_solid.svg");
}

.icon-mode-sequence:before {
  background-image: url("~common/img/play_mode_sequence.svg");
}
.icon-mode-loop:before {
  background-image: url("~common/img/play_mode_loop.svg");
}
.icon-mode-random:before {
  background-image: url("~common/img/play_mode_random.svg");
}

@keyframes rotate {
  from {
    transform: rotate3d(0, 0, 1, 0);
  }
  to {
      transform: rotate3d(0, 0, 1, 360deg);
    }
}

.rotate {
  animation-name: rotate;
  animation-duration: 12s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.normal-enter-active,
.normal-leave-active {
  transition: all .4s;
  .top, .bottom {
    transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  }
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -100px, 0);
  }
  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}

.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  padding: 0 0 0 10px;
  background-color: rgba(255,255,255, .95);
  border-top: 3px solid rgb(230, 230, 230);
  .disc_bg {
    width: 50px;
    height: 50px;
    background: url("~common/img/disc.png") no-repeat center/cover;
    border-radius: 50%;
    overflow: hidden;
    .disc {
      width: 100%;
      height: 100%;
      background: transparent no-repeat center/cover;
    }
  }
  .info {
    color: #333;
    margin-left: 10px;
    .song-name,
    .author {
      margin: 0;
    }
    .song-name {
      font-size: $baseFontSize;
    }
  }
  .btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
    flex-grow: 1;
    .ctrl {
      display: block;
      width: 40px;
      height: 40px;
      border-color: transparent;
    }
    .icon-list {
      border: none;
      &:before {
        background-image: url("~common/img/list.svg")
      }
    }
  }
}

.pause {
  animation-play-state: paused;
}

.disable {
  filter: grayscale(100%);
}
</style>
