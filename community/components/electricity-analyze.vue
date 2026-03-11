<template>
    <view style="background-color: #fff;">
        <!-- 顶部标签栏和日期选择器 -->
        <view class="chart-tab-bar">
            <view class="chart-tabs">
                <view v-for="(tab, i) in ['日', '月', '年']" :key="i" class="chart-tab-item"
                    :class="{ 'chart-tab-active': activeChartTab === tab }" @click="handleDateTypeChange(tab)">
                    {{ tab }}
                </view>
            </view>

            <!-- 简化日期选择器组件，动态绑定timeType -->
            <dy-date :timeType="['day', 'month', 'year'][timeTypeIndex]" @getData="handleDatePicker"
                v-model="selectedDate" class="date-picker" />
        </view>

        <view class="divider-line"></view>

        <!-- 单位面积用电 -->
        <view class="unit-electric card">
            <text class="unit-label">单位面积用电</text>
            <text class="unit-value">{{ unitElectricValue || '--' }} kWh</text>
        </view>

        <view class="divider-line"></view>

        <!-- 分类用电（环形图） -->
        <view class="card">
            <view class="card-title">分类用电</view>
            <view class="card-content" style="height:250rpx">
                <!-- 有数据时显示图表 -->
                <qiun-data-charts v-if="pieData.series.length > 0" type="ring" :chartData="pieData" :opts="pieOps"
                    :canvas2d="canvas2d" canvasId="classifyChart" />

                <!-- 无数据时显示占位UI -->
                <view v-else class="empty-chart">
                    <uni-icons type="empty" size="40" class="empty-icon" />
                    <text class="empty-text">暂无分类用电数据</text>
                </view>
            </view>
        </view>

        <view class="divider-line"></view>

        <!-- 用电TOP10 -->
        <view class="ranking-container">
            <text class="section-title">用电TOP10</text>

            <!-- 有数据时显示列表 -->
            <scroll-view v-if="areaRankList.length > 0" class="ranking-list" scroll-y
                :style="{ height: listHeight + 'px' }">
                <view v-for="(item, index) in areaRankList.slice(0, 10)" :key="index" class="ranking-item">
                    <view class="rank-header">
                        <view class="rank-tag" :class="['rank-tag-' + (index + 1)]">
                            <text class="rank-number">{{ index + 1 }}</text>
                        </view>
                        <text class="area-name">{{ item.area }}</text>
                    </view>

                    <view class="progress-container">
                        <view class="progress-bar">
                            <view class="progress-fill" :class="['progress-fill-' + (index + 1)]"
                                :style="{ width: `${(item.value / safeMaxConsumption) * 100}%` }" />
                        </view>
                        <text class="consumption-value">
                            {{ item.value }} kWh
                        </text>
                    </view>
                </view>
            </scroll-view>

            <!-- 无数据时显示占位UI -->
            <view v-else class="empty-list">
                <uni-icons type="list" size="40" class="empty-icon" />
                <text class="empty-text">暂无用电排名数据</text>
            </view>
        </view>

        <view class="divider-line"></view>

        <!-- 区域用电情况（柱状图） -->
        <view class="card">
            <view style="display: flex;align-items: center;justify-content: space-between;">
                <view class="card-title">区域用电情况</view>
                <view class="selector">
                    <uni-data-select v-model="selectArea" :localdata="areaList" :map="{ text: 'name', value: '_id' }"
                        style="width: 200px;" @change="onAreaChange" />
                </view>
            </view>

            <view class="card-content">


                <!-- 有数据时显示图表 -->
                <view v-if="stackData.series.length > 0">
                    <qiun-data-charts type="column" :chartData="stackData" :opts="lineOps" :canvas2d="canvas2d"
                        canvasId="areaChart" />
                </view>

                <!-- 无数据时显示占位UI -->
                <view v-else class="empty-chart">
                    <uni-icons type="chart" size="40" class="empty-icon" />
                    <text class="empty-text">暂无区域用电数据</text>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import sapi from '@/store/sapi'
import dyDate from '@/components/dy-Date/dy-Date.vue';

