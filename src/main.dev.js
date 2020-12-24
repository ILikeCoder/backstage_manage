import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'

// 导入NProgress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中，展示进度条NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//在response拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

import BreadCrumb from './components/common/BreadCrumb.vue'
Vue.component(BreadCrumb.name, BreadCrumb)
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
