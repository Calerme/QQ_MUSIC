import Vue from 'vue'
import Router from 'vue-router'

// import Recommend from 'pages/Recommend'
// import Singer from 'pages/Singer'
// import Hot from 'pages/Hot'
// import Search from 'pages/Search'
// import SingerDesc from 'pages/SingerDesc'
// import Disc from 'pages/disc'
// import TopList from 'pages/TopList'
// import Dashboard from 'pages/Dashboard'

Vue.use(Router)

const Recommend = (resolve) => {
  import('pages/Recommend')
    .then(module => {
      resolve(module)
    })
}
const Singer = (resolve) => {
  import('pages/Singer')
    .then(module => {
      resolve(module)
    })
}
const Hot = (resolve) => {
  import('pages/Hot')
    .then(module => {
      resolve(module)
    })
}
const Search = (resolve) => {
  import('pages/Search')
    .then(module => {
      resolve(module)
    })
}
const SingerDesc = (resolve) => {
  import('pages/SingerDesc')
    .then(module => {
      resolve(module)
    })
}
const Disc = (resolve) => {
  import('pages/disc')
    .then(module => {
      resolve(module)
    })
}
const TopList = (resolve) => {
  import('pages/TopList')
    .then(module => {
      resolve(module)
    })
}
const Dashboard = (resolve) => {
  import('pages/Dashboard')
    .then(module => {
      resolve(module)
    })
}

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
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDesc
        }
      ]
    },
    {
      path: '/dashboard',
      component: Dashboard
    }
  ]
})
