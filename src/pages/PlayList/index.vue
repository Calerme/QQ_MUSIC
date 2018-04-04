<template>
  <transition name="slip">
    <div class="playlist-wrapper" v-show="showFlag"
         @click.self="close">
        <div class="playlist">
          <div class="top">
            <button class="play-random-btn"
                    @click="beginRandomPlay">随机播放</button>
            <button class="empty-btn"
                    @click.stop="empty"></button>
          </div>
          <scroll class="middle"
                  :data="sequencelist"
                  ref="scroll">
            <transition-group tag="div" name="change-h">
              <div v-for="(item, index) of sequencelist"
                   :key="item.mid"
                   class="list-item"
                   ref="items">
              <div class="song-info"
                   :class="getCurrentCls(item, index)"
                   @click.stop="selectItem(item)">
                <span class="name" v-html="item.name"></span>
                <span class="singer" v-html="item.singer"></span>
              </div>
              <div class="song-ctrl">
                <span class="favo-btn"
                      :class="isFavo(item)"
                      @click.stop="toggle(item)"></span>
                <div class="del-btn"
                     @click.stop="deleteItem(item)"></div>
              </div>
            </div>
            </transition-group>
          </scroll>
          <div class="addsong-wrapper">
            <button class="addsong"
                    ref="addBtn"
                    @click="showAddSong">点击添加歌曲</button>
          </div>
          <button class="close-btn"
                  @click.stop="close">关&nbsp;&nbsp;闭</button>
        </div>
        <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll'
import AddSong from 'pages/AddSong'
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'playlist',
  data () {
    return {
      currentIndex: 0
    }
  },
  props: {
    showFlag: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showFlag () {
      setTimeout(() => {
        this.$refs.scroll.refresh()
        this.$refs.scroll.scrollToElement(this.$refs.items[this.currentIndex])
      }, 20)
    },
    currentSong () {
      if (this.isClick) {
        this.isClick = false
        return
      }
      setTimeout(() => {
        this.$refs.scroll.scrollToElement(this.$refs.items[this.currentIndex])
      }, 20)
    }
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'playlist',
      'sequencelist',
      'playing',
      'favoList'
    ])
  },
  methods: {
    isFavo (song) {
      const index = this.favoList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1 ? 'favo' : ''
    },
    toggle (song) {
      this.toggleSongToFavo(song)
    },
    showAddSong () {
      this.$refs.addSong.show()
    },
    close () {
      this.$emit('close')
    },
    getCurrentCls (item, index) {
      if (item.id === this.currentSong.id) {
        this.currentIndex = index
        if (this.playing) {
          return 'current'
        } else {
          return 'current-pause'
        }
      } else {
        return ''
      }
    },
    selectItem (item) {
      this.isClick = true
      let index = this.playlist.findIndex(song => {
        return song.id === item.id
      })
      this.setCurrentIndex(index)
      this.setPlaying(true)
    },
    deleteItem (item) {
      this.deleteSong(item)
    },
    empty () {
      this.emptyList()
    },
    beginRandomPlay () {
      this.randomPlay({list: this.sequencelist})
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaying: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'emptyList',
      'randomPlay',
      'toggleSongToFavo'
    ])
  },
  components: {
    Scroll,
    AddSong
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/base';

.playlist-wrapper {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .4);
  .playlist {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 70%;
    background: gray;
    .top {
      position: absolute;
      width: 100%;
      height: 50px;
      .play-random-btn {
        height: 40px;
        margin-top: 5px;
        margin-left: 20px;
        padding-left: 60px;
        font-size: 1.3rem;
        color: $baseColor;
        background: url("~common/img/play_mode_random.svg") no-repeat 20px center/30px;
        border: 3px solid $baseColor;
        border-radius: 10px;
      }
      .empty-btn {
        float: right;
        margin: 10px 20px 0 0 ;
        width: 30px;
        height: 30px;
        border: none;
        background: transparent url("~common/img/empty.svg") no-repeat center/cover;
      }
    }
    .middle {
      position: absolute;
      top: 50px;
      bottom: 120px;
      width: 100%;
      overflow: hidden;
      .list-item {
        display: flex;
        width: 100%;
        height: 50px;
        padding: 0 20px;
        margin-bottom: 10px;
        .song-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 70%;
          height: 100%;
          padding: 0 25px;
          font-size: $baseFontSize;
          color: #e1e1e1;
          &.current {
            background: url("~common/img/player_play.svg") no-repeat 0 center;
          }
          &.current-pause {
            background: url("~common/img/player_pause.svg") no-repeat 0 center;
          }
          .name,
          .singer {
            display: block;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
        .song-ctrl {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 30%;
          height: 100%;
          .favo-btn,
          .del-btn {
            width: 30px;
            height: 30px;
            margin-left: 20px;
            background: transparent no-repeat center/80%;
          }
          .favo-btn {
            background-image: url("~common/img/favo_empty.svg");
            &.favo {
              background-image: url("~common/img/favo_solid.svg");
            }
          }
          .del-btn {
            background-image: url("~common/img/x.svg");
          }
        }
      }
    }
    .addsong-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 60px;
      width: 100%;
      height: 60px;
      .addsong {
        width: 300px;
        height: 30px;
        border: 3px solid #fff;
        border-radius: 20px;
        color: #fff;
        background: none;
      }
    }
    .close-btn {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 1.2rem;
      text-align: center;
      background: $baseColor;
      color: #e7e7e7;
      border: none;
    }
  }
}

.slip-enter-active,
.slip-leave-active {
  transition: all .3s;
  .playlist {
    transition: all .3s;
  }
}
.slip-enter,
.slip-leave-to {
  opacity: 0;
  .playlist {
    transform: translate3d(0, 100%, 0);
  }
}

.change-h-enter-active,
.change-h-leave-active {
  transition: all .3s;
}
.change-h-enter,
.change-h-leave-to {
  transform: translate3d(-100%, 0, 0)
}
</style>
