import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 关闭生产环境提示
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
