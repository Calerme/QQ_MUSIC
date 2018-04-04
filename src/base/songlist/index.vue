<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songs"
          :key="index"
          class="item">
          <div class="song-item-content"
               @click="selectSong(song, index)"
               :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ getDesc(song) }}</p>
            <div class="delbtn"
                 v-if="delBtn"
                 @click="del(song)"></div>
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
      default () {
        return []
      }
    },
    delBtn: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    del (song) {
      this.$emit('del', song)
    },
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
.item {
  border-bottom: 1px solid #e1e1e1;
  position: relative;
}
.song-item-content {
  width: 80%;
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
.name,
.desc {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delbtn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  background: url("~common/img/x.svg") no-repeat center/70%;
}
.slip-enter-active,
.slip-leave-active {
  transition: all .3s;
}
.slip-enter,
.slip-leave-to {
  transform: translate3d(-100%, 0, 0);
}
</style>
