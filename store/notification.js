import axios from "axios";
import { request, requestGeneric, handleResponse } from "~/assets/utils/axios";

export default {
  state () {
    return {
        isShow: false,
        text: '',
        variant: '',
        newsletters: true,
        notificationEmail: true,
        notificationSms: true,
    }
  },

  mutations: {
    SET(state, payload) {
        state.isShow = payload[0]
        state.text = payload[1]
        state.variant = payload[2]
    },
    SET_NEWSLETTERS(state, payload) {
      state.newsletters = payload
    },
    SET_NOTIFICATIONEMAIL(state, payload) {
      state.notificationEmail = payload
    },
    SET_NOTIFICATIONSMS(state, payload) {
      state.notificationSms = payload
    },
  },

  actions: {
    set({ commit }, payload) {
      commit('SET', payload)
    },
    set_newsletters({ commit }, payload) {
      commit('SET_NEWSLETTERS', payload)
    },
    set_notificationEmail({ commit }, payload) {
      commit('SET_NOTIFICATIONEMAIL', payload)
    },
    set_notificationSms({ commit }, payload) {
      commit('SET_NOTIFICATIONSMS', payload)
    },
    async getNotifications ({ commit, dispatch, state }, data) {
      return await requestGeneric
        .get(`/account/notifications/${data.userId}`)
        .then((res) => {
          return res.data
        })
        .catch((err) => {
          return { err: err.response && err.response.data || err };
        });
    },
    async updateNotifications ({state, commit, dispatch}, userId){
      const data = {
        language: "en",
        newsletters: {
          insider: state.newsletters
        },
        notificationEmail: state.notificationEmail,
        notificationSms: state.notificationSms
      }
      return await requestGeneric
      .put(`/account/notifications/${userId}`, data)
      .then((res) => {
        $nuxt.$gtm.push({eventCategory: 'Business', eventLabel: 'Update business', eventAction: 'update'});
        return res.data;
      })
      .catch((err) => {
        return { err: err.response && err.response.data || err };
      });
    }
  },

  getters: {
    newsletters(state) {
			return state.newsletters
		},
    notificationEmail(state) {
			return state.notificationEmail
		},
    notificationSMS(state) {
			return state.notificationSms
		},
  }
}