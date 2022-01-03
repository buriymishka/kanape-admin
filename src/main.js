import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import alertPlugin from '@/plugins/alert'
import '@/assets/styles/global.sass'

Vue.use(alertPlugin)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
})

app.$mount('#app')

export default app
