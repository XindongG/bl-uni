<template>
  <ul class="userList">
    <li v-for="(val,key,i) in userInfo" :key="i">
      <text>{{key}}：</text>
      <text>{{val}}</text>
    </li>
  </ul>
</template>

<script>
export default {
	name: "UserList",
	props: {
		userInfo: Object
	},
	created() {

	},
	mounted() {
	}
};
</script>

<style lang="less" scoped>
.userList{
  display: flex;
  flex-wrap: wrap;
  font-size: 14rpx;
  li{
    list-style: none;
    width: 50%;
  }
}
</style>
