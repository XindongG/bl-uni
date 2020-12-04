import {
	queryBannerList,
} from "../../../api/detailList";
import { Notify, Toast } from "vant";

const actions = {
	// 提交意见反馈
	queryBannerList ({ commit }, payload) {
		return new Promise((resolve, reject) => {
			queryBannerList(payload).then((res = {}) => {
				if(payload.cb) payload.cb(res);
				resolve(res);
			}).catch(error => {
				reject(error);
			});
		});
	}
};

export default actions;
