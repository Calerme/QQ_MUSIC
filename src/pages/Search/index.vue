<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query-change="queryChange"
                  ref="searchBox"></search-box>
    </div>
    <scroll class="shortcut" :data="shortcut" ref="shortcutScroll">
      <div>
        <div class="hotkey-wrapper" v-if="hotKey.length">
          <h3>热门搜索</h3>
          <ul>
            <li v-for="item of hotKey"
                :key="item.n"
                v-html="item.k"
                @click="replaceQuery(item.k)"></li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h3>搜索历史 <button class="empty" @click="empty"></button></h3>
          <history-list :searches="searchHistory"
                        @select="selectItem"
                        @clear="delItem"></history-list>
        </div>
      </div>
    </scroll>
    <div class="search-wrapper" v-show="query" ref="searchWrapper">
      <suggest @listScroll="blurInput"
               :query="query"
               ref="suggestScroll"
               @select="saveSearch"></suggest>
    </div>
    <router-view class="singer-wrapper"></router-view>
  </div>
</template>
<script>
import SearchBox from 'base/searchbox'
import {getHotKey} from 'api/search'
import config from 'api/config'
import Suggest from 'pages/Suggest'
import {playlistMixin} from 'common/js/mixin'
import {mapActions, mapGetters} from 'vuex'
import HistoryList from 'base/historylist'
import Scroll from 'base/scroll'

export default {
  name: 'Search',
  mixins: [playlistMixin],
  data () {
    return {
      hotKey: [],
      query: ''
    }
  },
  computed: {
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  created () {
    this._getHotKey()
  },
  methods: {
    selectItem (query) {
      console.log(query)
      this.replaceQuery(query)
    },
    delItem (query) {
      this.deleteSearchHistory(query)
    },
    empty () {
      this.emptySearchHistory()
    },
    handlePlaylist (list) {
      this.$refs.searchWrapper.style.bottom = list.length > 0 ? '60px' : 0
      this.$refs.suggestScroll.refresh()
      this.$refs.shortcutScroll.$el.style.bottom = list.length > 0 ? '60px' : 0
      this.$refs.shortcutScroll.refresh()
    },
    replaceQuery (key) {
      this.$refs.searchBox.setQuery(key)
    },
    queryChange (newVal) {
      this.query = newVal
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    _getHotKey () {
      getHotKey()
        .then(data => {
          if (data.code === config.ERR_OK) {
            this.hotKey = data.data.hotkey.slice(0, 10)
          }
        })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'emptySearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    HistoryList,
    Scroll
  }
}
</script>
<style lang="scss" scoped>
.search {
  position: fixed;
  top: 87px;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #e7e7e7;
  .search-box-wrapper {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
  .hotkey-wrapper {
    padding: 0 5%;
    h3 {
      font-size: 1.2rem;
      margin: 0;
      color: #333;
    }
    ul {
      margin: 0;
      padding: 0;
      overflow: hidden;
      li {
        float: left;
        list-style: none;
        padding: 5px;
        margin: 10px 0 0 10px;
        background-color: #aaa;
        border-radius: 8px;
        color: #fff;
      }
    }
  }
  .search-wrapper {
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .singer-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .search-history {
    width: 100%;
    padding: 0 5%;
    overflow: hidden;
    h3 {
      font-size: 1.2rem;
      margin: 25px 0 5px 0;
      color: #333;
      overflow: hidden;
      .empty {
        float: right;
        width: 27px;
        height: 27px;
        margin-right: 10px;
        background: url("~common/img/empty.svg") no-repeat center/cover;
        border: none;
      }
    }
  }
  .shortcut {
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    overflow: hidden;
  }
}
</style>
