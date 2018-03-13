<template>
  <div>
    Recommend
  </div>
</template>
<script>
import getRecommend from 'api/getRecommend'

export default {
  name: 'Recommend',
  data () {
    return {

    }
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend()
        .then(console.log)
    }
  }
}
</script>
