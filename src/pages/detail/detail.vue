<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view>
			<text class="title">{{detail}}</text>
		</view>
	</view>
</template>

<script>
  import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
  export default {
		data() {
			return {
			}
		},
		onLoad() {

		},
		methods: {

		},
    computed: {
      ...mapState({
        detail: store => store.detailStore.title
      }),
    }
	}
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
