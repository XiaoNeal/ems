<template>
    <view class="charging-detail">
        <!-- 顶部导航栏（适配刘海屏） -->


        <u-navbar title="充电桩详情" :autoBack="true" :placeholder="true">
        </u-navbar>


        <!-- 顶部信息卡片 -->
        <view class="info-card">
            <view class="header">
                <text class="name">{{ pileInfo.name }}</text>
                <view class="status" :class="pileInfo.status">
                    {{ pileInfo.status === 'active' ? '运行中' : '空闲' }}
                </view>
            </view>

            <view class="stats">
                <view class="stat-item">
                    <text class="value">{{ pileInfo.power }}kW</text>
                    <text class="label">当前功率</text>
                </view>
                <view class="stat-item">
                    <text class="value">{{ pileInfo.voltage }}V</text>
                    <text class="label">电压</text>
                </view>
                <view class="stat-item">
                    <text class="value">{{ pileInfo.current }}A</text>
                    <text class="label">电流</text>
                </view>
            </view>

            <view class="detail-info">
                <view class="info-row">
                    <text class="info-label">充电桩编号：</text>
                    <text class="info-value">{{ pileInfo.code }}</text>
                </view>
                <view class="info-row">
                    <text class="info-label">安装位置：</text>
                    <text class="info-value">{{ pileInfo.location }}</text>
                </view>
                <view class="info-row" v-if="pileInfo.status === 'active'">
                    <text class="info-label">开始时间：</text>
                    <text class="info-value">{{ pileInfo.startTime }}</text>
                </view>
                <view class="info-row" v-if="pileInfo.status === 'active'">
                    <text class="info-label">已充电：</text>
                    <text class="info-value">{{ pileInfo.duration }}小时</text>
                </view>
                <view class="info-row">
                    <text class="info-label">上次更新：</text>
                    <text class="info-value">{{ formatTime(pileInfo.lastUpdate) }}</text>
                </view>
            </view>

            <view class="action-buttons">
                <button class="btn start-btn" @click="controlCharging('start')" v-if="pileInfo.status === 'idle'">
                    <uni-icons type="playfill" size="24" color="#FFF"></uni-icons>
                    <text>开始</text>
                </button>
                <button class="btn stop-btn" @click="controlCharging('stop')" v-else>
                    <uni-icons type="stopfill" size="24" color="#FFF"></uni-icons>
                    <text>停止</text>
                </button>
            </view>
        </view>

        <!-- 充电数据统计 -->
        <view class="data-stats">
            <view class="stats-header">
                <text class="title">今日充电数据</text>
                <picker :range="timeRanges" @change="changeTimeRange" :value="timeRangeIndex">
                    <view class="time-filter">
                        {{ timeRanges[timeRangeIndex] }}
                        <uni-icons type="arrowdown" size="20" color="#666"></uni-icons>
                    </view>
                </picker>
            </view>

            <view class="stats-items">
                <view class="stats-item">
                    <text class="item-title">充电次数</text>
                    <text class="item-value">{{ pileInfo.todayChargingTimes || 0 }}</text>
                </view>
                <view class="stats-item">
                    <text class="item-title">总充电量</text>
                    <text class="item-value">{{ pileInfo.todayEnergy || 0 }}kWh</text>
                </view>
                <view class="stats-item">
                    <text class="item-title">总收入</text>
                    <text class="item-value">¥{{ pileInfo.todayIncome || 0 }}</text>
                </view>
                <view class="stats-item">
                    <text class="item-title">使用率</text>
                    <text class="item-value">{{ pileInfo.usageRate || 0 }}%</text>
                </view>
            </view>
        </view>

        <!-- 充电曲线图（使用qiun-data-charts） -->
        <view class="chart-container">
            <view class="chart-header">
                <text class="title">充电功率曲线</text>
                <view class="chart-actions">
                    <button class="refresh-btn" @click="refreshChart" hover-class="btn-hover">
                        <uni-icons type="refresh" size="24" color="#666"></uni-icons>
                    </button>
                </view>
            </view>
            <qiun-data-charts type="line" :chartData="chartData" :opts="chartOptions" canvasId="chargingChart"
                :canvas2d="canvas2d" @rendered="onChartRendered" />
            <view class="chart-loading" v-if="chartLoading">
                <uni-loading-icon size="24" color="#07C160"></uni-loading-icon>
                <text>加载中...</text>
            </view>
        </view>

        <!-- 充电记录（优化为滑动加载） -->
        <view class="history-container" style="padding: 16px; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <view class="history-header" style="margin-bottom: 12px;">
                <text class="title" style="font-size: 18px; font-weight: 500; color: #333;">最近充电记录</text>
            </view>

            <view class="history-list" style="max-height: 400px; overflow-y: auto;">
                <view class="history-item" v-for="(record, index) in chargingRecords" :key="index" style="padding: 12px 0; border-bottom: 1px solid #f5f5f5;">
                    <view class="record-time" style="margin-bottom: 8px;">
                        <text class="date" style="font-size: 14px; color: #666;">{{ record.date }}</text>
                        <text class="time" style="font-size: 12px; color: #999; margin-left: 8px;">{{ record.time }}</text>
                    </view>
                    <view class="record-details" style="display: flex; flex-wrap: wrap;">
                        <view class="detail-item" style="width: 50%; margin-bottom: 6px;">
                            <text class="label" style="font-size: 13px; color: #999;">充电量：</text>
                            <text class="value" style="font-size: 14px; color: #333;">{{ record.energy }}kWh</text>
                        </view>
                        <view class="detail-item" style="width: 50%; margin-bottom: 6px;">
                            <text class="label" style="font-size: 13px; color: #999;">费用：</text>
                            <text class="value" style="font-size: 14px; color: #07C160;">¥{{ record.fee }}</text>
                        </view>
                        <view class="detail-item" style="width: 50%; margin-bottom: 6px;">
                            <text class="label" style="font-size: 13px; color: #999;">时长：</text>
                            <text class="value" style="font-size: 14px; color: #333;">{{ record.duration }}小时</text>
                        </view>
                    </view>
                </view>

                <view class="no-record" v-if="chargingRecords.length === 0 && !loadingMore" style="padding: 24px; text-align: center; color: #999;">
                    <text>暂无充电记录</text>
                </view>

                <!-- 加载更多提示 -->
                <view class="loading-more" v-if="loadingMore" style="padding: 16px; text-align: center;">
                    <uni-loading-icon size="24" color="#07C160"></uni-loading-icon>
                    <text style="font-size: 14px; color: #999; margin-left: 8px;">加载更多记录...</text>
                </view>

                <!-- 无更多数据提示 -->
                <view class="no-more" v-if="!hasMore && chargingRecords.length > 0 && !loadingMore" style="padding: 16px; text-align: center; color: #999; font-size: 14px;">
                    <text>没有更多记录了</text>
                </view>
            </view>
        </view>

        <!-- 确认弹窗 -->
        <view class="confirm-modal" v-if="showConfirmModal">
            <view class="modal-content">
                <text class="modal-title">{{ confirmTitle }}</text>
                <text class="modal-message">{{ confirmMessage }}</text>
                <view class="modal-buttons">
                    <button class="cancel-btn" @click="closeConfirmModal">取消</button>
                    <button class="confirm-btn" @click="confirmAction">确认</button>
                </view>
            </view>
        </view>

        <!-- 充电状态弹窗 -->
        <view class="status-modal" v-if="showStatusModal">
            <view class="modal-content">
                <view class="status-icon" :class="pileInfo.status">
                    <uni-icons :type="pileInfo.status === 'active' ? 'loading' : 'checkmark'" size="100"
                        :color="pileInfo.status === 'active' ? '#07C160' : '#333'"></uni-icons>
                </view>
                <text class="status-title">{{ pileInfo.status === 'active' ? '充电中' : '充电已停止' }}</text>

                <view class="status-details" v-if="pileInfo.status === 'active'">
                    <view class="detail-row">
                        <text class="label">当前电量：</text>
                        <text class="value">{{ chargingProgress }}%</text>
                    </view>
                    <view class="detail-row">
                        <text class="label">已充电：</text>
                        <text class="value">{{ pileInfo.duration }}小时</text>
                    </view>
                    <view class="detail-row">
                        <text class="label">预计还需：</text>
                        <text class="value">{{ estimatedTime }}分钟</text>
                    </view>
                </view>

                <progress class="status-progress" :percent="chargingProgress" :active="pileInfo.status === 'active'" />

                <button class="close-btn" @click="closeStatusModal">
                    {{ pileInfo.status === 'active' ? '返回' : '完成' }}
                </button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            canvas2d: this.$Config.ISCANVAS2D,
            pileId: '',
            pileInfo: {
                id: '',
                name: '',
                code: '',
                status: '',
                power: 0,
                voltage: 0,
                current: 0,
                location: '',
                startTime: '',
                duration: 0,
                lastUpdate: '',
                todayChargingTimes: 0,
                todayEnergy: 0,
                todayIncome: 0,
                usageRate: 0
            },
            chartLoading: false,
            timeRanges: ['今日', '本周', '本月', '全年'],
            timeRangeIndex: 0,
            chargingRecords: [],
            // 分页相关数据
            page: 1,
            pageSize: 5,
            hasMore: true,
            loadingMore: false,
            showConfirmModal: false,
            confirmTitle: '',
            confirmMessage: '',
            confirmCallback: null,
            showStatusModal: false,
            chargingProgress: 0,
            estimatedTime: 0,
            chartTimer: null,
            refreshTimer: null,
            // 使用qiun-data-charts的图表配置
            chartData: {
                categories: [],
                series: []
            },
            chartOptions: {
                color: ['#07C160'],
                padding: [15, 15, 0, 15],
                enableScroll: false,
                dataLabel: false,
                legend: {
                    show: false
                },
                xAxis: {
                    disableGrid: true,
                    labelCount: 6,
                    labels: {
                        rotate: 45
                    }
                },
                yAxis: {
                    gridType: 'dash',
                    dashLength: 2,
                    title: {
                        text: '功率 (kW)'
                    }
                },
                extra: {
                    line: {
                        type: 'curve',
                        width: 2,
                        activeType: 'hollow'
                    }
                }
            },
            statusBarHeight: 0,
            chartRendered: false,
            windowHeight: 0,
            historyContainerRect: null
        }
    },
    onLoad(options) {
        this.pileId = options.id

        // 获取状态栏高度
        uni.getSystemInfo({
            success: (res) => {
                this.statusBarHeight = res.statusBarHeight
                this.windowHeight = res.windowHeight
            }
        })

        this.loadPileInfo()
        this.loadChargingRecords(true)
        this.initChartData() // 初始化图表数据
    },
    onReady() {
        // 获取历史记录容器位置信息
        this.getHistoryContainerRect()
    },
    onShow() {
        // 每5秒刷新一次数据
        this.refreshTimer = setInterval(() => {
            this.loadPileInfo(false)
        }, 5000)
    },
    onHide() {
        if (this.chartTimer) clearInterval(this.chartTimer)
        if (this.refreshTimer) clearInterval(this.refreshTimer)
    },
    onUnload() {
        if (this.chartTimer) clearInterval(this.chartTimer)
        if (this.refreshTimer) clearInterval(this.refreshTimer)
    },
    onPageScroll(e) {
        // 页面滚动监听（小程序兼容）
        if (this.historyContainerRect && this.windowHeight) {
            if (e.scrollTop + this.windowHeight >= this.historyContainerRect.bottom - 100 && !this.loadingMore && this.hasMore) {
                this.loadChargingRecords()
            }
        }
    },
    methods: {
        navigateBack() {
            uni.navigateBack()
        },

        loadPileInfo(showLoading = true) {
            if (showLoading) {
                uni.showLoading({
                    title: '加载中'
                })
            }

            // 模拟API请求
            setTimeout(() => {
                const status = Math.random() > 0.3 ? 'active' : 'idle'
                this.pileInfo = {
                    id: this.pileId,
                    name: `A区-${this.pileId}号充电桩`,
                    code: `A0${this.pileId}`,
                    status: status,
                    power: status === 'active' ? (Math.random() * 5 + 5).toFixed(1) : 0,
                    voltage: 220,
                    current: status === 'active' ? (Math.random() * 10 + 25).toFixed(1) : 0,
                    location: 'A区停车场1楼',
                    startTime: status === 'active' ? this.formatDateTime(new Date(Date.now() - Math.random() * 3600000 * 2)) : '',
                    duration: status === 'active' ? (Math.random() * 3 + 1).toFixed(1) : 0,
                    lastUpdate: Date.now(),
                    todayChargingTimes: Math.floor(Math.random() * 10),
                    todayEnergy: (Math.random() * 50 + 30).toFixed(1),
                    todayIncome: (Math.random() * 200 + 100).toFixed(2),
                    usageRate: Math.floor(Math.random() * 80 + 20)
                }

                if (status === 'active') {
                    this.chargingProgress = Math.floor(Math.random() * 60 + 20)
                    this.estimatedTime = Math.floor(Math.random() * 60 + 10)
                }

                if (showLoading) {
                    uni.hideLoading()
                }
            }, 800)
        },

        formatTime(timestamp) {
            const date = new Date(timestamp)
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            return `${hours}:${minutes}`
        },

        formatDateTime(date) {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const hours = date.getHours().toString().padStart(2, '0')
            const minutes = date.getMinutes().toString().padStart(2, '0')
            return `${year}-${month}-${day} ${hours}:${minutes}`
        },

        changeTimeRange(e) {
            this.timeRangeIndex = e.detail.value
            this.loadPileInfo()
            this.initChartData() // 切换时间范围时更新图表
        },

        // 初始化图表数据
        initChartData() {
            this.chartLoading = true

            // 模拟API请求获取图表数据
            setTimeout(() => {
                const now = new Date()
                const categories = []
                const seriesData = []

                // 生成过去24小时的时间点和随机功率数据
                for (let i = 23; i >= 0; i--) {
                    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
                    categories.push(`${time.getHours().toString().padStart(2, '0')}:00`)

                    // 模拟功率数据，白天高，晚上低
                    let basePower = 3
                    if (time.getHours() >= 8 && time.getHours() <= 20) {
                        basePower = 7
                    }

                    seriesData.push((basePower + Math.random() * 3).toFixed(1))
                }

                this.chartData = {
                    categories,
                    series: [{
                        name: '充电功率',
                        data: seriesData
                    }]
                }

                this.chartLoading = false
            }, 800)
        },

        // 图表渲染完成回调
        onChartRendered() {
            this.chartRendered = true
        },

        refreshChart() {
            this.chartLoading = true
            this.initChartData()
        },

        // 获取历史记录容器位置信息
        getHistoryContainerRect() {
            const query = uni.createSelectorQuery().in(this)
            query.select('.history-container').boundingClientRect(rect => {
                if (rect) {
                    this.historyContainerRect = rect
                }
            }).exec()
        },

        // 加载充电记录
        loadChargingRecords(isInit = false) {
            if (isInit || this.hasMore) {
                if (!isInit) {
                    this.loadingMore = true
                }

                // 模拟API请求
                setTimeout(() => {
                    const newRecords = []
                    const date = new Date()

                    for (let i = 0; i < this.pageSize; i++) {
                        const recordDate = new Date(date)
                        recordDate.setDate(date.getDate() - ((this.page - 1) * this.pageSize + i))

                        newRecords.push({
                            date: this.formatDateTime(recordDate).split(' ')[0],
                            time: `${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}-${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                            energy: (Math.random() * 10 + 5).toFixed(1),
                            fee: (Math.random() * 50 + 20).toFixed(2),
                            duration: (Math.random() * 3 + 1).toFixed(1)
                        })
                    }

                    if (isInit) {
                        this.chargingRecords = newRecords
                    } else {
                        this.chargingRecords = [...this.chargingRecords, ...newRecords]
                    }

                    this.hasMore = this.page < 3
                    this.page++
                    this.loadingMore = false

                    // 更新容器位置信息
                    this.getHistoryContainerRect()
                }, 800)
            }
        },

        controlCharging(action) {
            this.confirmTitle = action === 'start' ? '开始充电' : '停止充电'
            this.confirmMessage = action === 'start' ?
                `确定要开始使用 ${this.pileInfo.name} 充电桩吗？` :
                `确定要停止使用 ${this.pileInfo.name} 充电桩吗？`

            this.confirmCallback = () => {
                uni.showLoading({
                    title: `${action === 'start' ? '启动' : '停止'}中`
                })

                setTimeout(() => {
                    uni.hideLoading()

                    this.pileInfo.status = action === 'start' ? 'active' : 'idle'
                    this.pileInfo.startTime = action === 'start' ? this.formatDateTime(new Date()) : ''
                    this.pileInfo.duration = action === 'start' ? 0 : this.pileInfo.duration

                    this.showStatusModal = true

                    if (action === 'start') {
                        this.chargingProgress = 0
                        this.estimatedTime = Math.floor(Math.random() * 60 + 30)

                        if (this.chartTimer) clearInterval(this.chartTimer)
                        this.chartTimer = setInterval(() => {
                            this.chargingProgress += 1
                            if (this.chargingProgress >= 100) {
                                clearInterval(this.chartTimer)
                                this.pileInfo.status = 'idle'
                            }
                        }, 1000)
                    }

                    uni.showToast({
                        title: `${action === 'start' ? '启动' : '停止'}成功`,
                        icon: 'success'
                    })
                }, 1000)
            }

            this.showConfirmModal = true
        },

        closeConfirmModal() {
            this.showConfirmModal = false
        },

        confirmAction() {
            if (typeof this.confirmCallback === 'function') {
                this.confirmCallback()
            }
            this.showConfirmModal = false
        },

        closeStatusModal() {
            this.showStatusModal = false
        }
    }
}
</script>

<style lang="scss" scoped>
// 变量定义
$primary-color: #07C160;
$danger-color: #F56C6C;
$text-primary: #333;
$text-secondary: #666;
$text-tertiary: #999;
$bg-light: #F5F7FA;
$border-color: #EEEEEE;

.charging-detail {
    padding: 0;
    min-height: 100vh;
    background-color: $bg-light;
}

// 自定义导航栏
.custom-nav {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    box-shadow: 0 2px 8px rgba(68, 136, 251, 0.2);
}

.nav-content {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
}

.back-btn {
    padding: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-title {
    flex: 1;
    text-align: center;
    // color: white;
    font-size: 18px;
    font-weight: 500;
    margin-left: -36px;
}

.action-buttons {
    margin-top: 20px;
}

.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 500;
    border: none;
    width: 100%;
    transition: all 0.3s;
}

.start-btn {
    background: linear-gradient(90deg, #52C41A, #73D13D);
    color: #FFF;
}

.stop-btn {
    background: linear-gradient(90deg, #F5222D, #FF4D4F);
    color: #FFF;
}

.btn text {
    margin-left: 8px;
}

.btn:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

// 内容区域
.content-container {
    padding-top: 100rpx; // 导航栏高度
    padding-bottom: 30rpx;
}

.info-card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    // margin-bottom: 20px;
    margin: 10rpx;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
}

.name {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;

    &.idle {
        background: #F0F0F0;
        color: #999;
    }

    &.active {
        background: #E6F7FF;
        color: #1890FF;
    }
}

.stats {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
    padding: 16px 0;
    border-top: 1px solid #F0F0F0;
    border-bottom: 1px solid #F0F0F0;
}

.stat-item {
    text-align: center;
}

.value {
    display: block;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.label {
    display: block;
    font-size: 12px;
    color: #999;
}

.detail-info {
    margin: 16px 0;

    .info-row {
        display: flex;
        margin-bottom: 8px;

        .info-label {
            color: #999;
            font-size: 14px;
            width: 100px;
        }

        .info-value {
            color: #333;
            font-size: 14px;
            flex: 1;
        }
    }
}

.data-stats {
    background: #FFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 0rpx 10rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-primary;
    }

    .time-filter {
        padding: 10rpx 20rpx;
        background-color: $bg-light;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: $text-secondary;
        display: flex;
        align-items: center;
    }
}

.stats-items {
    display: flex;
    flex-wrap: wrap;

    .stats-item {
        width: 50%;
        margin-bottom: 20rpx;

        .item-title {
            font-size: 28rpx;
            color: $text-secondary;
        }

        .item-value {
            font-size: 32rpx;
            font-weight: bold;
            color: $text-primary;
            margin-top: 8rpx;
        }
    }
}

.chart-container {
    background: #FFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 10rpx 10rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    position: relative;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-primary;
    }

    .chart-actions {
         margin-right:8px;
        .refresh-btn {
            width: 50rpx;
            height: 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
           
        }
    }
}

.chart {
    width: 100%;
    height: 350rpx;
}

.chart-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    width: 100%;
    height: calc(100% - 60rpx);
    border-radius: 10rpx;
    color: $primary-color;
    font-size: 28rpx;
}

.history-container {
    background: #FFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 10rpx 10rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .title {
        font-size: 32rpx;
        font-weight: bold;
        color: $text-primary;
    }
}

.history-list {
    .history-item {
        padding: 20rpx 0;
        border-bottom: 1rpx solid $border-color;

        &:last-child {
            border-bottom: none;
        }
    }

    .record-time {
        .date {
            font-size: 28rpx;
            font-weight: bold;
            color: $text-primary;
        }

        .time {
            font-size: 24rpx;
            color: $text-tertiary;
        }
    }

    .record-details {
        margin-top: 20rpx;

        .detail-item {
            display: flex;
            margin-bottom: 10rpx;

            .label {
                width: 120rpx;
                font-size: 26rpx;
                color: $text-secondary;
            }

            .value {
                font-size: 26rpx;
                color: $text-primary;
            }
        }
    }

    .no-record {
        text-align: center;
        padding: 50rpx 0;
        font-size: 28rpx;
        color: $text-tertiary;
    }

    // 加载更多和无更多数据样式
    .loading-more,
    .no-more {
        text-align: center;
        padding: 20rpx 0;
        color: $text-tertiary;
        font-size: 28rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

// 弹窗样式
.confirm-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background-color: #FFF;
    border-radius: 24rpx;
    width: 600rpx;
    padding: 40rpx 30rpx;
}

.modal-title {
    font-size: 32rpx;
    font-weight: bold;
    color: $text-primary;
    text-align: center;
    margin-bottom: 20rpx;
}

.modal-message {
    font-size: 28rpx;
    color: $text-secondary;
    text-align: center;
    margin-bottom: 40rpx;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;

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
        color: $text-secondary;
    }

    .confirm-btn {
        background-color: $primary-color;
        color: #FFF;
        margin-left: 20rpx;
    }
}

.status-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.status-modal .modal-content {
    background-color: #FFF;
    border-radius: 24rpx;
    width: 600rpx;
    padding: 40rpx 30rpx;
    text-align: center;
}

.status-icon {
    margin-bottom: 20rpx;

    &.active {
        animation: rotate 2s linear infinite;
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.status-title {
    font-size: 36rpx;
    font-weight: bold;
    color: $text-primary;
    margin-bottom: 30rpx;
}

.status-details {
    margin-bottom: 30rpx;

    .detail-row {
        display: flex;
        justify-content: center;
        margin-bottom: 15rpx;

        .label {
            font-size: 28rpx;
            color: $text-secondary;
            width: 200rpx;
            text-align: right;
        }

        .value {
            font-size: 28rpx;
            color: $text-primary;
            width: 200rpx;
            text-align: left;
        }
    }
}

.status-progress {
    width: 100%;
    height: 16rpx;
    margin-bottom: 40rpx;
}

.close-btn {
    background-color: $primary-color;
    color: #FFF;
    border-radius: 100rpx;
    height: 90rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-hover {
    opacity: 0.8;
}
</style>