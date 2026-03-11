<template>
    <view class="charging-container">
        <!-- 顶部导航栏 -->
       

        <!-- 搜索和筛选 -->
        <view class="search-filter" style="display:flex;align-items:center;justify-content: space-between;">
            <view class="search-box">
                <uni-icons type="search" size="24" color="#999"></uni-icons>
                <input type="text" placeholder="搜索充电桩名称/编号" v-model="searchKeyword" @confirm="searchPiles" />
            </view>
            <view class="nav-actions">
                <button class="refresh-btn" @click="refreshData" hover-class="btn-hover">
                    <uni-icons type="refresh" size="24" color="#333"></uni-icons>
                </button>
            </view>

            <!-- <view class="filter-options">
                <picker :range="statusOptions" @change="filterByStatus">
                    <view class="filter-btn">
                        <text>{{ statusFilter === '' ? '全部状态' : statusFilter === 'active' ? '运行中' : '空闲' }}</text>
                        <uni-icons type="arrowdown" size="20" color="#666"></uni-icons>
                    </view>
                </picker>

                <picker :range="powerOptions" @change="filterByPower">
                    <view class="filter-btn">
                        <text>{{ powerFilter === '' ? '全部功率' : powerFilter + 'kW' }}</text>
                        <uni-icons type="arrowdown" size="20" color="#666"></uni-icons>
                    </view>
                </picker>

               
            </view> -->
        </view>

        <!-- 顶部统计卡片 -->
        <view class="stats-cards">
            <view class="stat-card" v-for="(item, index) in stats" :key="index" @click="statCardClick(item)">
                <view class="stat-icon" :class="item.iconClass">
                    <uni-icons :type="item.icon" size="36" color="#FFF"></uni-icons>
                </view>
                <view class="stat-content">
                    <text class="stat-value">{{ item.value }}</text>
                    <text class="stat-label">{{ item.label }}</text>
                    <text class="stat-trend" :class="item.trend >= 0 ? 'up' : 'down'">
                        {{ item.trend >= 0 ? '↑' : '↓' }}{{ Math.abs(item.trend) }}%
                    </text>
                </view>
            </view>
        </view>

        <!-- 使用统计图表 -->
        <view class="usage-chart">
            <view class="chart-header">
                <text class="chart-title">充电量统计</text>
                <picker :range="chartTimeOptions" @change="changeChartTime">
                    <view class="time-filter">
                        <text>{{ chartTimeFilter }}</text>
                        <uni-icons type="arrowdown" size="18" color="#666"></uni-icons>
                    </view>
                </picker>
            </view>
            <qiun-data-charts type="column" :chartData="chartData" :opts="chartOptions" canvasId="chargeChart"
                :canvas2d="canvas2d" />
        </view>

        <!-- 充电桩列表 -->
        <scroll-view scroll-y class="pile-list" :scroll-with-animation="true">
            <view class="pile-item" v-for="(pile, index) in filteredPileList" :key="pile.id"
                @click="navigateToDetail(pile)"
                :hover-class="pile.status === 'active' ? 'pile-hover-active' : 'pile-hover-idle'">
                <view class="pile-header">
                    <text class="pile-name">{{ pile.name }}</text>
                    <view class="status-badge" :class="pile.status">
                        {{ pile.status === 'active' ? '运行中' : '空闲' }}
                    </view>
                </view>

                <view class="pile-details">
                    <view class="detail-row">
                        <view class="detail-item">
                            <uni-icons type="bolt" size="16" color="#666"></uni-icons>
                            <text>功率: {{ pile.power }}kW</text>
                        </view>
                        <view class="detail-item">
                            <uni-icons type="time" size="16" color="#666"></uni-icons>
                            <text>今日使用: {{ pile.todayUsage }}小时</text>
                        </view>
                    </view>
                    <view class="detail-row">
                        <view class="detail-item">
                            <uni-icons type="battery" size="16" color="#666"></uni-icons>
                            <text>今日电量: {{ pile.todayEnergy }}kWh</text>
                        </view>
                        <view class="detail-item">
                            <uni-icons type="moneybag" size="16" color="#666"></uni-icons>
                            <text>今日收入: ¥{{ pile.todayIncome }}</text>
                        </view>
                    </view>
                </view>

                <view class="progress-container">
                    <text class="progress-label">今日使用率: {{ pile.usageRate }}%</text>
                    <progress :percent="pile.usageRate" :activeColor="getProgressColor(pile.usageRate)" />
                    <!-- </progress-container> -->
                </view>

                <view class="pile-footer">
                    <text class="last-update">最后更新: {{ pile.lastUpdate }}</text>
                    <button class="quick-action" :class="pile.status === 'active' ? 'stop-btn' : 'start-btn'"
                        @click.stop="togglePileStatus(pile)" hover-class="action-btn-hover">
                        {{ pile.status === 'active' ? '停止' : '启动' }}
                    </button>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="filteredPileList.length === 0">
                <uni-icons type="search" size="80" color="#CCCCCC"></uni-icons>
                <text class="empty-text">没有找到匹配的充电桩</text>
                <button class="reset-filter-btn" @click="resetFilters" hover-class="btn-hover">
                    重置筛选条件
                </button>
            </view>
        </scroll-view>

        <!-- 底部操作按钮 -->


        <!-- 添加充电桩弹窗 -->
        <view class="dialog-mask" v-if="showAddModal" @click="closeAddDialog">
            <view class="add-dialog" @click.stop>
                <view class="dialog-header">
                    <text class="dialog-title">添加充电桩</text>
                    <button class="close-btn" @click="closeAddDialog" hover-class="btn-hover">
                        <uni-icons type="close" size="24" color="#999"></uni-icons>
                    </button>
                </view>

                <view class="dialog-content">
                    <view class="form-item">
                        <text class="form-label">充电桩名称</text>
                        <input type="text" v-model="newPile.name" placeholder="请输入充电桩名称" />
                    </view>

                    <view class="form-item">
                        <text class="form-label">充电桩编号</text>
                        <input type="text" v-model="newPile.code" placeholder="请输入充电桩编号" />
                    </view>

                    <view class="form-item">
                        <text class="form-label">充电桩功率(kW)</text>
                        <picker :range="powerOptions" @change="setNewPilePower">
                            <view class="picker-view">
                                {{ newPile.power || '请选择功率' }}
                                <uni-icons type="arrowdown" size="18" color="#666"></uni-icons>
                            </view>
                        </picker>
                    </view>

                    <view class="form-item">
                        <text class="form-label">安装位置</text>
                        <input type="text" v-model="newPile.location" placeholder="请输入安装位置" />
                    </view>
                </view>

                <view class="dialog-footer">
                    <button class="cancel-btn" @click="closeAddDialog" hover-class="btn-hover">取消</button>
                    <button class="confirm-btn" @click="addNewPile" hover-class="btn-hover">确认添加</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            canvas2d: this.$Config.ISCANVAS2D,
            searchKeyword: '',
            statusFilter: '',
            powerFilter: '',
            chartTimeFilter: '本周',
            showAddModal: false,
            chartData: {},
            chartOptions: {
                padding: [15, 15, 0, 15],
                enableScroll: false,
                legend: { show: false },
                xAxis: {
                    disableGrid: true,
                    axisLine: false
                },
                yAxis: {
                    gridType: "dash",
                    dashLength: 2,
                    splitNumber: 4
                },
                extra: {
                    column: {
                        type: "group",
                        width: 30,
                        activeBgColor: "#07C160",
                        activeBgOpacity: 0.8,
                        categoryGap: 10
                    }
                }
            },
            newPile: {
                name: '',
                code: '',
                power: '',
                location: ''
            },
            stats: [
                { value: '24', label: '总充电桩数', icon: 'app', iconClass: 'bg-blue', trend: 12 },
                { value: '16', label: '运行中', icon: 'bulb', iconClass: 'bg-green', trend: 5 },
                { value: '3250', label: '今日充电量(kWh)', icon: 'battery', iconClass: 'bg-orange', trend: 8 },
                { value: '¥1625', label: '今日收入', icon: 'moneybag', iconClass: 'bg-red', trend: 15 }
            ],
            statusOptions: ['全部状态', '运行中', '空闲'],
            powerOptions: ['全部功率', '7.5', '15', '30', '60', '120'],
            chartTimeOptions: ['本周', '本月', '本季度', '本年度'],
            pileList: [
                {
                    id: 1,
                    name: 'A区-01号充电桩',
                    code: 'A01',
                    status: 'active',
                    power: 7.5,
                    location: 'A区停车场1楼',
                    todayUsage: 6.8,
                    todayEnergy: 51,
                    todayIncome: 255,
                    usageRate: 75,
                    lastUpdate: '10:25:30'
                },
                {
                    id: 2,
                    name: 'A区-02号充电桩',
                    code: 'A02',
                    status: 'idle',
                    power: 7.5,
                    location: 'A区停车场1楼',
                    todayUsage: 2.3,
                    todayEnergy: 17.25,
                    todayIncome: 86.25,
                    usageRate: 25,
                    lastUpdate: '09:40:15'
                },
                {
                    id: 3,
                    name: 'B区-01号充电桩',
                    code: 'B01',
                    status: 'active',
                    power: 15,
                    location: 'B区停车场2楼',
                    todayUsage: 4.5,
                    todayEnergy: 67.5,
                    usageRate: 60,
                    todayIncome: 337.5,
                    lastUpdate: '10:15:45'
                },
                {
                    id: 4,
                    name: 'B区-02号充电桩',
                    code: 'B02',
                    status: 'active',
                    power: 15,
                    location: 'B区停车场2楼',
                    todayUsage: 5.2,
                    todayEnergy: 78,
                    todayIncome: 390,
                    usageRate: 70,
                    lastUpdate: '10:05:20'
                },
                {
                    id: 5,
                    name: 'C区-01号快充桩',
                    code: 'C01',
                    status: 'idle',
                    power: 60,
                    location: 'C区快速充电区',
                    todayUsage: 3.8,
                    todayEnergy: 228,
                    todayIncome: 456,
                    usageRate: 40,
                    lastUpdate: '08:30:10'
                }
            ]
        }
    },
    computed: {
        filteredPileList() {
            return this.pileList.filter(pile => {
                const nameMatch = pile.name.includes(this.searchKeyword) || pile.code.includes(this.searchKeyword);
                const statusMatch = this.statusFilter === '' ||
                    (this.statusFilter === 'active' && pile.status === 'active') ||
                    (this.statusFilter === 'idle' && pile.status === 'idle');
                const powerMatch = this.powerFilter === '' || pile.power.toString() === this.powerFilter;

                return nameMatch && statusMatch && powerMatch;
            });
        }
    },
    onReady() {
        this.initChart();
    },
    methods: {
        // 统计卡片点击事件
        statCardClick(item) {
            if (item.label === '运行中') {
                this.statusFilter = 'active';
            } else if (item.label === '总充电桩数') {
                this.resetFilters();
            }
        },

        // 搜索充电桩
        searchPiles() {
            // 搜索逻辑已在计算属性中实现
        },

        // 筛选状态
        filterByStatus(e) {
            const index = e.detail.value;
            if (index === 0) {
                this.statusFilter = '';
            } else if (index === 1) {
                this.statusFilter = 'active';
            } else {
                this.statusFilter = 'idle';
            }
        },

        // 筛选功率
        filterByPower(e) {
            const index = e.detail.value;
            this.powerFilter = index === 0 ? '' : this.powerOptions[index];
        },

        // 显示地图
        showMap() {
            uni.navigateTo({
                url: '/community/charging-map'
            });
        },

        // 刷新数据
        refreshData() {
            uni.showLoading({
                title: '刷新中...'
            });

            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '刷新成功',
                    icon: 'success'
                });
            }, 800);
        },

        // 打开设置
        openSettings() {
            uni.navigateTo({
                url: '/community/settings'
            });
        },

        // 切换图表时间范围
        changeChartTime(e) {
            this.chartTimeFilter = this.chartTimeOptions[e.detail.value];
            this.updateChart();
        },

        // 初始化图表
        initChart() {
            this.updateChart();
        },

        // 更新图表
        updateChart() {
            const categories = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            const series = [{
                name: '充电量',
                data: [420, 380, 520, 480, 620, 750, 820]
            }];

            this.chartData = {
                categories: categories,
                series: series
            };
        },

        // 获取进度条颜色
        getProgressColor(rate) {
            if (rate < 30) return '#07C160';
            if (rate < 70) return '#FF9800';
            return '#F56C6C';
        },

        // 导航到详情页
        navigateToDetail(pile) {
            uni.navigateTo({
                url: `/community/charging-detail?id=${pile.id}`
            });
        },

        // 切换充电桩状态
        togglePileStatus(pile) {
            uni.showModal({
                title: `确认${pile.status === 'active' ? '停止' : '启动'}`,
                content: `是否${pile.status === 'active' ? '停止' : '启动'}${pile.name}充电桩？`,
                success: (res) => {
                    if (res.confirm) {
                        pile.status = pile.status === 'active' ? 'idle' : 'active';
                        uni.showToast({
                            title: `${pile.status === 'active' ? '启动' : '停止'}成功`,
                            icon: 'success'
                        });
                    }
                }
            });
        },

        // 显示添加弹窗
        showAddDialog() {
            this.showAddModal = true;
        },

        // 关闭添加弹窗
        closeAddDialog() {
            this.showAddModal = false;
            this.resetNewPileForm();
        },

        // 设置新充电桩功率
        setNewPilePower(e) {
            const index = e.detail.value;
            this.newPile.power = index === 0 ? '' : this.powerOptions[index];
        },

        // 添加新充电桩
        addNewPile() {
            if (!this.newPile.name || !this.newPile.code || !this.newPile.power || !this.newPile.location) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none'
                });
                return;
            }

            const newId = Math.max(...this.pileList.map(p => p.id)) + 1;
            const newPileData = {
                id: newId,
                name: this.newPile.name,
                code: this.newPile.code,
                status: 'idle',
                power: parseFloat(this.newPile.power),
                location: this.newPile.location,
                todayUsage: 0,
                todayEnergy: 0,
                todayIncome: 0,
                usageRate: 0,
                lastUpdate: '刚刚'
            };

            this.pileList.unshift(newPileData);
            this.showAddModal = false;
            this.resetNewPileForm();

            // 更新统计数据
            this.stats[0].value = (parseInt(this.stats[0].value) + 1).toString();

            uni.showToast({
                title: '添加成功',
                icon: 'success'
            });
        },

        // 重置新充电桩表单
        resetNewPileForm() {
            this.newPile = {
                name: '',
                code: '',
                power: '',
                location: ''
            };
        },

        // 重置筛选条件
        resetFilters() {
            this.searchKeyword = '';
            this.statusFilter = '';
            this.powerFilter = '';
        }
    }
}
</script>

