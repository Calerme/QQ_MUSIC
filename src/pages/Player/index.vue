<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
      <div class="top">
        <h3 class="song-name" v-html="currentSong.name"></h3>
        <h4 class="author" v-html="currentSong.singer"></h4>
        <div class="back"
             @click="back">
          <i class="icon-back"></i>
        </div>
      </div>
      <div class="middle">
        <div class="disc_bg rotate"
             :class="{'pause': playing}">
          <div class="disc"
               :style="styleBg"></div>
        </div>
      </div>
      <div class="bottom">
        <i class="icon icon-mode-sequence"></i>
        <i class="icon icon-prev"></i>
        <i class="icon icon-play"></i>
        <i class="icon icon-next"></i>
        <i class="icon icon-favo-empty"></i>
      </div>
    </div>
    </transition>
    <transition name="mini">
      <div class="mini-player"
           v-show="!fullScreen"
           @click.stop="show">
        <div class="disc_bg rotate"
             :class="{'pause': playing}">
          <div class="disc"
               :style="styleBg"></div>
        </div>
        <div class="info">
          <h3 class="song-name" v-html="currentSong.name"></h3>
          <h4 class="author" v-html="currentSong.singer"></h4>
        </div>
        <div class="btns">
          <i class="icon ctrl icon-pause"></i>
          <i class="icon icon-list"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'player',
  data () {
    return {
      styleBg: {}
    }
  },
  computed: {
    imgURL () {
      return `url(${this.currentSong.image})`
    },
    ...mapGetters([
      'singer',
      'currentSong',
      'fullScreen',
      'playlist',
      'playing'
    ])
  },
  watch: {
    imgURL (newVal) {
      this.styleBg.backgroundImage = newVal
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

    },
    afterEnter (el) {

    },
    leave (el, done) {

    },
    afterLeave (el) {

    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    })
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
  background-color: gray;
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
  width: 10vw;
  height: 10vw;
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
  width: 13vw;
  height: 13vw;
  border: 2px solid $baseColor;
  border-radius: 50%;
  padding: 5px;
}
.icon.icon-play,
.icon.icon-pause {
  width: 15vw;
  height: 15vw;
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
  animation-duration: 8s;
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
      width: 10vw;
      height: 10vw;
      margin-right: 10px;
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
</style>
