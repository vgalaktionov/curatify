import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: () => ({
    user: null
  }),

  mutations: {
    SET_USER(state, user) {
      state.user = user
    }
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.session && req.session.user) {
        commit('SET_USER', req.session.user)
      }
    }
  }

})

export default store