<style lang="scss" scoped>
// 颜色变量
$primary-color: #07C160;
$primary-dark: #06A850;
$secondary-color: #1989FA;
$secondary-dark: #0E75D4;
$warning-color: #FF9800;
$warning-dark: #E68A00;
$danger-color: #F56C6C;
$danger-dark: #E05A5A;
$text-color: #333;
$text-secondary-color: #666;
$text-tertiary-color: #999;
$bg-color: #F5F7FA;
$card-bg: #FFF;
$border-color: #EEEEEE;

// 尺寸变量
$nav-height: 100rpx;
$search-height: 88rpx;
$stat-card-height: 200rpx;
$touch-area-min: 80rpx;

.charging-container {
    padding: 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: $bg-color;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}

// 导航栏样式
.nav-bar {
    height: $nav-height;
    background-color: $card-bg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    box-shadow: 0 2rpx 15rpx rgba(0, 0, 0, 0.08);
    position: relative;
    z-index: 10;

    .nav-title {
        font-size: 36rpx;
        font-weight: bold;
        color: $text-color;
    }

    .nav-actions {
        display: flex;
        gap: 40rpx;
    }

 
}

   .refresh-btn,
    .settings-btn {
        width: $touch-area-min;
        height: $touch-area-min;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        padding: 0;
    }

