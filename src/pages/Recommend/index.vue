<template>
  <div ref="recommend"
       class="recommend">
    <Scroll :data="hotList"
            class="recommend-scroll"
            ref="scroll">
      <div>
        <div class="slider-container">
          <Slider v-if="sliderList.length"
                  ref="slider">
            <a v-for="item of sliderList"
               :key="item.id"
               :href="item.linkUrl"
               class="slider-item-wrapper">
              <img :src="item.picUrl"
                   @load="loadImage"
                   alt="推荐歌曲">
            </a>
          </Slider>
        </div>
        <h2 class="hot-list-title">热门歌单</h2>
        <div class="hot-list">
          <div v-for="item of hotList"
             :key="item.dissid"
             :href="'https://y.qq.com/n/yqq/playsquare/'+ item.dissid + '.html'"
             class="hot-list-item"
             @click.prevent="selectItem(item)">
            <img v-lazy="item.imgurl"
                 :alt="item.title">
            <div class="hot-list-item-information">
              <h3 class="hot-list-item-title">{{item.creator.name}}</h3>
              <p class="hot-list-item-info">{{item.dissname}}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!hotList.length"
           class="loading-container">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>
<script>
import {getSlider, getHotList} from 'api/getRecommend'
import Slider from 'base/slider'
import Scroll from 'base/scroll'
import Loading from 'components/Loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'Recommend',
  mixins: [playlistMixin],
  data () {
    return {
      sliderList: [],
      hotList: []
    }
  },
  created () {
    this._getRecommend()
    this._getHotList()
  },
  mounted () {
    this.$nextTick(() => {
      console.log(this.$refs)
    })
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem (item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRecommend () {
      getSlider()
        .then((data) => {
          this.sliderList = data.slider
        })
        .catch((err) => {
          console.error(err)
        })
    },
    _getHotList () {
      getHotList()
        .then((data) => {
          this.hotList = data
        })
        .catch((err) => {
          console.error(err)
        })
    },
    loadImage () {
      if (!this.checkImgLoaded) {
        this.$refs.scroll.refresh()
        this.checkImgLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="scss">
  @import "~common/style/base";

  .hot-list-title {
    color: $baseColor;
    font-size: $baseFontSize;
    text-align: center;
  }
  .slider-item-wrapper {
    display: block;
  }
  .slider-item-wrapper img {
    width: 100%;
  }

  .hot-list {
    display: flex;
    flex-direction: column;
  }
  .hot-list-item {
    display: block;
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 5vw 10px 5vw;
    overflow: hidden;
    color: inherit;
    text-decoration: none;
  }
  .hot-list-item:after {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    content: '';
    width: 70%;
    display: block;
    border-bottom: 1px solid #f1f1f1;
  }
  .hot-list-item img {
    width: 20vw;
  }
  .hot-list-item-information {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 5vw;
  }
  .hot-list-item-title {
    margin: 0;
    font-size: $baseFontSize;
  }
  .hot-list-item-info {
    margin: 0;
    font-size: $baseFontSize;
  }
  .recommend {
    position: fixed;
    width: 100%;
    top: 87px;
    bottom: 0;
  }
  .recommend-scroll {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: hidden;
  }
  .slider-container {
    width: 100vw;
  }
  .loading-container {
    display: flex;
    padding: 15px 0;
    justify-content: center;
    align-items: center;
  }
</style>
