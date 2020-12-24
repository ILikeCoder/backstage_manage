import Vue from 'vue'

import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui'

let components = [
  Button,
  Form,
  FormItem,
  Input,
  Container,
  Aside,
  Header,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
]

// 导入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

// 面包屑公共组件
import BreadCrumb from 'components/common/BreadCrumb'
// 注册进一步封装后的面包屑全局组件。
Vue.component(BreadCrumb.name, BreadCrumb)

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

// 用循环的方式注册element的组件
for (let component of components) {
  Vue.use(component)
}
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$Message = Message
