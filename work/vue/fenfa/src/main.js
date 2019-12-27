import Vue from 'vue';
import App from './App.vue';
import store from './store/index'
import {sync} from 'vuex-router-sync'
import router from './router';
import './utils/rem';


Vue.config.productionTip = false;
const unsync = sync(store, router);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
