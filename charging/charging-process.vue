<template>
    <view class="container">
        <custom-nav-bar title="充电管理"></custom-nav-bar>
        <view class="content">
            <!-- 充电桩信息卡片 -->
            <view class="pile-card">
                <view class="pile-header">
                    <view class="icon-box">
                        <uni-icons type="location" size="20" color="#409EFF"></uni-icons>
                    </view>
                    <view class="pile-main">
                        <view class="pile-name">{{ pileInfo.name }}</view>
                        <view class="pile-desc">
                            <text>{{ pileInfo.location }}</text>
                            <text class="tag">{{ pileInfo.type }}</text>
                        </view>
                    </view>
                    <uni-icons type="info" size="18" color="#999"></uni-icons>
                </view>
                <view class="pile-extra">
                    <view class="extra-item">
                        <uni-icons type="clock" size="14" color="#666"></uni-icons>
                        <text>{{ pileInfo.operator }}</text>
                    </view>
                    <view class="extra-item">
                        <uni-icons type="bolt" size="14" color="#666"></uni-icons>
                        <text>{{ pileInfo.powerType }}</text>
                    </view>
                </view>
            </view>

            <!-- 充电状态区域 -->
            <view class="charging-status">
                <view class="status-circle">
                    <view class="circle-inner">
                        <text class="power-num">{{ currentPower.toFixed(1) }}%</text>
                        <text class="status-text">{{ statusText }}</text>
                    </view>
                    <!-- 环形进度条 -->
                    <view class="progress-ring"
                        :style="{ background: `conic-gradient(var(--progress-color) ${currentPower}%, #f0f0f0 0)` }">
                        <view class="ring-mask"></view>
                    </view>
                </view>

                <!-- 进度条 -->
                <view class="power-progress">
                    <text class="progress-label">当前电量</text>
                    <view class="progress-bar">
                        <view class="progress-fill"
                            :style="{ width: `${currentPower}%`, background: progressGradient }"></view>
                    </view>
                    <view class="progress-info">
                        <text>{{ currentPower.toFixed(1) }}%</text>
                        <text>预计{{ estimateFullTime }}</text>
                    </view>
                </view>
            </view>

            <!-- 充电数据网格 -->
            <view class="data-grid">
                <view class="data-item">
                    <text class="data-label">充电功率</text>
                    <text class="data-value">{{ power.toFixed(1) }}kW</text>
                </view>
                <view class="data-item">
                    <text class="data-label">已充电量</text>
                    <text class="data-value">{{ chargedEnergy.toFixed(2) }}kWh</text>
                </view>
                <view class="data-item">
                    <text class="data-label">充电时间</text>
                    <text class="data-value">{{ chargingTime }}</text>
                </view>
                <view class="data-item">
                    <text class="data-label">预计费用</text>
                    <text class="data-value">{{ cost.toFixed(2) }}元</text>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view class="action-buttons">
                <button class="action-btn start-btn" @click="startCharging" v-if="chargingStatus === 'waiting'"
                    :disabled="chargingStatus !== 'waiting'">
                    <uni-icons type="play" size="16" color="#fff" v-if="!isStarting"></uni-icons>
                    <uni-icons type="spinner-cycle" size="16" color="#fff" class="loading"
                        v-if="isStarting"></uni-icons>
                    {{ isStarting ? '启动中...' : '开始充电' }}
                </button>

                <button class="action-btn stop-btn" @click="showStopConfirm" v-if="chargingStatus === 'charging'"
                    :disabled="chargingStatus !== 'charging'">
                    <uni-icons type="stop" size="16" color="#fff" v-if="!isStopping"></uni-icons>
                    <uni-icons type="spinner-cycle" size="16" color="#fff" class="loading"
                        v-if="isStopping"></uni-icons>
                    {{ isStopping ? '结束中...' : '结束充电' }}
                </button>
            </view>
        </view>
    </view>
</template>

