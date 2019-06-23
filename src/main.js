import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// /**引入公共样式，最好在elementui后边引入可以替换element里边不需要的样式*/

import './styles/index.less'

import router from './router'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
