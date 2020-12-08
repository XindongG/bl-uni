import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import commonStore from './modules/common/index';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		commonStore
	},
	mutations: {
	},
	plugins: [createLogger()]
});
export default store;
