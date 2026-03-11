<template>
	<view class="container">
		<u-navbar :title="currentSystemInfo.areaName"
			:titleStyle="{'color':'#fff','width':'80%','text-align':'left','margin-left':'20rpx'}" :leftIcon="leftIcon"
			leftIconColor="#fff" :leftText="null" :placeholder="true" :bgColor="headerTabBg" @leftClick="leftClick"
			:safeAreaInsetTop='true'></u-navbar>

		<view class="u-demo-block__content" style="margin:0.5rem 0.5rem;height:5%;display: flex;">
			<u-notice-bar :text="alarText" :bgColor="headerTabBg" direction="column" mode="link"
				url="/pages/FIEMS/alert/alert-info"></u-notice-bar>
		</view>
		<view class="box-container" style="display:flex;align-items:center;height: 19%;">
			<view style="width: 15%;display:flex;flex-direction:column;justify-content:center;align-items:center;">
				<!-- <u--image width="32" height="36"
					src="https://serviceiems.gree.com/api/upload/wximages/newIcon/icon_gains.svg"></u--image>
				<text>收益</text> -->
				<image style="width: 32px; height: 36px;" src="@/static/uiImages/icon/icon_gains.svg" mode="widthFix">
				</image>
				<!-- <u--image width="32" height="36"
					src="@/static/uiImages/icon/icon_gains.svg"></u--image> -->
				<text>收益</text>
			</view>
			<view style="width:80%;height:100%;display:flex;flex-direction: column;">
				<view style="height:46%;display:flex;width:100%;align-items: center;;">
					<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
						<text
							style="font-size:32rpx;margin: 4% 0;">¥&nbsp;{{electriDataChange(getDayProfit())}}&nbsp;{{electriUnitChange(getDayProfit())}}</text>
						<text style="color:#7287C6;font-size:28rpx;">当日</text>
					</view>
					<view class="col-line"></view>
					<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
						<text
							style="font-size:32rpx;margin: 4% 0;">¥&nbsp;{{electriDataChange(getMonthProfit())}}&nbsp;{{electriUnitChange(getMonthProfit())}}</text>
						<text style="color:#7287C6;font-size:28rpx;">本月</text>
					</view>
				</view>
				<u-line margin="3%"></u-line>
				<view style="height:46%;display:flex;width:100%;align-items: center;;">

					<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
						<text
							style="font-size:32rpx;margin: 4% 0;">¥&nbsp;{{electriDataChange(getYearProfit())}}&nbsp;{{electriUnitChange(getYearProfit())}}</text>
						<text style="color:#7287C6;font-size:28rpx;">本年</text>
					</view>
					<view class="col-line"></view>
					<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
						<text
							style="font-size:32rpx;margin: 4% 0;">¥&nbsp;{{electriDataChange(getTotalProfit())}}&nbsp;{{electriUnitChange(getTotalProfit())}}</text>
						<text style="color:#7287C6;font-size:28rpx;">累计</text>
					</view>
				</view>
			</view>
		</view>
		<view style="display:flex;flex-wrap:wrap;height: 41%;">
			<view
				style="width:46%;margin-right:1%;display:flex;align-items: center;margin-top: unset;margin-bottom:unset;"
				class="box-container">
				<view
					style="width:20%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-left:7%;">
					<!-- <u--image width="32" height="36"
						src="https://serviceiems.gree.com/api/upload/wximages/newIcon/icon_electricity.svg"></u--image> -->
					<image style="width: 32px; height: 36px;" src="@/static/uiImages/icon/icon_electricity.svg"
						mode="widthFix"></image>
					<text>发电</text>
				</view>
				<view style="display:flex;flex-direction:column;align-items:center;width: 80%;">
					<text style="font-size:32rpx;margin: 4% 0;">{{dailyGeneration}}&nbsp;kWh</text>
					<text style="color:#7287C6;font-size:28rpx;">当日</text>
				</view>

			</view>
			<view style="width:46%;display:flex;align-items: center;margin-top: unset;margin-bottom:unset;"
				class="box-container">
				<view
					style="width:20%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-left:7%;">
					<!-- <u--image width="32" height="36"
						src="https://serviceiems.gree.com/api/upload/wximages/newIcon/icon_energy.svg"></u--image> -->
					<image style="width: 32px; height: 36px;" src="@/static/uiImages/icon/icon_energy.svg"
						mode="widthFix"></image>
					<text>储能</text>
				</view>
				<view style="display:flex;flex-direction:column;align-items:center;width: 80%;">
					
					<qiun-data-charts style="height: 60%;width:60%" type="arcbar" :opts="opts" :chartData="chartData"
						:canvas2d="true" canvasId="KGsxNcnmFRoxRPNfqKoXjtAjHIPdZOwY" />
				</view>

			</view>
			<view
				style="width:46%;margin-right:1%;display:flex;align-items: center;margin-top: unset;margin-bottom:unset;"
				class="box-container">
				<view
					style="width:20%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-left:7%;">
				
					<image style="width: 32px; height: 36px;" src="@/static/uiImages/icon/icon_use.svg" mode="widthFix">
					</image>
					<text>用电</text>
				</view>
				<view style="display:flex;flex-direction:column;align-items:center;width: 80%;">
					<text
						style="font-size:32rpx;margin: 4% 0;">{{electriDataChange(dailyConsumtion)}}&nbsp;{{electriUnitChange(dailyConsumtion)}}kWh</text>
					<text style="color:#7287C6;font-size:28rpx;">当日</text>
				</view>

			</view>
			<view style="width:46%;display:flex;align-items: center;margin-top: unset;margin-bottom:unset;"
				class="box-container">
				<view
					style="width:20%;display:flex;flex-direction:column;justify-content:center;align-items:center;margin-left:7%;">
					
					<image style="width: 32px; height: 36px;" src="@/static/uiImages/icon/icon_power.svg"
						mode="widthFix"></image>
					<text>电网</text>
				</view>
				<view style="display:flex;flex-direction:column;align-items:center;width: 80%;">
					<text
						style="font-size:32rpx;margin: 4% 0;">{{electriDataChange(powerSupply)}}&nbsp;{{electriUnitChange(powerSupply)}}kWh</text>
					<text style="color:#7287C6;font-size:28rpx;">当日供电</text>
				</view>

			</view>


		</view>

		<view class="box-container"
			style="height:calc(35% - 91px - 2rem);display:flex;align-items:center;justify-content: center;margin-top:unset">
		
			<view style="width:35%">
			
				<image style="width: 112px; height: 52px;" src="@/static/images/tree.png" mode="widthFix"></image>
			</view>

			<view style="color:#7287C6;width: 65%;">
				<view>
					<view style="display: flex;">
						<text style="display: block;">今日减排二氧化碳</text>
						
						<text
							style="color:#fff;display:block;text-align: end;margin: 0 0.5rem;">{{emissionsObj.dailyCarbonEmissions?(emissionsObj.dailyCarbonEmissions / 1000).toFixed(2):'--'}}</text>
						<text style="display: block;">t</text>
					</view>
				</view>
				<view style="margin: 2% 0;">
					<view>
						<text>约等于</text>
						<text style="color:#fff;margin: 0 0.5rem;">&nbsp;&nbsp;{{emissionsObj.tree}}&nbsp;</text>
						<text> 棵大树一天的消耗量</text>
						<!-- <text>
						75.5kg
					</text> -->
					</view>
				</view>
				<view>
					<view style="display: flex;">
						<text>累计减排二氧化碳 </text>
						<!-- <text style="color:#fff;width:5rem;display:block;text-align: end;">{{carbonDataChange(emissionsObj.totalCarbonEmissions)}}</text>&nbsp; -->
						<text style="color:#fff;display:block;text-align: end;margin: 0 0.5rem;">{{carbonDataChange(emissionsObj.totalCarbonEmissions)}}</text>&nbsp;
						<text>{{carbonUnitChange(emissionsObj.totalCarbonEmissions)}}</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		getStorageData,
		energyDataBetweenMonth,
		energyDataBetweenYear,
		energyDataBetweenDay,
		queryStorageIncome,
		queryDeviceMonitorRecordByStatus
	} from '@/api/fiems/home.js'
	export default {
		name: 'fiemsHome',
		data() {
			return {
				alarText: ['当前暂无告警信息'],
				// bgColor: '#003E98',
				systemSoc: '--',
				chargeCapacityDaily: '--',
				dischargeCapacityDaily: '--',
				cumulativeChargeDapacity: '--',
				cumulativeDischargeCapacity: '--',
				dailyGeneration: '--',
				monthlyGeneration: '--',
				yearlyGeneration: '--',
				dailyConsumtion: '--',
				monthlyConsumtion: '--',
				yearlyConsumtion: '--',
				powerSupply: '--',
				feedSupply: '--',
				monthlyPowerSupply: '--',
				monthlyfeedSupply: '--',
				ladderPrices: [{
						"openInterval": 0,
						"closedInterval": 2000,
						"price": 0.29
					},
					{
						"openInterval": 2000,
						"closedInterval": 4000,
						"price": 0.34
					},
					{
						"openInterval": 4000,
						"closedInterval": 6000,
						"price": 0.38
					},
					{
						"openInterval": 6000,
						"price": 0.44
					}
				],
				dayStorageProfit: 0,
				monthStorageProfit: 0,
				yearStorageProfit: 0,
				totalStorageProfit: 0,
				monthProfit: '--',
				yearProfit: '--',
				totalProfit: '--',
				dayProfit: '--',
				emissionsObj: {
					dailyCarbonEmissions: '--',
					tree: '--',
					totalCarbonEmissions: '--'
				},
				caculatorCoefficient: 0.997,
				treeFactor: 5,
				fractionDigits: 2,
				opts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: undefined,
					title: {
						name: "--",
						fontSize: 12,
						color: "#fff"
					},
					subtitle: {
						name: "",
						fontSize: 25,
						color: "#666666"
					},
					extra: {
						arcbar: {
							type: "circle",
							width: 12,
							backgroundColor: "#142C7E",
							startAngle: 1.5,
							endAngle: 0.25,
							gap: 2,
							lineCap: "butt"
						}
					}
				},
				chartData: {},
				timer1: 0,
				timer2: 0,
				leftIcon: null
			}
		},
		mounted() {
			let currentPages = getCurrentPages()
			if (currentPages[currentPages.length - 1].options.admin == 'admin') {
				this.leftIcon = 'arrow-left'
			}
			this.setStroageData()
			this.setAlertData()
		},
		beforeDestroy() {
			clearTimeout(this.timer1);
			clearTimeout(this.timer2)
		},
		methods: {
			leftClick() {
				uni.navigateBack()
			},
			electriDataChange(data) {
				let numberData = Number(data)
				let tempData = numberData.toFixed()
				if ((tempData.length) > 5) {
					return (data / 10000).toFixed(2);
				} else if (numberData) {
					return numberData.toFixed(2)
				} else {
					return '--'
				}
			},

			electriUnitChange(data) {
				let tempData = Number(data).toFixed()
				if ((tempData.length) > 5) {
					return '万'
				} else {
					return ''
				}
			},
			carbonDataChange(data) {
				let numberData = Number(data)
				let tempData = numberData.toFixed()
				if ((tempData.length) > 4) {
					return (data / 1000).toFixed(2);
				} else if (numberData) {
					return numberData.toFixed(2)
				} else {
					return '--'
				}
			},

			carbonUnitChange(data) {
				let tempData = Number(data).toFixed()
				if ((tempData.length) > 4) {
					return 't'
				} else {
					return 'kg'
				}
			},

			/**
			 *
			 * @param ladderPrices 阶梯电价定义
			 * @param powerData 能源数据
			 * @returns [year, month, income, saving] 返回根据能源数据计算出来的收入(income)和节省(saving)
			 */
			calculateSavingPrice(powerData) {
				const {
					year,
					month
				} = powerData;
				const income = this.calculateLadderPrice(powerData.total_grid_reverse_q);
				const saving = this.calculateLadderPrice(powerData.total_provide_q - powerData.total_grid_reverse_q);
				return [income, saving];
			},

			/**
			 * 根据阶梯电价计算电量的电价
			 * 依据阶梯区间, 将待计算的电量分成三个部分: 小于区间, 在区间中, 大于区间
			 * @param ladderPrices 阶梯电价定义
			 * @param electricity 需要计算电价的电量
			 * @return 计算后的电价
			 */
			calculateLadderPrice(electricity) {
				let income = 0;
				this.ladderPrices.forEach(({
					openInterval,
					closedInterval,
					price
				}) => {
					const closed = closedInterval || Number.POSITIVE_INFINITY;
					if (electricity - openInterval < 0) {
						return income;
					} else if (electricity - closed < 0) {
						income += (electricity - openInterval) * price;
					} else {
						income += (closedInterval - openInterval) * price;
					}
				});
				return income;
			},
			// getDayProfit() {
			// 	if (this.dayProfit && this.dayStorageProfit) {
			// 		return Number(this.dayProfit + this.dayStorageProfit).toFixed(2)
			// 	} else if (this.dayProfit) {
			// 		return this.dayProfit
			// 	} else if (this.dayStorageProfit) {
			// 		return this.dayStorageProfit
			// 	} else return '--'
			// },
			// getMonthProfit() {
			// 	if (this.monthProfit && this.monthStorageProfit) {
			// 		return Number(this.monthProfit + this.monthStorageProfit).toFixed(2)
			// 	} else if (this.monthProfit) {
			// 		return this.monthProfit
			// 	} else if (this.monthStorageProfit) {
			// 		return this.monthStorageProfit
			// 	} else return '--'
			// },
			// getYearProfit() {
			// 	if (this.yearProfit && this.yearStorageProfit) {
			// 		return (Number(this.yearProfit) + Number(this.yearStorageProfit)).toFixed(2)
			// 	} else if (this.yearProfit) {
			// 		return this.yearProfit
			// 	} else if (this.yearStorageProfit) {
			// 		return this.yearStorageProfit
			// 	} else return '--'
			// },
			// getTotalProfit() {
			// 	if (this.totalProfit && this.totalStorageProfit) {
			// 		return (Number(this.totalProfit) + Number(this.totalStorageProfit)).toFixed(2)
			// 	} else if (this.totalProfit) {
			// 		return this.totalProfit
			// 	} else if (this.totalStorageProfit) {
			// 		return this.totalStorageProfit
			// 	} else return '--'
			// },
			getDayProfit() {
				if (this.dayProfit && this.dayStorageProfit) {
					return Number(this.dayProfit).toFixed(2)
				} else if (this.dayProfit) {
					return this.dayProfit
				} else if (this.dayStorageProfit) {
					return this.dayStorageProfit
				} else return '--'
			},
			getMonthProfit() {
				if (this.monthProfit && this.monthStorageProfit) {
					return Number(this.monthProfit).toFixed(2)
				} else if (this.monthProfit) {
					return this.monthProfit
				} else if (this.monthStorageProfit) {
					return this.monthStorageProfit
				} else return '--'
			},
			getYearProfit() {
				if (this.yearProfit && this.yearStorageProfit) {
					return (Number(this.yearProfit)).toFixed(2)
				} else if (this.yearProfit) {
					return this.yearProfit
				} else if (this.yearStorageProfit) {
					return this.yearStorageProfit
				} else return '--'
			},
			getTotalProfit() {
				if (this.totalProfit && this.totalStorageProfit) {
					return (Number(this.totalProfit)).toFixed(2)
				} else if (this.totalProfit) {
					return this.totalProfit
				} else if (this.totalStorageProfit) {
					return this.totalStorageProfit
				} else return '--'
			},
			setAlertData() {
				let date = new Date()
				date.setHours(0)
				date.setMinutes(0)
				date.setSeconds(0)
				queryDeviceMonitorRecordByStatus(this.currentSystemInfo.areaId, 1, 0, date, new Date()).then(datas => {
					if (datas.length > 0)
						this.alarText = []
					datas.forEach(element => {
						let info = element.occurTime.substring(0, 19) + ' ' + element.levelParentName +
							' ' + element.levelName + ' ' + element.attributeName
						this.alarText.push(info)
					})
				})
				this.timer1 = setTimeout(() => {
					this.setAlertData()
				}, 30000)
				// }
			},
			setStroageData() { //储能数据
				let findArea = this.storageBaseList.find(ele => ele.areaId == this.currentSystemInfo.areaId &&
					this.urlPrefix == ele.urlPrefix)
				if (findArea) {
					getStorageData(findArea.areaInfoId).then(data => {
						this.systemSoc = data.systemSoc + '%';
						this.chargeCapacityDaily = data.chargeCapacityDaily;
						this.dischargeCapacityDaily = data.dischargeCapacityDaily;
						this.cumulativeChargeDapacity = (data.cumulativeChargeDapacity);
						this.cumulativeDischargeCapacity = (data.cumulativeDischargeCapacity);
						let res = {
							series: [{
								name: "储电",
								color: "#00E9AA",
								data: (data.systemSoc / 100) ? (data.systemSoc / 100) : 0
							}]
						};
						if (data.systemSoc) {
							this.opts.title.name = data.systemSoc + '%';
						}
						this.chartData = JSON.parse(JSON.stringify(res));
					});
					queryStorageIncome(findArea.areaInfoId).then(data => {
						this.dayStorageProfit = data.curDayTotalIncome;
						this.monthStorageProfit = data.curMonthTotalIncome;
						this.yearStorageProfit = data.curYearTotalIncome;
						this.totalStorageProfit = data.totalIncome;
					})
				}

				energyDataBetweenMonth(this.currentSystemInfo.areaLevelId, new Date().getFullYear(), new Date().getMonth() + 1, new Date().getFullYear(), new Date().getMonth() + 1).then(data => {
					this.monthlyGeneration = (data[0].total_provide_q)
					const {
						income,
						saving
					} = this.calculateSavingPrice(data[0])
					const profit = (this.calculateSavingPrice(data[0])[0]) + (this.calculateSavingPrice(data[0])[1]);
					this.monthProfit = profit + this.monthStorageProfit
					this.monthlyConsumtion = (data[0].total_consume_electricity_q)
					this.monthlyPowerSupply = ((data[0].total_consume_electricity_q - data[0].total_provide_q))

				});
				energyDataBetweenYear(this.currentSystemInfo.areaLevelId, new Date().getFullYear(), new Date().getFullYear()).then(data => {
					this.yearlyGeneration = (data[0].total_provide_q)
					this.yearlyConsumtion = (data[0].total_consume_electricity_q)
					const {
						income,
						saving
					} = this.calculateSavingPrice(data[0])
					const profit = (this.calculateSavingPrice(data[0])[0]) + (this.calculateSavingPrice(data[0])[1]);
					this.yearProfit = (profit + this.yearStorageProfit).toFixed(2)
				});
				energyDataBetweenYear(this.currentSystemInfo.areaLevelId, 0, new Date().getFullYear()).then(data => {
					let totalData = {
						total_grid_reverse_q: 0,
						total_provide_q: 0
					};
					// this.yearlyGeneration = (data[0].total_provide_q / 10000).toFixed(0)
					data.forEach(ele => {
						totalData.total_grid_reverse_q += ele.total_grid_reverse_q;
						totalData.total_provide_q += ele.total_provide_q
					})
					// this.emissionsObj.totalCarbonEmissions = (totalData.total_provide_q * this.caculatorCoefficient).toFixed(this.fractionDigits) || '--';
					this.emissionsObj.totalCarbonEmissions = (totalData.total_provide_q * 0.475).toFixed(this.fractionDigits) || '--';
					let incomeSavingData = this.calculateSavingPrice(totalData)
					const profit = incomeSavingData[0] + incomeSavingData[1];
					this.totalProfit = (profit + this.totalStorageProfit).toFixed(2)
				});
				energyDataBetweenDay(this.currentSystemInfo.areaLevelId, new Date(), new Date()).then(datas => { //能源信息按天获取
					this.dailyGeneration = datas[0].total_provide_q
					this.dailyConsumtion = datas[0].total_consume_electricity_q
					this.powerSupply = (this.dailyConsumtion - this.dailyGeneration).toFixed(0)
					const profit = (this.calculateSavingPrice(datas[0])[0]) + (this.calculateSavingPrice(datas[0])[1]);
					this.dayProfit = profit + this.dayStorageProfit
					this.emissionsObj.dailyCarbonEmissions = (datas[0].total_provide_q * this.caculatorCoefficient).toFixed(this.fractionDigits) || '--';
					// this.emissionsObj.tree = ((datas[0].total_provide_q * this.caculatorCoefficient) / this.treeFactor).toFixed(this.fractionDigits) || '--';
					this.emissionsObj.tree = ((datas[0].total_provide_q * 0.475 / 18.3 / 40)).toFixed(this.fractionDigits) || '--';
				})
				this.timer2 = setTimeout(() => {
					this.setStroageData()
				}, 60000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep.u-notice-bar {
		height: 100%;
	}

	.container {
		font-size: 26rpx;
		// line-height: 24px;
		background-color: #0E2264;
		height: 100%;
		overflow: auto
	}

	.box-container {
		background: #16379A;
		// height: 260rpx;
		height: calc(50% - 0.5rem);
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

	.col-line {
		background-color: #7287C6;
		margin: 3%;
		width: 1px;
		float: left;
		height: 50%;
	}

	.row-container {
		margin: auto;
		width: 100%;
		display: flex;
		align-items: center;
		height: 100%;
	}

	.line-container {
		background-color: #00E9AA;
		width: 40%;
		height: 100%;
	}
</style>