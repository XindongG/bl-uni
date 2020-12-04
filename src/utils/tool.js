/**
 *@desc 公共方法
 *@author jiay
 *@date 2020/5/9 上午9:51
 */

import moment from "moment";
import {jsGetUuid, encryptDes} from '@/utils/validator.js';
import store from "../store";
import config from "@/config";
import iconJson from '@/assets/icon/icon.json';
import {Dialog, Toast} from "vant";

let toolDefault = {};

/**
 *@desc: return Sentry异常监控
 *@author: XinD
 *@date: 2020/6/23
 */
export function SentryErr(err) {
	if(process.env.NODE_ENV === 'production') {
		window.Sentry.captureException(err);
	}
}
/**
 * @desc base64转二进制文件流
 * @param dataurl
 * @param filename
 * @returns {File}
 */
export function dataURLtoBlob(dataurl, filename = "file") {
	let arr = dataurl.split(",");
	let mime = arr[0].match(/:(.*?);/)[1];
	let suffix = mime.split("/")[1];
	let bstr = atob(arr[1]);
	let n = bstr.length;
	let u8arr = new Uint8Array(n);
	while(n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], `${filename}.${suffix}`, {
		type: mime
	});
}

/**
 *@desc: 埋点
 *@author: XinD
 *@date: 2020/6/4
 */
export function addTrack(source, sourceModule, operateType, fromTime, json) {
	const phoneInfo = store.state.commonStore.phoneInfo || '';
	const userInfo = store.state.commonStore.userInfo || '';
	let timestamp = new Date().getTime();
	let deviceUUIDWithTime = jsGetUuid(8, 10) + "_" + timestamp;
	let time = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
	let params = {
		"behaviorFlag": deviceUUIDWithTime,
		"operateType": operateType ? String(operateType) : "1",
		"brand": phoneInfo.phoneBrand,
		"fromTime": fromTime ? fromTime : time,
		"json": json ? JSON.stringify(json) : '',
		"mobileSys": phoneInfo.clientType === '2' ? 'iOS' : 'ANDROID',
		"model": phoneInfo.phoneModel,
		"operators": phoneInfo.phoneOperator,
		"recordSource": 0,
		"source": source,
		"sourceModule": sourceModule,
		"toTime": time
	};
	store.dispatch('addUserTrack', params);
}
/**
 *@desc: 校验是否为一卡通会员
 *@author: XinD
 *@date: 2020/7/21
 */
export function checkOneCard(){
	const param = arguments[0];
	window.$webview({
		openLoading: null
	});
	const {
		birthday,
		cardNo,
		cardType,
		name,
		sex
	} = store.state.commonStore.userInfo;
	return new Promise((resolve, reject)=>{
		store.dispatch('appOneCardInitialize', {
			"apiCode": "hmiapp-0019",
			"birthday": birthday,
			"idcard": cardNo,
			"idcardtype": cardType,
			"name": name,
			"sex": sex,
			"version": "2.0"
		}).then((data)=>{
			window.$webview({
				closeLoading: null
			});
			data.status === -111 && Toast('您暂时还不是一卡通会员');
			const state = data.status === -111 ? false :true;
			data.status !== -111 && resolve(state);
			data.status === -111 && reject(state);
		});
	});
}
/**
 *@desc: 第三方url获取接口
 *@author: XinD
 *@date: 2020/7/1
 */
export function ThirdUrl() {
	const {
		name,
		cardType,
		cardNo,
		birthday,
		sex,
		phone
	} = store.state.commonStore.userInfo;
	const { userCustomerId } = store.state.commonStore;
	const { interrogation } = store.state.indexStore;
	const userInfo = store.state.commonStore.userInfo || '';
    store.dispatch('queryInterrogation', {
		birthday: userInfo.birthday,
		cardNo: userInfo.cardNo,
		cardType: userInfo.cardType,
		openId: "",
		sex: userInfo.sex,
		tel: userInfo.phone,
		userName: userInfo.name
	});
	!userCustomerId && store.dispatch('getCustomerInfo', {
		selfname: name,
		sbirthday: birthday,
		gendercode: sex,
		idnumber: cardNo,
		tel: phone,
		idtype: cardType //证件类型
	});
}
/**
 *@desc: 判断是否实名
 *@author: XinD
 *@date: 2020/6/10
 */
export function realNameFlag() {
	const phoneInfo = store.state.commonStore.phoneInfo || '';
	const userInfo = store.state.commonStore.userInfo || '';
	if(userInfo.certification !== "0") {
		window.$webview({
			openCertificationPage: {
				closeLastPage: 0
			}
		});
		return false;
	} else {
		return true;
	}
}

