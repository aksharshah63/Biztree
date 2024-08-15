/**
 * The appearance and behavior of various UI elements
 */

export default {
	state : {
		backButtonVisible: false,
		onboardFreeDocument: true,
		paymentModal: false,
		feedbackModal: false,
	},

	getters: {
		showOnboardFreeDocument( state, getters, rootState ) {
			return rootState.account.DownloadCounter == 0 && state.onboardFreeDocument &rootState.account.businessStatus=="FREETRIAL"
		}
	},

	mutations : {
		TOGGLE_BACK_BUTTON( state, payload=null ) {
			state.backButtonVisible = payload != null ? payload : !state.backButtonVisible
		},
		ONBOARD_FREE_DOCUMENT (state, payload=null ) {
			state.onboardFreeDocument = payload != null ? payload : !state.onboardFreeDocument
		},
		PAYMENT_MODAL(state, payload){
			state.paymentModal = payload
		},
		FEEDBACK_MODAL(state, payload) {
			state.feedbackModal = payload
		},
	},

	actions : {
	},

	namespaced: true
}