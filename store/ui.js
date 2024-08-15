import { getBrowser } from "@/assets/utils/misc";

export default {
	state() {
		return {
			gridView: true,
			windowSize: {},
			navigationCollapsed: false,
			browser: getBrowser(navigator.userAgent),
			isMobile: /Mobile|Android|webOS|Phone|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
		}
	},

	getters: {
	},

	mutations: {
		GRID_VIEW(state, payload = null) {
			state.gridView = payload != null ? payload : !state.gridView;
		},
		NAVIGATION_COLLAPSE(state, payload = false) {
			state.navigationCollapsed = payload;
		},
		WINDOW_SIZE(state, payload) {
			state.windowSize = payload;
		}
	},

	actions: {
	},
}