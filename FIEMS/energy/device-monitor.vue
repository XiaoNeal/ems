<template>
	<view class="container">
		<u-navbar title="能耗设备监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>

		<view class="box-container" style="display:flex;height: unset;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">位置选择</text>
			<uni-data-select style="width:15rem;margin-left: 2rem;background:#142C7E;" v-model="value" :clear="false" :localdata="range" @change="change"></uni-data-select>
		</view>

		<view v-if="deviceLists.length==0">
			<u-loading-icon :show="dataLoading"></u-loading-icon>
			<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png"></u-empty>
		</view>

		<view v-if="deviceLists.length>0" class="box-container" style="height: 10rem;display: block;" v-for=" (device,index) in deviceLists " :key="index">

			<view class="header-container" >
				<view style="display:flex;align-items:center;">
					<text>{{device.name}}</text>
				</view>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container">
				<view class="row-container">
					<text style="width:40%;">今日用电</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.totalForwardQ}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Ua</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseA.Voltage}}&nbsp;V</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Ub</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseB.Voltage}}&nbsp;V</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Uc</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseC.Voltage}}&nbsp;V</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">有功功率</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.activePower}}&nbsp;W</text>
				</view>
			</view>
			<view class="col-line"></view>
			<view class="content-container">
				<view class="row-container">
					<text style="width: 40%;">昨日用电</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.lastForwardQ}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Ia</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseA.Current}}&nbsp;A</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Ib</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseB.Current}}&nbsp;A</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">Ic</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.phaseC.Current}}&nbsp;A</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">功率因数</text>
					<text style="width:60%;text-align: end;color:#fff">{{device.energyData.powerFactor}}&nbsp;</text>
				</view>
			</view>
		</view>
		<u-back-top v-if="deviceLists.length>0" :scrollTop="scrollTop"  icon="arrow-up" ></u-back-top>

	</view>
</template>

<script>
	import {
		queryHighEnergyDevice,
		queryDeviceLevelMenu
	} from '@/api/fiems/energy.js'
	import {
		RealtimeDataProviderService
	} from '@/service/socket/realtime-data-provider.js'
	export default {
		data() {
			return {
				// bgColor: '#003E98',
				value: 0,
				range: [],
				deviceLists: [],
				deviceMap: new Map(),
				realTimeService: new RealtimeDataProviderService(),
				totalDevices: [],
				scrollTop: 0,
				dataLoading: true,
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			queryDeviceLevelMenu(this.currentSystemInfo.areaId, 7).then(datas => {
				datas.forEach(ele => {
					this.deviceMap.set(ele.children[0].children[0].id, ele.children[0].children[0].children)
					this.range.push({
						value: ele.children[0].children[0].id,
						text: ele.name
						// device: device
					})
				})
				this.value = this.range[0].value
				this.realTimeService.initDeviceList(this.deviceMap.get(this.value))
				let deviceList = this.realTimeService.getDeviceList();
				this.deviceLists = deviceList
				
				queryHighEnergyDevice(this.currentSystemInfo.areaLevelId, 3,7).then(datas => {
				// queryHighEnergyDevice(661573, 3).then(datas => {
					this.totalDevices = datas
					this.deviceLists.forEach(ele => {
						let findData = datas.find(device => device.deviceId == ele.deviceId)
						if (findData) {
							ele.totalForwardQ = findData.totalForwardQ
							ele.lastForwardQ = findData.lastForwardQ
						}
					})
					this.dataLoading = false
				})
			})

		},
		beforeDestroy() {
			this.realTimeService.unregister()
		},
		methods: {
			change(e) {
				this.dataLoading = true
				this.deviceLists = this.deviceMap.get(e)
				this.realTimeService.initDeviceList(this.deviceLists)
				let deviceList = this.realTimeService.getDeviceList();
				this.deviceLists = deviceList
				this.deviceLists.forEach(ele => {
					let findData = this.totalDevices.find(device => device.deviceId == ele.deviceId)
					if (findData) {
						ele.totalForwardQ = findData.totalForwardQ
						ele.lastForwardQ = findData.lastForwardQ
					}
				})
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
		min-height: 100%;
		// overflow: auto
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2rem;
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
		height: 72%;
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
</style>