<template>
  <div class="singer" ref="singer">
    <list-view :data="singerList"
               ref="list"
               @select="selectSinger"/>
    <router-view class="singer-desc-wrapper" />
  </div>
</template>
<script>
import {getSinger} from 'api/getSinger'
import Singer from 'common/js/Singer'
import ListView from 'base/listview'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_MAX = 10

export default {
  name: 'Singer',
  data () {
    return {
      originList: [],
      singerList: []
    }
  },
  created () {
    this._getSinger()
      .then(() => {
        this._getNormalList()
      })
      .catch(err => {
        console.error(err)
      })
  },
  mounted () {
  },
  methods: {
    selectSinger (singer) {
      this.setSinger(singer)
      this.$router.push(`/singer/${singer.id}`)
    },
    _getSinger () {
      return getSinger()
        .then(data => {
          this.originList = data
        })
        .catch(err => {
          console.error(err)
        })
    },
    _getNormalList () {
      // 解析 originList
      const map = {
        hot: {
          title: HOT_NAME,
          members: []
        }
      }
      this.originList.forEach((item, i) => {
        if (i < HOT_MAX) {
          map.hot.members.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))
        }
        const initial = item.Findex
        if (!map[initial]) {
          map[initial] = {
            title: initial,
            members: []
          }
        }
        map[initial].members.push(new Singer({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      })
      // 将 Map 转为数组，得到有序列表
      const ret = []
      const hot = []
      for (let k in map) {
        if (map[k].title.match(/[a-zA-Z]/)) {
          ret.push(map[k])
        } else if (map[k].title.match(/[^\d]/)) {
          hot.push(map[k])
        }
      }
      // 排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt((0))
      })
      this.singerList = hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>
<style>
  .singer-desc-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
