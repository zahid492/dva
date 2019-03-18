import Vue from 'vue'
import {
  Table,
  TableColumn,
  Form,
  FormItem,
  Input,
  Button,
  Row,
  Col,
  Loading,
  Notification,
  Message,
  MessageBox
} from 'element-ui'

import lang from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

// configure language
locale.use(lang)

// set
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message

// import components


Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)

Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Input.name, Input)

Vue.component(Button.name, Button)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)

