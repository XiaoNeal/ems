<template>
	<view class="container">
		<u-navbar title="配电监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="f1">
			<text :class="{'active':show==1}" @click="switchShow(1)">高压监测</text>
			<text :class="{'active':show==2}" @click="switchShow(2)">低压监测</text>
		</view>
		<view class="box-container" v-if="show==2" style="display:flex;height:unset;margin-bottom: unset;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">位置选择</text>
			<uni-data-select style="width:15rem;margin-left: 2rem;background:#142C7E;" v-model="value" :clear="false" :localdata="range" @change="change"></uni-data-select>
		</view>

		<u-search v-model="keyword" color="#fff" @search="search" :show-action="false" margin="0.5rem 0.5rem 0 0.5rem" bgColor="#16379A"></u-search>
		<view :style="show==2?'height:74%':'height:81%'">

			<view v-if="filterDevices.length==0">
				<u-loading-icon :show="dataLoading"></u-loading-icon>
				<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png"></u-empty>
			</view>

			<view v-if="filterDevices.length>0" class="box-container"  v-for=" (device,index) in dataLists " :key="index" :style="'height:'+(device.realTimeData?10:3)+'rem;'">
				<view class="header-container" @click="redictToPage('electricity-analysis',device)">
					<view style="display:flex;align-items:center;width:100%;justify-content: space-between;">
						<text style="font-family: cursive;">{{device.name}}</text>
						<text style="font-family: cursive;">{{device.parentName}}</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container" v-if="device.realTimeData">
					<!-- <view class="row-container">
						<text style="width:40%;">今日用电</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.totalForwardQ}}&nbsp;kWh</text>
					</view> -->
					<view class="row-container">
						<text style="width:40%;">Ua</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseA.Voltage}}&nbsp;V</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">Ub</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseB.Voltage}}&nbsp;V</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">Uc</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseC.Voltage}}&nbsp;V</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">有功功率</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.activePower}}&nbsp;kW</text>
					</view>
				</view>
				<view class="col-line" v-if="device.realTimeData"></view>
				<view class="content-container" v-if="device.realTimeData">
					<!-- 	<view class="row-container">
						<text style="width: 40%;">昨日用电</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.lastForwardQ}}&nbsp;kWh</text>
					</view> -->
					<view class="row-container">
						<text style="width:40%;">Ia</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseA.Current}}&nbsp;A</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">Ib</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseB.Current}}&nbsp;A</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">Ic</text>
						<text
							style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.phaseC.Current}}&nbsp;A</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">功率因数</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.realTimeData.energyData.powerFactor}}&nbsp;</text>
					</view>
				</view>
			</view>
			<u-loadmore v-if="filterDevices.length>0" :status="status" />
			<u-back-top :scrollTop="scrollTop" icon="arrow-up"></u-back-top>
		</view>

	</view>
</template>

