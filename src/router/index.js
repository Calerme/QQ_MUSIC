import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'pages/Recommend'
import Singer from 'pages/Singer'
import Hot from 'pages/Hot'
import Search from 'pages/Search'
import SingerDesc from 'pages/SingerDesc'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children: [
        {
          path: ':id',
          name: 'SingerDesc',
          component: SingerDesc
        }
      ]
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
