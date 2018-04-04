<template>
  <div class="historylist">
    <ul>
      <li v-for="query of searches"
          :key="query">
        <span v-html="query"
              @click.stop="selectItem(query)"></span>
        <button @click.stop="clear(query)"></button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'historylist',
  props: {
    searches: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    clear (query) {
      this.$emit('clear', query)
    },
    selectItem (query) {
      this.$emit('select', query)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~common/style/base';
.historylist {
  ul {
    margin: 0;
    padding: 0;
    li {
      list-style: none;
      font-size: 1.2rem;
      line-height: 2.5em;
      color: #343434;
      overflow: hidden;
      span {
        float: left;
        display: block;
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      button {
        float: right;
        width: 20px;
        height: 20px;
        margin: 14px;
        background: url("~common/img/x.svg") no-repeat center/cover;
        border: none;
      }
    }
  }
}
</style>
