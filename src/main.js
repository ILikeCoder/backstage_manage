import Vue from 'vue'
import App from './App'
import router from './router'

/** 第三方组件 */
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'

/** 网络请求封装 */
import axios from 'axios'
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
