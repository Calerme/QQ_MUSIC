<template>
  <div>
    <div class="slider-container">
      <Slider v-if="sliderList.length">
        <a v-for="item of sliderList"
           :key="item.id"
           :href="item.linkUrl"
        class="slider-item-wrapper">
          <img :src="item.picUrl" alt="推荐歌曲">
        </a>
      </Slider>
    </div>
    <h2 class="hot-list-title">热门歌单</h2>
    <div class="hot-list">
      <div v-for="item of hotList"
           :key="item.dissid"
           class="hot-list-item">
        <img :src="item.imgurl"
             :alt="item.title">
        <div class="hot-list-item-information">
          <h3 class="hot-list-item-title">{{item.creator.name}}</h3>
          <p class="hot-list-item-info">{{item.dissname}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getSlider, getHotList} from 'api/getRecommend'
import Slider from 'base/slider'

export default {
  name: 'Recommend',
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
  methods: {
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
    }
  },
  components: {
    Slider
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
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 0 5vw 10px 5vw;
    overflow: hidden;
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
</style>
