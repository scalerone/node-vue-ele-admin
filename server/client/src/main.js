import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles'
import axios from './http'

Vue.use(VueParticles);
Vue.use(ElementUI);

Vue.prototype.$axios = axios;// 将api挂载到vue的原型上-供全局使用

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
