"use strict";
const path = require("path");

function resolve(dir) {
	return path.join(__dirname, dir);
}

const name = "项目名称";

module.exports = {
	lintOnSave: process.env.NODE_ENV === "development",
	// 路径别名
	configureWebpack: {
		name: name,
		resolve: {
			alias: {
				"@": resolve("src"),
				"@i": resolve("src/api"),
				"@c": resolve("src/components"),
				"@a": resolve("src/assets"),
				"@s": resolve("src/styles"),
				"@u": resolve("src/utils"),
				"@pages": resolve("src/pages")
			}
		}
	}
};
