const accountData = {
	userId : null,
	userStatus: null,
	userRole: null,
	userEmail: null,
	userFirstName: '',
	userLastName: '',
	businessId: null,
	businessStatus: null,
	photo: null,
}

import { getAllCookies } from "~/assets/utils/cookies";
import axios from "axios";

export default {
	state () {
		return {
			data: JSON.parse( JSON.stringify( accountData ) )
		}
	},

	getters: {
		userId(state) {
			return state.data.userId
		} 
	},

	mutations : {
		SET ( state, payload ) {
			state.data = { ...payload }
		},
	},

	actions : {
		credentials ({state, dispatch }, entryPoint) {
			this.$mobile.emit("autologinFailed", { email: state.data.userEmail });
			dispatch('reset');
			
			this.$cookies.remove(process.env.SSO_COOKIE_NAME, { domain: 'business-in-a-box.com' });
			this.$cookies.remove(process.env.SSO_COOKIE_NAME);

			window.location.href = `${process.env.authModule}${entryPoint}`
		},

		reset( {commit} ) {
			commit('SET', accountData)
		},

		update({ state, commit }, payload) {
			commit('SET', {
				userId : payload.Id || state.data.userId,
				userStatus: payload.Status || state.data.userStatus,
				userRole: payload.Role || state.data.userRole,
				userEmail: payload.Email || state.data.userRole,
				userFirstName: payload.FirstName || state.data.userFirstName,
				userLastName: payload.LastName || state.data.userLastName,
				businessId: payload.BusinessId || state.data.BusinessId,
				businessStatus: payload.businessStatus || state.data.businessStatus,
				photo: payload.Photo || state.data.photo,
			})
		},

		async authenticate ( {commit, dispatch}, refreshUser ) {
			const ssojwt = this.$cookies.get(process.env.SSO_COOKIE_NAME)
			const entryPoint = window.location.href
			if ( !ssojwt ) {
				dispatch('credentials', entryPoint)
				return
			} else {
				axios.defaults.headers.common.Authorization = `Bearer ${this.$cookies.get(process.env.SSO_COOKIE_NAME)}`
				const request = axios.create({
					baseURL: process.env.BackEnd_API_URL,
					headers: {
					  Authorization: `Bearer ${getAllCookies()[process.env.SSO_COOKIE_NAME]}`,
					  client_time: new Date().toISOString(),
					}
				});
				try {
					const { u } = await request.post(`/user/sso/verify`, { token: ssojwt })
						.then((res) => {
						return res.data;
						})
						.catch((err) => {
						return { err: err.response && err.response.data || err };
					});
					  
					const [account] = await request.get(`/user/${u.sub}`)
						.then((res) => {
						return res.data;
						})
						.catch((err) => {
						return { err: err.response && err.response.data || err };
						});

					commit('SET', {
						userId : account.Id,
						userStatus: account.Status,
						userRole: account.Role,
						userEmail: account.Email,
						userFirstName: account.FirstName || '',
						userLastName: account.LastName || '',
						businessId: account.BusinessId,
						businessStatus: u.subbs,
						photo: account.Photo
					})

					if(!refreshUser){
						commit('context/APP_READY', null, {root: true})
						this.$mobile.emit("userLogin", { 
							email: account.Email,
							id: account.Id,
							businessId: account.BusinessId,
							ssoToken: ssojwt,
						 });
					}
				}
				catch(e) {
					console.log(`login error -> `, e);
					dispatch('credentials', entryPoint)
				}
			}
		},

		keepUserLogged(context) {
			this.$cookies.set('b_keepin', true, {
				path: '/',
				domain: location.host.includes('business-in-a-box.com') ? 'business-in-a-box.com' : undefined,
				maxAge: 60 * 60 * 24 * 30
			})
        },

		logout({state, dispatch}) {
			this.$mobile.emit("userLogout", { id: state.data.userId });

			dispatch('reset')
			this.$cookies.remove(process.env.SSO_COOKIE_NAME, { path: '/', domain: 'business-in-a-box.com' })
            this.$cookies.remove(process.env.SSO_COOKIE_NAME, { path: '/' })
			this.$cookies.remove('identification', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('identification', { path: '/' })
			this.$cookies.remove('account', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('account', { path: '/' })
			this.$cookies.remove('b_keepin', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('b_keepin', { path: '/' })

			window.location.href = `${process.env.authModule}${window.location.href}`
		},

		global_logout( {dispatch} ) {
			dispatch('reset')
			this.$cookies.remove(process.env.SSO_COOKIE_NAME, { path: '/', domain: 'business-in-a-box.com' })
            this.$cookies.remove(process.env.SSO_COOKIE_NAME, { path: '/' })
			this.$cookies.remove('identification', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('identification', { path: '/' })
			this.$cookies.remove('account', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('account', { path: '/' })
			this.$cookies.remove('b_keepin', { path: '/', domain: 'business-in-a-box.com' })
			this.$cookies.remove('b_keepin', { path: '/' })

			window.location.href = `${process.env.AppAccont}/login`
		}
	},
}