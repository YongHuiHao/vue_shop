// 引入vue
import Vue from 'vue'
// 引入App组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入API
import * as API from './api'
// 引入element-ui
import './plugins/element'
// 引入字体图标样式
import './assets/fonts/iconfont.css'
// 引入全局样式表
import './assets/css/global.css'

// 将api添加到vue的原型对象上
Vue.prototype.$API = API

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
