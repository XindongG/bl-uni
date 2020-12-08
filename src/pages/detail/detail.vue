<template>
	<view class="content">
		<view>
			<text class="title" @click="routerBack">返回！！</text>
		</view>
	</view>
</template>

<script>
import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
export default {
	data() {
		return {
		};
	},
	onLoad() {

	},
	created() {
	},
	methods: {
		routerBack(){
			uni.navigateBack();
		}
	},
	computed: {
		...mapState({
			detail: store => store.commonStore.title
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

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin: 200rpx auto 50rpx auto;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
