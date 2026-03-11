<template>
    <view class="main-container">

        <view class="main-content" style="position: relative;">
            <image src="../static/images/power-efficiency.png" style="width:100%; height:100%; position: absolute; top:0; left:0; z-index: 1;"></image>
            
            <view class="provide-power" style="position: absolute; z-index: 2;">
                <p style="">{{ totalSolarData.power }}kW</p>
            </view>
            
            <view class="storage-power" style="position:absolute;z-index:2;top: 89%;">
                <p style="">{{ storageData.power }}kW</p>
            </view>
            
            <view class="duolianji1-power" style="position: absolute; z-index: 2 ">
                <p style="">{{ dljPower.power1 }}W</p>
            </view>
            
            <view class="duolianji2-power" style="position: absolute; z-index: 2;">
                <p style="">{{ dljPower.power2 }}W</p>
            </view>
            
            <view class="light-power" style="position: absolute; z-index: 2; ">
                <p style="">{{ lightPower }}kW</p>
            </view>
            
            <view class="grid-power" style="position: absolute; z-index: 2;top: 92%;">
                <p style="">{{ totalElectricityData.power }}kw</p>
            </view>

        </view>

        <!-- 移动端布局 -->
        <view class="mobile-layout">
            <view class="mobile-header">
                <view class="loss-type">损耗类型</view>
                <view class="loss-title">电量损耗值(kWh)</view>
                <view class="loss-title">功率损耗值(kW)</view>
            </view>

            <view class="mobile-row">
                <view class="loss-name">PCS整流</view>
                <view class="num-cube">{{ batteryLoss.PCSRectification }}</view>
                <view class="num-cube">{{ powerLoss.PCSRectification }}</view>
            </view>

            <view class="mobile-row">
                <view class="loss-name">PCS逆变</view>
                <view class="num-cube">{{ batteryLoss.PCSInverter }}</view>
                <view class="num-cube">{{ powerLoss.PCSInverter }}</view>
            </view>

            <view class="mobile-row">
                <view class="loss-name">储能DC充电</view>
                <view class="num-cube">{{ batteryLoss.storageDCCharge }}</view>
                <view class="num-cube">{{ powerLoss.storageDCCharge }}</view>
            </view>

            <view class="mobile-row">
                <view class="loss-name">储能DC放电</view>
                <view class="num-cube">{{ batteryLoss.storageDCDischarge }}</view>
                <view class="num-cube">{{ powerLoss.storageDCDischarge }}</view>
            </view>

            <view class="mobile-row">
                <view class="loss-name">光伏DC发电</view>
                <view class="num-cube">{{ batteryLoss.photovoltaicDC }}</view>
                <view class="num-cube">{{ powerLoss.photovoltaicDC }}</view>
            </view>
        </view>

        <view class="chart-content" v-if="false">
            <view class="provide-chart" style="width: 100%; height: 25%">
                <view style="font-size: 0.1rem; font-weight: bold">光伏</view>
                <!-- <v-chart style="width: 100%; height: 20vh;" :options='provideOptions' autosize></v-chart> -->
                <qiun-data-charts type="line" :opts="options" :chartData="provideChartData" canvasId="provideChart"
                    style="width: 100%; height: 20vh;" :canvas2d="canvas2d" :autoresize="true" />
            </view>
            <view class="provide-chart" style="width: 100%; height: 25%">
                <view style="font-size: 0.1rem; font-weight: bold">储能</view>
                <!-- <v-chart style="width: 100%; height: 20vh;" :options='storageOptions' autosize></v-chart> -->
                <qiun-data-charts type="line" :opts="options" :chartData="storageChartData" canvasId="storageChart"
                    style="width: 100%; height: 20vh;" :canvas2d="canvas2d" :autoresize="true" />
            </view>
            <view class="provide-chart" style="width: 100%; height: 25%">
                <view style="font-size: 0.1rem; font-weight: bold">负荷</view>
                <!-- <v-chart style="width: 100%; height: 20vh;" :options='loadOptions' autosize></v-chart> -->
                <qiun-data-charts type="line" :opts="options" :chartData="loadChartData" canvasId="loadChart"
                    style="width: 100%; height: 20vh;" :canvas2d="canvas2d" :autoresize="true" />
            </view>
            <view class="provide-chart" style="width: 100%; height: 25%">
                <view style="font-size: 0.1rem; font-weight: bold">电网</view>
                <!-- <v-chart style="width: 100%; height: 20vh;" :options='gridOptions' autosize></v-chart> -->
                <qiun-data-charts type="column" :opts="options" :chartData="gridChartData" canvasId="gridChart"
                    style="width: 100%; height: 20vh;" :canvas2d="canvas2d" :autoresize="true" />
            </view>
        </view>
    </view>
