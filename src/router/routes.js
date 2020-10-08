import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Home/Welcome'
import Users from '@/components/Home/Users'
import Rights from '@/components/Home/Rights'
import Roles from '@/components/Home/Roles'


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
      },
      {
        path: 'rights',
        component: Rights
      },
      {
        path: 'roles',
        component: Roles
      }
    ]
  },
  {
    path: '/',
    redirect: '/login'
  }
]