// 搜索和筛选样式
.search-filter {
    padding: 20rpx 10rpx;

    .search-box {
        height: 72rpx;
        background-color: #F0F2F5;
        border-radius: 100rpx;
        display: flex;
        align-items: center;
        padding: 0 24rpx;
        box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.03) inset;

        input {
            flex: 1;
            margin-left: 12rpx;
            font-size: 28rpx;
            color: $text-color;
            height: 100%;
        }
    }

    .filter-options {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;
        gap: 15rpx;

        .filter-btn {
            flex: 1;
            min-width: 160rpx;
            height: $touch-area-min;
            background-color: $card-bg;
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            color: $text-secondary-color;
            border: 1rpx solid $border-color;
            box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.03);
        }

        .map-btn {
            width: $touch-area-min;
            height: $touch-area-min;
            background-color: rgba($primary-color, 0.1);
            color: $primary-color;
            border-radius: 10rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            padding: 0;

            uni-icons {
                margin-right: 8rpx;
            }
        }
    }
}

// 统计卡片样式
.stats-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10rpx;
    // margin-bottom: 20rpx;

    .stat-card {
        width: 48%;
        height: $stat-card-height;
        background: $card-bg;
        border-radius: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        min-height: $touch-area-min * 2;
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:active {
            transform: scale(0.98);
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
        }

        .stat-icon {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 24rpx;
            box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
        }

        .stat-content {
            .stat-value {
                font-size: 36rpx;
                font-weight: bold;
                color: $text-color;
                display: block;
            }

            .stat-label {
                font-size: 24rpx;
                color: $text-tertiary-color;
                margin-top: 4rpx;
            }

            .stat-trend {
                font-size: 22rpx;
                margin-top: 4rpx;
                display: inline-block;

                &.up {
                    color: $primary-color;
                }

                &.down {
                    color: $danger-color;
                }
            }
        }
    }

    .bg-blue {
        background-color: rgba($secondary-color, 0.2);
        color: $secondary-color;
    }

    .bg-green {
        background-color: rgba($primary-color, 0.2);
        color: $primary-color;
    }

    .bg-orange {
        background-color: rgba($warning-color, 0.2);
        color: $warning-color;
    }

    .bg-red {
        background-color: rgba($danger-color, 0.2);
        color: $danger-color;
    }
}

