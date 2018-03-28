<template>
  <div class="loading-wrapper">
    <img src="~common/img/loading.svg"
         alt="loading"
         class="loading-img">
    <p class="loading-text">{{ msg }}</p>
  </div>
</template>
<script>
export default {
  name: 'loading',
  data () {
    return {
      msg: '数据努力加载中...'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "~common/style/base";
  .loading-wrapper {
    width: min-content;
    text-align: center;
  }
  .loading-img {
    width: 25px;
    height: 25px;
  }
  .loading-text {
    margin: 0;
    margin-top: 10px;
    color: $baseColorLighterGray;
    white-space: nowrap;
  }
</style>
