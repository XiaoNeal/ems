<template>
	<view class="container">
		<u-navbar title="峰平谷用电" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view style="display:flex;margin:0.5rem;background:#16379A;align-items:center;height:2rem;justify-content: center;">
			<view style="color:#fff;font-size:13px;width: 5rem;text-align:right;">日期选择：</view>
			<view>
				<biaofun-datetime-picker fields="day" :defaultValue="single" @change="change"></biaofun-datetime-picker>
			</view>
		</view>
		<view style="display:flex;flex-direction:row;">
			<view class="box-container" style="height:15rem;width:47%">
				<text style="text-align:center;display: block;">峰谷用电占比(kWh)</text>
				<u-line color="#7287C6"></u-line>
				<view class="content-container" style="width:100%;padding-top: 15px;">
					<qiun-data-charts style="height: 100%;" type="ring" :opts="opts" :chartData="chartData" :disableScroll="false" :ontouch="false" :canvas2d="canvas2d" canvasId="GADZmcaNkycViDorPVQTWckDCHhnoxee" :inScrollView="true"/>
				</view>
			</view>
			<view class="box-container" style="height:15rem;width:47%;margin-left:unset">
				<text style="text-align:center;display: block;">峰谷费用占比(¥)</text>
				<u-line color="#7287C6"></u-line>
				<view class="content-container" style="width:100%;padding-top: 15px;">
					<qiun-data-charts style="height: 100%;" type="ring" :opts="opts2" :chartData="chartData2" :disableScroll="false" :ontouch="false" :canvas2d="canvas2d" canvasId="GADZmcaNkycViDorPVQTWckDCHhnoxekj" :inScrollView="true"/>
				</view>
			</view>
		</view>

		<view class="box-container" style="height:45rem">
			<view style="display:flex;align-items: center;justify-content:space-around;height:2rem;">
				<text style="width:80%;display: block;">各区域峰谷用电比例</text>
				<view style="display:flex;flex-direction:row;min-width: fit-content;">
					<view style="word-break:break-all;margin-right: 0.5rem;">标准值&nbsp;0.89&nbsp;</view>
					<u-icon name="info-circle" color="#2979ff" size="20" @click="showModel"></u-icon>
				</view>
				<u-modal :show="show" title="峰谷用电比例标准值" @confirm="() => show = false">
					<view class="slot-content">
						<rich-text :nodes="content"></rich-text>
					</view>
				</u-modal>
			</view>
			<u-line color="#7287C6"></u-line>
			<view class="content-container" style="width:100%;height:94%">
				<qiun-data-charts style="height: 100%;" type="bar" :opts="opts3" :chartData="chartData3" :disableScroll="false" :ontouch="false" :canvas2d="canvas2d" canvasId="GADZmcaNkycViDorPVQTWckDCHhpoioxee" :inScrollView="true" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getUrlByDay,
		getPeakValleyPowerByAreaId
	} from '@/api/fiems/expert.js'
	import {
		dateStandardFormat
	} from '@/utils/date-format'
	export default {
		data() {
			return {
				canvas2d: this.$Config.ISCANVAS2D,
				show: false,
				// bgColor: '#003E98',
				date: new Date(),
				single: '2021-02-12',
				content: "标准值为<span style='color:yellow'>0.89</span>，峰谷比<span style='color:yellow'>越低</span>，峰时用电量越小，谷时用电量<span style='color:yellow'>0.89</span>越大，<span style='color:yellow'>避峰用电效果越好</span>；峰谷比<span style='color:yellow'>越大</span>，说明峰时用电量越大，谷时用电量越小，<span style='color:yellow'>避峰用电的效果越差</span>。峰谷比<span style='color:yellow'>等于</span>0.89标准值时，相当于企业连续均衡生产用电，没能做到避峰用电。峰谷比<span style='color:yellow'>大于</span>0.89时，说明企业峰时用电量过大，或者谷时用电量过低。<span style='color:yellow'>峰谷比越大，电费越高，峰谷比越小，电费越低。</span>",
				opt: {
					update:true,
					rotate: false,
					rotateLock: false,
					color: ["#2A70FF", "#00E9AA", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [5, 0, 4, 0],
					dataLabel: false,
					enableScroll: false,
					legend: {
						show: false,
					},
					title: {
						name: "总用电",
						fontSize: 10,
						color: "#fff"
					},
					subtitle: {
						name: "",
						fontSize: 10,
						color: "#fff"
					},
					extra: {
						ring: {

						}
					}
				},
				opts: {}
					,
				opts2: {}
					,
				opts3: {
					color: ["#2A70FF", "#00E9AA", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					update:true,
					fontColor: "#fff",
					padding: [5, 30, 0, 5],
					enableScroll: false,
					fontSize: 10,
					legend: {
						show: false
					},
					xAxis: {
						disabled: true,
						boundaryGap: "justify",
						disableGrid: true,
						min: 0,
						axisLine: false,
						max: 40,
						fontColor: '#fff'
					},
					yAxis: {
						padding: 20,
						data: [{
							type: 'categories',
							fontColor: '#fff',
							fontSize: 10
						}]
					},
					extra: {
						bar: {
							type: "group",
							width: 60,
							meterBorde: 1,
							meterFillColor: "#FFFFFF",
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							linearType: "custom",
							linearOpacity: 0,
							customColor: ['#0B9BA8'],
							// barBorderCircle: true,
							seriesGap: 2,
							categoryGap: 2,

						},
						tooltip: {
							fontSize: 10
						}
					}
				},
				chartData3: {},
				chartData: {},
				chartData2: {},
				peakValleyPrice: []
			}
		},

		onLoad() {
			this.opt.extra.ring.border = false
			this.opt.extra.ring.centerColor = '#16379A'
			this.opts = JSON.parse(JSON.stringify(this.opt))
			this.opts2 = JSON.parse(JSON.stringify(this.opt))
			this.opts.title.name = '总用电'
			this.opts2.title.name = '总费用'
			// this.opts2.extra.ring.border = false
			// this.opts2.extra.ring.centerColor = '#16379A'
			this.date.setDate(this.date.getDate() - 1)
			this.single = dateStandardFormat(this.date)
			this.setPeakValleyPrice(new Date(this.single), new Date(this.single), this.currentSystemInfo.areaLevelId)
			this.setPowerRatioChart(new Date(this.single), new Date(this.single), this.currentSystemInfo.areaId)
		},
		methods: {
			change(e) {
				this.setPeakValleyPrice(new Date(e.f1), new Date(e.f1), this.currentSystemInfo.areaLevelId)
				this.setPowerRatioChart(new Date(e.f1), new Date(e.f1), this.currentSystemInfo.areaId)
			},
			
			showModel(){
				this.show = true
			},

			/**
			 * 电价设置
			 * @param startDate 
			 * @param endDate 
			 * @param positionId 
			 * @param areaInfoId 
			 */
			setPeakValleyPrice(startDate, endDate, areaLevelId) {
				// this.isLoading = true
				// this.fontSize = fontSize
				getUrlByDay(startDate, endDate, areaLevelId, this.currentSystemInfo.areaId).then(data => {
					let res = {
						series: [{
							data: []
						}]
					};
					let res2 = {
						series: [{
							data: []
						}]
					};
					let totalElectricityQ = 0
					let totalCost = 0
					for (let i = 0; i < data.length; i++) {
						res.series[0].data.push({
							value: data[i].total_electricity_q,
							name: data[i].name.substring(0, 2) + '用电'
						})
						totalElectricityQ += data[i].total_electricity_q
						let cost = parseFloat((data[i].total_electricity_q * data[i].price).toFixed(2))
						totalCost += cost;
						res2.series[0].data.push({
							value: cost,
							name: data[i].name.substring(0, 2) + '费用'
						})
					}
					this.opts.subtitle.name = totalElectricityQ.toFixed(2)
					this.opts2.subtitle.name = totalCost.toFixed(2)
					this.chartData2 = JSON.parse(JSON.stringify(res2));
					this.chartData = JSON.parse(JSON.stringify(res));
				});
			},
			setPowerRatioChart(startDate, endDate, positionId) {
				getPeakValleyPowerByAreaId(startDate, endDate, positionId).then(data => {
					let res = {
						categories: [],
						series: [{
								name: "峰谷用电占比",
								data: []
							}
						]
					};
					let optionData = []
					for (let i = 0; i < data.length; i++) {
						if (data[i + 1] && data[i].areaLevelId == data[i + 1].areaLevelId) {
							if (data[i].totalConsumeElectricityQ == 0) continue;
							let electricity = parseFloat((data[i + 1].totalConsumeElectricityQ / data[i].totalConsumeElectricityQ).toFixed(2))
							// this.options.series[0].data.push(electricity)
							let name = (data[i].name.length > 9 ? data[i].name.slice(0, 8) + '...' : data[i].name)
							optionData.push({
								name: name,
								value: electricity
							})
							i++;
						}
					}
					// 峰谷比例数据排序
					optionData = optionData.sort((a, b) => {
						if (isNaN(b.value)) return -1
						if (isNaN(a.value)) return 1
						return b.value - a.value
					})
					optionData.forEach(ele => {
						res.categories.push(ele.name)
						res.series[0].data.push(ele.value)
					})
					// y轴找出最大值
					this.opts3.xAxis.max = optionData[0].value;
					this.chartData3 = JSON.parse(JSON.stringify(res));
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
		padding: 0.5rem;
		margin-top: unset
	}

	.content-container {
		width: 46%;
		float: left;
		height: 77%;
		display: flex;
		flex-direction: column;
		color: #7287C6;
		position: relative;
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

	::v-deep.u-modal__title,
	::v-deep.u-modal__content__text {
		color: #fff !important;
	}

	/deep/.u-popup__content {
		background-color: #16379A !important;
	}
</style>