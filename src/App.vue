<template>
  <div id="app">
    <q-header></q-header>
    <nav-bar></nav-bar>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import QHeader from 'components/QHeader'
import NavBar from 'components/NavBar'

export default {
  name: 'App',
  components: {
    QHeader,
    NavBar
  }
}
</script>

<style lang="scss">
  @import '~common/style/main';
</style>
