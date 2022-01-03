import store from '@/store'
import Vue from 'vue'

const alertPlugin = {
  install() {
    Vue.prototype.$error = (text = 'Ошибка') => {
      store.dispatch('alerts/add', {
        text
      })
    }

    Vue.prototype.$success = (text = 'Успешно') => {
      store.dispatch('alerts/add', {
        type: 'success',
        text,
      })
    }
  }
}

export default alertPlugin