// 图表样式
.usage-chart {
    background-color: $card-bg;
    padding: 30rpx;
    margin: 0 10rpx 20rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

    .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .chart-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-color;
        }

        .time-filter {
            padding: 10rpx 20rpx;
            background-color: #F5F7FA;
            border-radius: 10rpx;
            font-size: 28rpx;
            color: $text-secondary-color;
            display: flex;
            align-items: center;
        }
    }

    .chart-canvas {
        width: 100%;
        height: 300rpx;
    }
}

// 充电桩列表样式
.pile-list {
    flex: 1;
    padding: 0 10rpx;

    .pile-item {
        background: $card-bg;
        border-radius: 20rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
        transition: transform 0.15s ease, box-shadow 0.15s ease;

        &:active {
            transform: translateY(2rpx);
            box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
        }
    }

    .pile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20rpx;

        .pile-name {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-color;
        }

        .status-badge {
            padding: 8rpx 20rpx;
            border-radius: 100rpx;
            font-size: 24rpx;

            &.active {
                background: rgba($primary-color, 0.1);
                color: $primary-color;
            }

            &.idle {
                background: #F5F7FA;
                color: $text-tertiary-color;
            }
        }
    }

    .pile-details {
        .detail-row {
            display: flex;
            justify-content: space-between;

            .detail-item {
                display: flex;
                align-items: center;
                margin-bottom: 15rpx;
                font-size: 28rpx;
                color: $text-secondary-color;

                text {
                    margin-left: 10rpx;
                }
            }
        }
    }

    .progress-container {
        margin-top: 20rpx;

        .progress-label {
            font-size: 26rpx;
            color: $text-secondary-color;
            margin-bottom: 10rpx;
        }

        progress {
            width: 100%;
            height: 16rpx;
            border-radius: 100rpx;
        }
    }

    .pile-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20rpx;

        .last-update {
            font-size: 24rpx;
            color: $text-tertiary-color;
        }

        .quick-action {
            padding: 10rpx 30rpx;
            border-radius: 100rpx;
            font-size: 26rpx;
            min-height: $touch-area-min;
            display: flex;
            align-items: center;
            justify-content: center;

            &.start-btn {
                background-color: rgba($primary-color, 0.1);
                color: $primary-color;
                border: 1rpx solid rgba($primary-color, 0.2);
            }

            &.stop-btn {
                background-color: rgba($danger-color, 0.1);
                color: $danger-color;
                border: 1rpx solid rgba($danger-color, 0.2);
            }
        }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 100rpx 0;

        .empty-text {
            font-size: 32rpx;
            color: $text-tertiary-color;
            margin-top: 40rpx;
        }

        .reset-filter-btn {
            margin-top: 40rpx;
            padding: 16rpx 40rpx;
            background-color: $primary-color;
            color: #FFF;
            border-radius: 100rpx;
            font-size: 28rpx;
            min-height: $touch-area-min;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .pile-hover-active {
        background-color: rgba($primary-color, 0.03);
    }

    .pile-hover-idle {
        background-color: rgba($text-tertiary-color, 0.03);
    }
}

