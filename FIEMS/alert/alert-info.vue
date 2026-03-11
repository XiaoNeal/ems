<template>
	<view class="container">
		<u-navbar title="告警信息" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>

		<view class="box-container" style="display:flex;height: unset;overflow: auto;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">日期</text>
			<view class="example-body">
				<uni-datetime-picker type="date" v-model="datetimeStart" @change="changeStartDate" :border="false" :clear-icon="false" />
			</view>
			<view class="example-body">
				<uni-datetime-picker type="date" v-model="datetimeEnd" @change="changeEndDate" :border="false" :clear-icon="false" />
			</view>
		</view>

		<view class="box-container" style="overflow: auto;display:block;height:81%">
			<view v-if="deviceLists.length==0">
				<u-loading-icon :show="dataLoading"></u-loading-icon>
				<u-empty :show="!dataLoading" mode="message" text="无数据" icon="http://cdn.uviewui.com/uview/empty/message.png"></u-empty>
			</view>


			<view v-if="deviceLists.length>0" class="content-container" v-for=" (device,index) in deviceLists" :key="index">
				<view style="display:flex;align-items: center;color: #fff;">
					<!-- <u--image width="16" height="16" mode="scaleToFill"
							src="https://serviceiems.gree.com/api/upload/wximages/menu/icon-ele.png"></u--image> -->
					<text>{{device.deviceName}}</text>
					<!-- <text class="navigat-arrow" @click="redictToPage('electricity-monitor')">&#xe65e;</text> -->
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="data-container">
					<view class="row-container">
						<text style="width: 33%;">报警位置</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.position}}&nbsp;</text>
					</view>
					<view class="row-container">
						<text style="width: 33%;">报警属性</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.attributeName}}&nbsp;</text>
					</view>
				</view>
				<!-- <view class="col-line"></view> -->
				<view class="data-container">
					<view class="row-container">
						<text style="width:33%;">预警值</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.alertValue}}&nbsp;</text>
					</view>
					<view class="row-container">
						<text style="width: 33%;">当前值</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.currentValue}}&nbsp;</text>
					</view>
				</view>

				<view class="data-container">
					<view class="row-container">
						<text style="width:33%;">报警时间</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.occurTime}}&nbsp;</text>
					</view>
					<view class="row-container">
						<text style="width: 33%;">恢复时间</text>
						<text style="width:70%;text-align: end;color:#fff">{{device.recoverTime}}&nbsp;</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryDeviceMonitorRecordByStatus
	} from '@/api/fiems/home.js'
	import {
		dateStandardFormat
	} from '@/utils/date-format';
	export default {
		data() {
			return {
				// bgColor: '#003E98',
				value: 0,
				// range: [],
				deviceLists: [],

				dataLoading: true,

				datetimeStart: '',
				datetimeEnd: "",
			}
		},

		onLoad() {
			this.dataLoading = true
			let date = new Date()
			// date.setDate(date.getDate() - 3)
			date.setHours(0)
			date.setMinutes(0)
			date.setSeconds(0)
			this.datetimeStart = dateStandardFormat(date)
			this.datetimeEnd = dateStandardFormat(new Date())
			this.getAlertData()
		},
		methods: {
			changeStartDate(e) {
				// this.single = e;
				this.datetimeStart = e
				this.getAlertData()
			},
			changeEndDate(e) {
				// this.single = e;
				this.datetimeEnd = e
				this.getAlertData()
			},

			getAlertData() {
				this.dataLoading = true
				this.deviceLists = []
				let date = new Date(this.datetimeStart)
				date.setHours(0)
				date.setMinutes(0)
				date.setSeconds(0)
				let endDate = new Date(this.datetimeEnd)
				endDate.setHours(23)
				endDate.setMinutes(59)
				endDate.setSeconds(59)
				queryDeviceMonitorRecordByStatus(this.currentSystemInfo.areaId, -1, 0, date, endDate).then(datas => {
					this.alarText = []
					datas.forEach(element => {
						let recoverTime = element.recoverTime.slice(0, 19)
						this.deviceLists.push({
							position: element.levelParentName,
							deviceName: element.levelName,
							attributeName: element.attributeName,
							occurTime: element.occurTime.slice(0, 19) ,
							recoverTime: recoverTime ? recoverTime : '未恢复',
							currentValue: parseFloat(element.lastValue).toFixed(2),
							alertValue: element[this.getValueType(element.valueType)]
						})

					})

					this.deviceLists.sort((a, b) => {
						return new Date(b.occurTime).getTime() - new Date(a.occurTime).getTime()
					})
					this.dataLoading = false
				})
			},
			getValueType(valueType) {
				switch (valueType) {
					case 1:
						return 'maxAlarm';
					case 2:
						return 'minAlarm'
					case 3:
						return 'maxHalt'
					case 4:
						return 'minHalt';
					default:
						return ''
				}
			},
			change(e) {
				// this.dataLoading = true
				// let deviceList = this.deviceMap.get(e)
				// this.realTimeService.initDeviceList(deviceList)
				// this.deviceLists = this.realTimeService.getDeviceList();
				// this.dataLoading = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		font-size: 24rpx;
		line-height: 24px;
		background-color: #0E2264;
		height: 100%;
		overflow: auto
	}

	.box-container {
		background: #16379A;
		height: 3rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem;
		display: flex;
	}

	.content-container {
		width: 100%;
		float: left;
		// height: 77%;
		display: flex;
		flex-direction: column;
		color: #7287C6;
		border: 1px solid;
		margin-bottom: 0.5rem;
	}

	.data-container {
		display: flex;
	}

	.row-container {
		margin: auto;
		width: 50%;
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

	::v-deep.uni-date__x-input {
		width: 6rem
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

	::v-deep.uni-date-x {
		margin: 0 0.25rem;
		background: #142C7E;
		color: #fff;
	}
</style>