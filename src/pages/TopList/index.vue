<template>
  <div class="toplist">
    <div class="loading-wrapper">
      <music-list :bgImage="bgImage"
                  :title="title"
                  :songs="songs"
      ></music-list>
    </div>
  </div>
</template>

<script>
import MusicList from 'pages/MusicList'
import {mapGetters} from 'vuex'
import {getTopSongs} from 'api/getRank'
import config from 'api/config'
import {createSong} from 'common/js/Song'

export default {
  name: 'topList',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.topList.topTitle
    },
    bgImage () {
      return this.topList.picUrl
    },
    ...mapGetters([
      'topList'
    ])
  },
  created () {
    this._getTopSongs()
  },
  methods: {
    _getTopSongs () {
      if (!this.topList.id) {
        this.$router.push({
          path: '/hot'
        })
        return
      }
      getTopSongs(this.topList.id)
        .then(res => {
          if (res.code === config.ERR_OK) {
            this._normalizeSongs(res.songlist)
          }
        })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
        this.songs = ret
      })
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
.toplist {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
