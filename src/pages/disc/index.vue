<template>
  <transition name="slide">
    <div class="songlist-wrapper">
      <music-list :title="title"
                 :bg-image="bgImage"
                 :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'pages/MusicList'
import {getDisc} from 'api/getDisc'
import config from 'api/config'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/Song'

export default {
  name: 'songList',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    if (!this.disc.dissid) {
      this.$router.push({
        path: '/recommend'
      })
    }
    this._getSonglist(this.disc.dissid)
  },
  methods: {
    _getSonglist (disstid) {
      return getDisc(disstid)
        .then(res => {
          if (res.code === config.ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
    },
    _normalizeSongs (list) {
      const songs = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          songs.push(createSong(item))
        }
      })
      return songs
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
.songlist-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.slide-enter-active,
.slide-leave-active {
  transition: all .3s;
}
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
