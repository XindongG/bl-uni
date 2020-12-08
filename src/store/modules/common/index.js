import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";
import config from "@/config";
const common = {
	state: {
		userInfo: null
	},
	getters,
	mutations,
	actions
};

export default common;
