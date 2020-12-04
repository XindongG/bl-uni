/**
 *@desc
 *@author jiay
 *@date 2020/3/24 上午9:44
 */
import axios from "axios";
import Vue from "vue";
import {Notify, Toast} from "vant";
import store from "../store/index.js";

Vue.use(Toast);
const instance = axios.create({
	timeout: 50000
});

class Request {
	constructor(baseURL) {
		this.baseUrl = baseURL;
		this.queue = {};
	}

	checkStatus(response) {
		let responseData = response.data;
		switch (responseData.status) {
		case 0 :
			return Promise.resolve(responseData);
		case '0' :
			return Promise.resolve(responseData);
		case 200:
			return Promise.resolve(responseData);
		case 10001:
			return Promise.resolve(responseData);
		case -111:
			return Promise.resolve(responseData);
		case '-10000':
			return Promise.reject(responseData);
		case 2:
			Toast({
				message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
			});
			return Promise.reject(responseData);
		case 20000:
			Toast({
				message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
			});
			return Promise.resolve(responseData);
		case -1:
			Toast({
				message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
			});
			return Promise.reject(responseData);
		case -2:
			return Promise.reject(responseData);
		case -100:
			Toast({
				message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
			});
			return Promise.reject(responseData);
		case -103:
			Toast("对不起，您还没有绑定邮箱，请手机号找回");
			if(responseData.statusText === '该账户未绑定邮箱！' || responseData.message === '该账户未绑定邮箱！') {
				return Toast("对不起，您还没有绑定邮箱，请手机号找回");
			} else {
				Toast({
					message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
				});
				return Promise.reject(responseData);
			}
		case -403:
			localStorage.token && store.commit("DEL_USERINFO", 403);
			return Promise.reject(responseData);
		default:
			if(responseData.message !== '您的账户未注册，请先注册') {
				if(responseData.error === 0) {
					return Promise.resolve(responseData);
				} else {
					Toast({
						message: responseData.statusText || responseData.message || '操作失败,请稍后再试！'
					});
					return Promise.reject(responseData);
				}
			} else {
				return Promise.resolve(responseData);
			}
		}
	}

	interceptors(instance, url, data, headers, type) {
		// 请求拦截
		// type === 1 && window.$webview({
		// 	postRequest: {
		// 		url: url,
		// 		header: {
		// 			"X-Requested-With": "XMLHttpRequest",
		// 			"Content-Type": "application/json",
		// 			token: localStorage.token || '',
		// 			userId: localStorage.userId || '',
		// 			...headers
		// 		},
		// 		body: JSON.stringify(data)
		// 	}
		// });
		instance.interceptors.request.use(config => {
			return config;
		}, error => {
			return Promise.reject(error);
		});
	}
	checkBaseUrl(baseUrl){
		switch (baseUrl) {
		case "/api":
			return "https://apptest.picchealth.com/picchealthappapi/api";
		case "/uc":
			return "https://apptest.picchealth.com/picchealthappapi/user";
		case "/chat":
			return "https://apptest.picchealth.com";
		case "/health":
			return "http://10.252.68.52:9090";
		case "/shop":
			return "https://dev-jkgltyzx.picchealth.com/eshop/eshop/eshopapp-appli-server";
		case "/wechat":
			return "https://api.weixin.qq.com/cgi-bin";
		case "/up":
			return "http://10.252.68.108:32003/hmms/hmbms-application";
		case "/insurance":
			return "http://apptest.picchealth.com:7080";
		default:
			return baseUrl;
		}
	}
	post(url, data, headers, baseUrl) {
		let time = 0;
		let timeFun = setInterval(() => {
			time++;
			if(time > 10) {
				clearInterval(timeFun);
				window.$webview({closeLoading: null});
			}
		}, 1000);
		// this.baseUrl = this.checkBaseUrl(this.baseUrl || baseUrl);
		this.interceptors(instance, baseUrl || this.baseUrl + url, data, headers, 1);
		return instance({
			method: "post",
			url,
			data,
			baseURL: baseUrl ? baseUrl : this.baseUrl,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				token: localStorage.token || '',
				userId: localStorage.userId || '',
				oldUserId: localStorage.oldUserId || localStorage.userId,
				...headers
			}
		}).then(
			(response) => {
				clearInterval(timeFun);
				// window.$webview({closeLoading: null});
				return this.checkStatus(response);
			}
		).catch(
			(err) => {
				window.$webview({closeLoading: null});
				if(err.response && err.response.status === 500) {
					window.location.hash !== '#/error/serverError' && window.location.hash !== '/error/serverError' && window.$routerGo('/error/serverError');
				} else if(err.status !== '-10000') {
					if(err.statusText === 'Network Error' || err.message === 'Network Error' || err.statusText === 'timeout of 50000ms exceeded' || err.message === 'timeout of 50000ms exceeded') {
						// Toast({
						// 	message: err.statusText || err.message || '服务器报错'
						// });
						return false;
					} else if(err.status === -2) {
						Toast({
							message: '操作失败,请稍后再试！'
						});
					} else {
						// Toast({
						// 	message: err.statusText || err.message || '服务器报错'
						// });
					}
				}
				// window.$SentryErr(err);
				return Promise.reject(err);
			}
		);
	}

	get(url, params, headers, baseUrl) {
		let time = 0;
		let timeFun = setInterval(() => {
			time++;
			if(time > 10) {
				clearInterval(timeFun);
				window.$webview({closeLoading: null});
			}
		}, 1000);
		this.interceptors(instance, baseUrl || this.baseUrl + url, params, headers, 0);
		return instance({
			method: "get",
			url,
			params, // get 请求时带的参数
			baseURL: baseUrl ? baseUrl : this.baseUrl,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				token: localStorage.token || '',
				userId: localStorage.userId || '',
				oldUserId: localStorage.oldUserId || localStorage.userId,
				...headers
			}
		}).then(
			(response) => {
				clearInterval(timeFun);
				// window.$webview({closeLoading: null});
				return Promise.resolve(response);
			}
		).catch(
			(err) => {
				window.$webview({closeLoading: null});
				if(err.statusText === 'Network Error' || err.message === 'Network Error' || err.statusText === 'timeout of 50000ms exceeded' || err.message === 'timeout of 50000ms exceeded') {
					// Toast({
					// 	message: err.statusText || err.message || '服务器报错'
					// });
					return false;
				} else if(err.status === -2) {
					Toast({
						message: '操作失败,请稍后再试！'
					});
				} else {
					// Toast({
					// 	message: err.statusText || err.message || '操作失败,请稍后再试！'
					// });
				}
				// window.$SentryErr(err);
				return Promise.reject(err);
			}
		);
	}
}

export default Request;
