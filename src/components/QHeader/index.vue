<template>
  <header class="h">
    <h1 class="h_logo">
      QQ音乐
    </h1>
    <div class="user"
         @click="toDashboard"></div>
  </header>
</template>
<script>
export default {
  name: 'QHeader',
  methods: {
    toDashboard () {
      this.$router.push({
        path: '/dashboard'
      })
    }
  }
}
</script>
<style lang="scss">
  @import "~common/style/base";
  .h {
    height: 44px;
    background-color: $baseColor;
    overflow: hidden;
  }
  .h_logo {
    width: 90px;
    height: 25px;
    margin: 9px 0 0 10px;
    text-indent: -9999px;
    background: url("~common/img/logo.png") no-repeat;
    background-size: cover;
  }
  .user {
    position: absolute;
    top: 7px;
    right: 10px;
    width: 30px;
    height: 30px;
    background: url("~common/img/user.svg") no-repeat center/cover;
  }
</style>
