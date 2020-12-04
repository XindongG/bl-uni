const getters = {
	requestLoading: state => state.app.requestLoading,
	size: state => state.app.size,
	token: state => state.user.token,
	// name: state => state.user.name,
	roles: state => state.user.roles
};
export default getters;
