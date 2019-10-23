import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import {sync} from 'vuex-router-sync'
import {Message} from "element-ui";

Vue.component(Message);
Vue.prototype.$message = Message;

Vue.config.productionTip = false;
const unsync = sync(store, router);

import './permission';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
