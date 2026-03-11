<template>
	<view class="container">
		<u-navbar title="污水站监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>

		<view class="box-container" style="overflow: auto;display:block;height:100%">
			<view v-if="deviceLists.length==0">
				<u-loading-icon :show="dataLoading"></u-loading-icon>
				<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png">
				</u-empty>
			</view>

			<view v-if="deviceLists.length>0&&device.deviceType!=1803" class="content-container" v-for=" (device,index) in deviceLists" :key="index">

				<!-- 	<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="color:#fff">{{device.name}}</text>
					</view>

				
				</view> -->
				<!-- <u-line color="#7287C6"></u-line> -->
				<view class="data-container">
					<view class="row-container" v-for="(property,index) in objectToArray(device.stateData)" :key="index">
						<text style="width:60%;min-width:fit-content">{{property.name}}</text>
						<rich-text style="width:40%;text-align: end" :nodes="property.value"></rich-text>
							<!-- <text
							style="width:60%;text-align: end;color:#fff">{{property.value}}&nbsp;</text> -->
					</view>
				</view>
			</view>
		</view>

		<view v-if="false&&deviceLists.length>0&&device.deviceType!=1803" class="box-container" style="display: block;" v-for=" (device,index) in deviceLists " :key="index"></view>

	</view>
</template>

<script>
	import {
		getDeviceLevelByAreaInfoIdAndCategroyV2,
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
		onLoad() {
			this.setDeviceLevel()
		},
		beforeDestroy() {
			this.realTimeService.unregister()
		},
		methods: {
			// change(e) {
			// 	this.dataLoading = true
			// 	let deviceList = this.deviceMap.get(e)
			// 	this.realTimeService.initDeviceList(deviceList)
			// 	this.deviceLists = this.realTimeService.getDeviceList();
			// 	this.dataLoading = false
			// },

			setDeviceLevel() {
				getDeviceLevelByAreaInfoIdAndCategroyV2(this.currentSystemInfo.areaId, 6, 3, 11).then(datas => {
					console.log('污水站',datas);
					// this.range.forEach(ele => {
					// 	let ameterList = []
					// 	let findData = datas.filter(device => device.parentId == ele.value)
					// 	ameterList = ameterList.concat(findData)
					// 	this.deviceMap.set(ele.value, ameterList)

					// })
					let data = datas.filter(device => device.deviceId > 0)

					this.realTimeService.initDeviceList(data)
					let deviceList = this.realTimeService.getDeviceList();
					this.deviceLists = deviceList
					this.dataLoading = false
				})
			},
			objectToArray(obj) {
				return Object.values(obj)
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