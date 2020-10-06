// 引入axios
import axios from 'axios'
import { Message } from 'element-ui'

// 进行axios的二次封装
const service = axios.create({
  // 基础路径
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  // 超时时间
  timeout: 20000
})

// 请求拦截器
service.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token')
  // 如果token存在，则每次请求都携带token
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const result = response.data
    // 当状态码非200时，抛出错误
    if (result.meta.status !== 200 && result.meta.status !== 201) {
      // 抛出错误
      return Promise.reject(new Error(result.meta.msg || '未知错误'))
    } else {
      return result
    }
  },
  // 响应错误
  error => {
    console.log("响应错误:" + error)
    return Promise.reject(error)
  }
)

export default service