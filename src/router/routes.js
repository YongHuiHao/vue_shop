import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Home/Welcome'
import Users from '@/components/Home/Users'

// 向外暴露routes数组
export default [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]
