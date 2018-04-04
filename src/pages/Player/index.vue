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
          <div class="middle-main"
               @touchstart.prevent="middleTouchStart($event)"
               @touchmove.prevent="middleTouchMove($event)"
               @touchend.prevent="middleTouchEnd($event)">
            <div class="middle-main-L"
                 ref="middleL">
              <div class="disc_bg"
                   ref="normalDisc">
                <div class="disc rotate"
                     :class="{'pause': !playing}"
                     :style="styleBg"></div>
              </div>
             <p class="play-lyric-wrapper">{{ playingLyric }}</p>
            </div>
            <scroll v-if="currentLyric && currentLyric.lines"
                  class="lyric-scroll-wrapper"
                  ref="lyricScroll">
            <div class="lyric-wrapper">
            <div class="lyric">
              <p v-for="(line, index) of currentLyric.lines"
                 class="text"
                 :class="{current: currentLineNum === index}"
                 :key="index"
                 ref="lyricLines">
                {{ line.txt }}
              </p>
            </div>
          </div>
          </scroll>
          </div>
          <div class="disc-lyric-dot-wrapper">
            <span class="dot"
                  :class="{active: currentShow === 'disc'}"></span>
            <span class="dot"
                  :class="{active: currentShow === 'lyric'}"></span>
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
        <i class="icon"
           :class="isFavo()"
           @click="toggleFavo"></i>
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
          <i class="icon icon-list" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list :showFlag="showListFlag"
               @close="hidePlayList"></play-list>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready($event)"
           @timeupdate="updateTime($event)"
           @error="error"
           @ended="end"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import ProgressBar from 'pages/ProgressBar'
import ProgressCircle from 'base/progresscircle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll'
import PlayList from 'pages/PlayList'

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
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'disc',
      playingLyric: '',
      showListFlag: false
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
      'mode',
      'favoList'
    ])
  },
  watch: {
    imgURL (newVal) {
      this.styleBg.backgroundImage = newVal
    },
    currentSong (newSong, oldSOng) {
      if (newSong.id == null) {
        this.currentLyric.stop()
        return
      }
      if (newSong.id === oldSOng.id) return
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        // 如果在歌曲一开始快速点击暂停，但歌曲还是会播放，因为 currentSong 变化会延迟触发 play() 所以这里要判断一下
        if (!this.playing) return
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
    },
    playing (newVal) {
      if (newVal) {
        this.currentLyric && this.currentLyric.play()
      } else {
        this.currentLyric && this.currentLyric.stop()
      }
      this.$nextTick(() => {
        if (newVal) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      })
    }
  },
  created () {
    this.touch = {}
  },
  methods: {
    toggleFavo () {
      this.toggleSongToFavo(this.currentSong)
    },
    isFavo () {
      const index = this.favoList.findIndex(item => {
        return this.currentSong.id === item.id
      })
      return index > -1 ? 'icon-favo-solid' : 'icon-favo-empty'
    },
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
      if (!this.songReady) return
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    loop () {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      }
    },
    next () {
      if (!this.songReady) return
      let index = this.currentIndex + 1
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        if (index === this.playlist.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    prev () {
      if (!this.songReady) return
      if (this.playlist.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady = false
      }
    },
    ready (e) {
      this.songReady = true
      this.duration = e.target.duration
      this.saveSongToRecentList(this.currentSong)
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    changeTime (percent) {
      const currentTime = this.duration * percent
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
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
        list = this.sequencelist
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
          this.currentLyric = new Lyric(lyric, this._handleLyric.bind(this))
          if (this.playing) {
            this.currentLyric.play()
          }
        })
        .catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    middleTouchStart (e) {
      this.touch.initiated = true
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      if (this.$refs.lyricScroll) {
        this.$refs.lyricScroll.$el.style.transition = ''
        this.$refs.middleL.style.transition = ''
      }
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) return
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this.touch.percent = null
        return
      }
      const left = this.currentShow === 'disc' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      if (this.$refs.lyricScroll) {
        this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
      }
    },
    middleTouchEnd () {
      if (!this.touch.percent) return
      let offsetWidth, opacity
      if (this.currentShow === 'disc') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'disc'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      if (this.$refs.lyricScroll) {
        this.$refs.lyricScroll.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
        this.$refs.lyricScroll.$el.style.transition = `all .4s`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.transition = `all .4s`
      }
    },
    hidePlayList () {
      this.showListFlag = false
    },
    showPlayList () {
      this.showListFlag = true
    },
    _handleLyric ({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 4) {
        let lineEl = this.$refs.lyricLines[lineNum - 4]
        this.$refs.lyricScroll.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricScroll.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    _resetCurrentIndex (list) {
      const newIndex = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
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
    }),
    ...mapActions([
      'saveSongToRecentList',
      'toggleSongToFavo'
    ])
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
    ProgressCircle,
    Scroll,
    PlayList
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
  .middle-main {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 80px;
    width: 100%;
    .middle-main-L {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
  .disc_bg {
    position: absolute;
    width: 80vw;
    height: 80vw;
    top: 0;
    left: 0;
    right: 0;
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
  .play-lyric-wrapper {
    position: absolute;
    left: 0;
    bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: $baseFontSize;
    color: rgba(255,255,255,.9)
  }
  .lyric-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 95%;
    overflow: hidden;
  }
  .lyric-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    .text {
      font-size: $baseFontSize;
      color: rgba(255,255,255,.5);
      text-align: center;
      line-height: 1.8em;
      transition: all .3s;
      &.current {
        color: rgba(255,255,255, .9);
        text-shadow: 0 0 4px 4px #000;
      }
    }
  }
  .disc-lyric-dot-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 60px;
    width: 100%;
    height: 20px;
    .dot {
      display: block;
      width: 12px;
      height: 12px;
      background: rgba(255,255,255,.3);
      border-radius: 10px;
      transition: all .3s;
    }
    .dot:nth-child(2) {
      margin-left: 10px;
    }
    .dot.active {
      width: 28px;
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
