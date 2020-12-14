import Vue from 'vue'
import App from './App'
import router from './router'
/** 第三方组件 */
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './network/index'
Vue.config.productionTip = false
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
