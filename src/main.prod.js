import Vue from 'vue'
import App from './App'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import {Message,MessageBox} from 'element-ui'
// 网络请求
import axios from 'axios'
import NProgress from 'nprogress'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
import BreadCrumb from './components/common/BreadCrumb.vue'

Vue.component(BreadCrumb.name, BreadCrumb)
Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
Vue.prototype.$Message = Message
Vue.prototype.$confirm = MessageBox.confirm

// Vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
