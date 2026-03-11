<template>
	<view class="container">
	
		<u-navbar :title="currentSystemInfo.areaName" :titleStyle="{'color':'#fff','width':'100%','text-align':'left','padding-left':'40rpx'}" :leftIcon="null" :leftText="null" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="box-container">
			<view class="header-container">
				<text>分时用电统计</text>
		
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container">
				<qiun-data-charts canvasId="qrcMKRxoUnEvhohjLmErchtVOWQkTuYh" type="column" :opts="opts" :disableScroll="false" :ontouch="false" :canvas2d="canvas2d" :chartData="chartData" :inScrollView="true" />
			</view>
		</view>
		<view class="box-container" v-if="rationData.length>0">
			<view class="header-container">
				<text>分项用电及占比</text>
			
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;height:92%;overflow: auto;padding-top:15px">
				<progress-rank :isRank="isRank" :content="rationData" />
			</view>
		</view>

		<view class="box-container">
			<view class="header-container" @click="redictToPage('elec-rank')">
				<text>用电量Top10</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;">
				<progress-bar :isRank="isRank" :content="RankData" />
			</view>
		</view>

		<view class="box-container">
			<view class="header-container" @click="redictToPage('elec-peak')">
				<text>峰平谷用电</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%">
				<qiun-data-charts canvasId="qrcMKuxoUnEvhohjLmErchtVOWQkTuYi" type="column" :opts="opts" :disableScroll="false" :ontouch="false" :canvas2d="canvas2d" :chartData="chartData4" :inScrollView="true" />
			</view>
		</view>
	</view>
</template>

