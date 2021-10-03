import { createStore } from 'vuex'

export default createStore({
  state: {
    version: process.env.VERSION || '0',
    folders: {
      base: process.env.BASE_URL,
      fonts: 'fonts/',
    },
    routing: {
      pages: null,
      topics: null
    }
  },
  getters: {
    appVersion: (state) => {
      return state.version
    }
  },
  mutations: {
    UPDATE_STATE(state, { parent, key, value }) {
      state[parent][key] = value;
    },
  },
  actions: {
    updateState({ commit }, { parent, key, value }) {
      commit('UPDATE_STATE', { parent, key, value });
    },
  },
  modules: {
  }
})
