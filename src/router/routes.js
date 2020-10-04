// 引入Login组件
import Login from '@/components/Login'
// 引入Home组件
import Home from '@/components/Home'

// 向外暴露routes数组
export default [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/',
    redirect: '/login'
  }
]
