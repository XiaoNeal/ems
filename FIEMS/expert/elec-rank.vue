<template>
	<view class="container">
		<u-navbar title="用电量排名" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="box-container" style="height:19rem">
			<view style="display:flex;align-items: center;justify-content: space-between;">
				<text>日用电排名</text>
				<biaofun-datetime-picker fields="day" :defaultValue="dailyDefaultValue" @change="changeDaily"></biaofun-datetime-picker>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;">
				<progress-bar :isRank="isRank" :content="dailyData" />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
		</view>
		<view class="box-container" style="height:19rem">
			<view style="display:flex;align-items: center;justify-content: space-between;">
				<text>月用电排名</text>
				<biaofun-datetime-picker fields="month" :defaultValue="dailyDefaultValue" @change="changeMonthy"></biaofun-datetime-picker>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;">
				<progress-bar :isRank="isRank" :content="monthlyData" />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
		</view>
		<view class="box-container" style="height:19rem">
			<view style="display:flex;align-items: center;justify-content: space-between;">
				<text>年用电排名</text>
				<biaofun-datetime-picker fields="year" :defaultValue="yearDefaultValue" @change="changeYearly"></biaofun-datetime-picker>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;">
				<progress-bar :isRank="isRank" :content="yearlyData" />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryEnergyConsumptonByDay,
		queryEnergyConsumptonByMonth,
		queryEnergyConsumptonByYear
	} from '@/api/fiems/expert.js'
	import {
		dateStandardFormat,
		dateMonthFormat
	} from '@/utils/date-format'
	export default {
		data() {
			return {
				show: false,
				value1: Number(new Date()),
				bgColor: '#003E98',
				yearDischargeCapacity: '--',
				monthDischargeCapacity: '--',
				yesterdayDischargeCapacity: '--',
				yearIncome: '--',
				monthIncome: '--',
				yesterdayIncome: '--',
				date: new Date(),
				single: '2021-02-12',
				dailyData: [],
				isRank: true,
				monthlyData: [],
				yearlyData: [],
				dateIndex: 1,
				dailyDefaultValue: '',
				montlyDefaultValue: '',
				yearDefaultValue: '',
				monthlyDate:new Date(),
				datelyDate:new Date(),
				yearlyDate:new Date()
			}
		},

		onLoad() {
			// this.single = '2021-2-12'
			// this.date.setDate(this.date.getDate() - 1)
			this.dailyDefaultValue = dateStandardFormat(this.date)
			this.montlyDefaultValue = dateMonthFormat(this.date)
			this.yearDefaultValue = this.date.getFullYear()
			this.yearDefaultValue = this.yearDefaultValue.toString()
			this.getDailyData()
			this.getMonthlyData()
			this.getYearlyData()
		},
		methods: {
			changeDaily(e) {
				this.daillyDate = e.dt
				this.getDailyData()
			},
			changeMonthy(e) {
				this.monthlyDate = e.dt
				this.getMonthlyData()
			},
			changeYearly(e) {
				this.yearlyDate = e.dt
				this.getYearlyData()
			},
			
			getMonthlyData(){
				this.monthlyData = []
				queryEnergyConsumptonByMonth(this.currentSystemInfo.areaLevelId,this.currentSystemInfo.areaId, 2,this.monthlyDate).then(datas => {
					datas = datas.sort((a, b) => {
						return parseInt(b.total_consume_electricity_q) - parseInt(a.total_consume_electricity_q)
					})
					datas = datas.slice(0, 10)
					let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.monthlyData.push({
							"name": datas[i].area_level_name,
							"num": datas[i].total_consume_electricity_q.toFixed(2),
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": 'kWh'
						})
					}
				})
			},
			getYearlyData(){
				this.yearlyData = []
				queryEnergyConsumptonByYear(this.currentSystemInfo.areaLevelId,this.currentSystemInfo.areaId, 2, this.yearlyDate).then(datas => {	
					datas = datas.sort((a, b) => {
						return parseInt(b.total_consume_electricity_q) - parseInt(a.total_consume_electricity_q)
					})
					datas = datas.slice(0, 10)
					let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.yearlyData.push({
							"name": datas[i].area_level_name,
							"num": datas[i].total_consume_electricity_q.toFixed(2),
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": 'kWh'
						})
					}
				})
			},

			getDailyData() {
				this.dailyData = []
				queryEnergyConsumptonByDay(this.currentSystemInfo.areaLevelId,this.currentSystemInfo.areaId, 2, this.datelyDate).then(datas => {
					datas = datas.sort((a, b) => {
						return parseInt(b.total_consume_electricity_q) - parseInt(a.total_consume_electricity_q)
					})
					datas = datas.slice(0, 10)
					let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.dailyData.push({
							"name": datas[i].area_level_name,
							"num": datas[i].total_consume_electricity_q.toFixed(2),
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": 'kWh'
						})
					}
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