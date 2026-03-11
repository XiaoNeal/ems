<template>
	<view class="container">
		<u-navbar :title="currentStorageArea.name+'储能'" leftIconColor="#fff"
			:titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true"
			:bgColor="'#003E98'" :safeAreaInsetTop='true'></u-navbar>
		<view class="f1">
			<text :class="{'active':show==1}" @click="switchShow(1)">概览</text>
			<text :class="{'active':show==2}" @click="switchShow(2)">设备</text>
		</view>
		<view class="box-container" v-if="show==2" style="justify-content: center;">
			<text style="color:#fff;display:flex;align-items:center;justify-content:center;font-size:28rpx;">储能箱选择</text>
			<uni-data-select style="width:8rem;margin-left: 2rem;background:#142C7E;text-align: center;" v-model="value" :clear="false" :localdata="range" @change="changeStrage"></uni-data-select>
		</view>

		<view class="box-container" style="height: 8rem;display: block;" v-if="show==1" v-for=" (storageDevice,index) in storageDevices " :key="index">
			<view style="display:flex;align-items:center;justify-content: space-between;">
				<view style="display:flex;align-items:center;">
					<text>{{storageDevice.name}}</text>
				</view>
				<!-- <text class="navigat-arrow">&#xe65e;</text> -->
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:50%">
				<view class="row-container">
					<text style="width:66%;">当前状态</text>
					<text style="width:34%;text-align: end;color:#fff">{{storageDevice.realtimeData.B7b4}}&nbsp;</text>
				</view>
				<view class="row-container">
					<text style="width:66%;">日累计充电电量</text>
					<text style="width:34%;text-align: end;color:#fff">{{storageDevice.realtimeData.chargeCapacityDaily}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:66%;">日累计放电放电</text>
					<text style="width:34%;text-align: end;color:#fff">{{storageDevice.realtimeData.dischargeCapacityDaily}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:66%;">系统电量</text>
					<text style="width:34%;text-align: end;color:#fff">{{storageDevice.realtimeData.systemSoc}}&nbsp;%</text>
				</view>
			</view>
			<view class="col-line"></view>
			<view class="content-container" style="width:41%">
				<view class="row-container">
					<text style="width: 40%;">今日收益</text>
					<text style="width:60%;text-align: end;color:#fff">{{storageDevice.realtimeData.dailyIncome}}&nbsp;元</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">本月收益</text>
					<text style="width:60%;text-align: end;color:#fff">{{storageDevice.realtimeData.monthIncome}}&nbsp;元</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">本年收益</text>
					<text style="width:60%;text-align: end;color:#fff">{{storageDevice.realtimeData.yearIncome}}&nbsp;元</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">累计收益</text>
					<text style="width:60%;text-align: end;color:#fff">{{storageDevice.realtimeData.totalIncome}}&nbsp;元</text>
				</view>
			</view>
		</view>

		<view style="display:flex;margin:0.5rem;background:#16379A;align-items: center;height: 2rem;" v-if="show==2">
			<view style="color:#fff;font-size:26rpx;width:6rem;text-align: right;">日期选择：</view>
			<view class="date-container">
				<text :class="dateIndex==1?'date-text select-date':'date-text'" @click="selectDateType(1)">日</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==2?'date-text select-date':'date-text'" @click="selectDateType(2)">月</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==3?'date-text select-date':'date-text'" @click="selectDateType(3)">年</text>
			</view>

			<view>
				<biaofun-datetime-picker fields="month" :defaultValue="single" v-if="dateIndex==1" @change="change"></biaofun-datetime-picker>
				<biaofun-datetime-picker fields="year" :defaultValue="single" v-if="dateIndex==2" @change="change"></biaofun-datetime-picker>
			</view>
		</view>

		<view class="box-container" style="height:18rem;display: block;" v-if="show==2">
			<view style=" display:flex;align-items: center;justify-content: space-between;">
				<text>收益曲线</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;">
				<!-- <progress-bar :isRank="isRank" :content="incomeRankData" /> -->
				<qiun-data-charts canvasId="KkEwYhONjGGMdZnWIwymDmECMggvUAFD" :canvas2d="canvas2d" type="column" :opts="optBar" :chartData="chartBarData" />
			</view>
		</view>

		<view class="box-container" style="height:18rem;display: block;" v-if="show==2">
			<view style=" display:flex;align-items: center;justify-content: space-between;">
				<text>充放电曲线</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;">
				<!-- <progress-bar :isRank="isRank" :content="incomeRankData" /> -->
				<qiun-data-charts canvasId="HLWIyUNqLZKuYOndVFMlMXRWBiqChpcL" :canvas2d="canvas2d" type="line" :opts="optLine" :chartData="chartLineData" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getAllInfoFromDeviceBaseInfo,
		findStateByDeviceIds,
		get1706energyByDays,
		get1706stateByDays
	} from '@/api/fiems/energy.js'
	import {
		isNumber
	} from 'axios/lib/utils';
	import {
		dateStandardFormat
	} from '@/utils/date-format'
	export default {
		data() {
			return {
				canvas2d: this.$Config.ISCANVAS2D,
				bgColor: '#003E98',
				storageDevices: [],
				show: 1,
				dateIndex: 1,
				dateType: 'day',
				date: new Date(),
				single: '2021-02-12',
				chartBarData: {},
				currentBattery: {},
				value: 0,
				range: [],
				optBar: {
					color: ["#1890FF"],
					update: true,
					padding: [15, 15, 15, 5],
					enableScroll: false,
					dataLabel: false,
					labelCount: 6,
					legend: {
						position: 'top',
						float: "right",
						fontColor: '#fff'
					},
					xAxis: {
						disableGrid: true,
						fontColor: '#fff',
						fontSize: 10,
						splitNumber: 6,
						labelCount: 6,
						fontSize: 10,
						gridEval: '100',
						format: (val, index, opts) => {
							if (index % 2 == 0) {

								return val;
							} else {
								return ''
							}
						}

					},
					yAxis: {
						disableGrid: true,
						showTitle: true,
						data: [{
							min: 0,
							fontColor: '#fff',
							position: "left",
							title: "单位：元",
							titleOffsetY: -10,
							titleFontColor: '#fff'
						}]
					},
					extra: {
						column: {
							type: "stack",
							width: 6,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							labelPosition: "center"
						}
					}
				},
				optLine: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					update: true,
					padding: [15, 10, 0, 15],
					enableScroll: false,
					dataLabel: false,
					legend: {
						position: 'top',
						float: "right",
						fontColor: '#fff',

					},
					xAxis: {
						disableGrid: true,
						fontColor: '#fff',
						fontSize: 10,
						splitNumber: 6,
						labelCount: 6,
						fontSize: 10,
						gridEval: '100',
						format: (val, index, opts) => {
							if (index % 2 == 0) {

								return val;
							} else {
								return ''
							}
						}
					},
					yAxis: {
						// gridType: "dash",
						// dashLength: 2,
						disableGrid: true,
						showTitle: true,
						data: [{
							min: 0,
							fontColor: '#fff',
							position: "left",
							title: "单位：kWh",
							titleOffsetY: -10,
							titleFontColor: '#fff'
						}]
					},
					extra: {
						line: {
							type: "straight",
							activeBgColor: "#000000",
							width: 2,
							activeType: "hollow"
						}
					}
				},
				chartLineData: {},
				chartLineOption: {
					categories: [],
					series: [{
							name: "充电",
							data: []
						},
						{
							name: "放电",
							data: []
						}
					]
				},
				chartBarOption: {
					categories: [],
					series: [{
						name: "收益",
						data: []
					}]
				},

			}
		},
		onLoad() {
			this.date.setDate(this.date.getDate() - 1)
			this.single = dateStandardFormat(this.date)
			getAllInfoFromDeviceBaseInfo(this.currentStorageArea.areaInfoId).then(data => {
				console.log('data',data);
				this.storageDevices = []
				for (const key in data[0]) {
					let element = data[0][key]
					if (element instanceof Object || typeof(element)=='object') {
						let name = key.split('_')[1]
						// let deviceId = element._1706device ? element._1706device.join('') : element._1706_V2device.join('')
						let deviceId = element._1706device ? element._1706device[0].toString() : element._1706_V2device[0].toString()
						console.log('deviceId',deviceId);
						// let _1312device = ''
						// if (element._1312device) {
						// 	_1312device = element._1312device.join('')
						// } else if (element._1312_V2_1device) {
						// 	_1312device = element._1312_V2_1device.join('')
						// } else(
						// 	_1312device = ''
						// )
						let _1707device = []
						if(element._1707device){
							_1707device=element._1707device
						}else if(element._1707_V3device){
							let _1707_V3device = element._1707_V3device?element._1707_V3device:[]
							let _1707_V3_1device = element._1707_V3_1device?element._1707_V3_1device:[]
							let _1707_V2_1device = element._1707_V2_1device?element._1707_V2_1device:[]
							_1707device=_1707_V3device.concat(_1707_V3_1device,_1707_V2_1device)
						}else{
							_1707device = []
						}
						
						let device = {
							name: name,
							deviceId: deviceId,
							realtimeData: {
								systemSoc: '--',
								B7b4: '--',
								B7b0: '--',
								cumulativeChargeDapacity: '--',
								cumulativeDischargeCapacity: '--',
								chargeCapacityDaily: '--',
								dischargeCapacityDaily: '--',
								systemPower: '--',
								monthIncome: '--',
								yearIncome: '--',
								totalIncome: '--',
								dailyIncome: '--'
							},
							// _1312device: element._1312device.join(''),
							_1312device: element._1312device ? element._1312device.join(''): (element._1312_V2_1device?element._1312_V2_1device.join(''):'')   ,
							// _1312device: _1312device,
							// _1708device: element._1708device.join(''),
							_1708device: element._1708device ? element._1708device.join('') : (element._1708_V2device? element._1708_V2device.join(''):''),
							// _1704device: element._1704device,
							_1704device: element._1704device ? element._1704device : element._1704_V2device,
							// _1704device: _1704device,
							// _1707device: element._1707device ? element._1707device : element._1707_V2device,
							_1707device: _1707device,
						}
						this.range.push({
							value: deviceId,
							text: name,
							device: device
						})
						this.storageDevices.push(device)
					}
				}
				this.storageDevices.sort((a,b)=>{
					return +a.name.slice(0,-2) - +b.name.slice(0,-2)
				})
				this.value = this.storageDevices[0].deviceId
				this.currentBattery = this.storageDevices[0]
				this.storageDevices.forEach(blist => {
					let date = new Date()
					findStateByDeviceIds(blist.deviceId, blist._1708device).then(data => {
						if (data) {
							let currentDate;
							if (data && data.frameDatetime) {
								data.frameDatetime=data.frameDatetime.slice(0, -2)
								let frameDate = new Date(data.frameDatetime.replace(/-/g, "/"))
								date.setHours(0);
								date.setMinutes(0);
								date.setSeconds(0)
								if (frameDate > date) currentDate = true
							}
							blist.realtimeData.currentDate = currentDate
							blist.realtimeData.systemSoc = data.systemSoc ? data.systemSoc : '--';
							blist.realtimeData.cumulativeChargeDapacity = data.cumulativeChargeCapacity;
							blist.realtimeData.cumulativeDischargeCapacity = data.cumulativeDischargeCapacity;
							blist.realtimeData.chargeCapacityDaily = currentDate ? data.chargeCapacityDaily : '--';
							blist.realtimeData.dischargeCapacityDaily = currentDate ? data.dischargeCapacityDaily : '--';
							blist.realtimeData.systemPower = data.systemPower ? data.systemPower : '--';
							blist.realtimeData.B7b4 = currentDate ? this.getStateData(data.chargeDischargeStatus,data.pcs_side_three_phase_active_power) : '--';
							blist.realtimeData.B7b0 = currentDate && data ? this.getStrategy(data.runningStrategy) : '--';
							blist.realtimeData.totalIncome = data.totalIncome ? data.totalIncome : '---'
							blist.realtimeData.dailyIncome = currentDate && data ? data.dailyIncome : '---'
							blist.realtimeData.monthIncome = data.monthlyIncome ? data.monthlyIncome : '--'
							blist.realtimeData.yearIncome = data.yearlyIncome ? data.yearlyIncome : '--'
						}
					})
					
				})
				
			})
		},

		methods: {
			changeStrage(e) {
				let findData = this.range.find(ele => e == ele.value)
				if (findData) {
					this.currentBattery = findData.device
					this.setChargeData()
					this.setProfitData()
				}
			},
			selectDateType(index) {
				this.dateIndex = index
				switch (index) {
					case 1:
						this.single = '2023-06-04';
						break;
					case 2:
						this.single = '2023-06';
						break;
					case 3:
						this.single = '2023';
						break;
					default:
						this.single = '2023-06-04';
						break;
				}
				this.setChargeData()
				this.setProfitData()

			},
			change(e) {
				this.date = e.dt
				this.setChargeData()
				this.setProfitData()
			},
			getStateData(stateData, num) {
				// if (num == 'num') return stateData
				if(num>0){
					return '充电'
				}else if (num<0){
					return '放电'
				}else if(num==0) {
					return '不充不放'
				}
				if (stateData === 0) {
					return '不充不放'
				} else if (stateData == 1) {
					return '充电'
				} else if (parseInt(stateData)) {
					return '放电'
				} else return '--'

			},

			getEnergyData(device, property, num) {
				if (device.realtimeData && device.realtimeData.energyData) {
					return device.realtimeData.energyData[property]
				} else if (num == 'num') {
					return 0
				} else {
					return '--'
				}
			},

			getStrategy(stateData) {
				if (stateData === 0) {
					return '峰谷模式'
				} else if (stateData == 1) {
					return '安全模式'
				} else if (isNumber(stateData)) {
					return '未知状态'
				} else return '--'

			},
			switchShow(index) {

				this.show = index
				if (index == 2) {
					this.setChargeData()
					this.setProfitData()
				}

			},
			setChargeData() {

				this.chartLineOption.categories = []
				this.chartLineOption.series[0].data = []
				this.chartLineOption.series[1].data = []
				if (this.dateIndex == 1) {
					get1706energyByDays(this.currentBattery.deviceId, this.getStartEndDate().startDate, this
						.getStartEndDate().endDate).then(data => {
						this.setChargeOption(data, 8, 11)
					})
				} else if (this.dateIndex == 2) {
					let startDate = new Date(this.getStartEndDate().startDate)
					startDate.setMonth(0);
					startDate.setDate(1);
					this.isLoading = false
					get1706energyByDays(this.currentBattery.deviceId, startDate, this.getStartEndDate().endDate).then(
						data => {
							for (let index = 0; index < 12; index++) {
								let findData = data.filter(ele => {
									return ele.frameDatetime.substring(5, 7) == (index + 1)
								})
								let chargeCapacity = 0
								let dischargeCapacity = 0
								if (findData) {
									chargeCapacity = findData.reduce((total, currentValue) => {
										return total + currentValue.chargeCapacityDaily
									}, 0)
									dischargeCapacity = findData.reduce((total, currentValue) => {
										return total + currentValue.dischargeCapacityDaily
									}, 0)
								}

								this.chartLineOption.categories.push(index + 1 + '月')
								// this.chargeOptions.xAxis[0].data.push(index);
								this.chartLineOption.series[0].data.push(chargeCapacity)
								this.chartLineOption.series[1].data.push(dischargeCapacity)
							}
							this.chartLineData = JSON.parse(JSON.stringify(this.chartLineOption));
							// }
							// this.chargeOptionsData.setOption(this.chargeOptions);
						})
				} else if (this.dateIndex == 3) {

					let startDate = new Date(this.getStartEndDate().startDate)
					startDate.setMonth(0);
					startDate.setDate(1);
					startDate.setFullYear(2021)
					this.isLoading = false
					get1706energyByDays(this.currentBattery.deviceId, startDate, new Date()).then(data => {

						for (let index = 2021; index < (new Date().getFullYear() + 1); index++) {
							let findData = data.filter(ele => {
								return ele.frameDatetime.substring(0, 4) == (index)
							})
							let chargeCapacity = 0
							let dischargeCapacity = 0
							if (findData) {
								chargeCapacity = findData.reduce((total, currentValue) => {
									return total + currentValue.chargeCapacityDaily
								}, 0)
								dischargeCapacity = findData.reduce((total, currentValue) => {
									return total + currentValue.dischargeCapacityDaily
								}, 0)
							}
							this.chartLineOption.categories.push(index)
							this.chartLineOption.series[0].data.push(chargeCapacity)
							this.chartLineOption.series[1].data.push(dischargeCapacity)
						}
						this.chartLineData = JSON.parse(JSON.stringify(this.chartLineOption));
					})
				}
			},

			setChargeOption(data, startIndex, endIndex) {
				for (let index = 0; index < data.length; index++) {
					const element = data[index];
					this.chartLineOption.categories.push(element.frameDatetime.substring(startIndex, endIndex))
					// this.chargeOptions.xAxis[0].data.push(index);
					this.chartLineOption.series[0].data.push(element.chargeCapacityDaily)
					this.chartLineOption.series[1].data.push(element.dischargeCapacityDaily)
				}
				this.chartLineData = JSON.parse(JSON.stringify(this.chartLineOption));
			},
			getStartEndDate() {
				let startDate = new Date(this.date);
				startDate.setDate(1)
				startDate.setHours(0)
				startDate.setMinutes(0)
				startDate.setSeconds(0)
				let endDate = new Date(this.date);
				endDate.setMonth(this.date.getMonth() + 1)
				endDate.setDate(0)
				endDate.setHours(0)
				endDate.setMinutes(0)
				endDate.setSeconds(0)
				return {
					startDate,
					endDate
				}
			},
			setProfitData() {

				this.chartBarOption.categories = []
				this.chartBarOption.series[0].data = []
				// if (this.selectedType == 0) {
				//   this.profitOptions.series[0].type = 'line'
				//   this.storageService.get1706StateIncome(this.currentBattery.deviceId, this.startDate).then(data => {
				//     this.setProfitOption(data, 11, 19)
				//   })
				// } else 
				if (this.dateIndex == 1) {
					get1706stateByDays(this.currentBattery.deviceId, this.getStartEndDate().startDate, this
						.getStartEndDate().endDate).then(data => {
						this.setProfitOption(data, 8, 11)
					})
				} else if (this.dateIndex == 2) {

					// this.profitOptions.series[0].type = 'bar'
					// this.profitOptions.series[0].barMaxWidth = '30'
					let startDate = new Date(this.getStartEndDate().startDate)
					startDate.setMonth(0);
					startDate.setDate(1);
					get1706stateByDays(this.currentBattery.deviceId, startDate, this.getStartEndDate().endDate).then(
						data => {
							for (let index = 0; index < 12; index++) {
								let findData = data.filter(ele => {
									return ele.frameDatetime.substring(5, 7) == (index + 1)
								})
								let dailyIncome = 0
								if (findData) {
									dailyIncome = findData.reduce((total, currentValue) => {
										return total + currentValue.dailyIncome
									}, 0)
								}
								this.chartBarOption.categories.push(index + 1 + '月')
								this.chartBarOption.series[0].data.push(dailyIncome)
							}
							this.chartBarData = JSON.parse(JSON.stringify(this.chartBarOption));
						})
				} else if (this.dateIndex == 3) {
					let startDate = new Date(this.getStartEndDate().startDate)
					startDate.setMonth(0);
					startDate.setDate(1);
					startDate.setFullYear(2021)
					get1706stateByDays(this.currentBattery.deviceId, startDate, new Date()).then(data => {
						for (let index = 2021; index < (new Date().getFullYear() + 1); index++) {
							let findData = data.filter(ele => {
								return ele.frameDatetime.substring(0, 4) == (index)
							})
							let dailyIncome = 0
							if (findData) {
								dailyIncome = findData.reduce((total, currentValue) => {
									return total + currentValue.dailyIncome
								}, 0)
							}
							this.chartBarOption.categories.push(index);
							this.chartBarOption.series[0].data.push(dailyIncome)
						}
						this.chartBarData = JSON.parse(JSON.stringify(this.chartBarOption));
					})
				}
			},

			setProfitOption(data, startIndex, endIndex) {
				for (let index = 0; index < data.length; index++) {
					const element = data[index];
					if (element.dailyIncome > 3000) continue
					this.chartBarOption.categories.push(element.frameDatetime.substring(startIndex, endIndex));
					this.chartBarOption.series[0].data.push(element.dailyIncome)
				}
				this.chartBarData = JSON.parse(JSON.stringify(this.chartBarOption));
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
		height: 3rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem;
		display: flex;
		padding-right: unset;
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
		height: 70%;
	}


	.date-container {
		color: #fff;
		width: 7rem;
		display: flex;
		align-items: center;
		background: #142C7E;
	}

	.date-text {
		display: block;
		width: 2rem;
		text-align: center;
		background: #142C7E;
	}

	.select-date {
		border-bottom: 2px solid #00E9AA
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