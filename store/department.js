const departmentdata = {
	Id: null, 
    BusinessId: null, 
    DeptName: '', 
    Description: '',
}

export default {
	state () {
		return {
			data: JSON.parse( JSON.stringify( departmentdata ) )
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
			commit('SET', departmentdata)
		},

		update({ state, commit }, payload) {
			commit('SET', {
				Id : payload.Id || state.data.Id,
				BusinessId: payload.BusinessId || state.data.BusinessId,
				DeptName: payload.DeptName || state.data.DeptName,
				Description: payload.Description || state.data.Description,
			})
		},
	},
}