<template>
	<view class="container">
		<u-navbar :title="currentDevice.name" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%','margin':'0 2rem'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>

		<view style="display:flex;margin:0.5rem;background:#16379A;align-items: center;height: 2rem;">
			<view style="color:#fff;font-size:26rpx;width:6rem;text-align: right;">日期选择：</view>
			<!-- 	<view class="date-container">
				<text :class="dateIndex==1?'date-text select-date':'date-text'" @click="selectDateType(1)">日</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==2?'date-text select-date':'date-text'" @click="selectDateType(2)">月</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==3?'date-text select-date':'date-text'" @click="selectDateType(3)">年</text>
			</view> -->
			<!-- 	<!-- 	<view class="example-body" v-if="dateIndex==1">
				<uni-datetime-picker type="date" :clear-icon="false" v-model="single" @maskClick="maskClick"
					@change="change" />
			</view>
			<view v-if="dateIndex==2">
				<u-datetime-picker :show="show" v-model="value1" mode="year-month"></u-datetime-picker>
				<u-button @click="show = true">打开</u-button>
			</view> -->
			<view>
				<biaofun-datetime-picker fields="day" :defaultValue="single" @change="change"></biaofun-datetime-picker>
				<!-- <biaofun-datetime-picker fields="month" :defaultValue="single" v-if="dateIndex==2"
					@change="change"></biaofun-datetime-picker>
				<biaofun-datetime-picker fields="year" :defaultValue="single" v-if="dateIndex==3"
					@change="change"></biaofun-datetime-picker> -->
				<!-- <biaofun-datetime-picker fields="year" :defaultValue="single"
						@change="change"></biaofun-datetime-picker> -->
			</view>
		</view>

		<view class="box-container" style="height:18rem">
			<view class="header-container">
				<text>相电流</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;">
				<qiun-data-charts type="line" :opts="opts" :chartData="chartCurrentData" :inScrollView="true" />
			</view>
		</view>

		<view class="box-container" style="height:18rem">
			<view class="header-container">
				<text>有功功率</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;">
				<qiun-data-charts type="line" :opts="optsPower" :chartData="chartPowerData" :inScrollView="true" />
			</view>
		</view>
		<view class="box-container" style="height:18rem">
			<view class="header-container">
				<text>相电压</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;">
				<qiun-data-charts type="line" :opts="optsVoltage" :chartData="chartVoltageData" :inScrollView="true" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryThreePhaseMeterDataByDateNew
	} from '@/api/fiems/energy.js'
	import {
		dateStandardFormat,
		dateMonthFormat
	} from '@/utils/date-format'
	export default {
		data() {
			return {
				show: false,
				value1: Number(new Date()),
				// bgColor: '#003E98',
				yearDischargeCapacity: '--',
				monthDischargeCapacity: '--',
				yesterdayDischargeCapacity: '--',
				yearIncome: '--',
				monthIncome: '--',
				yesterdayIncome: '--',
				date: new Date(),
				single: '2021-02-12',
				incomeRankData: [],
				isRank: true,
				singleIncomeRankData: [],
				standardizedRateData: [],
				dateIndex: 1,
				dateType: 'day',
				currentDevice: {},
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [0, 15, 15, 5],
					dataLabel: false,
					dataPointShape: false,
					enableScroll: false,
					legend: {
						position: 'top',
						float: "right",
						fontColor: '#fff'
					},
					xAxis: {
						disableGrid: true,
						fontColor: '#fff',
						min: 0,
						splitNumber: 6,
						labelCount: 6,
						fontSize: 10,
						gridEval: '100',
					},
					yAxis: {
						gridType: "dash",
						dashLength: 2,
						showTitle:true,
						data: [{
							min: 0,
							title: "单位:A",
							fontColor: '#fff',
							titleOffsetY: -10,
							titleFontColor: '#fff',
							titleFontSize: '10',
							fontSize: 10,
							tofix:2

						}]
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow",
							linearType: "custom"
						}
					}
				},
				optsPower:{},
				optsVoltage:{},
				chartCurrentData: {},
				chartVoltageData:{},
				chartPowerData:{}
			}
		},

		onLoad: function(option) {
			this.optsPower = JSON.parse(JSON.stringify(this.opts))
			this.optsPower.yAxis.data[0].title = "单位:kW"
			this.optsVoltage = JSON.parse(JSON.stringify(this.opts))
			this.optsVoltage.yAxis.data[0].title = "单位:V"
			this.currentDevice = option
			// this.single = '2021-2-12'
			this.date.setDate(this.date.getDate() - 1)
			this.single = dateStandardFormat(this.date)
			this.getStorageData()
		},
		methods: {
			selectDateType(index) {
				this.dateIndex = index
				switch (index) {
					case 1:
						this.single = dateStandardFormat(this.date);
						break;
					case 2:
						this.single = dateMonthFormat(this.date);
						break;
					case 3:
						this.single = this.date.getFullYear();
						break;
					default:
						this.single = dateStandardFormat(this.date);
						break;
				}
				this.getStorageData()
			},
			change(e) {
				this.date = e.dt
				this.getStorageData()
			},
			getStorageData() {

				let startDate = new Date()
				startDate.setHours(0)
				startDate.setMinutes(0)
				startDate.setSeconds(0)
				let categorie = []
				let xAxisData = []
				let serie = [{
						name: 'A相电流',
						linearColor: [
							[
								0,
								"#1890FF"
							],
							[
								0.25,
								"#00B5FF"
							],
							[
								0.5,
								"#00D1ED"
							],
							[
								0.75,
								"#00E6BB"
							],
							[
								1,
								"#90F489"
							]
						],
						data: []
					},
					{
						name: 'B相电流',
						linearColor: [
							[
								0,
								"#91CB74"
							],
							[
								0.25,
								"#2BDCA8"
							],
							[
								0.5,
								"#2AE3A0"
							],
							[
								0.75,
								"#C4D06E"
							],
							[
								1,
								"#F2D375"
							]
						],
						data: []
					},
					{
						name: 'C相电流',
						linearColor: [
							[
								0,
								"#FAC858"
							],
							[
								0.33,
								"#FFC371"
							],
							[
								0.66,
								"#FFC2B2"
							],
							[
								1,
								"#FA7D8D"
							]
						],
						data: []
					}
				]
				
			let seriesPower =	[{
						name: '有功功率',
						linearColor: [
							[
								0,
								"#1890FF"
							],
							[
								0.25,
								"#00B5FF"
							],
							[
								0.5,
								"#00D1ED"
							],
							[
								0.75,
								"#00E6BB"
							],
							[
								1,
								"#90F489"
							]
						],
						data: []
					}]
				let seriesVoltage = JSON.parse(JSON.stringify(serie))
				seriesVoltage[0].name = "A相电压";
				seriesVoltage[1].name = "B相电压";
				seriesVoltage[2].name = "C相电压";
				
				queryThreePhaseMeterDataByDateNew(startDate, new Date(), this.currentDevice.deviceId).then(datas => {
					for (let i = 0; i < datas.length; i++) {
						let ele = datas[i]
						categorie.push(ele.frameDateTime.substring(11))
						// serie[0].data.push(6)
						serie[0].data.push(parseFloat(ele.phaseCurrentA))
						serie[1].data.push(parseFloat(ele.phaseCurrentB))
						serie[2].data.push(parseFloat(ele.phaseCurrentC))
						seriesPower[0].data.push(parseFloat(ele.totalValidPower))
						seriesVoltage[0].data.push(parseFloat(ele.phaseVoltageA))
						seriesVoltage[1].data.push(parseFloat(ele.phaseVoltageB))
						seriesVoltage[2].data.push(parseFloat(ele.phaseVoltageC))
					}
					

					let res = {
						categories: categorie,
						series: serie
					}
					let rsPower = {
						categories: categorie,
						series: seriesPower
					}
					let rsVoltage = {
						categories: categorie,
						series: seriesVoltage
					}
				
					this.chartCurrentData = JSON.parse(JSON.stringify(res));
					this.chartPowerData = JSON.parse(JSON.stringify(rsPower));
					this.chartVoltageData = JSON.parse(JSON.stringify(rsVoltage));
				})
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
		height: 50%;
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
</style>