/**
 *@desc: 判断是否登录
 *@author: XinD
 *@date: 2020/6/10
 */
export function loginFlag() {
	const phoneInfo = store.state.commonStore.phoneInfo || '';
	const userInfo = store.state.commonStore.userInfo || '';
	if(userInfo && userInfo.token) {
		return true;
	} else {
		window.JsInterface || window.webkit
			? window.$webview({openLoginPage: null})
			: window.$webview({openURL: "/login/loginModule"});
		return false;
	}
}

/**
 *@desc: 员工认证跳转
 *@author: XinD
 *@date: 2020/6/19
 */
const jobNumAuthentication = (data) => {
	const item = toolDefault.item;
	const {authStatus, groupAgentCode, cardNo} = store.state.commonStore.userInfo;
	const userInfo = store.state.commonStore.userInfo || '';
	console.log(authStatus, 'authStatus');
	if(cardNo) {
		if(item.tag === 'certification') { //员工认证  工号认证
			//判断是不是已认证并且有工号
			if(authStatus === '0') { //authStatus是0 代表已认证工号 直接跳转到客户管理
				if(userInfo.compCode && userInfo.compCode === '000100' || userInfo.compCode === '000002'){
					window.$routerGo({
						path: '/jobNumAuthentication',
						type: 0
					});
				} else {
					window.$routerGo({
						path: '/user/customer',
						type: 0
					});
				}
				return false;
			}
		}
		window.$routerGo({path: item.jumpUrl, type: item.linkFlag ? item.linkFlag : 0});
	}
};
/**
 *@desc: 健康档案跳转
 *@author: XinD
 *@date: 2020/6/16
 */
const healthRecord = () => {
	const {item} = toolDefault;
	const userCustomerId = store.state.commonStore.userCustomerId || '';
	window.$webview({
		openURL: {path: item.jumpUrl, query: {uuid: userCustomerId, channel: 'picchealth'}, type: item.linkFlag}
	});
};
/**
 *@desc 健康评测
 *@author XinD
 *@date  2020/6/17
 */
export const healthEvaluating = () => {
	const {item} = toolDefault;
	const userInfo = store.state.commonStore.userInfo || '';
	const userCustomerId = store.state.commonStore.userCustomerId || '';
	if(!userInfo || !userInfo.token) {
		window.$webview({
			openURL: {path: item.jumpUrl, query: {channel: 'picchealth'}, type: item.linkFlag}
		});
	} else {
		window.$webview({
			openURL: {path: item.jumpUrl, query: {uuid: userCustomerId, channel: 'picchealth'}, type: item.linkFlag}
		});
	}
};

/**
 *@desc: 获取当前webview唯一tag，并挑战对应URL
 *@author: XinD
 *@date: 2020/6/19
 */
