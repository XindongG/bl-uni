// 一些全局的config配置
const modeUrlObj = {
	// 生产环境
	"production": {
		version: '0.0.1', //此版本号可以放在页面隐秘位置，方便查看当前线上代码版本
		baseURL: "https://anymock.alipay.com/direct-mock/http/122000027/api" //接口接口请求
	},
	// 测试环境
	"test": {
		version: '0.0.1',
		baseURL: "/api"
	},
	// 本地开发
	"development": {
		version: '0.0.1',
		baseURL: "/api"
	}
};
export default modeUrlObj[process.env.VUE_APP_ENV];