// 底部操作按钮
.action-bar {
    padding: 30rpx;
    position: relative;

    .action-btn {
        background: $primary-color;
        color: #FFF;
        border-radius: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24rpx;
        font-size: 32rpx;
        box-shadow: 0 6rpx 20rpx rgba($primary-color, 0.3);
        height: 96rpx;
        position: fixed;
        bottom: 50rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        max-width: 700rpx;
        z-index: 20;
    }
}

// 添加充电桩弹窗
.dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.active {
        opacity: 1;
    }
}

.add-dialog {
    width: 680rpx;
    background-color: $card-bg;
    border-radius: 24rpx;
    overflow: hidden;
    transform: scale(0.95);
    transition: transform 0.2s ease;

    &.active {
        transform: scale(1);
    }

    .dialog-header {
        height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        border-bottom: 1rpx solid $border-color;

        .dialog-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-color;
        }

        .close-btn {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
        }
    }

    .dialog-content {
        padding: 30rpx;

        .form-item {
            margin-bottom: 30rpx;

            .form-label {
                font-size: 28rpx;
                color: $text-secondary-color;
                margin-bottom: 10rpx;
                display: block;
            }

            input {
                width: 100%;
                height: 80rpx;
                background-color: #F5F7FA;
                border-radius: 10rpx;
                padding: 0 20rpx;
                font-size: 28rpx;
                color: $text-color;
            }

            .picker-view {
                width: 100%;
                height: 80rpx;
                background-color: #F5F7FA;
                border-radius: 10rpx;
                padding: 0 20rpx;
                font-size: 28rpx;
                color: $text-color;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }

    .dialog-footer {
        display: flex;
        padding: 30rpx;
        border-top: 1rpx solid $border-color;

        .cancel-btn,
        .confirm-btn {
            flex: 1;
            height: 90rpx;
            border-radius: 100rpx;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cancel-btn {
            color: $text-secondary-color;
        }

        .confirm-btn {
            background-color: $primary-color;
            color: #FFF;
        }
    }
}

// 动画类
.fade-in {
    animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.scale-in {
    animation: scaleIn 0.3s ease forwards;
}

@keyframes scaleIn {
    from {
        transform: scale(0.95);
    }

    to {
        transform: scale(1);
    }
}

// 按钮点击效果
.btn-hover {
    opacity: 0.8;
}

.fab-hover {
    transform: translateX(-50%) scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba($primary-color, 0.2);
}

.action-btn-hover {
    opacity: 0.8;
    transform: scale(0.98);
}
</style>