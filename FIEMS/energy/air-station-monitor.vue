<template>
	<view class="container">
		<u-navbar title="空压站监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>

		<view class="box-container" style="display:flex;height:unset;background:#16379A;margin:0.5rem;margin-bottom: unset;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">位置选择</text>
			<uni-data-select style="width:15rem;margin-left: 2rem;background:#142C7E;" v-model="value" :clear="false" :localdata="range" @change="change"></uni-data-select>
		</view>

		<view class="box-container" style="overflow: auto;display:block;height:81%">
			<view v-if="deviceLists.length==0">
				<u-loading-icon :show="dataLoading"></u-loading-icon>
				<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png"></u-empty>
			</view>

			<view v-if="deviceLists.length>0&&device.deviceType!=1803" class="content-container" v-for=" (device,index) in deviceLists" :key="index">
				<!-- <view style="display:flex;align-items: center;color: #fff;">
				
				<text>{{device.name}}</text>
				
			</view>
			<u-line color="#7287C6"></u-line> -->
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="color:#fff">{{device.name}}</text>
					</view>

					<!-- <text class="navigat-arrow">&#xe65e;</text> -->
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="data-container" v-if="device.deviceType==1318">
					<view class="row-container">
						<text style="width:40%;">介质温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.temperature}}&nbsp;℃</text>
					</view>
					<view class="row-container" v-if="currentSystemInfo.areaId != 2">
						<text style="width:50%;">标况瞬时流量</text>
						<text style="width:50%;text-align: end;color:#fff">{{device.energyData.transientFlowStardard}}&nbsp;m³/h</text>
					</view>
					<view class="row-container" v-show="currentSystemInfo.areaId != 2">
						<text style="width:50%;">工况瞬时流量</text>
						<text style="width:50%;text-align: end;color:#fff">{{device.energyData.transientFlowCondition}}&nbsp;m³/h</text>
					</view>

				</view>
				<view class="data-container" v-if="device.deviceType=='130B'">
					<view class="row-container">
						<text style="width:40%;">温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.temperature}}&nbsp;m³/h</text>
					</view>
					<!-- <view class="row-container">
						<text style="width:40%;">压力</text>
						<text
							style="width:60%;text-align: end;color:#fff">{{device.energyData.pressure}}&nbsp;m³/h</text>
					</view> -->
					
					<view class="row-container" v-if="currentSystemInfo.areaId != 2">
						<text style="width:40%;">压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.pressure}}&nbsp;bar</text>
					</view>
					<view class="row-container" v-show="currentSystemInfo.areaId != 2">
						<text style="width:40%;">压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.pressure}}&nbsp;Mpa</text>
					</view>

				</view>
				<view class="data-container" v-if="device.deviceType==1318">
					<!-- <view class="row-container">
						<text style="width: 28%;">标况累计流量</text>
						<text
							style="text-align:end;color:#fff;width: 72%;">{{device.energyData.totalFlowStardard}}&nbsp;m³/h</text>
					</view> -->
					<view class="row-container" v-if="currentSystemInfo.areaId != 2">
						<text style="width:28%;">标况瞬时流量</text>
						<text style="text-align:end;color:#fff;width: 72%;">{{device.energyData.totalFlowStardard}}&nbsp;m³/h</text>
					</view>
					<view class="row-container" v-show="currentSystemInfo.areaId != 2">
						<text style="width:28%;">工况瞬时流量</text>
						<text style="text-align:end;color:#fff;width: 72%;">{{device.energyData.totalFlowCondition}}&nbsp;m³/h</text>
					</view>
					<!-- <view class="row-container">
						<text style="width: 40%;"></text>
						<text style="width:60%;text-align: end;color:#fff"></text>
					</view> -->
				</view>
				<view class="data-container" v-if="device.deviceType=='130B'">
					<view class="row-container">
						<text style="width: 40%;">压力露点</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.temperatureDewPoint}}&nbsp;℃td</text>
					</view>
					<view class="row-container">
						<text style="width: 40%;">常压露点</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.atmosphericDewPoint}}&nbsp;℃td</text>
					</view>
				</view>
				<view class="data-container" v-if="device.deviceType=='2305_V1.1'">
					<view class="row-container">
						<text style="width:40%;">系统供气压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.systemPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">冷却水压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.coolingWaterPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">二级排气温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.secondStageExhaustTemperature}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">润滑油温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.lubricationOilTemperature}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">主电机电流</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.mainMotorCurrent}}&nbsp;A</text>
					</view>
				</view>
				<view class="data-container" v-if="device.deviceType=='2306_V2.2'">
					<view class="row-container">
						<text style="width:40%;">排气口温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.ventTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">后冷出口温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.outletTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">露点温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.dewPoint}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">空气进口温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.inletTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">空气进口温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.heaterTemp}}&nbsp;℃</text>
					</view>

				</view>
				
				<view class="data-container" v-if="device.deviceType=='2307'">
					<view class="row-container">
						<text style="width:40%;">系统压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.systemPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">排气压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.exhaustPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">润滑油温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.lubricatingOilTemperature}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">IGV开度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.IGVOpeningSignal}}&nbsp;%</text>
					</view>
				
				
				</view>
				<view class="data-container" v-if="device.deviceType=='230A'">
					<view class="row-container">
						<text style="width:40%;">A塔压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.containerAPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">B塔压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.containerBPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">露点温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.dewPointTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">进气温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.inletTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">加热器温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.heaterTemp}}&nbsp;℃</text>
					</view>
				
				</view>
				<view class="data-container" v-if="device.deviceType=='2309'">
					<view class="row-container">
						<text style="width:40%;">A罐压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.containerAPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">B罐压力</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.containerBPressure}}&nbsp;Mpa</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">露点</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.dewPoint}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">进气温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.inletTemp}}&nbsp;℃</text>
					</view>
					<view class="row-container">
						<text style="width:40%;">加热器温度</text>
						<text style="width:60%;text-align: end;color:#fff">{{device.energyData.heaterTemp}}&nbsp;℃</text>
					</view>
				
				</view>
			</view>
		</view>

		<view v-if="false&&deviceLists.length>0&&device.deviceType!=1803" class="box-container" style="display: block;" v-for=" (device,index) in deviceLists " :key="index"></view>
	</view>