<script>
import CustomNavBar from './components/custom-nav-bar.vue';
export default {
    components: {
        CustomNavBar
    },
    data() {
        return {
            // 充电桩信息（完善细节）
            pileInfo: {
                name: '国创联能充电桩A01',
                location: '地下车库A区1号车位',
                operator: '国创联能',
                type: '快充',
                powerType: '60kW max'
            },
            // 充电数据
            currentPower: 25.6, // 当前电量百分比
            power: 45.2, // 充电功率(kW)
            chargedEnergy: 3.25, // 已充电量(kWh)
            chargingTime: '00:25:18', // 充电时长
            cost: 8.65, // 预计费用
            estimateFullTime: '01:32:00', // 预计充满时间

            // 状态管理
            chargingStatus: 'waiting', // waiting/charging/stopped
            isStarting: false, // 启动中
            isStopping: false, // 结束中
            timer: null
        };
    },
    computed: {
        // 进度条颜色（随电量变化的渐变）
        progressGradient() {
            if (this.currentPower < 30) return 'linear-gradient(90deg, #4CD964, #59D987)';
            if (this.currentPower < 70) return 'linear-gradient(90deg, #59D987, #7ED9A3)';
            return 'linear-gradient(90deg, #7ED9A3, #A4D9BB)';
        },
        // 状态文本
        statusText() {
            const statusMap = {
                waiting: '待启动',
                charging: '充电中',
                stopped: '已结束'
            };
            return statusMap[this.chargingStatus];
        }
    },
    onLoad(options) {
        const { pileId } = options;
        console.log('充电桩ID:', pileId);
        this.getPileInfo(pileId);
    },
    onUnload() {
        this.clearTimer();
    },
    methods: {
        // 获取充电桩信息（模拟API）
        getPileInfo(pileId) {
            // 实际项目中调用接口获取真实数据
            setTimeout(() => {
                console.log('充电桩信息加载完成');
            }, 800);
        },

        // 开始充电
        startCharging() {
            if (this.isStarting) return;
            this.isStarting = true;
            this.chargingStatus = 'starting'; // 启动中状态

            // 模拟启动充电API调用
            setTimeout(() => {
                this.isStarting = false;
                this.chargingStatus = 'charging';
                this.startUpdatingData(); // 开始更新数据
                uni.showToast({ title: '充电已启动', icon: 'success' });
            }, 2000);
        },

        // 显示结束充电确认
        showStopConfirm() {
            uni.showModal({
                title: '确认结束充电',
                content: '当前充电未完成，确定要结束吗？',
                confirmText: '确认结束',
                cancelText: '继续充电',
                success: (res) => {
                    if (res.confirm) {
                        this.stopCharging();
                    }
                }
            });
        },

        // 结束充电
        stopCharging() {
            if (this.isStopping) return;
            this.isStopping = true;
            this.chargingStatus = 'stopping'; // 结束中状态
            this.clearTimer();

            // 模拟结束充电API调用
            setTimeout(() => {
                this.isStopping = false;
                this.chargingStatus = 'stopped';

                // 显示充电结果
                uni.showModal({
                    title: '充电完成',
                    content: `已充电: ${this.chargedEnergy.toFixed(2)}kWh\n费用: ${this.cost.toFixed(2)}元`,
                    showCancel: false,
                    success: () => {
                        uni.navigateTo({ url: '/charging/records' });
                    }
                });
            }, 1500);
        },

        // 开始更新充电数据
        startUpdatingData() {
            this.clearTimer();
            this.timer = setInterval(() => {
                // 1. 更新当前电量（每秒钟增加~0.02%，更贴近实际）
                this.currentPower += 0.02;
                if (this.currentPower >= 100) {
                    this.currentPower = 100;
                    this.stopCharging(); // 自动结束
                    return;
                }

                // 2. 更新已充电量（功率kW = 每小时充电kWh，故每秒增加 power/3600）
                this.chargedEnergy += this.power / 3600;
                this.chargedEnergy = parseFloat(this.chargedEnergy.toFixed(2));

                // 3. 更新费用（假设1.8元/kWh）
                this.cost = parseFloat((this.chargedEnergy * 1.8).toFixed(2));

                // 4. 更新充电时间
                this.updateChargingTime();

                // 5. 计算预计充满时间
                this.calcEstimateFullTime();
            }, 1000);
        },

        // 更新充电时间
        updateChargingTime() {
            const [hours, minutes, seconds] = this.chargingTime.split(':').map(Number);
            let newSeconds = seconds + 1;
            let newMinutes = minutes;
            let newHours = hours;

            if (newSeconds >= 60) {
                newSeconds = 0;
                newMinutes += 1;
            }
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours += 1;
            }

            this.chargingTime = [
                newHours.toString().padStart(2, '0'),
                newMinutes.toString().padStart(2, '0'),
                newSeconds.toString().padStart(2, '0')
            ].join(':');
        },

        // 计算预计充满时间
        calcEstimateFullTime() {
            const remainingPower = 100 - this.currentPower; // 剩余电量百分比
            const powerPerSecond = 0.02; // 每秒增加的电量（与更新频率一致）
            const remainingSeconds = Math.ceil(remainingPower / powerPerSecond);

            // 转换为时分秒
            const hours = Math.floor(remainingSeconds / 3600);
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;

            this.estimateFullTime = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');
        },

        // 清除计时器
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    }
};
</script>

