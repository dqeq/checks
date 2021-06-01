import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import OneFieldPage from '@/components/OneFieldPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/one',
      name: 'OneFieldPage',
      component: OneFieldPage
    }
  ]
})
