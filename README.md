# 基础命令

### 安装依赖
```
yarn install / npm i
```

### 启动 / 打包
```
yarn run dev:h5 本地服务器--h5（开发环境接口）
yarn run dev:mp-weixindev:mp-weixin 本地服务器--微信小程序（开发环境接口）
yarn run dev_test:h5 本地服务器--h5（测试环境接口）
yarn run dev_test:mp-weixin 本地服务器--微信小程序（测试环境接口）
yarn run yarn run dev_production:h5 本地服务器--h5（生产环境接口）
yarn run dev_production:mp-weixin 本地服务器--微信小程序（生产环境接口）
yarn run build_test:h5 打包--h5（测试环境接口）
yarn run build_test:mp-weixin 打包--微信小程序（测试环境接口）
yarn run build:h5 打包--h5（生产环境接口）
yarn run build:mp-weixin 打包--h5（生产环境接口）
```

# 开发常见问题及注意事项：

### css单位需用rpx，rpx换算公式：750 * 元素在设计稿中的宽度 / 设计稿基准宽度
### eslint已配置，如无特殊情况，不可关闭eslint
### 路由配置与普通vue项目相同
### 路由必须按业务分模块，方便维护，保持低耦合性
### store必须按业务分模块，方便维护，保持低耦合性
### api文件夹为接口维护文件，必须按业务分成多个js文件，方便维护
### components文件夹为公共组件，按项目成长进度，需持续维护优化相关组件
### pages文件夹为页面，单独页面使用单独文件夹维护，文件夹啊内存放.vue及.less等

