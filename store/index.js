
import { getAllCookies } from "~/assets/utils/cookies";

export default {
  state () {
    return {
      auth: null,
      token: getAllCookies()[process.env.SSO_COOKIE_NAME] || '',
      isLightTheme: {type: Boolean},
    }
  },

  mutations: {
    setIsLightTheme(state, value) {
			if (process.client) {
			  this.$cookies.set("isLightTheme", value, {
          path: "/",
          domain: location.host.includes("business-in-a-box.com")
            ? ".business-in-a-box.com"
            : undefined,
          maxAge: 60 * 60 * 24 * 30,
			  });
			}
			state.isLightTheme = value;
		},
  },

  actions: {
    setToken({ commit }, payload) {
      this.$cookies.set(process.env.SSO_COOKIE_NAME, payload.ssojwt, {
        path: '/',
        domain: location.host.includes("business-in-a-box.com") ? 'business-in-a-box.com' : undefined,
        maxAge: 60 * 60 * 24 * 30
      })
    },

    nuxtServerInit({ commit }, { app }) {
			if (app.$cookies.get("isLightTheme")) {
				commit("setIsLightTheme", app.$cookies.get("isLightTheme"));
			}
		},
  },

  getters: {
  }
}

export const store = () => {
  return process.browser && $nuxt.$store;
};