const pageViewTag = (data) => {
	toolDefault.tag = data ? JSON.parse(data).tag : '';
	const phoneInfo = store.state.commonStore.phoneInfo || '';
	const userInfo = store.state.commonStore.userInfo || '';
	const {item} = toolDefault;
	let Info = "";
	addTrack(item.title, item.buriedCode, '0');
	if(item.title === '更多') {
		window.$routerGo({
			path: item.jumpUrl,
			type: "0",
			navigationInfo: {//(可选参数) 导航条配置信息
				titleColor: "#ffffff",
				titleFontSize: 19,
				backgroundColor: "#292F42",
				title: "全部功能", //页面标题
				rightButton: {
					rightButtonTitle: "编辑", //(可选参数)右侧按钮标题
					rightButtonTitleSize: 13.5,
					rightButtonAction: "$api.allEdit()", //右侧按钮执行的JS方法
					rightButtonImage: ''
				},
				leftButton: {},
				sections: []
			}
		});
		return false;
	}
	switch (item.buriedCode) {
	// 快速问诊
	case "queryInterrogation":
		window.$routerGo({
			type: 4,
			path: store.state.indexStore.interrogation
		});
		break;
	// 闪电购药
	case "buymedLine":
		Info = encryptDes(
			{
				customerId: userInfo.userId,
				cardNo: userInfo.cardNo,
				referrer: 1019,
				phone: userInfo.phone,
				name: userInfo.name
			},
			"12ZyrsRfflliiiaooii9999@#"
		);
		window.$routerGo({
			path: `${item.jumpUrl}/views/lg/lg-check.jsp?info=${Info}&skipTo=third_shop_ddky&from=rbhapp`,
			type: item.linkFlag,
			navigationInfo: {//(可选参数) 导航条配置信息
				title: '闪电购药', //页面标题
				titleColor: '#ffffff', //标题颜色
				titleFontSize: 19,
				backgroundColor: '#292F42', //导航条背景色
				rightButton: {},
				leftButton: {},
				sections: []
			}
		});
		break;
	// 体检预约
	case "networkExamineListSearch":
		window.$routerGo({
			path: `${item.jumpUrl}/index.html?auto=1&partner=piccapp&partner_openid=${userInfo.oldUserId}&urlsrc=launch`,
			type: item.linkFlag,
			navigationInfo: {//(可选参数) 导航条配置信息
				title: '体检预约', //页面标题
				titleColor: '#ffffff', //标题颜色
				titleFontSize: 19,
				backgroundColor: '#292F42', //导航条背景色
				rightButton: {},
				leftButton: {},
				sections: []
			}
		});
		break;
	case "更多":
		window.$routerGo({
			path: item.jumpUrl,
			type: "0",
			navigationInfo: {//(可选参数) 导航条配置信息
				titleColor: "#ffffff",
				titleFontSize: 19,
				backgroundColor: "#292F42",
				title: "全部功能", //页面标题
				rightButton: {
					rightButtonTitle: "编辑", //(可选参数)右侧按钮标题
					rightButtonTitleSize: 13.5,
					rightButtonAction: "$api.allEdit()", //右侧按钮执行的JS方法
					rightButtonImage: ''
				},
				leftButton: {},
				sections: []
			}
		});
		break;
	// 疾病库
	case "diseaseLibrary":
		store.dispatch('toWyUrl', {
			"type": "3",
			"userid": userInfo.userId
		});
		break;
	// 健康商城
	case "eshopHome":
		window.$routerGo({
			path: "/eshop/home?target=index",
			type: 1
		});
		break;
	// 疾病自查
	case "diseaseInspection":
		store.dispatch('toWyUrl', {
			"type": "4",
			"userid": userInfo.userId
		});
		break;
	// 选医问诊
	case "cloveDoctorUser":
		store.dispatch('cloveDoctorUser', {
			"dingXiangDoctorUserToken": "string",
			"redirect": window.location.href,
			"userId": userInfo.userId
		});
		break;
	// 电话医生
	case "hlghealthUrl":
		store.dispatch('hlghealthUrl', {
			"accUrlT": "calldoctor",
			"cardNoT": "string",
			"cardPassT": "string",
			"idCardT": userInfo.cardNo,
			"mobileT": userInfo.phone,
			"thirdIdT": userInfo.userId,
			"usernameT": userInfo.name
		});
		break;
	// 健康圈
	case "SongGuo":
		window.$webview({
			goToSongGuo: {
				pageType: 0,
				openid: userInfo.oldUserId
			}
		});
		break;
	// 健康档案
	case "healthRecordsViewModel":
		healthRecord();
		break;
	// 员工认证
	case "jobNumAuthentication":
		jobNumAuthentication(data);
		break;
	// 我的档案
	case "我的档案":
		healthRecord();
		break;
	// 健康评测
	case "healthAccessmentPageViewModel":
		healthEvaluating();
		break;
	// 家庭医生
	case "healthHouseKeeperConsult":
		Toast('功能升级，敬请期待');
		// chat(item);
		break;
	// 人工客服
	case "人工客服":
		// Toast('功能升级，敬请期待。如有疑问，请致电全国统一客服热线95591或4006695518 进行咨询（人工服务时间8:00-20:00）');
		chat(item);
		break;
	// 在线客服
	case "customerService":
		// Toast('功能升级，敬请期待。如有疑问，请致电全国统一客服热线95591或4006695518 进行咨询（人工服务时间8:00-20:00）');
		chat(item);
		break;
	// 我的订单
	case "myOrder":
		window.$routerGo({
			path: item.jumpUrl,
			type: item.linkFlag,
			navigationInfo: item.nativeHeaderFlag === "0"
				? {
					//(可选参数) 导航条配置信息
					title: item.title, //页面标题
					titleColor: item.titleColor, //标题颜色
					titleFontSize: item.titleFontSize,
					backgroundColor: item.backgroundColor, //导航条背景色
					rightButton: {},
					leftButton: {},
					sections: [
						{
							title: "商城",
							type: '1',
							url: `/eshop/order/all?tag=${toolDefault.tag}&from=piccHealthy`
						},
						{
							title: "保险",
							type: '5',
							url: `/myGoodsOrder?tag=${toolDefault.tag}&from=piccHealthy`
						}
					]
				}
				: ""
		});
		break;
	default:
		item.jumpUrl &&
		window.$routerGo({
			path: item.jumpUrl.indexOf("?") !== -1 ? `${item.jumpUrl}&tag=${toolDefault.tag}&from=piccHealthy`:`${item.jumpUrl}?tag=${toolDefault.tag}&from=piccHealthy`,
			type: item.linkFlag,
			navigationInfo: item.nativeHeaderFlag === '0' ? {//(可选参数) 导航条配置信息
				title: item.title, //页面标题
				titleColor: '#ffffff', //标题颜色
				titleFontSize: 19,
				backgroundColor: '#292F42', //导航条背景色
				rightButton: item.shareFlag === '0' ? {
					rightButtonTitle: '', //(可选参数)右侧按钮标题
					rightButtonTitleSize: '',
					rightButtonAction: window.webkit ? `window.webkit.messageHandlers.weChatShareDialog.postMessage(${JSON.stringify({
						shareType: 2,
						title: item.shareTitle,
						content: item.shareDescribe,
						scene: '',
						// webUrl: `${config.shareWebUrl}/commonView/outsideLink/${encodeURIComponent(item.jumpUrl)}`,
						webUrl: item.jumpUrl,
						webImg: config.fileBase + 'picchealth_logo.png',
						taskId: '',
						taskModular: '首页icon分享'
					})})` : `JsInterface.weChatShareDialog('${JSON.stringify({
						shareType: 2,
						title: item.shareTitle,
						content: item.shareDescribe,
						scene: '',
						webUrl: item.jumpUrl,
						webImg: config.fileBase + 'picchealth_logo.png',
						taskId: '',
						taskModular: '首页icon分享'
					})}')`, //右侧按钮执行的JS方法
					rightButtonImage: iconJson.headerRightShare
				} : {},
				leftButton: {},
				sections: []
			} : ''
		});
		break;
	}
};
const chat = (item) =>{
	const {userId} = store.state.commonStore;
	const {token} = store.state.commonStore;
	const {userCustomerId} = store.state.commonStore;
	let chatParams = {
		customerId: userCustomerId, //健康档案customerId
		uid: userId,
		token: token,
		sgid: item.sgid ? item.sgid : item.title === '家庭医生' ? '管家' : '客服',
		sid: item.sid || '',
		ftype: item.ftype || '',
		tarid: item.tarid || '',
		tarurl: item.tarurl || '',
		tardesc: item.tardesc || '人工客服',
		tarimg: item.tarimg || '',
		att: item.att || ''
	};
	chatParams = window.$Base64.encode(JSON.stringify(chatParams));
	chatParams = encodeURIComponent(chatParams);
	window.$routerGo({
		path: `${config.chatPageUrl}?args=${chatParams}`,
		type: 4,
		navigationInfo: {//(可选参数) 导航条配置信息
			title: item.title, //页面标题
			titleColor: "#ffffff", //标题颜色
			titleFontSize: 19,
			backgroundColor: "#292F42", //导航条背景色
			rightButton: {},
			leftButton: {},
			sections: []
		}
	});
};
export function encodeMD5(value){
	return window.$md5("HEALTHIMS" + window.$md5(value));
}
/**
 *@desc: 跳转一卡通
 *@author: XinD
 *@date: 2020/7/21
 */
