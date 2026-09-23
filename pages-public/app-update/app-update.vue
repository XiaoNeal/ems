<template>
	<view class="update-mask">
		<view class="update-card">
			<!-- 顶部标题区 -->
			<view class="card-header">
				<view class="header-deco header-deco-l"></view>
				<view class="header-deco header-deco-r"></view>
				<view class="header-icon">
					<uni-icons type="download" size="40" color="#007AFF" />
				</view>
				<text class="header-title">发现新版本</text>
				<view class="header-version">
					<text class="header-version-text">v{{ info.version }}</text>
				</view>
			</view>

			<!-- 更新日志 -->
			<view class="note-section">
				<text class="note-label">更新内容</text>
				<scroll-view class="note-scroll" scroll-y :style="{ maxHeight: noteMaxHeight + 'rpx' }">
					<text class="note-text">{{ info.note || '体验优化与问题修复' }}</text>
				</scroll-view>
			</view>

			<!-- 下载进度 -->
			<view v-if="status === 'downloading'" class="progress-section">
				<view class="progress-track">
					<view class="progress-fill" :style="{ width: progress + '%' }"></view>
				</view>
				<text class="progress-text">正在下载 {{ progress }}%</text>
			</view>

			<!-- 安装中提示 -->
			<view v-if="status === 'installing'" class="progress-section">
				<text class="progress-text">下载完成，正在准备安装...</text>
			</view>

			<!-- 失败提示 -->
			<view v-if="status === 'failed'" class="progress-section">
				<text class="progress-text failed-text">{{ failReason || '下载失败，请重试' }}</text>
			</view>

			<!-- 按钮区 -->
			<view class="btn-group">
				<!-- 主按钮：更新 / 下载中 / 重试 -->
				<button
					class="btn btn-primary"
					:disabled="status === 'downloading' || status === 'installing'"
					@tap="handleMainAction">
					{{ mainBtnText }}
				</button>

				<!-- 次按钮：失败时浏览器下载（wgt 热更新不支持浏览器安装，不显示） -->
				<button v-if="status === 'failed' && info.updateStatus !== 2" class="btn btn-plain" @tap="handleBrowser">浏览器下载</button>

				<!-- 次按钮：稍后再说（强制更新不显示） -->
				<button v-if="!isForce && status !== 'installing'" class="btn btn-plain" @tap="handleCancel">稍后再说</button>
			</view>

			<!-- 强制更新提示 -->
			<text v-if="isForce" class="force-tip">本次更新为必须更新，完成后方可继续使用</text>
		</view>
	</view>
</template>

<script>
import {
	PENDING_UPDATE_KEY,
	downloadUpdateFile,
	ensureInstallPermission,
	installWgt,
	installApk,
	openInBrowser
} from '@/utils/appUpdate.js'

