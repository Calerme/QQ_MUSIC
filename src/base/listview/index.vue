<template>
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="scroll"
          ref="scroll">
    <ul>
      <li v-for="group in data"
          class="list-group"
          ref="listGroup"
          :key="group.title">
        <h2 class="list-group-title" ref="title">
          {{ group.title }}</h2>
        <ul>
          <li v-for="item in group.members"
              :key="item.id"
              @click.stop.prevent="selectSinger(item)"
              class="list-group-item">
            <img class="avator" v-lazy="item.avator">
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut-list"
         @touchstart.stop.prevent="onShortcutTouchStart"
         @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) of shourtcutList"
            :data-index="index"
            class="shortcut-item"
            :class="{'current': currentIndex === index}"
            :key="index"
            ref="shortItem">
          {{ item }}
        </li>
      </ul>
    </div>
    <div v-if="false"
         class="list-fixed" ref="fixed">{{ data[currentIndex].title }}</div>
    <div v-show="!data.length"
         class="loading-container">
      <Loading></Loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll'
import Loading from 'components/Loading'
import {playlistMixin} from 'common/js/mixin'

export default {
  name: 'listview',
  mixins: [playlistMixin],
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      currentIndex: 0,
      scrollY: 0,
      diff: 0
    }
  },
  computed: {
    shourtcutList () {
      return this.data.map(group => {
        return group.title.substr(0, 1)
      })
    }
  },
  watch: {
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      !this.listHeight && this._calculateHeight()
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      if (this) return
      let fixedTop = (newVal > 0 && newVal < this.TITLE_HEIGHT) ? newVal - this.TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  created () {
    this.probeType = 3
    this.listenScroll = true
    this.touch = {}
    this.listHeight = []
    this.TITLE_HEIGHT = 26
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : 0
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    onShortcutTouchStart (e) {
      const anchorIndex = e.target.dataset.index
      const firstTouch = e.touches[0]

      this.ANCHOR_HEIGHT = this.$refs.shortItem[1].clientHeight
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = Math.round((this.touch.y2 - this.touch.y1) / this.ANCHOR_HEIGHT)
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectSinger (item) {
      this.$emit('select', item)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      list.forEach(item => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      !this.listHeight && this._calculateHeight()
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.currentIndex = parseInt(index)
      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index])
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="scss" scoped>
  @import "~common/style/base";

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  .scroll {
    position: relative;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 87px;
    bottom: 0;
    width: 100%;
    overflow: hidden;
  }
  .list-group:not(:first-child) {
    margin-top: 15px;
  }
  .list-group-title,
  .list-fixed {
    height: 26px;
    margin: 0;
    padding: 2px 0;
    font-size: $baseFontSize;
    background-color: rgb(240,240,240);
    text-indent: 1em;
    color: $baseColor;
  }
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    font-weight: bold;
    padding: 0;
  }
  .list-group-item {
    display: flex;
    align-items: center;
    margin-top: 15px;
  }
  .list-group-item img {
    width: 18vw;
    height: 18vw;
    border-radius: 50%;
    margin: 0 5vw;
  }
  .list-group-item span {
    color: #717171;
  }
  .shortcut-list {
    position: absolute;
    right: 2vw;
    top: 50%;
    transform: translateY(-50%);
  }
  .shortcut-list {
    background-color: #d5d5d5;
    padding: 10px 5px;
    border-radius: 15px;
  }
  .shortcut-list li {
    font-size: 14px;
    text-align: center;
    padding: 1px;
    color: $baseColorGray;
  }
  li.current {
    color: $baseColor;
  }
</style>
