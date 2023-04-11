import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import VueRouter from "vue-router";
import global_ from './components/Global'//引用文件 
// import _axios from './plugins/axios'
// Vue.prototype.$axios = _axios;

Vue.prototype.GLOBAL = global_//挂载到Vue实例上面
Vue.use(ElementUI);
Vue.config.productionTip = false
// Vue.use(router)
Vue.use(VueRouter)
new Vue({
  render: h => h(App),
  router:router
}).$mount('#app')