export default {
	data() {
		return {
			info: {},            // 服务端下发的更新信息 {updateStatus, version, note, force, url}
			status: 'confirm',   // confirm | downloading | installing | failed
			progress: 0,         // 下载进度百分比
			failReason: '',      // 下载/安装失败的具体原因
			isIOS: false,
			noteMaxHeight: 320   // 更新日志区域最大高度（rpx），过长时内部滚动
		}
	},

	computed: {
		isForce() {
			return !!this.info.force
		},
		mainBtnText() {
			if (this.status === 'downloading') return '下载中...'
			if (this.status === 'installing') return '安装中...'
			if (this.status === 'failed') return '重试'
			if (this.isIOS) return '前往 App Store 更新'
			if (this.info.updateStatus === 2) return '立即升级'
			return '立即更新'
		}
	},

	onLoad() {
		const info = uni.getStorageSync(PENDING_UPDATE_KEY)
		if (!info || !info.version) {
			// 无待更新信息（异常进入），直接退出
			uni.navigateBack()
			return
		}
		this.info = info
		// #ifdef APP-PLUS
		this.isIOS = plus.os.name === 'iOS'
		// #endif
	},

	// 强制更新：拦截返回键/侧滑返回
	onBackPress() {
		if (this.isForce) return true
		return false
	},

	methods: {
		/** 主按钮：iOS 跳商店 / Android 下载安装 / 失败重试 */
		handleMainAction() {
			if (this.status === 'downloading' || this.status === 'installing') return

			if (this.status === 'failed') {
				this.startUpdate()
				return
			}
			if (this.isIOS) {
				// iOS 整包更新：跳转 App Store
				openInBrowser(this.info.url)
				if (!this.isForce) this.handleCancel()
				return
			}
			this.startUpdate()
		},

		/** Android 下载 + 安装主流程 */
		async startUpdate() {
			// Android 8+ 先确认安装权限（wgt 热更新不需要安装未知应用权限）
			const isWgt = this.info.updateStatus === 2
			if (!isWgt) {
				const granted = await ensureInstallPermission()
				if (!granted) return
			}

			this.status = 'downloading'
			this.progress = 0
			this.failReason = ''
			try {
				const filePath = await downloadUpdateFile(this.info.url, (p) => {
					this.progress = p
				}, isWgt ? 'wgt' : 'apk')
				this.status = 'installing'
				if (isWgt) {
					// wgt 热更新：安装后提示重启
					await installWgt(filePath)
					this.status = 'confirm'
				} else {
					// APK 整包：系统安装器接管
					await installApk(filePath)
					this.status = 'confirm'
				}
			} catch (e) {
				console.error('[AppUpdate] 下载/安装失败:', e)
				this.failReason = (e && e.message) || '请重试或前往浏览器下载'
				this.status = 'failed'
			}
		},

		/** 失败兜底：浏览器下载 */
		handleBrowser() {
			openInBrowser(this.info.url)
		},

		/** 稍后再说：记录忽略版本并退出弹窗 */
		handleCancel() {
			if (!this.isForce && this.info.version) {
				uni.setStorageSync('ignored_version', this.info.version)
			}
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
page {
	background: transparent;
}

.update-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
	padding: 0 60rpx;
}

.update-card {
	width: 630rpx;
	max-width: 100%;
	background-color: #ffffff;
	border-radius: 28rpx;
	overflow: hidden;
	box-shadow: 0 20rpx 60rpx rgba(0, 40, 100, 0.18);
}

/* 顶部标题区 */
.card-header {
	position: relative;
	background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
	padding: 52rpx 40rpx 44rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
}

/* 顶部装饰圆斑 */
.header-deco {
	position: absolute;
	border-radius: 50%;
	background-color: rgba(255, 255, 255, 0.08);
	pointer-events: none;
}

.header-deco-l {
	width: 260rpx;
	height: 260rpx;
	top: -140rpx;
	left: -90rpx;
}

.header-deco-r {
	width: 200rpx;
	height: 200rpx;
	bottom: -120rpx;
	right: -60rpx;
	background-color: rgba(255, 255, 255, 0.06);
}

.header-icon {
	width: 108rpx;
	height: 108rpx;
	border-radius: 50%;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 20rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 60, 160, 0.25);
}

.header-title {
	color: #ffffff;
	font-size: 38rpx;
	font-weight: 600;
	letter-spacing: 2rpx;
}

.header-version {
	margin-top: 14rpx;
	padding: 4rpx 24rpx;
	border-radius: 100rpx;
	background-color: rgba(255, 255, 255, 0.2);
	border: 1rpx solid rgba(255, 255, 255, 0.35);
}

.header-version-text {
	color: #ffffff;
	font-size: 24rpx;
	line-height: 1.6;
}

/* 更新日志 */
.note-section {
	padding: 32rpx 40rpx 0;
}

.note-label {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	font-weight: 600;
	color: #333333;

	&::before {
		content: '';
		width: 8rpx;
		height: 28rpx;
		border-radius: 4rpx;
		background: linear-gradient(180deg, #007aff, #0066cc);
		margin-right: 14rpx;
	}
}

.note-scroll {
	margin-top: 20rpx;
}

.note-text {
	font-size: 27rpx;
	color: #555555;
	line-height: 1.8;
	white-space: pre-wrap;
}

/* 进度条 */
.progress-section {
	padding: 32rpx 40rpx 0;
}

.progress-track {
	height: 16rpx;
	background-color: #eef1f6;
	border-radius: 8rpx;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	background: linear-gradient(90deg, #007aff, #0066cc);
	border-radius: 8rpx;
	transition: width 0.2s linear;
}

.progress-text {
	display: block;
	margin-top: 18rpx;
	font-size: 26rpx;
	color: #007AFF;
	text-align: center;
}

.failed-text {
	color: #e24b4a;
	line-height: 1.6;
	word-break: break-all;
	padding: 0 10rpx;
}

/* 按钮区 */
.btn-group {
	padding: 36rpx 40rpx 36rpx;
}

.btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	font-size: 31rpx;
	font-weight: 500;
	margin-bottom: 20rpx;

	&::after {
		border: none;
	}
}

.btn:last-child {
	margin-bottom: 0;
}

.btn-primary {
	background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
	color: #ffffff;
	box-shadow: 0 8rpx 20rpx rgba(0, 102, 204, 0.28);

	&[disabled] {
		opacity: 0.75;
		color: #ffffff;
		background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
		box-shadow: none;
	}
}

.btn-plain {
	background-color: #f5f6f8;
	color: #666666;
}

/* 强制更新提示 */
.force-tip {
	display: block;
	text-align: center;
	font-size: 24rpx;
	color: #e24b4a;
	padding: 0 40rpx 32rpx;
}
</style>
