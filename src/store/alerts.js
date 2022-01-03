let AI = 0

export default {
  namespaced: true,
  state: () => ({
    list: []
  }),
  getters: {
    list: state => state.list
  },
  mutations: {
    add(state, alert) {
      state.list.push(alert)
    },
    remove(state, id) {
      state.list = state.list.filter(el => el.id !== id)
    }
  },
  actions: {
    add({ dispatch, commit }, { text = 'Ошибка', timeout = 5000, type = 'error', dismissible = false } = {}) {
      commit('add', { text, type, id: ++AI, timeout, dismissible })
      if(timeout) {
        let id = AI
        setTimeout(() => {
          dispatch('remove', id)
        }, timeout)
      }
    },

    remove({ commit }, id) {
      commit('remove', id)
    }
  }
}