export default {
	state () {
		return {
			store: null, // The platform store for the cuurent account (Apple Store, Google store, etc)
			navigationRoot: null,
			appReady: false,
			clickCoords: {},
			userMenuOn: false,
			purchaseCompleted: false, // Was a purchase just being completed (required for the confirmation)?
		}
	},

	getters: {
		/**
		 * Whether the app runs as a website in a browser
		 * (not embedden in any desktop platform)
		 */
		webEnvironment(state, getters, rootState) {
			return state.store == null
		}
	},

	mutations : {
		SET(state, payload) {
			Object.keys(state).forEach(key => {
				if (key in payload) state[key] = payload[key]
			})
		},
		TOGGLE_PURCHASE_COMPLETION(state, payload) {
			state.purchaseCompleted = payload
		},
		APP_READY (state) {
			state.appReady = !state.appReady
		},
		ROOT_FOLDER (state, payload=null) {
			if ( payload==null  ) {
				state.navigationRoot = null
				return
			}
			state.navigationRoot = payload
		},
		CLICK_COORDS (state, payload) {
			state.clickCoords = {
				x: payload.x,
				y: payload.y,
			}
		},
		TOGGLE_USER_MENU ( state, payload=null ) {
			state.userMenuOn =  payload==null ?  !state.userMenuOn : payload
		}
	},

	actions : {
		clear({ commit, dispatch }) {
			/** 
			 * <meta userLogin> is a method to communicate data to the Electron (Google Android version)
			 * as the back end platform can not process the "detail" of the standard custom event
			 */
			document.querySelectorAll('[userLogin]').forEach(meta => meta.parentNode.removeChild(meta)) // 
		},

		storeSet({ state, commit, dispatch }, route) {
			/* Retrieve potentiol value from the route */
			const retrieveFromRoute = () => {
				const appTypes = ["WIN", "MACOS", "MSFTWIN", "AAPLMACOS", "AAPLIOS", "GOOGANDR"];
				let SourceDesktopApp = this.$cookies.get('SourceDesktopApp') || null;


				if ('SourceDesktopApp' in route.query && route.query.SourceDesktopApp != SourceDesktopApp) {
					let routeParam = appTypes.indexOf(route.query.SourceDesktopApp.toUpperCase());
					routeParam = routeParam == -1 ? false : appTypes[routeParam];

					if (routeParam) {
						this.$cookies.set("SourceDesktopApp", routeParam, {
							path: '/',
							domain: location.host.includes("business-in-a-box.com") ? ".business-in-a-box.com" : undefined,
							maxAge: 60 * 60 * 24 * 30,
						})

						SourceDesktopApp = routeParam;
					}
				}

				SourceDesktopApp && setTrackingSource({ CustomTracking: `SourceDesktopApp:${SourceDesktopApp}` });
				return SourceDesktopApp;
			}

			/* Retrieve potentiol value from the local storage */
			const retrieveFromfromStorage = () => {
				return localStorage.getItem('ExternalStore') || null
			}

			/* Save the value of the store*/
			const save = (store) => {
				commit('SET', { store })
			}




			let store = retrieveFromRoute()
			if (store != null) {
				save(store)
				return
			}

			store = retrieveFromfromStorage()
			if (store != null) save(store)

		},

		/**
		 * Verify if apurchase has just been completed
		 * and trigger the purchase completed dialog
		 */
		checkPurchaseCompleted({ commit }) {
			const purchaseIntent = JSON.parse(localStorage.getItem('purchaseIntent'));
			if ((purchaseIntent && purchaseIntent.purchaseCompleted)) {
				commit('TOGGLE_PURCHASE_COMPLETION', true)
				localStorage.setItem('refreshAccount', 'true') // notify other tabs (other Vue insances) that a purchase has been made so data needs to be refreshed in the respective tabs
				localStorage.removeItem("purchaseIntent");
			}
		},
		callToAction ({rootState}, data) {		
			if(rootState.account.data.businessStatus == "FREETRIAL" && this.$mobile.emit("appStorePurchaseDialogInitiate", { action: data.url?.split('/').pop() })) return
			
			window.location.href = `${data.url}?lang=${this.$i18n.locale}&lib=${this.$i18n.locale}${data.documentName ? `&documentName=${data.documentName}` : ''}&redirect=${location.href}`;
		},
		userMenuOn ({state, commit}, payload) {			
			commit('context/CLICK_COORDS', {x: payload.pageX, y: payload.pageY}, {root:true})
			commit('TOGGLE_USER_MENU')
		},
	},
}