export function oneCardGo(item){
	const {
		name,
		cardType,
		cardNo,
		birthday,
		sex,
		userId
	} = store.state.commonStore.userInfo;
	const { onCardUrl } = store.state.userStore;
	const jumpUrl = item && item.jumpUrl ? item.jumpUrl : onCardUrl;
	checkOneCard({toast: true}).then(data=>{
		window.$routerGo({
			path: `${
				jumpUrl
			}?userId=${encodeMD5(userId)}&userName=${encodeMD5(
				name
			)}&userSex=${encodeMD5(sex)}&userBirthday=${encodeMD5(
				birthday
			)}&userIDType=${encodeMD5(cardType)}&userIDNo=${encodeMD5(
				cardNo
			)}`,
			type: 2
		});
	}).catch((data)=>{
	});
}
/**
 *@desc: 首页及全部功能icon跳转
 *@author: XinD
 *@date: 2020/6/10
 */
export function appIconGo(item) {
	toolDefault.item = item;
	window.$api = {
		...window.$api,
		pageViewTag: pageViewTag
	};

	// 验证是否登录
	if(item.loginFlag === '0' && !loginFlag()) {
		return false;
	}
	// 验证是否实名
	if(item.realNameFlag === '0' && !realNameFlag()) {
		return false;
	}
	// 验证是否一卡通
	if(item.oneCardInitializeFlag === '0') {
		oneCardGo(item);
		return false;
	}
	// 获取webview唯一tag
	if(window.JsInterface || window.webkit){
		window.$webview({
			getPageViewTag: null
		});
	} else {
		pageViewTag();
	}
}
