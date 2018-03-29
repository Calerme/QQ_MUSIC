import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'

import 'babel-polyfill'

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('common/img/img_place_holder.svg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
