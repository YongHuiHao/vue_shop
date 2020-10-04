// 引入vue
import Vue from 'vue'
// 引入element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'
// 按需引入所需组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 声明并注册相关组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message = Message
