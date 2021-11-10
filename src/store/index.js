import { createStore } from 'vuex'

export default createStore({
  state: {
    version: process.env.VUE_APP_VERSION || '0',
    folders: {
      base: process.env.BASE_URL,
      fonts: 'fonts/',
    },
    routing: {
      pages: null,
      topics: null,
      content: null,
    },
    theme: {
      mode: "dark"
    },
  },
  getters: {
    appVersion: (state) => {
      return state.version.replace(/["]+/g, '')
    },
    pages: (state) => {
      return state.routing.pages;
    },
    topics: (state) => {
      return state.routing.topics;
    },
    content: (state) => (filter) => {
      if (filter != undefined) {
        return state.routing.content.filter(i => filter.includes(i.topic));
      }
      return state.routing.content;
    },
    researchLinks: (state) => (filter) => {
      if (filter != undefined) {
        return state.routing.topics.filter(i => filter.includes(i.name))[0]["researchLinks"];
      }
    },
    abstract: (state) => (filter) => {
      if (filter != undefined) {
        return state.routing.topics.filter(i => filter.includes(i.name))[0]["abstract"];
      }
    },
    themeChange: (state) => {
      return state.theme.mode;
    },
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
