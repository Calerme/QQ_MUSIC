import Vue from 'vue'
import Router from 'vue-router'

import Recommend from 'pages/Recommend'
import Singer from 'pages/Singer'
import Hot from 'pages/Hot'
import Search from 'pages/Search'
import SingerDesc from 'pages/SingerDesc'
import Disc from 'pages/disc'
import TopList from 'pages/TopList'

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
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
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
      component: Hot,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'Search',
      component: Search
    }
  ]
})
