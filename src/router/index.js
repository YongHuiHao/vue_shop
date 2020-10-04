// 引入vue
import Vue from 'vue'
// 引入vue-router
import VueRouter from 'vue-router'
// 引入routes对象
import routes from './routes'

// 声明使用vue-router
Vue.use(VueRouter)

// 向外暴露router实例
const router = new VueRouter({
  mode: 'history',
  routes
})


// 设置全局路由守卫,没有登录的情况下，不允许访问其他页面
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  // 如果访问的是login页面，则直接放行
  if (to.path === '/login') return next()
  // 判断是否登录
  if (token) {
    // 如果已登录，则放行
    next()
  } else {
    // 否则，跳转到登录页
    next('/login')
  }
})

export default router
