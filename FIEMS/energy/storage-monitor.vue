<template>
	<view class="container">
		<u-navbar title="集团储能监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null"
			:autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="box-container" style="height: 16vh;">
			<view class="header-container">
				<view style="display:flex;align-items:center;">
					<text>集团储能收益</text>
				</view>
				<!-- <text class="navigat-arrow">&#xe65e;</text> -->
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container">
				<view class="row-container">
					<text style="width: 40%;">年放电</text>
					<text
						style="width:60%;text-align: end;color:#fff">{{yearDischargeCapacity>10000?`${(yearDischargeCapacity/10000).toFixed(2)}万`:yearDischargeCapacity}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">月放电</text>
					<text
						style="width:60%;text-align: end;color:#fff">{{monthDischargeCapacity>10000?`${(monthDischargeCapacity/10000).toFixed(2)}万`:monthDischargeCapacity}}&nbsp;kWh</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">昨日放电</text>
					<text style="width:60%;text-align: end;color:#fff">{{yesterdayDischargeCapacity}}&nbsp;kWh</text>
				</view>
			</view>
			<view class="col-line"></view>
			<view class="content-container">
				<view class="row-container">
					<text style="width: 40%;">年收益</text>
					<text
						style="width:60%;text-align: end;color:#fff">{{yearIncome>10000?`${(yearIncome/10000).toFixed(2)}万`:yearIncome}}&nbsp;元</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">月收益</text>
					<text
						style="width:60%;text-align: end;color:#fff">{{monthIncome>10000?`${(monthIncome/10000).toFixed(2)}万`:monthIncome}}&nbsp;元</text>
				</view>
				<view class="row-container">
					<text style="width:40%;">昨日收益</text>
					<text style="width:60%;text-align: end;color:#fff">{{yesterdayIncome}}&nbsp;元</text>
				</view>
			</view>
		</view>

		<view style="display:flex;margin:0.5rem;background:#16379A;align-items: center;height: 2rem;">
			<view style="color:#fff;font-size:26rpx;width:6rem;text-align: right;">日期选择：</view>
			<view class="date-container">
				<text :class="dateIndex==1?'date-text select-date':'date-text'" @click="selectDateType(1)">日</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==2?'date-text select-date':'date-text'" @click="selectDateType(2)">月</text>
				<u-line direction="col" length="1rem" margin="0.25rem"></u-line>
				<text :class="dateIndex==3?'date-text select-date':'date-text'" @click="selectDateType(3)">年</text>
			</view>
			<!-- 	<!-- 	<view class="example-body" v-if="dateIndex==1">
				<uni-datetime-picker type="date" :clear-icon="false" v-model="single" @maskClick="maskClick"
					@change="change" />
			</view>
			<view v-if="dateIndex==2">
				<u-datetime-picker :show="show" v-model="value1" mode="year-month"></u-datetime-picker>
				<u-button @click="show = true">打开</u-button>
			</view> -->
			<view>
				<biaofun-datetime-picker fields="day" :defaultValue="single" v-if="dateIndex==1"
					@change="change"></biaofun-datetime-picker>
				<biaofun-datetime-picker fields="month" :defaultValue="single" v-if="dateIndex==2"
					@change="change"></biaofun-datetime-picker>
				<biaofun-datetime-picker fields="year" :defaultValue="single" v-if="dateIndex==3"
					@change="change"></biaofun-datetime-picker>
				<!-- <biaofun-datetime-picker fields="year" :defaultValue="single"
						@change="change"></biaofun-datetime-picker> -->
			</view>
		</view>

		<view class="box-container">
			<view class="header-container">
				<text>各基地收益排名</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;overflow: auto;" :style="{height:moreProgressHeight}">
				<progress-bar :isRank="isRank" :content="incomeRankData" :url="'energy/storage-detail'" />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
			<view class="show-rank-more" @click="loadMoreProgress">
				<!-- <view class="show-rank-more" v-show="electricityConsumption.length>12" @click="loadMoreProgress"> -->
				{{moreProgress==true?'收起':'加载更多'}}
			</view>
		</view>

	
	
		<view class="box-container">
			<view class="header-container">
				<text>各基地单台储能箱收益</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;overflow: auto;" :style="{height:energyStorageBoxHeight}">
				<progress-bar :isRank="isRank" :content="singleIncomeRankData" :url="'energy/storage-detail'"  />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
			<view class="show-rank-more" @click="loadEnergyStorageBox">
				<!-- <view class="show-rank-more" v-show="electricityConsumption.length>12" @click="loadMoreProgress"> -->
				{{energyStorageBox==true?'收起':'加载更多'}}
			</view>
		</view>
		<view class="box-container">
			<view class="header-container">
				<text>各基地单台储能箱达标率</text>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;padding-top: 15px;overflow: auto;" :style="{height:complianceRateHeight}">
				<progress-bar :isRank="isRank" :content="standardizedRateData" :url="'energy/storage-detail'" />
				<!-- <qiun-data-charts type="bar" :opts="opts3" :chartData="chartData3" /> -->
			</view>
			<view class="show-rank-more" @click="loadComplianceRate">
				<!-- <view class="show-rank-more" v-show="electricityConsumption.length>12" @click="loadMoreProgress"> -->
				{{complianceRate==true?'收起':'加载更多'}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		findDischargeCapacityAndIncome,
		findEveryBaseIncomeByDate
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
				moreProgress: false,
				energyStorageBox: false,
				complianceRate: false,
				moreProgressHeight: '280px',
				energyStorageBoxHeight: '280px',
				complianceRateHeight: '280px',
			}
		},

		onLoad() {
			// this.single = '2021-2-12'
			this.date.setDate(this.date.getDate() - 1)
			this.single = dateStandardFormat(this.date)
			this.getStorageData()
		},
		methods: {
			loadMoreProgress() {
				if (this.moreProgress == false) {
					this.moreProgressHeight = 'auto'
				} else {
					this.moreProgressHeight = '280px'
				}
				this.moreProgress = !this.moreProgress
			},
			loadEnergyStorageBox() {
				if (this.energyStorageBox == false) {
					this.energyStorageBoxHeight = 'auto'
				} else {
					this.energyStorageBoxHeight = '280px'
				}
				this.energyStorageBox = !this.energyStorageBox
			},
			loadComplianceRate() {
				if (this.complianceRate == false) {
					this.complianceRateHeight = 'auto'
				} else {
					this.complianceRateHeight = '280px'
				}
				this.complianceRate = !this.complianceRate
			},
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
						this.single = (this.date.getFullYear()).toString();
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
			// maskClick(e) {
			// },
			getStorageData() {
				// 集团储能收益
				findDischargeCapacityAndIncome(new Date().getFullYear(), new Date().getMonth() + 1).then(data => {
					this.yearDischargeCapacity = data.yearDischargeCapacity,
						this.monthDischargeCapacity = data.monthDischargeCapacity,
						this.yesterdayDischargeCapacity = data.yesterdayDischargeCapacity,
						this.yearIncome = data.yearIncome,
						this.monthIncome = data.monthIncome,
						this.yesterdayIncome = data.yesterdayIncome
				})
				// 储能的日、月、年收益
				findEveryBaseIncomeByDate(this.date).then(datas => {
					this.standardizedRateData = []
					this.incomeRankData = []
					this.singleIncomeRankData = []
					let avgDateType = 'Day'
					let dateType = 'day'
					if (this.dateIndex == 1) {
						avgDateType = 'Day'
						dateType = 'day'
					} else if (this.dateIndex == 2) {
						avgDateType = 'Month'
						dateType = 'month'
					} else if (this.dateIndex == 3) {
						avgDateType = 'Year'
						dateType = 'year'
					}
					datas = datas.sort((a, b) => {
						return parseInt(b[dateType + 'Income']) - parseInt(a[dateType + 'Income'])
					})
					// datas = datas.slice(0, 10)
					let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.incomeRankData.push({
							"name": datas[i].areaName,
							"num": datas[i][dateType + 'Income'],
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": '元',
							"areaInfoId": datas[i].areaInfoId
						})
					}
					color = '#ff8400'
					datas = datas.sort((a, b) => {
						return parseInt(b['avg' + avgDateType + 'Income']) - parseInt(a['avg' +
							avgDateType + 'Income'])
					})
					// datas = datas.slice(0, 10)
					// let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.singleIncomeRankData.push({
							"name": datas[i].areaName,
							"num": datas[i]['avg' + avgDateType + 'Income'],
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": '元',
							"areaInfoId": datas[i].areaInfoId
						})
					}
					color = '#ff8400'
					datas = datas.sort((a, b) => {
						return parseInt(b['avg' + avgDateType + 'StandardizedRate']) - parseInt(a['avg' +
							avgDateType + 'StandardizedRate'])
					})
					// datas = datas.slice(0, 10)
					// let color = '#ff8400'
					for (let i = 0; i < datas.length; i++) {
						if (i > 2) color = '#008aff'
						this.standardizedRateData.push({
							"name": datas[i].areaName,
							"num": datas[i]['avg' + avgDateType + 'StandardizedRate'],
							// 		"num": 50000,
							"width": "",
							"background": color,
							"unit": '%',
							"areaInfoId": datas[i].areaInfoId
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

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2rem;
	}

	.box-container {
		background: #16379A;
		// height: 6rem;
		// height: 300px;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
		padding: 0.5rem;
		overflow: hidden;
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

	.show-rank-more {
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		padding: 0 0 1vw;
		// background-color: #fff;
		text-align: center;
		font-size: 14px;
	}
</style>