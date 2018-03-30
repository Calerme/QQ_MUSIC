<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs"
          :key="index"
          class="item">
        <div class="song-item-content"
             @click="selectSong(song, index)">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'songList',
  props: {
    songs: {
      type: Array,
      default: new Array(0)
    }
  },
  methods: {
    getDesc (song) {
      return `${song.singer} - ${song.album}`
    },
    selectSong (song, index) {
      this.$emit('select', song, index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/base';
.song-list {
  width: 100%;
  padding: 20px;
}
.song-item-content {
  width: 100%;
  border-bottom: 1px solid #e1e1e1;
  overflow: hidden;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
.name{
  margin: 0;
  font-size: $baseFontSize;
}
.name {
  margin-top: 10px;
}
.desc {
  margin: 6px 0 10px;
  font-size: $baseFontSize;
}
</style>
