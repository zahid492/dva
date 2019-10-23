import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Message} from "element-ui";

Vue.component(Message);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
