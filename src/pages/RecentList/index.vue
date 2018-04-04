<template>
  <scroll :data="recentList"
          ref="scroll"
          class="scroll">
    <ul>
      <li v-for="item of recentList"
          :key="item.id"
          class="song-item"
          @click.stop="selectItem(item)">
        <h3 class="song" v-html="item.name"></h3>
        <p class="singer">{{ item.singer }} - {{ item.album}}</p>
      </li>
    </ul>
  </scroll>
</template>

<script>
import {mapGetters} from 'vuex'
import Scroll from 'base/scroll'
export default {
  name: 'recentList',
  computed: {
    ...mapGetters([
      'recentList'
    ])
  },
  methods: {
    selectItem (song) {
      this.$store.dispatch('insertSong', song)
      this.$refs.scroll.scrollToElement(this.$refs.scroll.$el.firstChild)
    }
  },
  components: {
    Scroll
  }
}
</script>
<style lang="scss" scoped>
.scroll {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  margin-bottom: 10px;
}
.song {
  margin: 5px 0;
}
.singer {
  margin: 5px 0;
  color: #444;
}
.song,
.singer {
  overflow: hidden;
  text-overflow: ellipsis;
  white-sapce: nowrap;
}
</style>
