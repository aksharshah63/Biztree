export default {
	state() {
		return {
			selectorOn: false,
			code: "en"
		}
	},

	getters: {
	},

	mutations: {
		TOGGLE_SELECTOR(state, payload = null) {
			state.selectorOn = payload == null ? !state.selectorOn : payload
		},
		SET_LANGUAGE(state, code) {
			state.code = code
			this.$cookies.set(process.env.LANG_COOKIE_NAME, code, {
				path: '/',
				domain: 'business-in-a-box.com',
				maxAge: 60 * 60 * 24 * 30
			})
		}
	},

	actions: {
		selectorOn({ commit }, payload) {
			commit('context/CLICK_COORDS', { x: payload.pageX, y: payload.pageY }, { root: true })
			commit('TOGGLE_SELECTOR')
		},
		change({ commit }, payload) {
			commit('TOGGLE_SELECTOR', false)
			commit('SET_LANGUAGE', payload.code)
		}
	},
}