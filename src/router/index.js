import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'pages/Recommend'
import Singer from 'pages/Singer'
import Hot from 'pages/Hot'
import Search from 'pages/Search'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/redirect'
    },
    {
      path: '/Recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer
    },
    {
      path: '/hot',
      name: 'Hot',
      component: Hot
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
