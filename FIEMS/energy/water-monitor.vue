<template>
	<view class="container">
		<u-navbar title="用水监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="box-container" style="display:flex;height: unset;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">位置选择</text>
			<uni-data-select style="width:15rem;margin-left: 2rem;background:#142C7E;" v-model="value" :clear="false" :localdata="range" @change="change"></uni-data-select>
		</view>
		<view v-if="deviceLists.length==0">
			<u-loading-icon :show="dataLoading"></u-loading-icon>
			<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png">
			</u-empty>
		</view>
		<view v-if="deviceLists.length>0" class="box-container" v-for=" (device,index) in deviceLists " :key="index">
			<view class="header-container" >
				<view style="display:flex;align-items:center;">
					<text style="font-family: cursive;">{{device.name}}</text>
				</view>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container">
				<view class="row-container">
					<text style="width:40%;">瞬时流量</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.waterFlow}}&nbsp;m³/h</text>
				</view>
			</view>
			<view class="col-line"></view>
			<view class="content-container">
				<view class="row-container">
					<text style="width: 40%;">累计用量</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.positiveCum}}&nbsp;m³</text>
				</view>
			</view>
		</view>

		<view v-if="false" class="box-container" style="display: block;" v-for=" (device,index) in deviceLists " :key="index">
			<view style="display:flex;align-items:center;justify-content: space-between;" @click="redictToPage('storage-monitor')">
				<view style="display:flex;align-items:center;">
					<text>{{device.name}}</text>
				</view>
				<!-- <text class="navigat-arrow">&#xe65e;</text> -->
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container">
				<view class="row-container">
					<text style="width:40%;">瞬时流量</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.waterFlow}}&nbsp;m³/h</text>
				</view>
			</view>
			<view class="col-line"></view>
			<view class="content-container">
				<view class="row-container">
					<text style="width: 40%;">累计用量</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.positiveCum}}&nbsp;m³</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getDeviceLevelByAreaInfoIdAndCategroy
	} from '@/api/fiems/energy.js'
	import {
		RealtimeDataProviderService
	} from '@/service/socket/realtime-data-provider.js'
	export default {
		data() {
			return {
				bgColor: '#003E98',
				value: 0,
				range: [],
				deviceLists: [],
				deviceMap: new Map(),
				realTimeService: new RealtimeDataProviderService(),
				totalDevices: [],
				dataLoading: true,
			}
		},
		onLoad() {
			getDeviceLevelByAreaInfoIdAndCategroy(this.currentSystemInfo.areaId, 2, 6, 2).then(datas => {
				console.log('水表',datas);
				this.dataLoading = false
				let positions = datas.filter(ele => ele.parentId == 0)
				positions.forEach(ele => {
					this.range.push({
						value: ele.id,
						text: ele.name
						// device: device
					})
					let ameterList = []
					let findData = datas.filter(device => device.parentId == ele.id)
					ameterList = ameterList.concat(findData)
					findData.forEach(child => {
						let childFind = datas.filter(device => device.parentId == child.id)
						ameterList = ameterList.concat(childFind)
						childFind.forEach(childData => {
							let childFindData = datas.filter(device => device.parentId ==
								childData.id)
							ameterList = ameterList.concat(childFindData)
						})
					})
					ameterList = ameterList.filter(device => device.deviceType == 7)
					this.deviceMap.set(ele.id, ameterList)
				})
				this.value = this.range[0].value
				this.realTimeService.initDeviceList(this.deviceMap.get(this.value))
				let deviceList = this.realTimeService.getDeviceList();
				this.deviceLists = deviceList
				// this.dataLoading = false
			})

		},
		beforeDestroy() {
			this.realTimeService.unregister()
		},
		methods: {
			change(e) {
				this.dataLoading = true
				let deviceList = this.deviceMap.get(e)
				this.realTimeService.initDeviceList(deviceList)
				this.deviceLists = this.realTimeService.getDeviceList();
				this.dataLoading = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		font-size: 28rpx;
		line-height: 24px;
		background-color: #0E2264;
		height: 100%;
		overflow: auto
	}

	.box-container {
		background: #16379A;
		height: 6rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem
	}

	.content-container {
		width: 46%;
		float: left;
		height: 77%;
		display: flex;
		flex-direction: column;
		color: #7287C6;
	}

	.row-container {
		margin: auto;
		width: 100%;
		display: flex;
		align-items: center;
		height: 100%;
	}


	.col-line {
		background-color: #7287C6;
		margin: 3%;
		width: 1px;
		float: left;
		height: 50%;
	}

	::v-deep.uni-select {
		border: unset
	}

	::v-deep.uni-select__input-text {
		color: #fff;
	}

	::v-deep.uni-select__selector {
		background: #003879;
		border: unset
	}

	::v-deep.uni-popper__arrow::after {
		border: bottom color #0050ae;
	}

	::v-deep.u-loading-icon {
		height: 1000rpx;
	}
</style>