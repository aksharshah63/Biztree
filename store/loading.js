let timeOut = null
let timeOut_Global = null
export default {
  state () {
    return {
        isLoading: false,
        isGlobalLoading: false,
    }
  },

  mutations: {
    SET(state, payload) {
      state.isLoading = payload
    },
    SET_GLOBAL(state, payload) {
      state.isGlobalLoading = payload
    }
  },

  actions: {
    set({ commit }, payload) {
      if (payload === true) {
        timeOut = setTimeout(() => {
          commit('SET', true)
        }, 800)
      }
      if (payload === false) {
        commit('SET', false)
        clearTimeout(timeOut)
      }
    },
    setGlobal({ commit }, payload) {
      if (payload === true) {
        timeOut_Global = setTimeout(() => {
          commit('SET_GLOBAL', true)
        }, 800)
      }
      if (payload === false) {
        commit('SET_GLOBAL', false)
        clearTimeout(timeOut_Global)
      }
    }
  },

  getters: {
  }
}