<template>
  <transition name="slide">
    <music-list v-if="songs.length"
                :songs="songs"
                :title="title"
                :bg-image="bgImage"
                class="singer-desc">
    </music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDesc} from 'api/getSinger'
import {createSong} from 'common/js/Song'
import MusicList from 'pages/MusicList'

export default {
  name: 'singerDesc',
  data () {
    return {
      songs: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avator
    },
    ...mapGetters([
      'singer'
    ])
  },
  created () {
    this._getDetail()
  },
  methods: {
    _getDetail () {
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDesc(this.singer.id)
        .then(data => {
          this.songs = this._normailizeSongs(data.list)
        })
    },
    _normailizeSongs (list) {
      const ret = []
      list.forEach(item => {
        let {musicData} = item
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="scss" scoped>
  .singer-desc {
    width: 100%;
    height: 100%;
    background-color: white;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: all .2s;
  }
  .slide-enter,
  .slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }
</style>
