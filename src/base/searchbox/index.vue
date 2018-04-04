<template>
  <div class="search-box">
    <input class="search-input"
           type="text"
           v-model="query"
           :placeholder="placeholder"
           ref="input">
    <button v-show="query"
            class="search-clearbtn"
            @click="clearQuery"></button>
  </div>
</template>
<script>
export default {
  name: 'searchBox',
  data () {
    return {
      query: ''
    }
  },
  watch: {
    query (newVal) {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.$emit('query-change', newVal)
      }, 300)
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    }
  },
  created () {
    this.$watch('query', (newQuery) => {
      this.$emit('queryChange', newQuery)
    })
  },
  methods: {
    blur () {
      this.$refs.input.blur()
    },
    setQuery (newVal) {
      this.query = newVal
    },
    clearQuery () {
      this.query = ''
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~common/style/base';
.search-box {
  position: relative;
  width: 90%;
  height: 50px;
  padding: 10px 40px;
  border-radius: 8px;
  background: #fff url("~common/img/search.svg") 10px center/25px no-repeat;
  .search-input {
    margin: 0;
    font-size: $baseFontSize;
    line-height: 28px;
    text-indent: 1em;
    width: 100%;
    &:focus {
      outline: 2px solid $baseColor;
      box-shadow: 0 0 5px $baseColor;
    }
  }
  .search-clearbtn {
    position: absolute;
    top: 13px;
    right: 10px;
    width: 25px;
    height: 25px;
    background: url("~common/img/x.svg") no-repeat center/cover;
    border: none;
  }
}
</style>
