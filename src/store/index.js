import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/store/user'
import alerts from '@/store/alerts'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loaded: false
  },
  getters: {
    loaded: state => state.loaded
  },
  mutations: {
    setLoaded(state, newLoaded) {
      state.loaded = newLoaded
    }
  },
  actions: {
    setLoaded({ commit }, newLoaded) {
      commit('setLoaded', newLoaded)
    }
  },
  modules: {
    user,
    alerts
  },
  strict: process.env.NODE_ENV !== 'production'
})
