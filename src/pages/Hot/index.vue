<template>
  <div>
    <scroll class="hot"
       ref="hot">
    <div class="hot-wrapper" v-if="topList.length">
      <div v-for="item of topList"
           :key="item.id"
           class="hot-item"
           @click="selectItem(item)">
        <div class="hot-item-L">
          <img :src="item.picUrl" :alt="item.topTitle">
        </div>
        <div class="hot-item-R">
          <h3 v-html="item.topTitle"></h3>
          <ol>
            <li v-for="(songItem, index) of item.songList"
                :key="index"><span class="no">{{ index + 1 }}</span><span class="song">{{ songItem.songname }}</span> - <span class="singer">{{ songItem.singername }}</span></li>
          </ol>
        </div>
      </div>
    </div>
    <div class="loading-wrapper" v-if="!topList.length">
      <loading></loading>
    </div>
  </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getToplist} from 'api/getRank'
import config from 'api/config'
import {playlistMixin} from 'common/js/mixin'
import Scroll from 'base/scroll'
import Loading from 'components/Loading'
import {mapMutations} from 'vuex'

export default {
  name: 'hot',
  mixins: [playlistMixin],
  data () {
    return {
      topList: []
    }
  },
  created () {
    this._getTopList()
  },
  methods: {
    handlePlaylist (list) {
      this.$refs.hot.$el.style.bottom = list.length > 0 ? '60px' : '0'
      this.$refs.hot.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/hot/${item.id}`
      })
      this.setTopList(item)
    },
    _getTopList () {
      getToplist()
        .then(res => {
          if (res.code === config.ERR_OK) {
            this.topList = res.data.topList
          }
        })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import "~common/style/base";
ol {
  margin: 0;
  padding: 0;
  list-style: none;
}
.hot {
  position: fixed;
  top: 87px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  .hot-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 15px 15px 0;
    background-color: #e7e7e7;
    .hot-item {
      display: flex;
      width: 100%;
      height: 120px;
      margin-bottom: 10px;
      background-color: #fff;
      .hot-item-L {
        width: 120px;
        flex-shrink: 0;
        img {
          width: 100%;
        }
      }
      .hot-item-R {
        margin: 0 10px 0 15px;
        overflow: hidden;
        h3 {
          margin: 10px 0;
          font-size: $baseFontSize;
        }
        li {
          line-height: 1.5em;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          color: #444;
          .no {
            margin-right: .5em;
          }
          .singer {
            color: #999;
          }
        }
      }
    }
  }
  .loading-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
