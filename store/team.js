const teamdata = {
	Id: null, 
    BusinessId: null, 
    TeamName: '', 
    Description: '',
    DeptId: null
}

export default {
	state () {
		return {
			data: JSON.parse( JSON.stringify( teamdata ) )
		}
	},

	getters: {
		userId(state) {
			return state.data.Id
		} 
	},

	mutations : {
		SET ( state, payload ) {
			state.data = { ...payload }
		},
	},

	actions : {
		reset( {commit} ) {
			commit('SET', teamdata)
		},

		update({ state, commit }, payload) {
			commit('SET', {
				Id : payload.Id || state.data.Id,
				BusinessId: payload.BusinessId || state.data.BusinessId,
				TeamName: payload.TeamName || state.data.TeamName,
				Description: payload.Description || state.data.Description,
				DeptId: payload.DeptId || state.data.DeptId,
			})
		},
	},
}