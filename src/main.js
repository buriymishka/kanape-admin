import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import alertPlugin from '@/plugins/alert'
import currencyFilter from './filters/currency';
import dateFilter from './filters/date';
import '@/assets/styles/global.sass'
import VuetifyConfirm from 'vuetify-confirm'

Vue.use(VuetifyConfirm, { vuetify })
Vue.use(alertPlugin)
Vue.filter('currency', currencyFilter)
Vue.filter('date', dateFilter)

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
})

app.$mount('#app')

export default app