</template>

<script>
import {
    getSocketinstance
} from "@/service/websocket";
import storage from "@/service/config/storage";

export default {
    name: "power-efficiency-analysis",
    data: function () {
        return {
            canvas2d: this.$Config.ISCANVAS2D,
            current: "power-efficiency-analysis",
            providePower: "--",
            lightPower: "--",
            gridPower: "--",
            nyzData: {
                storagePower1: "--",
                storagePower2: "--",
                SOC: "--",
                photovoltaicPower1: "--",
                photovoltaicPower2: "--",
                loadPower1: "--",
                loadPower2: "--",
                loadElectricity1: "--",
                loadElectricity2: "--",
                pcsIntputPower: "--",
                pcsOutputTotalPower: "--"
            },

            selectedEnergyData: {
                // 被选中光伏的数据
                I: 111,
                U: 111,
                P: 111,
                Q: 111,
            },
            selectedStorageData: {
                // 被选中储能的数据
                I: 222,
                U: 222,
                soc: 68,
                chargeP: 222, // 充
                dischargeP: 222, // 放
                chargeQ: 222, // 充
                dischargeQ: 222, // 放
            },
            selectedGridData: {
                // 被选中电网的数据
                I: 333,
                U: 333,
                P: 333,
                forwardQ: 333, // 供电
                reverseQ: 333, // 馈电
            },
            eleConsumption: {
                // 被选中用电的数据
                Q: 555,
                P: 5.55,
            },

            //多联机功率
            dljPower: {
                power1: "--",
                power2: "--"
            },
            dljElectricity: "--",

            batteryLoss: {
                PCSRectification: "--",
                PCSInverter: "--",
                storageDCCharge: "--",
                storageDCDischarge: "--",
                photovoltaicDC: "--",
            },

            powerLoss: {
                PCSRectification: "--",
                PCSInverter: "--",
                storageDCCharge: "--",
                storageDCDischarge: "--",
                photovoltaicDC: "--",
            },

            options: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 10, 0, 15],
                update: true,       // 启用增量更新模式（核心）
                duration: 0,        // 关闭动画过渡时间
                animation: false,
                enableScroll: false,
                dataLabel: false,
                dataPointShape: false,  // 新增关键配置
                legend: {},
                xAxis: {
                    disableGrid: true,
                    boundaryGap: "justify",
                    axisLabelUseCanvas: true  // 启用Canvas渲染
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    axisLabelUseCanvas: true,  // 启用Canvas渲染
                    splitNumber: 5
                },
                extra: {
                    line: {  // 统一配置线型图表
                        type: "curve",
                        width: 2,
                        activeType: "point"
                    },
                    column: {  // 柱状图专用配置
                        type: "group",
                        width: 30,
                        activeBgColor: "#00000010"
                    }
                }
            },
            provideChartData: {
                categories: [],
                series: [{
                    name: '光伏',
                    data: [],
                    color: "#1890FF"
                }]
            },
            storageChartData: {
                categories: [],
                series: [{
                    name: '储能',
                    data: [],
                    type: 'line',
                }]
            },
            loadChartData: {
                categories: [],
                series: [{
                    name: '用电',
                    data: [],
                    type: 'line',
                }]
            },
            gridChartData: {
                categories: [],
                series: [{
                    name: '电网',
                    data: [],
                    type: 'line',
                }]
            },

            gridPArrayXaxis: [],
            gridPArrayYaxis: [],
            energyPArrayXaxis: [],
            energyPArrayYaxis: [],
            storagePArrayYaxis: [],
            // this.storageP2ArrayYaxis = [];
            storagePArrayXaxis: [],
            consumptionPArrayXaxis: [],
            consumptionPArrayYaxis: []
        }
    },

    computed: {
        // provideChartData() {
        //     return {
        //         categories: this.energyPArrayXaxis,
        //         series: [{
        //             name: '光伏',
        //             data: this.energyPArrayYaxis,
        //             color: "#1890FF"
        //         }]
        //     };
        // },
        // storageChartData() {
        //     return {
        //         categories: this.storageChartData.categories,
        //         series: [{
        //             name: '储能',
        //             data: this.storageChartData.series[0].data,
        //             type: 'line'
        //         }]
        //     };
        // },
        // loadChartData() {
        //     return {
        //         categories: this.consumptionPArrayXaxis,
        //         series: [{
        //             name: '负荷',
        //             data: this.loadChartData.series[0].data,
        //             type: 'line'
        //         }]
        //     };
        // },
        // gridChartData() {
        //     return {
        //         categories: this.gridChartData.categories,
        //         series: [{
        //             name: '电网',
        //             data: this.gridChartData.series[0].data,
        //             type: 'column'
        //         }]
        //     };
        // },
        storageData() {
            const power = parseFloat(this.nyzData.storagePower1) + parseFloat(this.nyzData.storagePower2)
            const status = power == 0 ? "不充不放" : power > 0 ? "充电中" : "放电中"
            return { power: power.toFixed(2), status }
        },

        totalSolarData() {
            const power1 = this.nyzData.photovoltaicPower1 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower1)
            const power2 = this.nyzData.photovoltaicPower2 == '--' ? '--' : Math.abs(this.nyzData.photovoltaicPower2)
            const power3 = parseFloat(this.selectedEnergyData.P / 1000).toFixed(2) == '--' ? '--' : parseFloat(this.selectedEnergyData.P / 1000).toFixed(2)
            const power = this.getSum([power1, power2, power3])
            return { power }
        },

        totalElectricityData() {
            const powerLoss = parseFloat(this.nyzData.loadPower1 + this.nyzData.loadPower2) - parseFloat(this.dljPower.power1 / 1000) * (parseFloat(this.dljPower.power1 / 1000) / parseFloat(this.nyzData.loadPower1 + this.nyzData.loadPower2))
            const power1 = this.nyzData.loadPower1 == '--' ? '--' : this.nyzData.loadPower1
            const power2 = this.nyzData.loadPower2 == '--' ? '--' : this.nyzData.loadPower2
            const power3 = this.gridPower == '--' ? '--' : this.gridPower
            const power = this.getSum([power1, power2, power3])
            return { power, powerLoss: powerLoss.toFixed(2) }
        },

        pcsData() {
            const pcsPowerLoss = parseFloat(this.nyzData.pcsIntputPower - this.nyzData.pcsOutputTotalPower)
            return { pcsPowerLoss: pcsPowerLoss.toFixed(2) }
        }
    },

    mounted() {
        this.getRealData();
        this.getNyzRealTimeData();
        this.getDljRealTimeData()
    },

    methods: {
        //跳转页面

        // 获取数组元素和
        getSum(arr) {
            if (arr.every(item => item == '--')) return '--'
            const sum = arr.reduce((acc, curr) => {
                if (curr == '--') {
                    return acc
                }
                return acc + parseFloat(curr)
            }, 0)
            return sum.toFixed(2)
        },


        updateCharts() {
            this.$nextTick(() => {
                ['provideChart', 'storageChart', 'loadChart', 'gridChart'].forEach(chartId => {
                    if (this.$refs[chartId] && this[`${chartId}Data`]?.series?.length) {
                        this.$refs[chartId].refresh();
                    }
                });
            });
        },

        // 能源站实时数据
        getNyzRealTimeData() {
            this.storageChartData.series[0].data = [];
            this.storageChartData.categories = [];
            this.nyzStoragePower1 = "--";
            this.nyzStoragePower2 = "--";
            this.totalStoragePower = "--";
            getSocketinstance().socket2.emit("register")
            getSocketinstance().socket2.on("nyzData", (jsonData) => {
                const { deviceType, address, dataType, data } = jsonData
                switch (deviceType) {
                    case "1804_V2_2":
                        if (address == "18" && dataType == "2") {
                            this.nyzData.storagePower1 = parseFloat(data.B8).toFixed(2)
                        }
                        else if (address == "19" && dataType == "2") {
                            this.nyzData.storagePower2 = parseFloat(data.B8).toFixed(2)
                        }
                        else if (address == "1A" && dataType == "2") {
                            this.nyzData.photovoltaicPower1 = parseFloat(data.B8).toFixed(2)
                        }
                        else if (address == "1B" && dataType == "2") {
                            this.nyzData.photovoltaicPower2 = parseFloat(data.B8).toFixed(2)
                        }
                        else if (address == "31" && dataType == "2") {
                            this.nyzData.loadPower1 = parseFloat(data.B8).toFixed(2)
                            this.nyzData.loadElectricity1 = parseFloat(data.B12).toFixed(2)
                        }
                        else if (address == "32" && dataType == "2") {
                            this.nyzData.loadPower2 = parseFloat(data.B8).toFixed(2)
                            this.nyzData.loadElectricity2 = parseFloat(data.B12).toFixed(2)
                        }
                        break;

                    case "1704_V1_2":
                        if (address == "02" && dataType == "2") {
                            this.nyzData.SOC = parseFloat(data.B4).toFixed(2)
                        }
                        break;

                    case "1710":
                        if (address == "04" && dataType == "2") {
                            this.batteryLoss.PCSRectification = parseFloat(data.B170).toFixed(2)
                            this.batteryLoss.PCSInverter = parseFloat(data.B178).toFixed(2)
                            this.batteryLoss.storageDCCharge = parseFloat(data.B186).toFixed(2)
                            this.batteryLoss.storageDCDischarge = parseFloat(data.B194).toFixed(2)
                            this.batteryLoss.photovoltaicDC = parseFloat(data.B202).toFixed(2)
                            this.powerLoss.PCSRectification = parseFloat(data.B166).toFixed(2)
                            this.powerLoss.PCSInverter = parseFloat(data.B174).toFixed(2)
                            this.powerLoss.storageDCCharge = parseFloat(data.B182).toFixed(2)
                            this.powerLoss.storageDCDischarge = parseFloat(data.B190).toFixed(2)
                            this.powerLoss.photovoltaicDC = parseFloat(data.B198).toFixed(2)
                        }
                        break;

                    case "170F":
                        if (address == "03" && dataType == "2") {
                            this.dljPower.power1 = parseFloat(data.B16).toFixed(2)
                            this.dljPower.power2 = parseFloat(data.B20).toFixed(2)

                        }
                        break;

                    default:
                        break;
                }
                if (deviceType == "1804_V2_2" && address == "18") {
                    this.nyzStoragePower1 = parseFloat(data.B8).toFixed(2)
                }
                else if (deviceType == "1804_V2_2" && address == "19") {
                    this.nyzStoragePower2 = parseFloat(data.B8).toFixed(2)
                }
                // 往储能实时的P曲线中添加数据
                this.storageChartData.categories.push(
                    new Date().getHours() +
                    ":" +
                    new Date().getMinutes() +
                    ":" +
                    new Date().getSeconds()
                );
                this.totalStoragePower = (parseFloat(this.nyzStoragePower1) + parseFloat(this.nyzStoragePower2)).toFixed(2)
                this.storageChartData.series[0].data.push(
                    Math.round(this.totalStoragePower * 100) / 100
                );
                // this.storageP2ArrayYaxis.push(
                //     Math.round(this.selectedStorageData.chargeP) / 1000
                // );
                if (this.storageChartData.series[0].data.length > 100) {
                    this.storageChartData.series[0].data.shift();
                    this.storageChartData.categories.shift();
                }
            })
        },

        //社区箱子实时数据
        getRealData() {
            this.gridChartData.categories = [];
            this.gridChartData.series[0].data = [];
            this.energyPArrayXaxis = [];
            this.energyPArrayYaxis = [];
            // this.storageChartData.series[0].data = [];
            // this.storageP2ArrayYaxis = [];
            // this.storageChartData.categories = [];
            this.consumptionPArrayXaxis = [];
            this.loadChartData.series[0].data = [];
            this.loadChartData.categories = [];
            this.gridPower = "--";
            this.selectedEnergyData = { I: 0, U: 0, P: 0, Q: 0 };
            this.selectedStorageData = {
                I: 0,
                U: 0,
                dischargeP: 0,
                chargeP: 0,
                dischargeQ: 0,
                chargeQ: 0,
                soc: 0,
            };
            this.selectedGridData = { I: 0, U: 0, P: 0, forwardQ: 0, reverseQ: 0 };
            this.eleConsumption = { Q: 0, P: 0 };
            // 获取社区的电网数据
            getSocketinstance().socket.emit("register")
            getSocketinstance().socket.on("Grid", (data) => {
                if (data.data.B56) {
                    this.gridPower = (data.data.B56 / 1000).toFixed(3);
                }
                this.gridChartData.categories.push(
                    new Date().getHours() +
                    ":" +
                    new Date().getMinutes() +
                    ":" +
                    new Date().getSeconds()
                );
                this.gridChartData.series[0].data.push(
                    parseFloat(this.totalElectricityData.power)
                );
                if (this.gridChartData.series[0].data.length > 100) {
                    this.gridChartData.series[0].data.shift();
                    this.gridChartData.categories.shift();
                }

                this.$nextTick(() => {
                    this.$refs.storageChart && this.$refs.storageChart.refresh();
                });
                // this.gridOptions.series[0].data = this.gridChartData.series[0].data;
                // this.gridOptions.xAxis[0].data = this.gridChartData.categories;
                // this.$nextTick(() => {
                //     this.gridChartData = {
                //         categories: this.gridChartData.categories,
                //         series: [{
                //             name: '电网',
                //             data: this.gridChartData.series[0].data,
                //             type: 'column',
                //         }]
                //     }
                // })

            });
            // 获取箱子全部据 和 社区的光伏、储能、用电数据
            getSocketinstance().socket.on("box", (data) => {
                // 拿光伏未来社区的 光伏 和 储能 的数据
                var community = {
                    energy: { I: 0.0, U: 0.0, P: 0.0, Q: 0.0 },
                    storage: {
                        I: 0.0,
                        U: 0.0,
                        chargeP: 0.0,
                        dischargeP: 0.0,
                        chargeQ: 0.0,
                        dischargeQ: 0.0,
                        soc: 0,
                        surplus_storage: 0.0,
                        rated_storage: 0.0,
                        chargeI: 0.0,
                        dischargeI: 0.0,
                        chargeU: 0.0,
                        dischargeU: 0.0,
                    },
                };
                // 累加每个箱子的数据
                for (var i in data) {
                    if (i != 524) {
                        if (JSON.stringify(data[i].energy) != "{}") {
                            community.energy.I += data[i].energy.I;
                            community.energy.P += data[i].energy.P;
                            community.energy.Q += data[i].energy.Q;
                        }
                        if (
                            JSON.stringify(data[i].storage) != "{}" &&
                            i != 399 &&
                            i != 400 &&
                            i != 372
                        ) {
                            // community.storage.I += data[i].storage.I;
                            if (data[i].storage.chargeP > data[i].storage.dischargeP) {
                                // 计算全部箱子 充电时的I的和
                                community.storage.chargeI += data[i].storage.I;
                            } else if (
                                data[i].storage.chargeP < data[i].storage.dischargeP
                            ) {
                                // 计算全部箱子 放电时的I的和
                                community.storage.dischargeI += data[i].storage.I;
                            }
                            community.storage.chargeP += data[i].storage.chargeP;
                            community.storage.dischargeP += data[i].storage.dischargeP;
                            community.storage.chargeQ += data[i].storage.chargeQ;
                            community.storage.dischargeQ += data[i].storage.dischargeQ;
                            community.storage.surplus_storage +=
                                data[i].storage.soc * storage[i]; // 剩余储能
                            community.storage.rated_storage += storage[i]; // 额定储能
                        }
                    }
                }
                if (community.energy.P === 0) {
                    // P为0,则表示待机, 那么I和U就不需要计算,直接为0
                    community.energy.U = 0;
                    community.energy.I = 0;
                } else {
                    community.energy.U = community.energy.P / community.energy.I;
                }
                community.storage.soc = Math.round(
                    community.storage.surplus_storage / community.storage.rated_storage
                );
                if (community.storage.chargeP > community.storage.dischargeP) {
                    community.storage.chargeU =
                        community.storage.chargeP / community.storage.chargeI;
                    community.storage.I = community.storage.chargeI;
                    // community.storage.I = community.storage.chargeI - community.storage.dischargeI
                    community.storage.U = community.storage.chargeU;
                    // community.storage.chargeP = community.storage.chargeP - community.storage.dischargeP
                } else if (community.storage.chargeP < community.storage.dischargeP) {
                    community.storage.dischargeU =
                        community.storage.dischargeP / community.storage.dischargeI;
                    community.storage.I = community.storage.dischargeI;
                    // community.storage.I = community.storage.dischargeI - community.storage.chargeI
                    community.storage.U = community.storage.dischargeU;
                    // community.storage.dischargeP = community.storage.dischargeP - community.storage.chargeP
                }
                if (community.storage.I == 0) {
                    community.storage.U = 0;
                }
                this.selectedEnergyData = community.energy;
                this.selectedStorageData = community.storage;
                this.eleConsumption.P =
                    this.selectedEnergyData.P +
                    this.selectedGridData.P +
                    this.selectedStorageData.dischargeP -
                    this.selectedStorageData.chargeP;
                this.eleConsumption.Q = Math.abs(
                    this.selectedEnergyData.Q +
                    this.selectedGridData.forwardQ +
                    this.selectedStorageData.dischargeQ -
                    this.selectedGridData.reverseQ -
                    this.selectedStorageData.chargeQ
                ); // 计算用电量

                // 往发电实时的P曲线中添加数据
                // this.energyPArrayXaxis.push(
                //     new Date().getHours() +
                //     ":" +
                //     new Date().getMinutes() +
                //     ":" +
                //     new Date().getSeconds()
                // );

                this.provideChartData.categories.push(
                    new Date().getHours() +
                    ":" +
                    new Date().getMinutes() +
                    ":" +
                    new Date().getSeconds()
                );
                this.loadChartData.series[0].data.push(parseFloat(this.totalSolarData.power));
                if (this.loadChartData.series[0].data.length > 100) {
                    // this.energyPArrayYaxis.shift();
                    this.provideChartData.categories.shift();
                    this.provideChartData.series[0].data.shift();
                    // this.energyPArrayXaxis.shift();
                }

                // 往负荷实时的P曲线中添加数据
                // this.consumptionPArrayXaxis.push(
                //     new Date().getHours() +
                //     ":" +
                //     new Date().getMinutes() +
                //     ":" +
                //     new Date().getSeconds()
                // );
                this.loadChartData.categories.push(
                    new Date().getHours() +
                    ":" +
                    new Date().getMinutes() +
                    ":" +
                    new Date().getSeconds()
                );
                this.loadChartData.series[0].data.push(Math.round(this.eleConsumption.P) / 1000);
                if (this.loadChartData.series[0].data.length > 100) {
                    // this.loadChartData.series[0].data.shift();
                    // this.consumptionPArrayXaxis.shift();
                    this.loadChartData.categories.shift();
                    this.loadChartData.series[0].data.shift();
                }


            

                // this.provideOptions.series[0].data = this.energyPArrayYaxis;
                // this.provideOptions.xAxis[0].data = this.energyPArrayXaxis;


                // this.$nextTick(() => {
                //     this.provideChartData = {
                //         categories: this.energyPArrayXaxis,
                //         series: [{
                //             name: '光伏',
                //             data: this.energyPArrayYaxis,
                //             type: 'line',
                //         }]
                //     }
                //     this.loadChartData = {
                //         categories: this.consumptionPArrayXaxis,
                //         series: [{
                //             name: '用电',
                //             data: this.loadChartData.series[0].data,
                //             type: 'line',
                //         }]
                //     }
                // })



                // this.loadOptions.series[0].data = this.loadChartData.series[0].data;
                // this.loadOptions.xAxis[0].data = this.consumptionPArrayXaxis




            });
        },

        //柔性调控多联机实时数据
        getDljRealTimeData() {
            getSocketinstance().socket.emit("register")
            getSocketinstance().socket.on("box", (data) => {

            });
            getSocketinstance().socket2.on("nyzData", (jsonData) => {
                const {
                    deviceType,
                    address,
                    dataType,
                    data
                } = jsonData
                switch (deviceType) {
                    case "1707_V3_3":
                        if (address == "01" && dataType == "2") {
                            this.nyzData.pcsIntputPower = parseFloat(data.B46).toFixed(2)
                            this.nyzData.pcsOutputTotalPower = parseFloat(data.B20).toFixed(2)
                        }
                        break;
                    default:
                        break;
                }
            })
        }
    }

}
</script>

