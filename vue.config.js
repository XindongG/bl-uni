const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

function resolve(dir) {
	return path.join(__dirname, "./", dir);
}

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
		if(process.env.NODE_ENV === 'production') {
			config.plugins.push(
				new TerserPlugin({
					terserOptions: {
						ecma: undefined,
						warnings: false,
						parse: {},
						compress: {
							"drop_console": true,
							"drop_debugger": false,
							"pure_funcs": [ 'console.log' ] // 移除console
						}
					}
				})
			);
		}
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
	productionSourceMap: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
	css: {
		extract: true,
		sourceMap: false,
		modules: false
	}
};
