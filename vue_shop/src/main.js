import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标D1-17
import './assets/fonts/iconfont.css'
// 导入全局样式表D1-15
import './assets/css/global.css'
// 导入 vue-table-with-tree-grid,D4-6
import TreeTable from 'vue-table-with-tree-grid'


// 导入axios然后挂载到vue，设置请求根路径，D1-22
import axios from 'axios'
// 配置请求的根路径，D1-22
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 通过axios 请求拦截器添加token，保证拥有获取数据的权限，D2-4
axios.interceptors.request.use(config => {
  // console.log(config)
  // 把 token发送到客户器端
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须 return config 
  return config
})
Vue.prototype.$http = axios


Vue.config.productionTip = false;

// 注册TreeTable 组件，D4-6
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
