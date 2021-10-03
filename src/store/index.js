import { createStore } from 'vuex'

export default createStore({
  state: {
    version: process.env.VERSION || '0'
  },
  getters: {
    appVersion: (state) => {
      return state.version
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