<style scoped>
.container {
    min-height: 100vh;
    padding-top: 44px;
    background-color: #f7f8fa;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.content {
    padding: 16px;
    margin-top:44px;
}

/* 充电桩信息卡片 */
.pile-card {
    background-color: #fff;
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.icon-box {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: #e8f4ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.pile-main {
    flex: 1;
}

.pile-name {
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    margin-bottom: 4px;
}

.pile-desc {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #86909c;
}

.pile-desc .tag {
    margin-left: 8px;
    padding: 2px 8px;
    background-color: #e6f7ed;
    color: #00b42a;
    border-radius: 12px;
    font-size: 12px;
}

.pile-extra {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #86909c;
}

.extra-item {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* 充电状态区域 */
.charging-status {
    margin-bottom: 24px;
}

.status-circle {
    width: 200px;
    height: 200px;
    margin: 0 auto 20px;
    position: relative;
}

.progress-ring {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    transform: rotate(-90deg);
    /* 旋转使进度从顶部开始 */
    background-color: #f0f0f0;
}

.ring-mask {
    width: 80%;
    height: 80%;
    background-color: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) inset;
}

.circle-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
}

.power-num {
    font-size: 36px;
    font-weight: 700;
    color: #1d2129;
    line-height: 1.2;
}

.status-text {
    font-size: 16px;
    color: #00b42a;
    margin-top: 8px;
    display: inline-block;
}

/* 电量进度条 */
.power-progress {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.progress-label {
    font-size: 14px;
    color: #86909c;
    margin-bottom: 8px;
    display: block;
}

.progress-bar {
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease;
}

.progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #86909c;
}

/* 数据网格 */
.data-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 30px;
}

.data-item {
    flex: 1;
    min-width: calc(50% - 6px);
    /* 每行2个 */
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-label {
    font-size: 14px;
    color: #86909c;
    display: block;
    margin-bottom: 6px;
}

.data-value {
    font-size: 18px;
    font-weight: 600;
    color: #1d2129;
    transition: all 0.3s ease;
}

/* 操作按钮 */
.action-buttons {
    padding: 0 10px;
}

.action-btn {
    width: 100%;
    height: 50px;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.start-btn {
    background-color: #409eff;
    color: #fff;
}

.start-btn:active {
    background-color: #337ecc;
}

.stop-btn {
    background-color: #f53f3f;
    color: #fff;
}

.stop-btn:active {
    background-color: #d43030;
}

.loading {
    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/* 适配深色模式（可选） */
@media (prefers-color-scheme: dark) {
    .container {
        background-color: #1a1a1a;
    }

    .pile-card,
    .power-progress,
    .data-item {
        background-color: #2c2c2c;
    }

    .pile-name,
    .data-value,
    .power-num {
        color: #f5f5f5;
    }

    .ring-mask {
        background-color: #2c2c2c;
    }
}
</style>