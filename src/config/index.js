// 一些全局的config配置
const modeUrlObj = {
	// build生产环境
	"production": {
		baseURL: "https://app.picchealth.com/picchealthappapi/api", //接口接口请求
	},
	// 本地开发
	"development": {
		baseURL: "/api",
	}
};
export default modeUrlObj[process.env.NODE_ENV];
