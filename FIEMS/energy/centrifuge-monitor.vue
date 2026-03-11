<template>
	<view class="container">
		<u-navbar title="离心机监测" leftIconColor="#fff" :titleStyle="{'color':'#fff','width':'100%'}" :leftText="null" :autoBack="true" :placeholder="true" :bgColor="headerTabBg" :safeAreaInsetTop='true'></u-navbar>
		<view class="f1">
			<text :class="{'active':show==1}" @click="switchShow(1)">概况</text>
			<text :class="{'active':show==2}" @click="switchShow(2)">光伏系统</text>
			<text :class="{'active':show==3}" @click="switchShow(3)">离心机系统</text>
		</view>

		<view v-if="show==1">
			<view class="box-container" style="display:flex;align-items:center;height: 19%;">
				<view style="width: 15%;display:flex;flex-direction:column;justify-content:center;align-items:center;">
					<image style="width: 32px; height: 36px;" src="./static/uiImages/icon/icon_gains.svg" mode="widthFix"></image>
					<text>收益</text>
				</view>
				<view style="width:80%;height:100%;display:flex;flex-direction: column;">
					<view style="height:46%;display:flex;width:100%;align-items: center;;">
						<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
							<text style="font-size:32rpx;margin: 4% 0;">
								¥&nbsp;{{profitsData.dayProfit}}
							</text>
							<text style="color:#7287C6;font-size:28rpx;">当日</text>
						</view>
						<view class="col-line"></view>
						<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
							<text style="font-size:32rpx;margin: 4% 0;">
								<!-- ¥&nbsp;{{electriDataChange(getDayProfit())}}&nbsp;{{electriUnitChange(getDayProfit())}} -->
								¥&nbsp;{{profitsData.monthProfit}}
							</text>
							<text style="color:#7287C6;font-size:28rpx;">本月</text>
						</view>
					</view>
					<u-line margin="3%"></u-line>
					<view style="height:46%;display:flex;width:100%;align-items: center;;">
						<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
							<text style="font-size:32rpx;margin: 4% 0;">
								<!-- ¥&nbsp;{{electriDataChange(getDayProfit())}}&nbsp;{{electriUnitChange(getDayProfit())}} -->
								¥&nbsp;{{profitsData.yearProfit}}
							</text>
							<text style="color:#7287C6;font-size:28rpx;">本年</text>
						</view>
						<view class="col-line"></view>
						<view style="display:flex;flex-direction:column;align-items:center;width: 50%;">
							<text style="font-size:32rpx;margin: 4% 0;">
								¥&nbsp;&nbsp;{{profitsData.accProfit}}
							</text>
							<text style="color:#7287C6;font-size:28rpx;">累计</text>
						</view>
					</view>
				</view>
			</view>
			<view style="color:#fff;height:2rem;display:flex;align-items:center;justify-content:center;">
				{{getRunningMode()}}
			</view>
			<view style="position:relative;height:236px;margin: 0.5rem;">
				<image src="./static/uiImages/photovoltaic.png" style="width: 100%;height:198.933px"></image>
				<view style="position:absolute;left:56%;top: 5%;display:flex;flex-direction:column;align-items:center;color:#00ff00;">
					<text>光伏发电功率</text>
					<!-- <text>{{}}kw</text> -->
					<rich-text v-if="deviceLists[0]" :nodes="deviceLists[0].photovoltaicData.photovoltaicGenerationPower+'kw'"></rich-text>
				</view>
				<view style="position:absolute;left: 76%;top:81%;display:flex;flex-direction:column;align-items:center;color:#fff000;">
					<text>光储空调功率</text>
					<rich-text v-if="deviceLists[0]" :nodes="deviceLists[0].photovoltaicData.unitPowerConsumption+'kw'"></rich-text>
				</view>
				<view style="position:absolute;left: 4%;top:81%;display:flex;flex-direction:column;align-items:center;color:#fff000;">
					<text>电网功率</text>
					<rich-text v-if="deviceLists[0]" :nodes="deviceLists[0].photovoltaicData.gridSupplyPower+'kw'"></rich-text>
				</view>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.photovoltaicGenerationPower>0" style="width:0.5rem;height:1rem;position:absolute;left: 45.8%;top:20%;" class="line-down"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.photovoltaicGenerationPower>0" style="width:0.5rem;height:1rem;position:absolute;left: 49%;top:20%;" class="line-down"></image>

				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower>0" style="width:0.5rem;height:1rem;position:absolute;left:22%;top:61%;transform: rotate(270deg);" class="line-right"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower>0" style="width:0.5rem;height:1rem;position:absolute;left:22%;top:66%;transform: rotate(270deg);" class="line-right"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower>0" style="width:0.5rem;height:1rem;position:absolute;left:22%;top:70%;transform: rotate(270deg);" class="line-right"></image>

				<!-- v-if="deviceLists[0].photovoltaicData.gridSupplyPower<0" -->
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower<0" style="width:0.5rem;height:1rem;position:absolute;left:50%;top:61%;transform: rotate(90deg);" class="line-left"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower<0" style="width:0.5rem;height:1rem;position:absolute;left:72%;top:66%;transform: rotate(90deg);" class="line-left"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.gridSupplyPower<0" style="width:0.5rem;height:1rem;position:absolute;left:32%;top:70%;transform: rotate(90deg);" class="line-left"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.unitPowerConsumption>0" style="width:0.5rem;height:1rem;position:absolute;left:64%;top:61%;transform: rotate(90deg);" class="line-right"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.unitPowerConsumption>0" style="width:0.5rem;height:1rem;position:absolute;left:64%;top:66%;transform: rotate(90deg);" class="line-right"></image>
				<image src="./static/uiImages/line.png" v-if="deviceLists[0].photovoltaicData.unitPowerConsumption>0" style="width:0.5rem;height:1rem;position:absolute;left:64%;top:70%;transform: rotate(90deg);" class="line-right"></image>
			</view>
			
			<view style="margin:0.5rem;height: 300px;">
				<qiun-data-charts type="line" height="400px" :opts="opts" :chartData="chartData" :canvas2d="canvas2d" canvasId="PFtixECXxAJzsgZhMnXgiqnfFVCzQtyq" />
			</view>
			<u-back-top :scrollTop="scrollTop" icon="arrow-up"></u-back-top>
		</view>

		<view v-else-if="show==2">
			<view class="box-container" style="height: 10rem;">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">光伏数据</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">发电功率</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B122.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B114.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B116.value"></rich-text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width: 40%;min-width: fit-content;">当天发电量</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B124.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">总发电量</text>
						<text style="width:60%;text-align: end;color:#fff">{{yearData.generate}}kWh</text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">冷却设备</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B1b6.value"></rich-text>
					</view>
				</view>
			</view>

			<view class="box-container" style="height: 8rem;">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">机组功耗</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">耗电功率</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B126.value"></rich-text>
					</view>

				</view>
				<view class="col-line" style="height: 60%;"></view>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width: 40%;min-width: fit-content;">当天耗电量</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B128.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">总耗电量</text>
						<text style="width:60%;text-align: end;color:#fff">{{yearData.consume}}kWh</text>
					</view>
				</view>
			</view>
			<view class="box-container" style="height: 8rem;">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">电网数据</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">供电功率</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B118.value"></rich-text>
					</view>

				</view>
				<view class="col-line" style="height: 60%;"></view>
				<view class="content-container">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width: 40%;min-width: fit-content;">当天供电量</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B124.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;">总供电量</text>
						<text style="width:60%;text-align: end;color:#fff">{{yearData.gridSum}}kWh</text>
					</view>

				</view>
			</view>
			<view class="box-container" style="height:26%">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">运营统计数据</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>

				<uni-table border stripe emptyText="暂无更多数据">
					<!-- 表头行 -->
					<uni-tr>
						<uni-th align="center"></uni-th>
						<uni-th align="center">光伏直驱利用率</uni-th>
						<uni-th align="center">光伏综合保证率</uni-th>
					</uni-tr>
					<!-- 表格数据行 -->
					<uni-tr>
						<uni-td>实时</uni-td>
						<uni-td>{{getRationData1(deviceLists[0].photovoltaicData.unitPowerConsumption,deviceLists[0].photovoltaicData.gridSupplyPower, deviceLists[0].photovoltaicData.photovoltaicGenerationPower)}}%</uni-td>
						<uni-td>{{getRationData2(deviceLists[0].photovoltaicData.photovoltaicGenerationPower,deviceLists[0].photovoltaicData.unitPowerConsumption)}}%</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>当天</uni-td>
						<uni-td>{{getRationData1(deviceLists[0].photovoltaicData.unitElectricConsumptionDaily,deviceLists[0].photovoltaicData.gridSupplyElectricDaily, deviceLists[0].photovoltaicData.photovoltaicGenerationElectricDaily)}}%</uni-td>
						<uni-td>{{getRationData2(deviceLists[0].photovoltaicData.photovoltaicGenerationElectricDaily,deviceLists[0].photovoltaicData.unitElectricConsumptionDaily)}}%</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>当月</uni-td>
						<uni-td>{{pvRate.pvUtilizationRateMonth}}%</uni-td>
						<uni-td>{{pvRate.overallCoverageRateMonth}}%</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td>当年</uni-td>
						<uni-td>{{pvRate.pvUtilizationRateYear}}%</uni-td>
						<uni-td>{{pvRate.overallCoverageRateYear}}%</uni-td>
					</uni-tr>

				</uni-table>
			</view>
		</view>

		<view v-else-if="show==3" style="height: 100%;padding-bottom: 1rem;">
			<view class="box-container" style="height:12%">

				<view class="content-container" style="width:40%">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;min-width: fit-content;">设备状态</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].stateData.B1b0.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;min-width: fit-content;">系统运行时间</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].energyData.B94.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;min-width: fit-content;">主机功率</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].energyData.B126.value"></rich-text>
					</view>
				</view>
				<view class="col-line" style="margin:2%"></view>
				<view class="content-container" style="width:55%">
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width: 40%;min-width: fit-content;">主机功率百分比</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].energyData.rationPower.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;min-width: fit-content;">光伏变流器运行频率</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].energyData.B70.value"></rich-text>
					</view>
					<view class="row-container" style="font-size: 28rpx;">
						<text style="width:40%;min-width: fit-content;">直流母线电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff;font-size: 26rpx;" :nodes="deviceLists[0].energyData.B72.value"></rich-text>
					</view>

				</view>
			</view>

			<view style="position:relative;height:236px;margin: 0.5rem;margin-top:1rem">
				<image src="./static/uiImages/CVE.png" style="width:74%;height:198.933px;position:absolute;left:15%;top: 20%;"></image>
				<view style="position:absolute;color:#fff;display:flex;flex-direction:column;align-items: center;">
					<text>
						压缩机
					</text>
					<text style="color:#00ffff;font-size:24rpx;">{{deviceLists[0].energyData.B48.value}}
					</text>
					<view style="width:25px;border-top:1px dotted #0ff;transform: translateX(35px) translateY(15px) rotateZ(45deg) scale(1.8);">
					</view>
				</view>
				<view style="position:absolute;color:#fff;left: 51%;top:-3%;">

					<text style="display: flex;">
						光伏逆变器
					</text>

					<text style="color:#00ffff;font-size:24rpx;">{{deviceLists[0].energyData.B58.value}}
					</text>
					<view style="width:25px;border-top:1px dotted #0ff;transform: translateX(-28px) translateY(-6px) rotateZ(130deg) scale(1.7);">
					</view>
				</view>
				<view style="position:absolute;color:#fff;left: 75%;top:19%;">
					<text style="display: flex;">
						冷凝器
					</text>
					<text style="color:#00ffff;font-size:24rpx;">{{deviceLists[0].energyData.B28.value}}
					</text>
					<view style="width: 33px;border-top:1px dotted #0ff;transform:translateX(-39px) translateY(14px) rotateZ(136deg) scale(1.7);">
					</view>
				</view>
				<view style="position:absolute;color:#fff;left:24%;top: 91%;">
					<text style="display: flex;">
						电子膨胀阀
					</text>
					<text style="color:#00ffff;font-size:24rpx;">{{deviceLists[0].energyData.B88.value}}
					</text>
					<view style="width: 26px;border-top:1px dotted #0ff;transform:translateX(25px) translateY(-70px) rotateZ(61deg) scale(2.0);">
					</view>
				</view>
				<view style="position:absolute;color:#fff;top: 87%;left:1%;">
					<text style="display: flex;">
						蒸发器
					</text>
					<text style="color:#00ffff;font-size:24rpx;">{{deviceLists[0].energyData.B30.value}}
					</text>
					<view
						style="width:35px;border-top:1px dotted #0ff;transform: translateX(39px) translateY(-76px) rotateZ(136deg) scale(2.0);">
					</view>
				</view>

				<image src="./static/uiImages/fan.png" style="width:15.38px;height: 15.38px;position:absolute;left:70%;top:56%;" :class="(deviceLists[0].stateData.B0b5.value==1?'fanRotateNum':'')"></image>
				<image src="./static/uiImages/fan.png" style="width:15.38px;height: 15.38px;position:absolute;left:70%;top:88%;" :class="(deviceLists[0].stateData.B0b4.value==1?'fanRotateNum':'')">
					<image src="./static/uiImages/arrow-orange.png" style="width:11.38px;height:11.38px;position:absolute;left:66%;top: 51%;" :class="(deviceLists[0].stateData.B0b5.value==1)?'arrowOrangeRight':''"></image>
					<image src="./static/uiImages/arrow-blue.png" style="width:11.38px;height:11.38px;position:absolute;left:77%;top: 56.5%;transform: rotateZ(180deg)" :class="(deviceLists[0].stateData.B0b5.value==1)?'arrowBlueLeft':''"></image>
					<image src="./static/uiImages/arrow-orange.png" style="width:11.38px;height:11.38px;position:absolute;left:77%;top: 89%;transform: rotateZ(180deg)" :class="(deviceLists[0].stateData.B0b4.value==1)?'arrowBlueLeft':''"></image>

					<image src="./static/uiImages/arrow-blue.png" style="width:11.38px;height:11.38px;position:absolute;left: 53%;top:97.5%;" :class="(deviceLists[0].stateData.B0b4.value==1)?'arrowBlueRight':''"></image>
					<view style="position:absolute;color:#fff;top: 48%;left: 89%;font-size:24rpx;">
						{{deviceLists[0].energyData.B6.value}}
					</view>
					<view style="position:absolute;color:#fff;top: 55%;left: 89%;font-size:24rpx;">
						{{deviceLists[0].energyData.B4.value}}
					</view>
					<view style="position:absolute;color:#fff;top: 86%;left: 89%;font-size:24rpx;">
						{{deviceLists[0].energyData.B0.value}}
					</view>
					<view style="position:absolute;color:#fff;top: 94%;left: 89%;font-size:24rpx;">
						{{deviceLists[0].energyData.B2.value}}
					</view>

			</view>
			<view class="box-container" style="height:36%;margin-top: 2rem;">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">换流器</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机U相电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B82.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机V相电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B84.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机W相电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B86.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">交流R、S相间线电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B64.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">交流S、T相间线电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B66.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">交流T、R相间线电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B68.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">逆变进口温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B60.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">逆变中间温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B62.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">逆变出口温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B74.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">变频环境温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B22.value"></rich-text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">交流R相输入电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B76.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">交流S相输入电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B78.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">交流T相输入电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B80.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">母线电压</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B72.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">运行频率</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B70.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">目标频率</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B58.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">整流进口温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B50.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">整流中间温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B52.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">整流出口温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B54.value"></rich-text>
					</view>

				</view>
			</view>
			<view class="box-container" style="height:20%">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">蒸发器</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">冷冻水进水温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B10.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">冷冻水出水温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B2.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">蒸发温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B26.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">蒸发压力</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B30.value"></rich-text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">蒸发器端温差</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B134.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">使用侧水泵</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B2b6.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content;">冷冻水流开关</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B0b4.state"></rich-text>
					</view>

				</view>
			</view>
			<view class="box-container" style="height:23%">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">冷凝器</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container">
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">冷却水进水温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B4.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">冷却水出水温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B6.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;">冷凝温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B24.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;">冷凝压力</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B28.value"></rich-text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">冷凝器端温度差</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B136.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">冷却塔风机</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B3b0.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">热源侧水泵</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B2b7.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">冷却水流开关</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B0b5.state"></rich-text>
					</view>
				</view>
			</view>
			<view class="box-container" style="height:36%;margin-bottom: 5rem;">
				<view class="header-container">
					<view style="display:flex;align-items:center;">
						<text style="font-family: cursive;">压缩机</text>
					</view>
				</view>
				<u-line color="#7287C6"></u-line>
				<view class="content-container" style="margin-bottom: 3rem;padding-bottom: 3rem;">
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">供油温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B14.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">油箱温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B16.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">供油压力</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B32.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">油箱压力</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B34.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width:fit-content">供油-油箱压力差</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B36.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">排气温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B12.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">吸气温度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B92.value"></rich-text>
					</view>
				</view>
				<view class="col-line"></view>
				<view class="content-container">
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">导叶运行开度</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B40.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机主机电流</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B48.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机运行时间</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B94.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width: 40%;min-width: fit-content;">压缩机启停次数</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].energyData.B96.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机油泵</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B2b1.value"></rich-text>
					</view>
					<view class="row-container">
						<text style="width:40%;min-width: fit-content">油加热器</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B2b2.value"></rich-text>
					</view>

					<view class="row-container">
						<text style="width:40%;min-width: fit-content">压缩机主交流接触器</text>
						<rich-text style="width:60%;text-align: end;color:#fff" :nodes="deviceLists[0].stateData.B2b0.value"></rich-text>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getOverallCoverageRate,
		getProfits,
		getPowerData
	} from '@/api/fiems/energy.js'
	import {
		RealtimeDataProviderService
	} from '@/service/socket/realtime-data-provider.js'
	import store from '@/store';
	import {
		zip
	} from 'rxjs'
	export default {
		data() {
			return {
				// bgColor: '#003E98',
				canvas2d: this.$Config.ISCANVAS2D,
				page: 0,
				show: 1,
				value: 0,
				range: [],
				highVoltageList: [],
				realTimeService: new RealtimeDataProviderService(),
				lowVoltageList: [],
				deviceLists: [],
				dataLoading: true,
				filterDevices: [],
				keyword: '',
				dataLists: [],
				scrollTop: 0,
				chartData: {},
				pvRate: {},
				categroy: [],
				gridData: [],
				consumeData: [],
				generateData: [],
				profitsData: {
					monthProfit: "--",
					accProfit: "--",
					dayProfit: "--",
					yearProfit: "--",
				},
				yearData: {
					gridSum: '--',
					consume: '--',
					generate: '--'
				},
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF", "#3CA272", "#FAC858", "#EE6666", "#73C0DE", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					height:'600px',
					padding: [0, 2, 0, 2],
					dataLabel: false,
					dataPointShape: false,
					enableScroll: false,
					legend: {
						position: 'top',
						float: "right",
						fontColor: '#fff',
						fontSize: 11
						// padding:[0, 2, 10, 2],
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
						showTitle: true,
						data: [{
							
							title: "单位:kW",
							fontColor: '#fff',
							titleOffsetY: -10,
							titleFontColor: '#fff',
							titleFontSize: '10',
							fontSize: 10,
							tofix: 2

						}]
					},
					extra: {
						line: {
							type: "curve",
							width: 2,
							activeType: "hollow",
							linearType: "custom",
							onShadow: true,
							animation: "horizontal"
						}
					},
				},
			};
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onLoad() {
			let array = [{
				deviceId: 1053536,
				name: '光伏直流离心机',
				address: '01',
				barCode: '00 00 05 0F 05 05 09 0A 07 02 03 0C 09 08 00',
				typeCode: '1D02_V2',
			}]
			this.realTimeService.initDeviceList(array)
			let deviceList = this.realTimeService.getDeviceList();
			this.deviceLists = deviceList

			getOverallCoverageRate('MONTH', new Date()).then(monthData => {
				this.pvRate.pvUtilizationRateMonth = monthData.data.pvUtilizationRate.toFixed(2)
				this.pvRate.overallCoverageRateMonth = monthData.data.overallCoverageRate.toFixed(2)
			})

			getProfits(new Date(), 317).then(datas => {
				this.profitsData = {
					monthProfit: datas.data.monthProfit ? datas.data.monthProfit.toFixed(2) : "--",
					accProfit: datas.data.accProfit ? datas.data.accProfit.toFixed(2) : "--",
					dayProfit: datas.data.dayProfit ? datas.data.dayProfit.toFixed(2) : "--",
					yearProfit: datas.data.yearProfit ? datas.data.yearProfit.toFixed(2) : "--",
				}
			})

			getOverallCoverageRate('YEAR', new Date()).then(yearData => {
				this.pvRate.pvUtilizationRateYear = yearData.data.pvUtilizationRate.toFixed(2)
				this.pvRate.overallCoverageRateYear = yearData.data.overallCoverageRate.toFixed(2)
				this.yearData = {
					gridSum: yearData.data.gridSum,
					consume: yearData.data.consume,
					generate: yearData.data.generate
				}
			})
			this.getCurveData()
		},

		onUnload() {
			if (this.RealTimeService)
				this.RealTimeService.unregister()
		},

		beforeDestroy() {
			this.realTimeService.unregister()
		},

		onReachBottom() {
			if (this.page >= (this.filterDevices.length / 10)) return;
			this.status = 'loading';
			this.page = ++this.page;
			this.dataLists = this.dataLists.concat(this.filterDevices.slice(this.dataLists.length, this.dataLists.length + 10));
			if (this.page >= (this.filterDevices.length / 10)) this.status = 'nomore';
			else this.status = 'loading';
		},
		methods: {
			switchShow(index) {
				this.page = 0
				this.show = index
			},

			getCurveData() {
				let startDate = new Date()
				let endDate = new Date()
				endDate.setDate(endDate.getDate() + 1)
				zip(getPowerData('grid', startDate, endDate),
					getPowerData('generate', startDate, endDate),
					getPowerData('consume', startDate, endDate)
				).subscribe(([gridData, generateData, consumeData]) => {
					let pPowerArr = []
					let cPowerArr = []
					let eNetPowerArr = []
					let xAxisArr = []
					let pDataTemp = ''
					let eDataTemp = ''
					let cDataTemp = ''
					let index = 0;
					gridData.data.forEach(element => {
						for (const key in element) {
							if (cDataTemp == consumeData.data[index][key] && eDataTemp == gridData.data[index][key] && pDataTemp == generateData.data[index][key]) {
								continue;
							}
							pDataTemp = generateData.data[index][key]
							eDataTemp = gridData.data[index][key]
							cDataTemp = consumeData.data[index][key]
							eNetPowerArr.push(gridData.data[index][key])
							cPowerArr.push(consumeData.data[index][key])
							pPowerArr.push(generateData.data[index][key])
							xAxisArr.push(key.substring(11))
						}

						index++;
					});

					let res = {
						categories: xAxisArr,
						series: [{
								name: "电网供电功率",

								data: eNetPowerArr
							},
							{
								name: "光伏发电功率",
								data: pPowerArr
							},
							{
								name: "离心机用电功率",
								data: cPowerArr
							}
						]
					};
					this.chartData = JSON.parse(JSON.stringify(res));
				})
			},

			fanRotateNum() {
				if (this.deviceRunFlag === true) {
					return 'fanRotate 1s linear infinite';
				} else {
					return 'none';
				}
			},
			getRationData1(value1, value2, value3) {
				if (value1 == 0 || value3 == 0) return 0
				if (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2)) && !isNaN(parseInt(value2))) {
					return ((value1 - value2 * 0.98 * 0.98) / value3 * 100).toFixed(2)
				} else {
					return '--'
				}
			},

			getRationData2(value1, value2) {
				if (value1 == 0 || value2 == 0) return 0
				if (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {
					return (value1 / value2 * 100).toFixed(2)
				} else {
					return '--'
				}
			},


			getRunningMode() {

				// if()
				if (!this.deviceLists[0]) return ''

				let value1 = this.deviceLists[0].photovoltaicData.photovoltaicGenerationPower
				let value2 = this.deviceLists[0].photovoltaicData.unitPowerConsumption
				if (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2))) {
					if (value1 > 1 && value2 == 0) {
						return '纯光伏发电工作模式'
					} else if (value1 > value2) {
						return '光伏空调及系统发电模式'
					} else if (value1 == value2) {
						return '光伏空调工作模式'
					} else if (value1 < value2) {
						return '光伏空调及系统用电工作模式'
					} else if (value1 == 0 && value2 > 0) {
						return '纯空调工作模式'
					}
				} else {
					return ''
				}

			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep page {
		height: 100%;
	}

	.container {
		font-size: 28rpx;
		line-height: 24px;
		background-color: #0E2264;
		min-height: 100%;
		height: 100%; // height:auto;
		// min-height:fit-content;
		overflow: auto;
		padding-bottom: 5rem;
	}

	.header-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 2rem;
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
		background: rgba(22, 55, 154, 0.2);
		height: 6rem;
		margin: 0.5rem;
		border-radius: 6px;
		color: #fff;
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
		font-size: 22rpx;
	}


	.col-line {
		background-color: #7287C6;
		margin: 3%;
		width: 1px;
		float: left;
		height: 72%;
	}

	.data-container {
		display: flex;
	}

	// .row-container {
	// 	margin: auto;
	// 	width: 50%;
	// 	display: flex;
	// 	align-items: center;
	// 	height: 100%;
	// 	padding: 0 0.5rem
	// }

	// .col-line {
	// 	background-color: #7287C6;
	// 	margin: 3%;
	// 	width: 1px;
	// 	float: left;
	// 	height: 50%;
	// }

	// ::v-deep.uni-select {
	// 	border: unset
	// }

	// ::v-deep.uni-select__input-text {
	// 	color: #fff;
	// }

	// ::v-deep.uni-select__selector {
	// 	background: #003879;
	// 	border: unset
	// }

	// ::v-deep.uni-popper__arrow::after {
	// 	border: bottom color #0050ae;
	// }

	// ::v-deep.table--border {
	// 	border-left: unset;
	// 	border-top: unset;
	// 	border-right: 1px solid #455FAE
	// }


	::v-deep.table--border {
		border: 1px gray solid !important;
		border-right: 1px gray solid !important;
	}


	::v-deep.uni-table-th {
		// background: #16379A;
		color: #fff;
		border-bottom: 1px gray solid !important;
		text-align: center !important;
	}

	::v-deep.uni-table-td {
		// background: #16379A;
		color: #fff;
		border-bottom: 1px gray solid !important;
		text-align: center !important;
	}

	::v-deep.uni-table {
		min-width: unset !important;
		background: unset !important;
	}

	::v-deep.u-loading-icon {
		height: 1000rpx;
	}

	.fanRotateNum {
		animation: fanRotate 1s linear infinite;
	}

	@keyframes fanRotate {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(-360deg);
		}
	}

	.arrowBlueRight {
		animation: arrowBlueRight 3s linear infinite
	}

	.arrowBlueLeft {
		animation: arrowBlueLeft 1.8s linear infinite
	}

	.arrowOrangeRight {
		animation: arrowOrangeRight 2s linear infinite
	}

	@keyframes arrowBlueRight {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(700%);
		}
	}

	@keyframes arrowBlueLeft {
		0% {
			transform: translateX(0%) rotateZ(180deg);
		}

		100% {
			transform: translateX(-80%) rotateZ(180deg);
		}
	}

	@keyframes arrowOrangeRight {
		0% {
			transform: translateX(0%);
		}

		100% {
			transform: translateX(300%);
		}
	}

	.line-down {
		animation: lz 3s linear infinite;
		position: absolute;
		left: 49.7%;
		top: 26%;
	}



	@keyframes lz {
		from {
			transform: translateY(0px);
		}

		to {
			transform: translateY(60px);
		}
	}

	.line-right {
		animation: lineR 3s linear infinite;
		position: absolute;
	}

	@keyframes lineR {
		0% {
			transform: translateX(0%) rotate(270deg);
		}

		100% {
			transform: translateX(300%) rotate(270deg);
		}
	}

	.line-left {
		animation: lineL 1.8s linear infinite;
		position: absolute;
	}

	@keyframes lineL {
		0% {
			transform: translateX(0%) rotate(90deg);
		}

		100% {
			transform: translateX(-300%) rotate(90deg);
		}
	}
</style>