export default {
    components: { dyDate },
    name: 'electricity-analyze',
    data() {
        return {
            // 标签与日期相关
            activeChartTab: '日',
            timeTypeIndex: 0, // 0:日 1:月 2:年（统一日期类型索引）
            selectedDate: new Date().toISOString().split('T')[0],
            selectDateType: 'date', // 日期类型：date/month/year

            // 图表配置
            canvas2d: this.$Config.ISCANVAS2D,
            tagBg: ['#F9B228', '#C0C0C0', '#E67E22', '#999', '#666'],

            // 环形图（分类用电）配置
            pieOps: {
                rotate: false,
                rotateLock: false,
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [5, 5, 5, 5],
                dataLabel: false,
                enableScroll: false,
                legend: {
                    show: true,
                    position: "right",
                    lineHeight: 25
                },
                title: { name: "", fontSize: 15, color: "#666666" },
                subtitle: { name: "", fontSize: 25, color: "#7cb5ec" },
                extra: {
                    ring: {
                        ringWidth: 20,
                        activeOpacity: 0.5,
                        activeRadius: 10,
                        offsetAngle: 0,
                        labelWidth: 15,
                        border: false,
                        borderWidth: 3,
                        borderColor: "#FFFFFF"
                    }
                }
            },
            pieData: { series: [{ data: [] }] },

            // 柱状图（区域用电）配置
            lineOps: {
                color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
                padding: [15, 15, 0, 5],
                enableScroll: false,
                dataLabel: false,
                legend: {},
                xAxis: { disableGrid: true, labelCount: 6, scrollShow: false },
                yAxis: { data: [{ min: 0 }] },
                extra: {
                    column: {
                        type: "stack",
                        width: 5,
                        activeBgColor: "#000000",
                        activeBgOpacity: 0.08,
                        labelPosition: "center"
                    }
                }
            },

            // 数据存储
            unitElectricValue: '--',
            areaRankList: [],
            maxConsumption: 0,
            stackData: { categories: [], series: [] },
            columnData: { categories: [], series: [{ data: [] }] },

            // 区域选择相关
            areaList: [
                { _id: 0, name: '#8 号集装箱' },
                { _id: 1, name: '#9 号集装箱' },
                { _id: 2, name: '#10 号集装箱' },
                { _id: 3, name: '#11 号集装箱' },
            ],
            selectArea: 0,
            areaLoading: false
        }
    },
    props: {
        selectDate: {
            type: Date | String,
            default: () => new Date()
        }
    },
    computed: {
        // 获取根区域ID
        origin() {
            return this.$store.state.centerList.filter(item => item.level === 0)[0]?.origin || [];
        },
        // 安全的最大用电量（避免除以0）
        safeMaxConsumption() {
            return Math.max(this.maxConsumption, 1);
        },
        // 列表高度（根据内容动态计算）
        listHeight() {
            return Math.min(this.areaRankList.length * 120, 500);
        }
    },
    mounted() {
        // 初始化数据
        this.initData();
    },
    methods: {
        // 初始化所有数据
        initData() {
            this.getUnitOptions();
            this.getClassifyOptions();
            this.initAreaList();
            this.getAreaOptions();
        },

        // 切换日/月/年标签
        handleDateTypeChange(tab) {
            const tabMap = { '日': 0, '月': 1, '年': 2 };
            this.activeChartTab = tab;
            this.timeTypeIndex = tabMap[tab];

            // 更新默认日期
            const now = new Date();
            this.selectedDate = [
                now.toISOString().split('T')[0], // 日
                `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`, // 月
                `${now.getFullYear()}` // 年
            ][this.timeTypeIndex];

            this.handleDatePicker(this.selectedDate);
        },

        // 日期选择器回调
        handleDatePicker(value) {
            this.selectedDate = value;
            this.selectDateType = ['date', 'month', 'year'][this.timeTypeIndex];
            this.initData();
        },

        // 获取单位面积用电和分区用电排名
        getUnitOptions() {
            // 配置不同日期类型对应的接口和参数
            const apiConfig = {
                date: {
                    api: sapi.findSubareaConsumptionByDay,
                    params: { day: this.selectedDate }
                },
                month: {
                    api: sapi.findSubareaConsumptionByMonth,
                    params: { month: this.selectedDate }
                },
                year: {
                    api: sapi.findSubareaConsumptionByYear,
                    params: { year: this.selectedDate }
                }
            };

            const { api, params } = apiConfig[this.selectDateType];
            api(params).then(result => {
                if (!result.data) return;

                // 计算单位面积用电
                const { consume, area } = result.data.reduce((pre, curr) => ({
                    consume: pre.consume + curr.totalConsumeElectricityQ,
                    area: pre.area + curr.totalArea
                }), { consume: 0, area: 0 });
                this.unitElectricValue = area ? (consume / area).toFixed(2) : '--';

                // 处理分区用电排名
                const sortedData = [...result.data].sort((a, b) => b.totalConsumeElectricityQ - a.totalConsumeElectricityQ);
                this.areaRankList = sortedData.map(item => ({
                    area: item.areaLevelName,
                    value: item.totalConsumeElectricityQ.toFixed(2)
                }));

                // 更新最大用电量
                this.maxConsumption = Math.max(...this.areaRankList.map(item => item.value), 1);
            });
        },

        // 获取分类用电数据（环形图）
        getClassifyOptions() {
            // 接口参数配置
            const paramsMap = {
                date: { areaLevelIds: this.origin, day: this.selectedDate },
                month: {
                    areaLevelIds: this.origin,
                    year: this.selectedDate.split('-')[0],
                    month: this.selectedDate.split('-')[1]
                },
                year: { areaLevelIds: this.origin, year: this.selectedDate }
            };

            // 接口映射
            const apiMap = {
                date: sapi.findDeviceCategoryConsumptionByDay,
                month: sapi.findDeviceCategoryConsumptionByMonth,
                year: sapi.findDeviceCategoryConsumptionByYear
            };

            apiMap[this.selectDateType](paramsMap[this.selectDateType]).then(result => {
                if (!result.data) {
                    this.pieData = { series: [] };
                    return;
                }

                // 提取分类用电数据
                const { homeCommunityTotalConsumeElectricityQ: total,
                    airConditioningTotalConsumeElectricityQ: air,
                    lightTotalConsumeElectricityQ: light,
                    computerTotalConsumeElectricityQ: computer
                } = result.data;

                const others = Math.abs(total - air - light - computer);
                this.pieData = {
                    series: [{
                        data: [
                            { name: '空调', value: air },
                            { name: '其他', value: others }
                        ]
                    }]
                };
            });
        },

        // 初始化区域列表
        initAreaList() {
            this.areaList = this.$store.state.centerList
                .filter(item => item.level === 2 && !['399', '400'].includes(item.origin[0]))
                .sort((a, b) => a.origin[0] - b.origin[0])
                .map(item => ({ ...item, value: item._id, text: item.name }));

            this.selectArea = this.areaList[0]?._id || 0;
        },

        // 获取区域用电情况（柱状图）
        getAreaOptions() {
            this.areaLoading = true;
            const areaId = this.areaList.find(item => item._id === this.selectArea)?.origin || [];

            // 接口配置
            const apiConfig = {
                date: {
                    api: sapi.findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay,
                    params: { areaLevelIds: areaId, date: this.selectedDate }
                },
                month: {
                    api: sapi.findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth,
                    params: { areaLevelIds: areaId, year: this.selectedDate.split('-')[0], month: this.selectedDate.split('-')[1] }
                },
                year: {
                    api: sapi.findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear,
                    params: { areaLevelIds: areaId, year: this.selectedDate }
                }
            };

            const { api, params } = apiConfig[this.selectDateType];
            api(params).then(result => {
                this.stackData = { categories: [], series: [] };
                if (!result.data?.length) return;

                // 处理x轴标签
                const xAxis = this.getXAxisLabels();

                // 处理用电数据
                const { airConditioner, others } = this.processAreaChartData(result.data[0], xAxis);

                // 组装图表数据
                this.stackData = {
                    categories: xAxis.map(item => this.formatXLabel(item)),
                    series: [
                        { name: '空调', type: 'bar', stack: 'total', data: airConditioner },
                        { name: '其他', type: 'bar', stack: 'total', data: others }
                    ]
                };
            }).finally(() => {
                this.areaLoading = false;
            });
        },

        // 生成x轴标签
        getXAxisLabels() {
            switch (this.selectDateType) {
                case 'date': return Array.from({ length: 24 }, (_, i) => `${i}:00`);
                case 'month': {
                    const days = new Date(this.selectedDate.split('-')[0], this.selectedDate.split('-')[1], 0).getDate();
                    return Array.from({ length: days }, (_, i) => `${i + 1}日`);
                }
                case 'year': return Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
            }
        },

        // 格式化x轴标签
        formatXLabel(label) {
            switch (this.selectDateType) {
                case 'date': return `${label.split(':')[0]}时`;
                default: return label;
            }
        },

        // 处理区域用电数据
        processAreaChartData(data, xAxis) {
            return xAxis.reduce((pre, curr) => {
                const item = data.find(e => e.formatDate === curr);
                if (item?.areaLevelDeviceConsumeElectricityModelList) {
                    pre.airConditioner.push(item.areaLevelDeviceConsumeElectricityModelList[0]?.consumeElectricityQ || 0);
                    pre.others.push(Math.abs(item.areaLevelDeviceConsumeElectricityModelList[3]?.consumeElectricityQ || 0));
                } else {
                    pre.airConditioner.push(0);
                    pre.others.push(0);
                }
                return pre;
            }, { airConditioner: [], others: [] });
        },

        // 切换区域
        onAreaChange(id) {
            this.selectArea = id;
            this.getAreaOptions();
        }
    }
}
</script>

