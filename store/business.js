import { getBusiness, getSubscriptionInfo } from "~/model/business";
export default {
  state () {
    return {
        AutoRenewal: 0,
        data: {},
        subscriptionInfo: {},
    }
  },

  mutations: {
    SET ( state, payload ) {
			state.data = { ...payload }
		},

    SET_AUTORENEWAL(state, payload) {
      state.AutoRenewal = payload
    },

    SET_SUBSCRIPTION_INFO(state, payload) {
      state.subscriptionInfo = { ...payload }
    },
  },

  actions: {
    async getBusiness ({commit, rootState}) {
      const businessId = rootState.account.data.businessId;
      if(!businessId ) return;

      const [business] = await getBusiness({ businessId });
      commit('SET', business);

      return business;
    },

    set_AutoRenewal({ commit }, payload) {
      commit('SET_AUTORENEWAL', payload)
    },

    async getSubscriptionInfo ({commit, rootState}) {
      const businessId = rootState.account.data.businessId;
      if(!businessId ) return;

      const info = await getSubscriptionInfo({ businessId });
      commit('SET_SUBSCRIPTION_INFO', info);

      return info;
    },
  },

  getters: {
  }
}