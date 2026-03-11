<template>
	<view class="" style="width: 100%;position: relative;">
		<u-empty mode="data" text="暂无数据" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<!-- <u-empty mode="data" v-if="powerStationEmpty" @click="goToWhere('newProject')" text="暂无电站" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty> -->
		<text class="" style="background-color: #4488fb;padding: 2vw 4vw;text-align: center;position: absolute;left: 50%;transform: translateX(-50%);border-radius: 100px;color: #fff;margin-top: 20rpx;" @click="refreshData">点击刷新</text>

	</view>
</template>

<script>
	export default {
		name:"NodataRefreshed",
		props: {
			funsList:Array
		},
		data() {
			return {
				
			};
		},
		methods:{
			refreshData(){
				this.$emit("noDataAndRefreshed")
			}
		}
	}
</script>

<style>

</style>