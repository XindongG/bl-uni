import Vue from 'vue';
import Vuex from 'vuex';
import detailStore from './modules/detail/index';

Vue.use(Vuex);

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		detailStore,
	},
	mutations: {
	},
});
export default store;
