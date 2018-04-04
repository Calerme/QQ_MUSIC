<template>
  <transition name="slip">
    <div class="addSong" v-show="showFlag">
      <div class="header">
        <h2>添加歌曲到列表</h2>
        <button class="close-btn"
                @click.stop="hide"></button>
      </div>
      <div class="search-box-wrapper">
        <search-box :placeholder="'请输入歌曲名'"
                     @query-change="queryChange"
                     ref="searchBox"></search-box>
      </div>
      <div class="tab-wrapper"
           @click.stop="changeShow($event)">
        <button class="recent"
                :class="getCls('recent')"
                data-name="recent">最近播放</button>
        <button class="history"
                :class="getCls('history')"
                data-name="history">搜索历史</button>
      </div>
      <div class="show-wrapper">
        <recent-list v-show="currentShow === 'recent'"></recent-list>
        <history-list
          v-show="currentShow === 'history'"
          :searches="searchHistory"
          @select="changeQuery"
          @clear="delHistoryItem"></history-list>
      </div>
      <div class="suggest-wrapper"
           v-show="query">
        <suggest :query="query"
                 :showSinger="false"
                 @listenScroll="blurSearchBox"
                 @select="selectItem"></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/searchbox'
import Suggest from 'pages/Suggest'
import HistoryList from 'base/historylist'
import {mapGetters, mapActions} from 'vuex'
import RecentList from 'pages/RecentList'

export default {
  name: 'addSong',
  data () {
    return {
      showFlag: false,
      query: '',
      currentShow: 'recent'
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    selectItem (query) {
      this.saveSearchHistory(query)
    },
    delHistoryItem (query) {
      this.deleteSearchHistory(query)
    },
    blurSearchBox () {
      this.$refs.searchBox.blur()
    },
    changeQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    changeShow (e) {
      const target = e.target
      if (target.tagName.toLowerCase() === 'button') {
        this.currentShow = target.dataset.name
      }
    },
    getCls (name) {
      return name === this.currentShow ? 'current' : false
    },
    show () {
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
      this.$refs.searchBox.query = ''
    },
    queryChange (query) {
      this.query = query
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    HistoryList,
    RecentList
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/base';
.addSong {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  .header {
    width: 100%;
    height: 60px;
    overflow: hidden;
    h2 {
      margin: 10px 0;
      text-align: center;
      color: #444;
    }
    .close-btn {
      position: absolute;
      right: 15px;
      top: 15px;
      width: 25px;
      height: 25px;
      background: url("~common/img/x.svg") no-repeat center/cover;
      border: none;
    }
  }
  .search-box-wrapper {
    display: flex;
    justify-content: center;
  }
  .tab-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    button {
      width: 120px;
      height: 60%;
      color: #e1e1e1;
      background: $baseColor;
      border: none;
      font-size: 1rem;
      &.recent {
        border-radius: 20px 0 0 20px;
      }
      &.history {
        border-radius: 0 20px 20px 0;
      }
      &.current {
        background-color: #279156 !important;
        color: #fff !important;
      }
    }
  }
}
.show-wrapper {
  position: absolute;
  top: 170px;
  bottom: 0;
  left: 0;
  padding: 10px 5% 0;
  width: 100%;
}
.suggest-wrapper {
  position: absolute;
  top: 120px;
  left: 0;
  bottom: 0;
  width: 100%;
}
.slip-enter-active,
.slip-leave-active {
  transition: all .3s;
}
.slip-enter,
.slip-leave-to {
  transform: translate3d(100%, 0, 0)
}
</style>