</template>

<script>
	import {
		getDevicePosotionLevelByAreaInfoIdAndCategroy,
		getDeviceLevelByAreaInfoIdAndCategroy
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
				dataLoading: true,
			}
		},
		mounted() {
			if (this.currentSystemInfo.areaId == 2) {
				// this.setPostionLevel()
				this.setDeviceLevel()
			} else {
				getDevicePosotionLevelByAreaInfoIdAndCategroy(this.currentSystemInfo.areaId, 4).then(datas => {
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
						// findData.forEach(child=>{
						//   let childFind = datas.filter(device=>device.parentId ==child.id)
						//   ameterList = ameterList.concat(childFind)
						//   childFind.forEach(childData=>{
						//     let childFindData = datas.filter(device=>device.parentId ==childData.id)
						//     ameterList = ameterList.concat(childFindData)
						//   })
						// })

						// ameterList = ameterList.filter(device=>device.deviceType==7) 
						this.deviceMap.set(ele.id, ameterList)

					})
					this.value = this.range[0].value
					this.realTimeService.initDeviceList(this.deviceMap.get(this.value))
					let deviceList = this.realTimeService.getDeviceList();
					this.deviceLists = deviceList

					this.dataLoading = false

				})

			}
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
			},

			async setDeviceLevel() {
				await getDeviceLevelByAreaInfoIdAndCategroy(this.currentSystemInfo.areaId, 7, 3).then(datas => {
					this.range=[
						{text:'氮气',value:3610},
						{text:'中压气体',value:3608},
						{text:'低压气体',value:3612},
					]
					this.range.forEach(ele => {
						let ameterList = []
						let findData = datas.filter(device => device.parentId == ele.value)
						ameterList = ameterList.concat(findData)
						this.deviceMap.set(ele.value, ameterList)

					})
					this.value = this.range[0].value
					this.realTimeService.initDeviceList(this.deviceMap.get(this.value))
					let deviceList = this.realTimeService.getDeviceList();
					this.deviceLists = deviceList
					this.dataLoading = false
				})
			},
			// async setPostionLevel() {
			// 	await getDevicePosotionLevelByAreaInfoIdAndCategroy(this.currentSystemInfo.areaId, 4).then(datas => {
			// 		this.dataLoading = false
			// 		let positions = datas.filter(ele => ele.parentId == 0)
			// 		positions.forEach(ele => {
			// 			this.range.push({
			// 				value: ele.id,
			// 				text: ele.name
			// 			})
			// 		})
			// 		this.value = this.range[0].value
			// 	})
			// }
		},
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

		height: 5rem;
		// margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem;
		display: flex;
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2rem;
		margin-left: 0.5rem
	}

	// .content-container {
	// 	width: 46%;
	// 	float: left;
	// 	height: 77%;
	// 	display: flex;
	// 	flex-direction: column;
	// 	color: #7287C6;
	// }

	// .row-container {
	// 	margin: auto;
	// 	width: 100%;
	// 	display: flex;
	// 	align-items: center;
	// 	height: 100%;
	// }

	.content-container {
		width: 100%;
		float: left;
		// height: 77%;
		display: flex;
		flex-direction: column;
		color: #7287C6;
		// border: 1px solid;
		margin-bottom: 0.5rem;
		background: #16379A;
		border-radius: 6px;
	}

	.data-container {
		display: flex;
		flex-wrap: wrap;
	}

	.row-container {
		margin: auto;
		width: 100%;
		display: flex;
		align-items: center;
		height: 100%;
		padding: 0 0.5rem
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