<script>
	import ProgressBar from '@/components/progress-bar/progress-bar.vue'
	import progressRank from '@/components/progress-rank/progress-rank.vue'
	import {
		queryTimeSharingEnergyConsumption,
		queryDailyPeakValleyPower,
		queryEnergyConsumptonByDay,
		queryTotalConsumeQ
	} from '@/api/fiems/expert.js'
	import {
		dateStandardFormat,
	} from "@/utils/date-format"
	export default {
		name: 'fimesEnergy',
		components: {
			ProgressBar,
			progressRank
		},
		data() {
			return {
				canvas2d: this.$Config.ISCANVAS2D,
				isRank: true,
				RankData: [],
				rationData: [],
				// bgColor: '#003E98',
				chartData: {},
				chartDataRank: {},
				chartData3: {},
				chartData4: {},
				opts: {
					color: ["#2A70FF", "#00E9AA"],
					update: true,
					dataLabel: false,
					padding: [15, 15, 15, 5],
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
						disableGrid: true,
						showTitle: true,
						data: [{
							min: 0,
							title: "单位:万kWh",
							fontColor: '#fff',
							titleOffsetY: -10,
							titleOffsetX: 6,
							titleFontColor: '#fff',
							titleFontSize: '10',
							fontSize: 10
						}]
					},
					extra: {
						column: {
							type: "stack",
							width: 6,
							// activeBgColor: "#000000",
							// activeBgOpacity: 0.08,
							// labelPosition: "center"
						},
						tooltip: {
							showBox: true,
						}
					}
				}
			}
		},
		onReady() {
			// #ifdef MP-WEIXIN
			this.getServerData();
			// #endif

		},
		mounted() {
			// #ifdef APP
			this.getServerData();
			// #endif

		},
		methods: {
			redictToPage(url) {
				uni.navigateTo({
					url: '/pages/FIEMS/expert/' + url
				})
			},
			getServerData() {

				let startDate = new Date();
				startDate.setDate(1)
				let endDate = new Date();
				queryTimeSharingEnergyConsumption(this.currentSystemInfo.areaLevelId, startDate, endDate).then(datas => {
					let categorie = []
					let xAxisData = []
					let serie = [{
							name: '白班',
							data: []
						},
						{
							name: '晚班',
							data: []
						}
					]
					let startDateDay = new Date(dateStandardFormat(startDate)).getTime();
					let endDateDay = endDate.getDate();
					let dateMonth = endDate.getMonth() + 1;
					for (let i = 1; i <= endDateDay; i += 1) {
						xAxisData.push(dateMonth + '-' + i)
					}
					categorie = xAxisData;
					let dataDay;
					for (let j = 0; j < datas.length; j++) {
						dataDay = Number(datas[j].date.split('-')[2]);
						let date = new Date(datas[j].date).getTime();
						if (date >= startDateDay && date <= endDate.getTime()) {
							if (datas[j].dayIndex == 1) {
								serie[0].data[dataDay - 1] = parseFloat((datas[j].totalConsumeElectricityQ / 10000).toFixed(2))
							} else if (datas[j].dayIndex == 2) {
								serie[1].data[dataDay - 1] = parseFloat((datas[j].totalConsumeElectricityQ / 10000).toFixed(2))
							}
						}
					}
					if (serie[0].data.length > serie[1].data.length) {
						serie[1].data[dataDay - 1] = 0
					}
					let res = {
						categories: categorie,
						series: serie
					}
					this.chartData = JSON.parse(JSON.stringify(res));
				})
				queryTotalConsumeQ(this.currentSystemInfo.areaId, 1, new Date(), this.currentSystemInfo.areaLevelId).then(
					datas => {
						datas = datas.sort((a, b) => {
							return parseInt(b.totalConsumeQ) - parseInt(a.totalConsumeQ)
						})
						let rationData = []
						for (let i = 0; i < datas.length; i++) {
							rationData.push({
								"name": datas[i].name,
								"num": datas[i].totalConsumeQ ? (datas[i].totalConsumeQ.toFixed(2)) : '--',
								"width": "",
								"background": '#E7E772',
								"unit": 'kWh'
							})
						}
						this.rationData = rationData
					})
				queryDailyPeakValleyPower(this.currentSystemInfo.areaLevelId, startDate, endDate, this.currentSystemInfo.areaId).then(datas => {
					let serie = [{
							name: '低谷',
							data: []
						},
						{
							name: '平段',
							data: []
						},
						{
							name: '高峰',
							data: []
						}
					]
					let categorie = []

					let dateTypeMap = new Map();
					let energyConsumptionMap = new Map();
					let h = 0;
					for (let i = 0; i < datas.length; i++) {
						if (!dateTypeMap.has(datas[i].timeType)) {
							dateTypeMap.set(datas[i].timeType, datas[i])
						}
						if (!energyConsumptionMap.has(datas[i].date)) {
							energyConsumptionMap.set(datas[i].date, [])
							let filterData = datas.filter(ele => ele.date == datas[i].date)
							let sum = 0
							let sumQ = 0
							filterData.forEach(element => {
								sum += element.total_electricity_q * element.price
								sumQ += element.total_electricity_q
							});
						}
						energyConsumptionMap.get(datas[i].date).push(datas[i])
						if (datas[i + 1] != undefined && datas[i].date == datas[i + 1].date) {
							serie[h].data.push(parseFloat((datas[i].total_electricity_q / 10000).toFixed(2)))
							h++

						} else if (datas[i + 1] != undefined && datas[i].date != datas[i + 1].date) {
							serie[h].data.push(parseFloat((datas[i].total_electricity_q / 10000).toFixed(2)))
							categorie.push(datas[i].date.substring(5, 10));
							h = 0;
						} else {
							if (datas[i].timeType == 1) {
								serie[h].data.push(parseFloat((datas[i].total_electricity_q / 10000).toFixed(2)))
								serie[h + 1].data.push(0.00)
								serie[h + 2].data.push(0.00)
							} else if (datas[i].timeType == 2) {
								serie[h].data.push(parseFloat((datas[i].total_electricity_q / 10000).toFixed(2)))
								serie[h + 1].data.push(0.00)
							} else if (datas[i].timeType == 3) {
								serie[h].data.push(parseFloat((datas[i].total_electricity_q / 10000).toFixed(2)))
							}
							categorie.push(datas[i].date.substring(5, 10));
						}
					}
					let dateTypeArray = Array.from(dateTypeMap.values()).sort((a, b) => {
						return a.timeType - b.timeType
					})
					for (let index = 0; index < dateTypeArray.length; index++) {
						const element = dateTypeArray[index];
						serie[index].name = element.name.substring(0, 2)
					}
					let res = {
						categories: categorie,
						series: serie
					}
					this.chartData4 = JSON.parse(JSON.stringify(res));
				})
				queryEnergyConsumptonByDay(this.currentSystemInfo.areaLevelId, this.currentSystemInfo.areaId, 2,
				new Date()).then(datas => {
					datas = datas.sort((a, b) => {
						return parseInt(b.total_consume_electricity_q) - parseInt(a.total_consume_electricity_q)
					})
					datas = datas.slice(0, 10)
					let rankData = []
					let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						rankData.push({
							"name": datas[i].area_level_name,
							"num": datas[i].total_consume_electricity_q.toFixed(2),
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": 'kWh'
						})
					}
					this.RankData = rankData
				})

			}
		}
	}
</script>

<style>
	.container {
		font-size: 14px;
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
		height: 18rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem
	}


	.content-container {
		width: 100%;
		float: left;
		height: 77%;
		display: flex;
		flex-direction: column;
		color: #7287C6;
		position: relative;
	}

	.navigat-arrow {
		width: 40rpx;
		color: #fff;
		text-align: right;
		font-family: texticons;
	}
</style>