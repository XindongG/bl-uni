<template>
	<view class="content">
		<view>
			<text class="title" @click="goPage">{{title}}</text>
		</view>
    <UserList :userInfo="userInfo" v-if="userInfo"/>
	</view>
</template>
<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
import UserList from './components/UserList';
export default {
	data() {
		return {
			title: '点我跳转'
		};
	},
	components: {
		UserList: UserList
	},
	onLoad() {

	},
	mounted () {
		console.log(process.env);
		this.getUserInfo().then(data=>{
			console.log('请求成功啦！➡️', data);
		}).catch(err=>{
			console.log('请求失败啦！➡️', err);
		});
	},
	methods: {
		...mapMutations({
			setUserInfo: "SET_USERINFO"
		}),
		...mapActions(["getUserInfo"]),
		goPage(){
			this.$Router.push('/pages/detail/detail');
			// uni.navigateTo({
			// 	url: "../detail/detail"
			// });
		}
	},
	computed: {
		...mapState({
			userInfo: store => store.commonStore.userInfo
		})
	}
};
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
