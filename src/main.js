import Vue from 'vue'
import App from './App'
import router from './router'
/** 第三方组件 Element-UI */
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
// 网络请求
import axios from './network/index'
Vue.config.productionTip = false
Vue.prototype.$http = axios

// Vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
