<template>
  <transition name="slip">
    <div class="dashboard">
      <div class="back"
           @click="back"></div>
      <div class="top">
        <button class="favobtn"
                :class="'favo'===showFlag ? 'current': ''"
                data-name="favo"
                @click.stop="show('favo')">我喜欢的</button>
        <button class="recent"
              :class="'recent'===showFlag ? 'current': ''"
              data-name="recent"
              @click.stop="show('recent')">最近听的</button>
      </div>
      <div class="middle">
        <button class="random"
                @click.stop="random">随机播放全部</button>
      </div>
      <div class="main"
           ref="main">
        <scroll :data="songs"
                class="songlist"
                ref="scroll">
          <song-list :songs="songs" :del-btn="true"
                     @del="delSong"></song-list>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll'
import SongList from 'base/songlist'
import {mapGetters, mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

export default {
  name: 'dashboard',
  mixins: [playlistMixin],
  data () {
    return {
      showFlag: 'favo'
    }
  },
  computed: {
    songs () {
      return this.showFlag === 'favo' ? this.favoList : this.recentList
    },
    ...mapGetters([
      'recentList',
      'favoList',
      'playlist'
    ])
  },
  mounted () {
    this.$refs.scroll.refresh()
  },
  methods: {
    random () {
      console.log(this.songs)
      this.randomPlay({list: this.songs})
    },
    delSong (song) {
      if (this.showFlag === 'favo') {
        this.delSongFromFavo(song)
      } else {
        this.delSongFromRecent(song)
      }
    },
    handlePlaylist () {
      this.$refs.main.style.bottom = this.playlist.length > 0 ? '60px' : ''
    },
    show (flag) {
      this.showFlag = flag
    },
    back () {
      this.$router.back()
    },
    ...mapActions([
      'delSongFromFavo',
      'delSongFromRecent',
      'randomPlay'
    ])
  },
  components: {
    Scroll,
    SongList
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
.dashboard {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  .top {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    .favobtn,
    .recent {
      width: 110px;
      height: 35px;
      background: $baseColor;
      font-size: 1rem;
      border: none;
      color: #e1e1e1;
    }
    .favobtn {
      border-radius: 20px 0 0 20px;
    }
    .recent {
      border-radius: 0 20px 20px 0;
    }
    .current {
      background-color: #279156 !important;
      color: #fff !important;
    }
  }
  .middle {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    height: 80px;
    .random {
      color: $baseColor;
      width: 200px;
      height: 35px;
      background: none;
      border: 3px solid $baseColor;
      border-radius: 20px;
    }
  }
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 140px;
    bottom: 0;
    left: 0;
    width: 100%;
    .songlist {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
.back {
  position: absolute;
  z-index: 100;
  top: 12px;
  left: 12px;
  width: 48px;
  height: 48px;
  background: url("~common/img/back.svg") no-repeat center/cover;
}
.slip-enter-active,
.slip-leave-active {
  transition: all .3s;
}
.slip-enter,
.slip-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
