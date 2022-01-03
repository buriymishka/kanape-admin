export default {
  namespaced: true,
  state: () => ({
    user: null,
  }),
  getters: {
    user: state => state.user,
  },
  mutations: {
    setUser(state, newUser) {
      state.user = newUser
    }
  },
  actions: {
    setUser({ commit }, newUser) {
      commit('setUser', newUser)
    }
  }
}
