import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress'
Vue.use(Router)
const routes = [
  {
    path: '/index',
    component: ()=>import('../views/index.vue')
  }
]

const router = new Router({
  mode: 'history',
  routes
})

if (typeof window !== 'undefined') {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })
  router.afterEach((to, from) => {
    NProgress.done()
  })
}

export const createRouter = () => router
