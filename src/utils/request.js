/**
 *@desc: axios
 *@author: XinD
 *@date: 2020/12/8
 */
import axios from "axios";
const instance = axios.create({
	timeout: 50000
});
let frequency = 0;
// 请求loading，仅供参考，可根据业务自行修改或重构
const loading = function (arg){
	let timer;
	if(arg){
		return function() {
			if(timer) clearTimeout(timer);
			frequency = frequency ? frequency + 1 : 1;
			timer = setTimeout(() => {
				uni.showLoading();
			}, 0);
		};
	} else if(frequency === 1){
		uni.hideLoading();
	} else {
		frequency = frequency - 1;
	}
};
//请求拦截
instance.interceptors.request.use(function (config) {
	loading(true)();
	return config;
}, function (error) {
	loading(false);
	return Promise.reject(error);
});
// 响应拦截
instance.interceptors.response.use(function (response) {
	loading(false);
	return response;
}, function (error) {
	loading(false);
	return Promise.reject(error);
});
class Request {
	constructor(baseURL) {
		this.baseUrl = baseURL;
		this.frequency = 0;
	}
	checkStatus(response){
		switch (response.status){
		case 200:
			return Promise.resolve(response.data);
		case 500:
			return Promise.reject(response);
		default:
			return Promise.resolve(response.data);
		}
	}

	post(url, data, headers, baseUrl) {
		return instance({
			method: "post",
			url,
			data,
			baseURL: baseUrl ? baseUrl : this.baseUrl,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				token: localStorage.token || '',
				...headers
			}
		}).then(
			(response) => {
				return this.checkStatus(response);
			}
		).catch(
			(err) => {
				return Promise.reject(err);
			}
		);
	}

	get(url, params, headers, baseUrl) {
		return instance({
			method: "get",
			url,
			params, // get 请求时带的参数
			baseURL: baseUrl ? baseUrl : this.baseUrl,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
				token: localStorage.token || '',
				...headers
			}
		}).then(
			(response) => {
				return Promise.resolve(response);
			}
		).catch(
			(err) => {
				return Promise.reject(err);
			}
		);
	}
}

export default Request;
