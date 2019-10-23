import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import {sync} from 'vuex-router-sync'
import {Message, MessageBox} from "element-ui";

Vue.component(Message);
Vue.component(MessageBox);
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$alert = MessageBox.alert;

Vue.config.productionTip = false;

const unsync = sync(store, router);
import "./permissions";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
