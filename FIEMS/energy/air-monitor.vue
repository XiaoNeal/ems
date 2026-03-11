<template>
	<view class="container">
		<!-- 	<view> :autoBack="true"-->
		<!-- <uni-nav-bar left-icon="refreshempty" :border="false" :fixed="true" :statusBar="true" title="变流器"
				@clickTitle="changeCategory" @clickLeft="refreshempty"></uni-nav-bar> -->
		<!-- :titleStyle="{'color':'#fff','width':'100%','text-align':'left','padding-left':'40rpx'}" -->
		<u-navbar title="气体监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<!-- 	<view class="f1">
			<text :class="{'active':show==1}" @click="switchShow(1)">高压监测</text>
			<text :class="{'active':show==2}" @click="switchShow(2)">低压监测</text>
		</view> -->
		<view class="box-container" style="display:flex;height:unset;margin-bottom: unset;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">位置选择</text>
			<uni-data-select style="width:15rem;margin-left: 2rem;background:#142C7E;" v-model="value" :clear="false" :localdata="range" @change="change"></uni-data-select>
		</view>

		<view style="overflow: auto;display:block">

			<view v-if="deviceLists.length==0">
				<u-loading-icon :show="dataLoading"></u-loading-icon>
				<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png"></u-empty>
			</view>

			<view v-if="deviceLists.length>0&&device.typeCode!=1904" class="box-container" v-for=" (device,index) in deviceLists " :key="index">

				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">{{device.name}}</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 30%;">流量</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.realTimeData.energyData.flow}}&nbsp;Nm³/h</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">用量</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.realTimeData.energyData.totalFlowStardard}}&nbsp;Nm³</text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 30%;">温度</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{device.realTimeData.energyData.temperature}}&nbsp;℃
						</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">压力</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{device.realTimeData.energyData.pressure}}&nbsp;Mpa
						</text>
					</view>
				</view>
			</view>

			<view v-if="deviceLists.length>0&&device.typeCode==1904" style="height:8rem" class="box-container" v-for=" (device,index) in deviceLists " :key="index">

				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">{{device.name}}</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 30%;">
							累计
						</text>
						<text style="width:70%;text-align: end;color:#fff">{{get1904EnergyData(device,'totalFlowStardard')}}&nbsp;m³</text>
					</view>
					<view class="row-container">
						<text style="width:30%;min-width: fit-content;">标况瞬时</text>
						<text style="width:70%;text-align: end;color:#fff">{{get1904EnergyData(device,'transientFlowStardard')}}&nbsp;m³/h</text>
					</view>
					<view class="row-container">
						<text style="width:30%;min-width: fit-content">工况瞬时</text>
						<text style="width:70%;text-align: end;color:#fff">{{get1904EnergyData(device,'transientFlowCondition')}}&nbsp;m³/h</text>
					</view>
					<view class="row-container" v-if="getInletPressureText(device.deviceType)">
						<text style="width:30%;min-width: fit-content">
							进口压力
						</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{get1904EnergyData(device,'inletPressure')}}&nbsp;Mpa
						</text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 30%;">温度</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{get1904EnergyData(device,'temperature')}}&nbsp;℃
						</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">压力</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{get1904EnergyData(device,'pressure')}}&nbsp;kPa
						</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">余量</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{get1904EnergyData(device,'allowance')}}&nbsp;m³
						</text>
					</view>
				</view>
			</view>

		</view>


		<view v-if="false" class="box-container" style="overflow: auto;display:block;height:81%">
			<view class="content-container" v-for=" (device,index) in deviceLists" :key="index">
				<view style="display:flex;align-items: center;color: #fff;">
					<!-- <u--image width="16" height="16" mode="scaleToFill"
							src="https://serviceiems.gree.com/api/upload/wximages/menu/icon-ele.png"></u--image> -->
					<text>{{device.name}}</text>
					<!-- <text class="navigat-arrow" @click="redictToPage('electricity-monitor')">&#xe65e;</text> -->
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="data-container">
					<view class="row-container">
						<text style="width: 30%;">流量</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.realTimeData.energyData.flow}}&nbsp;Nm³/h</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">用量</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.realTimeData.energyData.totalFlowStardard}}&nbsp;Nm³</text>
					</view>
				</view>
				<!-- <view class="col-line"></view> -->
				<view class="data-container">
					<view class="row-container">
						<text style="width: 30%;">温度</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{device.realTimeData.energyData.temperature}}&nbsp;℃
						</text>
					</view>
					<view class="row-container">
						<text style="width:30%;">压力</text>
						<text style="width:70%;text-align: end;color:#fff">
							{{device.realTimeData.energyData.pressure}}&nbsp;Mpa
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {

		getDeviceLevelByAreaInfoIdAndCategroyV2,
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
				show: 1,
				value: 0,
				range: [],
				airDeviceList: [],
				realTimeService: new RealtimeDataProviderService(),
				lowVoltageList: [],
				deviceLists: [],
				dataLoading: true,
			}
		},
		onLoad() {
			// this.realTimeService.getConnectedSocket()
			this.getAirListData()
			// this.getLowVoltageRoom()

		},

		onUnload() {
			// if(this.RealTimeService)
			// this.RealTimeService.unregister()
		},
		beforeDestroy() {
			this.realTimeService.unregister()
		},
		methods: {
			getAirListData() {
				getDeviceLevelByAreaInfoIdAndCategroyV2(this.currentSystemInfo.areaId, 3, 3, 6).then(datas => {
					this.dataLoading = false
					let airType = datas.filter(ele => ele.parentId == 0 && ele.levelId == 0) // 父id和层级id设置为0 生成气体种类
					for (let index = 0; index < airType.length; index++) {
						const element = airType[index];
						// let findData = 
						this.range.push({
							value: element.id,
							text: element.name
						})
					}
					// for (let i = 0; i < datas.length; i++) {
					// 	this.range.push({
					// 		value: datas[i].id,
					// 		text: datas[i].name
					// 	})

					// }
					this.value = this.range[0].value
					let findData = datas.filter(ele => ele.deviceId > 0 && ele.typeCode != '')
					this.realTimeService.initDeviceList(findData)
					let deviceList = this.realTimeService.getDeviceList();
					let tableData = datas.filter(ele => ele.deviceType == 6 || ele.deviceType > 8)
					this.airDeviceList = []
					tableData.forEach(data => {
						let realTimeData = deviceList.find(ele => ele.address == data.address && ele.barCode == data.barCode && ele.deviceType == data.typeCode)
						let parentNode = datas.find(ele => ele.id == data.parentId)
						if (!realTimeData) {
							realTimeData = {
								energyData: {
									flow: '--',
									totalFlowStardard: '--',
									temperature: '--',
									pressure: '--'
								}
							}
						}
						this.airDeviceList.push({
							name: parentNode.name + data.name,
							parentId: parentNode.parentId,
							barCode: data.barCode,
							deviceId: data.deviceId,
							typeCode: data.typeCode,
							realTimeData: realTimeData,
							deviceType: data.deviceType
						})
					})

					this.deviceLists = this.airDeviceList.filter(ele => ele.parentId == this.value)
				})
			},
			change(e) {
				this.deviceLists = this.airDeviceList.filter(ele => ele.parentId == e)
			},

			getProperty(deviceType) {
				let index = 1
				switch (deviceType) {
					case 9:
						index = 1
						break;
					case 10:
						index = 2
						break;
					case 11:
						index = 3
						break;
					case 12:
						index = 4
						break;
					case 13:
						index = 5
						break;
					case 14:
						index = 6
						break;
					case 15:
						index = 7
						break;
					case 16:
						index = 8
					default:
						break;

				}
				return index;
			},
			get1904EnergyData(device, property) {
				if (device && device.realTimeData) {
					let energyData = device.realTimeData.energyData
					return energyData[property + this.getProperty(device.deviceType)]
				}

				return '--'
			},
			getInletPressureText(deviceType) {
				switch (deviceType) {
					case 10:
					case 12:
					case 14:
					case 16:
						return true

					default:
						return false
				}
			},

			scrolltolower() {
				this.loadmore()
			},
			loadmore() {
				// for (let i = 0; i < 30; i++) {
				// 	this.indexList.push({
				// 		url: this.urls[uni.$u.random(0, this.urls.length - 1)]
				// 	})
				// }
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
		height: 100%;
		overflow: auto
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
		height: 8rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem;
		padding-bottom: 1rem;
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

	// .content-container {
	// 	width: 100%;
	// 	float: left;
	// 	// height: 77%;
	// 	display: flex;
	// 	flex-direction: column;
	// 	color: #7287C6;
	// 	border: 1px solid;
	// 	margin-bottom: 0.5rem;
	// }

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
</style>