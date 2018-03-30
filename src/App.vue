<template>
  <div id="app">
    <q-header></q-header>
    <nav-bar></nav-bar>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import QHeader from 'components/QHeader'
import NavBar from 'components/NavBar'
import Player from 'pages/Player'

export default {
  name: 'App',
  components: {
    QHeader,
    NavBar,
    Player
  }
}
</script>

<style lang="scss">
  @import '~common/style/main';
</style>
