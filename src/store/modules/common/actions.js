import {
	getUserInfo
} from "../../../api/testApi";

/**
 *@desc: 测试接口！！！
 *@author: XinD
 *@date: 2020/12/8
 */
const actions = {
	// 获取个人基本信息
	getUserInfo ({ commit }, payload) {
		return new Promise((resolve, reject) => {
			getUserInfo(payload).then((res = {}) => {
				commit('SET_USERINFO', res);
				resolve(res);
			}).catch(error => {
				reject(error);
			});
		});
	}
};

export default actions;