<style scoped>
.main-container {
    /* width: 100%;
    height: 100% */
}

.header {
    width: 100%;
    height: 4%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 1vh;
    border-bottom: 1px solid #cdddfe;
}

.header-item {
    font-size: 14px;
    padding: 0 16px;
}

.bl-1 {
    border-right: 1px solid #cdddfe;
}

.main {
    width: 100%;
    height: 95%;
    display: flex;
}

.ivu-btn {
    height: 3vh;
    color: #868e99;
    background: #e1e8f2;
}

.router-button {
    margin: auto;
    background-color: #e1e8f2;
}

.activated {
    color: #4488fb;
    background: #ffffff;
    border-bottom: 2px solid #4488fb;
}

.main-content {
    width: 80%;
    height: 100%;
    /* background: url("../static/images/power-efficiency.png") no-repeat center; */
      /* background-image: url("/static/images/power-efficiency.png") ; */
    background-size: 70%;
}

.provide-power {
    width: 5vw;
    height: 5vh;
    position: absolute;
    top: 18%;
    left: 26%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

.storage-power {
    width: 5vw;
    height: 5vh;
    position: absolute;
    top: 86.5%;
    left: 20%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

.light-power {
    width: 5vw;
    height: 5vh;
    position: absolute;
    top: 80%;
    left: 61.5%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

.duolianji1-power {
    width: 6vw;
    height: 5vh;
    position: absolute;
    top: 80%;
    left: 32%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

.duolianji2-power {
    width: 6vw;
    height: 5vh;
    position: absolute;
    top: 80%;
    left: 42%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

.grid-power {
    width: 5vw;
    height: 5vh;
    position: absolute;
    top: 88%;
    left: 12%;
    color: #4488fb;
    text-align: center;
    font-size: 0.1rem;
    font-weight: bold;
}

/* 方框数据 */
.box-data {
    width: 41vw;
    height: 13vh;
    position: absolute;
    top: 28%;
    left: 27%;
}

.mobile-layout {
    display: none;
}


.item-main-carbon-foot {
    width: 100%;
    height: 13vh;
    display: grid;
    grid-template-columns: 1fr repeat(5, 1fr);
    grid-template-rows: 1fr repeat(1, 1fr);
    justify-items: center;
    align-items: center;
    text-align: center;
    font-size: 1.5vh;
    color: #4488fb;
}

.num-cube {
    display: inline-block;
    vertical-align: middle;
    line-height: 3vh;
    width: 4vw;
    height: 3vh;
    background-color: #e1e8f2;
    border: 1px solid #4488fb;
}

.chart-content {
    width: 20%;
    height: 100%;
}


/* 移动端适配 */
@media screen and (max-width: 768px) {
    .main-container {
        /* min-height: 100vh; */
        padding: 0 8px;
        box-sizing: border-box;
    }

    .header {
        flex-direction: column;
        padding: 8px 0;
        height: auto;
        margin-bottom: 10px;
    }

    .header-item {
        width: 100%;
        padding: 0;
    }

    .header-item .router-button {
        width: 100%;
        display: flex;
        justify-content: center;
        background-color: transparent;
    }

    .header-item .router-button .ivu-btn {
        /* width: auto !important; */
        flex: 1;
        height: auto;
        font-size: 12px;
        margin-bottom: 6px;
        padding: 4px;
        text-wrap: wrap;
    }

    .main {
        flex-direction: column;
        height: auto;
    }

    .main-content {
        position: relative;
        width: 100%;
        height: 35vh;
        background-size: 96%;
        margin-bottom: 20px;
    }

    .chart-content {
        width: 100%;
        height: auto;
    }

    .provide-chart {
        margin-bottom: 15px;
    }

    /* 调整电力效能图上的文字和位置 */
    .provide-power,
    .storage-power,
    .light-power,
    .duolianji1-power,
    .duolianji2-power,
    .grid-power {
        width: 80px;
        font-size: 12px;
    }

    .provide-power {
        top: 16%;
        left: 21%;
    }

    .storage-power {
        top: 87%;
        left: 8.5%;
    }

    .light-power {
        top: 82%;
        left: 79.5%;
    }

    .duolianji1-power {
        top: 82%;
        left: 29.5%;
    }

    .duolianji2-power {
        top: 82%;
        left: 48%;
    }

    .grid-power {
        top: 87%;
        left: -6%;
    }

    /* 调整设备名称位置 */
    .dljName,
    .chargingPileName,
    .lightName {
        font-size: 12px !important;
    }

    .dljName {
        top: 83% !important;
        left: 40% !important;
    }

    .chargingPileName {
        top: 83% !important;
        left: 64% !important;
    }

    .lightName[style*="top: 85%"] {
        top: 83% !important;
        left: 90% !important;
    }

    /* 调整损耗值标签 */
    .lightName[style*="top: 26%"] {
        font-size: 10px !important;
    }

    /* 调整方框数据 */
    .box-data {
        width: 90%;
        height: auto;
        top: 30%;
        left: 5%;
    }

    .item-main-carbon-foot {
        grid-template-columns: 1fr repeat(2, 1fr);
        grid-template-rows: repeat(3, auto);
        gap: 5px;
        font-size: 12px;
    }

    .desktop-layout {
        display: none;
    }

    .mobile-layout {
        display: block;
        width: 100%;
    }

    .mobile-header,
    .mobile-row {
        display: grid;
        grid-template-columns: 0.7fr 1fr 1fr;
        gap: 5px;
        margin-bottom: 5px;
        align-items: center;
        text-align: center;
    }

    .mobile-header {
        font-weight: bold;
        color: #000000;
        margin-bottom: 10px;
    }

    .loss-name {
        color: #000000;
        font-size: 12px;
    }

    .loss-title,
    .loss-type {
        font-size: 12px;
    }

    .mobile-layout .num-cube {
        width: 100%;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
    }

    /* 调整图表区域 */
    .provide-chart {
        height: 200px !important;
    }

    .provide-chart>div:first-child {
        font-size: 14px !important;
    }
}
</style>