<template>
  <nav class="n">
    <router-link
      class="n_item"
      tag="span"
      v-for="item in navList"
      :to="item.path"
      :key="item.text">
      {{ item.text }}
    </router-link>
  </nav>
</template>
<script>
export default {
  data: function () {
    return {
      navList: [
        {text: '推荐', path: '/recommend'},
        {text: '歌手', path: '/singer'},
        {text: '排行', path: '/hot'},
        {text: '搜索', path: '/search'}]
    }
  }
}
</script>
<style lang="scss">
  @import "~common/style/base";

  .n {
    display: flex;
    justify-content: space-around;
    background-color: #fff;
    padding-bottom: 3px;
  }

  .n_item {
    flex: 1;
    padding: .5rem 0;
    color: $baseColorGray;
    text-align: center;
    cursor: pointer;
  }

  .n_item.router-link-active {
    color: $baseColor;
    border-bottom: 2px solid $baseColor;
  }
</style>
