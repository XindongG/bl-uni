const TransformPages = require('uni-read-pages');
const {webpack} = new TransformPages();

module.exports = {
	devServer: {
		host: "localhost",
		port: 8080,
		open: true,
		https: false,
		hotOnly: false,
		proxy: {
			"/api": {
				// 测试环境
				target: "https://anymock.alipay.com/direct-mock/http/122000027/api",  // 测试接口域名
				changeOrigin: true,  //是否跨域
				pathRewrite: {
					"^/api": ""   //需要rewrite重写的,
				}
			}
		}
	},
	configureWebpack: config => {
		config.plugins.push(
			new webpack.DefinePlugin({
				ROUTES: webpack.DefinePlugin.runtimeValue(() => {
					const tfPages = new TransformPages({
						includes: ['path', 'name', 'aliasPath']
					});
					return JSON.stringify(tfPages.routes);
				}, true )
			})
		);

	},
	chainWebpack: config => {
		config.resolve.symlinks(true);
		// 移除 prefetch 插件
		config.plugins.delete("prefetch");
		// 移除 preload 插件
		config.plugins.delete("preload");
		config.module
			.rule("images")
			.use("image-webpack-loader")
			.loader("image-webpack-loader")
			.options({
				bypassOnDebug: true
			})
			.end();
	},
	productionSourceMap: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
};