<style lang="scss" scoped>
/* 基础颜色定义 */
:root {
    --primary-color: #1890ff;
    --primary-light: #e6f7ff;
    --secondary-color: #36cbcb;
    --success-color: #52c41a;
    --warning-color: #faad14;
    --danger-color: #ff4d4f;
    --info-color: #64b5f6;
    --text-color: #333333;
    --text-secondary: #666666;
    --text-light: #999999;
    --bg-color: #f5f7fa;
    --card-bg: #ffffff;
    --border-color: #e8e8e8;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    --radius: 8px;
}

.date-picker {
    border: unset;
    padding:unset;
}

.chart-tab-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 10rpx;
    padding: 10rpx;
    background: #fff;
}


.chart-tabs {
    display: flex;
}

.chart-tab-item {
    padding: 12rpx 32rpx;
    margin: 0 2rpx;
    border: 1px solid #4488FB;
    color: #666;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    width: 120rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-tab-item.active {
    background: linear-gradient(135deg, #4488fb 0%, #6ca2ff 100%);
    color: #fff !important;
    box-shadow: 0 4rpx 12rpx rgba(68, 136, 251, 0.3);
}

.unit-electric {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.unit-label {
    font-size: 32rpx;
}

.unit-value {
    font-size: 32rpx;
    color: #1296db;
}



/* 卡片样式 */
// .card {
//     padding: 0 30rpx;

// }

.card-title {
    font-size: 32rpx;
    position: relative;
}

.divider-line {
    height: 1px;
    background-color: #e4e7ed;
    margin: 32rpx 0;
    width: 100%;
}



.ranking-container {
    padding: 20rpx;
    background: #ffffff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;

}

.section-title {
    font-size: 32rpx;
    color: #606266;
    margin-bottom: 32rpx;
}

.ranking-list {
    height: 50vh;
    max-height: 500rpx;
}

.ranking-item {
    padding: 16rpx;
    border-bottom: 1rpx solid #ebeef5;
    display: flex;
    justify-content: space-between;
}

.rank-header {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.rank-tag {
    width: 40rpx;
    height: 40rpx;
    border-radius: 6rpx;
    margin-right: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rank-number {
    font-size: 24rpx;
    line-height: 40rpx;
}

.area-name {
    font-size: 26rpx;
    color: #303133;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.progress-container {
    display: flex;
    align-items: center;
}

.progress-bar {
    flex: 1;
    height: 8rpx;
    background: #ebeef5;
    border-radius: 4rpx;
    margin-right: 16rpx;
}

.progress-fill {
    height: 100%;
    border-radius: 4rpx;
    opacity: 0.3;
}

.consumption-value {
    font-size: 24rpx;
    color: #909399;
    min-width: 140rpx;
    text-align: right;
}

.card-content {
    /* height:250rpx */
}



/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .card {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
    }

    .card-title {
        background: linear-gradient(135deg, #00ffaa, #00bcd4);
        -webkit-background-clip: text;
    }
}

/* 无数据状态通用样式 */
.empty-chart,
.empty-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.empty-icon {
    color: #ccc;
    margin-bottom: 16rpx;
}

.empty-text {
    color: #999;
    font-size: 28rpx;
}

/* 排名标签样式 */
.rank-tag-1 {
    background-color: #FF4D4F;
}

.rank-tag-2 {
    background-color: #FAAD14;
}

.rank-tag-3 {
    background-color: #13C2C2;
}

.rank-tag-4,
.rank-tag-5,
.rank-tag-6,
.rank-tag-7,
.rank-tag-8,
.rank-tag-9,
.rank-tag-10 {
    background-color: #4488FB;
}

/* 进度条颜色 */
.progress-fill-1 {
    background-color: #FF4D4F;
}

.progress-fill-2 {
    background-color: #FAAD14;
}

.progress-fill-3 {
    background-color: #13C2C2;
}

.progress-fill-4,
.progress-fill-5,
.progress-fill-6,
.progress-fill-7,
.progress-fill-8,
.progress-fill-9,
.progress-fill-10 {
    background-color: #4488FB;
}

/* 标签栏样式 */
.chart-tab-item {
    padding: 8rpx 24rpx;
    border: 1px solid #4488FB;
    border-radius: 6rpx;
    // margin: 0 8rpx;
}

.chart-tab-active {
    background-color: #4488FB;
    color: white;
}

.card {
    padding: 0 24rpx;
    background-color: white;
}

.selector{
    width:100px;
    min-width: fit-content;
}
</style>