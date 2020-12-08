import Vue from 'vue';
import App from './App';
import store from "./store/index";
import Vconsole from "vconsole";
Vue.config.productionTip = false;
App.mpType = 'app';
if(process.env.NODE_ENV !== 'production'){
	let vConsole = new Vconsole();
	Vue.use(vConsole);
}
new Vue({
	store,
	render: h => h(App)
}).$mount("#app");
