<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="scroll"
          :before-scroll="true"
          @beforeScroll="listScroll">
    <div class="result-wrapper">
      <div v-for="(item, index) of result"
           :key="index"
           class="suggest-item"
           :class="getClass(item)"
           @click="selectItem(item)">
        <p v-html="getName(item)"></p>
      </div>
      <div class="loading-wrapper" v-show="showLoading">
        <loading></loading>
      </div>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import config from 'api/config'
import {createSong} from 'common/js/Song'
import Scroll from 'base/scroll'
import Loading from 'components/Loading'
import Singer from 'common/js/Singer'
import {mapMutations, mapActions} from 'vuex'

const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      showLoading: true
    }
  },
  watch: {
    query () {
      this._search()
    }
  },
  methods: {
    refresh () {
      this.$refs.scroll.refresh()
    },
    getClass (item) {
      return item.type === TYPE_SINGER ? 'suggest-item-human' : 'suggest-item-music'
    },
    getName (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.showLoading = true
      this.page++
      search(this.query, this.page, false, PERPAGE)
        .then(res => {
          this.result = this.result.concat(this._getResult(res.data))
          this._checkMore(res.data)
          this.showLoading = false
          this.$refs.scroll.refresh()
        })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          name: item.singername,
          id: item.singermid
        })
        this.setSinger(singer)
        this.$router.push({
          path: `/search/${singer.id}`
        })
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _search () {
      this.hasMore = true
      if (!this.query) return
      search(this.query, this.page, this.showSinger, PERPAGE)
        .then((res) => {
          if (res.code === config.ERR_OK) {
            this.result = this._getResult(res.data)
            this._checkMore(res.data)
            this.showLoading = false
            this.$refs.scroll.refresh()
          }
        })
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || song.curnum + song.curnum * song.curpage >= song.totalnum) {
        this.hasMore = false
      }
    },
    _getResult: function (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push(Object.assign({}, {...data.zhida}, {type: TYPE_SINGER}))
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
.suggest {
  width: 100%;
  height: 100%;
  background: #e7e7e7;
  position: relative;
  z-index: 99999;
  overflow: hidden;
  .suggest-item {
    font-size: $baseFontSize;
    height: 50px;
    line-height: 50px;
    &.suggest-item-music {
      background: url("~common/img/music.svg") 5% center/30px no-repeat;
    }
    &.suggest-item-human {
      background: url("~common/img/human.svg") 5% center/30px no-repeat;
    }
    p {
      margin: 0;
      padding-left: 20%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .loading-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-top: 20px;
  }
}
</style>
