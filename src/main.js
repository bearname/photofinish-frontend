import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
require('dotenv').config()
import {registerPlugins} from "./plugins";
import {createStore} from './store';
import './util/util';
import routerModule from "./routers";
// import {sync} from 'vuex-router-sync';

Vue.config.productionTip = false
registerPlugins(Vue);
const store = createStore();
const router = routerModule.getInstance(store)
// createRouter(vuetify, store)
// sync(store, router)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
