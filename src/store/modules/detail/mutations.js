const mutations = {
	SET_NAME: (state, paload) => {
		state.name = paload.name;
	},
	SET_AVATAR: (state, paload) => {
		state.avatar = paload;
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles;
	},
	// SAVE_USERINFO: (state, paload) => {
	// 	state.userInfo = paload;
	// },
	SAVE_JOBNUMBER: (state, jobNumber) => {
		state.jobNumber = jobNumber;
	}
};
export default mutations;