<script>
	import {
		queryByAreaInfoAndLevelId,
		getDeviceLevelByAreaInfoIdAndCategroyV2,
		// queryDevicesByParentId,
		queryDevicesAndLevelsByParentId
	} from '@/api/fiems/energy.js'
	import {
		RealtimeDataProviderService
	} from '@/service/socket/realtime-data-provider.js'
	import store from '@/store';
	import {
		DeviceFactory
	} from '@/service/devices/device-factory.model.js'
	export default {
		data() {
			return {
				// bgColor: '#003E98',
				status: 'loadmore',
				page: 0,
				show: 1,
				value: 0,
				range: [],
				highVoltageList: [],
				realTimeService: new RealtimeDataProviderService(),
				lowVoltageList: [],
				deviceLists: [],
				dataLoading: true,
				filterDevices: [],
				keyword: '',
				dataLists: [],
				scrollTop: 0

			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			// this.realTimeService.getConnectedSocket()
			// this.RealTimeService = new RealtimeDataProviderService()
			// this.RealTimeService.getConnectedSocket()
			// this.getHighVoltageData()
			this.getHighVoltageData()
			// this.getLowVoltageRoom()

		},

		onUnload() {
			// if(this.RealTimeService)
			// this.RealTimeService.unregister()
		},

		beforeDestroy() {
			this.realTimeService.unregister()
		},
		onReachBottom() {
			if (this.page >= (this.filterDevices.length / 10)) return;
			this.status = 'loading';
			this.page = ++this.page;
			this.dataLists = this.dataLists.concat(this.filterDevices.slice(this.dataLists.length, this.dataLists.length + 10));
			if (this.page >= (this.filterDevices.length / 10)) this.status = 'nomore';
			else this.status = 'loading';
		},
		methods: {
			search() {
				// let deviceLists = JSON.parse(JSON.stringify(this.deviceLists))
				let deviceLists = this.deviceLists
				let keyword = this.trim(this.keyword)
				if (keyword == "") {
					this.filterDevices = [...deviceLists]
				} else {
					this.filterDevices = deviceLists.filter(ele => {
						return ele.name.includes(keyword)
					})
				}
				this.dataLists = this.filterDevices.slice(0, 10)
			},
			trim(str) { //删除左右两端的空格
				return str.replace(/(^\s*)|(\s*$)/g, "");
			},

			redictToPage(url, device) {
				uni.navigateTo({
					url: '/pages/FIEMS/energy/' + url + `?deviceId=${device.deviceId}&name=${device.name}`
				})

			},
			switchShow(index) {
				this.page = 0
				this.show = index

				if (index == 1) {
					this.deviceLists = this.highVoltageList
				} else if (index == 2 && this.range.length == 0) {
					this.getLowVoltageRoom()
				} else if (index == 2) {
					this.deviceLists = this.lowVoltageList
				}
				this.search()
			},
			getLowVoltageRoom() {
				this.dataLoading = true
				queryByAreaInfoAndLevelId(this.currentSystemInfo.areaId).then(datas => {
					this.range = []
					for (let key in datas) {
						this.range.push({
							value: datas[key].id,
							text: datas[key].name
						})
					}
					this.value = this.range[0].value
					this.getLowVoltagedData(this.value)
				})
			},

			getLowVoltagedData(parentId) {
				this.deviceLists = []
				this.filterDevices = []
				this.dataLoading = true
				queryDevicesAndLevelsByParentId(parentId).then(datas => {
					let findData = datas.filter(ele => ele.levelId == 6 && ele.deviceId > 0)
					console.log('findData',findData);
					this.realTimeService.initDeviceList(findData)
					let deviceList = this.realTimeService.getDeviceList();
					console.log('deviceList',deviceList);
					// let electricalData = datas.filter(ele => ele.levelId == 6)

					let levelData5 = datas.filter(ele => ele.levelId == 5)
					levelData5.sort((a, b) => {
						return a.orderNo - b.orderNo
					})
					this.lowVoltageList = []
					if (levelData5) {
						levelData5.forEach(levelData => {
							let levelData6 = datas.filter(ele => ele.parentId == levelData.id)
							levelData6.forEach(data => {
								let realTimeData = deviceList.find(ele => ele.address == data
									.address && ele.barCode == data.barcode && ele
									.deviceType == data.typeCode
								)
								data.realTimeData = realTimeData
								data.parentName = levelData.name
							})

							this.lowVoltageList = this.lowVoltageList.concat(levelData6)
						})
					}
					// this.lowVoltageList.forEach(data => {
					// 	let realTimeData = deviceList.find(ele => ele.address == data.address && ele
					// 		.barCode == data.barcode && ele.deviceType == data.typeCode)
					// 	data.realTimeData = realTimeData
					// 	// this.lowVoltageList.push({
					// 	// 	name: data.name,
					// 	// 	barCode: data.barcode,
					// 	// 	address: data.address,
					// 	// 	deviceId: data.deviceId,
					// 	// 	deviceType: data.typeCode,
					// 	// 	realTimeData: realTimeData
					// 	// })
					// })
					this.deviceLists = this.lowVoltageList
					this.filterDevices = [...this.deviceLists]
					this.dataLists = this.deviceLists.slice(0, 10)
					this.dataLoading = false
				})
			},

			getHighVoltageData() {
				this.dataLoading = true
				this.deviceLists = []
				this.filterDevices = []
				getDeviceLevelByAreaInfoIdAndCategroyV2(this.currentSystemInfo.areaId, 1, 3, 3).then(datas => {
					let findData = datas.filter(ele => ele.deviceId > 0 && ele.deviceType == 3)
					this.realTimeService.initDeviceList(findData)
					let deviceList = this.realTimeService.getDeviceList();
					this.highVoltageList = []
					findData.forEach(data => {
						let realTimeData = deviceList.find(ele => ele.address == data.address && ele.barCode == data.barCode && ele.deviceType == data.typeCode)
						this.highVoltageList.push({
							name: data.name,
							barCode: data.barCode,
							deviceId: data.deviceId,
							typeCode: data.typeCode,
							realTimeData: realTimeData
						})
					})

					this.deviceLists = this.highVoltageList
					this.filterDevices = [...this.deviceLists]
					this.dataLists = this.deviceLists.slice(0, 10)
					this.dataLoading = false

				})
			},
			change(e) {
				this.getLowVoltagedData(e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep page {
		height: 100%;
	}

	.container {
		font-size: 28rpx;
		line-height: 24px;
		background-color: #0E2264;
		min-height: 100%;
		// height:auto;
		// min-height:fit-content;
		// overflow: auto
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2rem;
	}


	.f1 {
		background-color: #003E98;
		text-align: center;
		display: flex;

		justify-content: space-evenly;
		z-index: 20;

		text {
			line-height: 9vw;
			padding-bottom: 1vw;
			color: rgb(163, 163, 163);
			font-size: 4vw;
			width: 21vw;
		}

		.active {
			color: #fff;
			border-bottom: 1vw solid #00E9AA;
		}
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

	.data-container {
		display: flex;
	}

	// .row-container {
	// 	margin: auto;
	// 	width: 50%;
	// 	display: flex;
	// 	align-items: center;
	// 	height: 100%;
	// 	padding: 0 0.5rem
	// }

	// .col-line {
	// 	background-color: #7287C6;
	// 	margin: 3%;
	// 	width: 1px;
	// 	float: left;
	// 	height: 50%;
	// }

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

	::v-deep.table--border {
		border-left: unset;
		border-top: unset;
		border-right: 1px solid #455FAE
	}

	::v-deep.uni-table-th {
		background: #16379A;
		color: #fff;
		border-bottom: 1px #455FAE solid;
		text-align: center !important;
	}

	::v-deep.uni-table-td {
		background: #16379A;
		color: #fff;
		border-bottom: 1px #455FAE solid;
		text-align: center !important;
	}

	::v-deep.u-loading-icon {
		height: 1000rpx;
	}
</style>