// 引入二次封装的axios
import request from './request'

// 登录
export const reqLogin = (username, password) => request.post('login', { username, password })