<template>
	<view class="container" :class="platformClass">
		<DyNavbar title="系统权限" bgColor="#f4f6f9" :titleStyle="navTitleStyle" :placeholder="true" leftIconColor="#2b2f36"></DyNavbar>
		<view class="fixed-placeholder"></view>

		<!-- 页头：大标题 + 用途说明，信息结构对齐「小米运动健康 → 系统权限」 -->
		<view class="intro">
			<text class="intro-title">系统权限</text>
			<text class="intro-desc">{{ intro }}</text>
		</view>

		<!-- 仅在明确有未授权权限时提示，避免与页头说明、底部操作指引重复 -->
		<view v-if="showNotice" class="notice">
			<text class="notice-text">{{ noticeText }}</text>
		</view>

		<!-- 权限清单：名称加粗、下方灰色用途说明、右侧状态与箭头，点击直达系统设置 -->
		<view class="card">
			<view
				v-for="(item, index) in items"
				:key="item.key"
				class="perm-row"
				hover-class="row-hover"
				:hover-stay-time="80"
				@click="onItemTap(item)"
			>
				<view class="perm-main">
					<text class="perm-title">{{ item.title }}</text>
					<text class="perm-desc">{{ item.desc }}</text>
				</view>
				<view class="perm-side">
					<text class="perm-state" :class="'state-' + stateOf(item.key)">{{ stateText(stateOf(item.key)) }}</text>
					<view class="perm-chevron">
						<uni-icons type="right" size="14" color="#c3c9d1"></uni-icons>
					</view>
				</view>
			</view>
		</view>

		<view class="tip">
			<text class="tip-text">{{ tip }}</text>
		</view>

		<view class="flex-space"></view>

		<view class="all-link" hover-class="row-hover" :hover-stay-time="80" @click="openAll">
			<text class="all-link-text">{{ allLinkText }}</text>
		</view>
	</view>
</template>

<script>
	import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
	import {
		getPermissionItems,
		getPermissionStates,
		getStateText,
		openPermissionPage
	} from '@/utils/system-permissions.js'

	export default {
		components: { DyNavbar },
		data() {
			return {
				items: [],
				states: {},
				platformClass: '',
				manageable: true,
				intro: '',
				tip: '',
				allLinkText: '查看全部权限',
				navTitleStyle: { color: '#2b2f36', width: '100%', fontWeight: '600' }
			}
		},
		computed: {
			/** 明确检测为未授予的项数；无法检测的项不计入，避免误报 */
			deniedCount() {
				let n = 0
				for (let i = 0; i < this.items.length; i++) {
					if (this.states[this.items[i].key] === 'denied') n++
				}
				return n
			},
			/** 提示条只在明确有未授权权限时出现，不再常驻一条与页头重复的中性说明 */
			showNotice() {
				return this.deniedCount > 0
			},
			noticeText() {
				return '有 ' + this.deniedCount + ' 项权限尚未开启，可能影响设备连接或扫码，点按对应项前往开启。'
			}
		},
		onLoad() {
			const conf = getPermissionItems()
			this.items = conf.items
			this.manageable = conf.manageable
			this.intro = conf.intro
			this.tip = conf.tip
			this.allLinkText = conf.allLinkText

			uni.getSystemInfo({
				success: (res) => {
					this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
				}
			})
		},
		/** 从系统设置 / 小程序设置返回时自动刷新状态 */
		onShow() {
			this.refreshStates()
		},
		/** 下拉刷新：重新读取系统授权状态；最短展示 400ms，避免动画一闪而过 */
		onPullDownRefresh() {
			const startedAt = Date.now()
			const finish = () => {
				const rest = 400 - (Date.now() - startedAt)
				if (rest <= 0) {
					uni.stopPullDownRefresh()
					return
				}
				this._pullTimer = setTimeout(() => {
					this._pullTimer = null
					uni.stopPullDownRefresh()
				}, rest)
			}
			Promise.resolve().then(() => this.refreshStates()).then(finish, finish)
		},
		/** 离页前收尾，避免延迟停止刷新动画影响到下一个页面 */
		onUnload() {
			if (this._pullTimer) {
				clearTimeout(this._pullTimer)
				this._pullTimer = null
				uni.stopPullDownRefresh()
			}
		},
		methods: {
			refreshStates() {
				return getPermissionStates().then((states) => {
					this.states = states || {}
				}).catch(() => {
					this.states = {}
				})
			},
			stateOf(key) {
				return this.states[key] || 'unknown'
			},
			/** 模块级纯函数，不依赖 this */
			stateText: getStateText,
			onItemTap(item) {
				if (!this.manageable) {
					uni.showToast({ title: '请在手机 APP 或微信小程序中管理系统权限', icon: 'none' })
					return
				}
				const ok = openPermissionPage(item)
				if (!ok) {
					uni.showToast({ title: '请在系统设置中搜索「能源站」查看权限', icon: 'none' })
				}
			},
			openAll() {
				if (!this.manageable) {
					uni.showToast({ title: '请在手机 APP 或微信小程序中管理系统权限', icon: 'none' })
					return
				}
				const ok = openPermissionPage({ key: 'all', setting: 'appDetails' })
				if (!ok) {
					uni.showToast({ title: '请在系统设置中搜索「能源站」查看权限', icon: 'none' })
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #f4f6f9;
		padding-bottom: 24rpx;
		padding-bottom: calc(24rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(24rpx + env(safe-area-inset-bottom));

		&.android-platform {
			.fixed-placeholder { height: calc(25px + 44px + 20px); }
		}
		&.ios-platform {
			.fixed-placeholder { height: calc(44px); }
		}
	}

	/* ---------- 页头 ---------- */
	.intro {
		padding: 48rpx 40rpx 24rpx;
	}

	.intro-title {
		display: block;
		font-size: 44rpx;
		font-weight: 600;
		line-height: 1.3;
		color: #2b2f36;
	}

	.intro-desc {
		display: block;
		margin-top: 16rpx;
		font-size: 24rpx;
		line-height: 1.6;
		color: #8a9099;
	}

	/* ---------- 警示条：仅未授权时出现，白底细边框 + 文字变色，不用彩色底 ---------- */
	.notice {
		margin: 0 24rpx 24rpx;
		padding: 20rpx 24rpx;
		background-color: #ffffff;
		border: 1rpx solid #ead9bd;
		border-radius: 16rpx;
	}

	.notice-text {
		display: block;
		font-size: 24rpx;
		line-height: 1.6;
		color: #a56a1f;
	}

	/* ---------- 权限清单 ---------- */
	.card {
		margin: 0 24rpx;
		background-color: #ffffff;
		border: 1rpx solid #eef0f4;
		border-radius: 20rpx;
		box-shadow: 0 4rpx 16rpx rgba(31, 51, 89, 0.04);
		overflow: hidden;
	}

	.perm-row {
		display: flex;
		align-items: center;
		padding: 30rpx 28rpx;

		&:not(:last-child) {
			border-bottom: 1rpx solid #f2f4f7;
		}
	}

	.perm-main {
		flex: 1;
		min-width: 0;
		padding-right: 24rpx;
	}

	.perm-title {
		display: block;
		font-size: 30rpx;
		font-weight: 600;
		line-height: 1.4;
		color: #2b2f36;
	}

	.perm-desc {
		display: block;
		margin-top: 10rpx;
		font-size: 24rpx;
		line-height: 1.6;
		color: #8a9099;
	}

	.perm-side {
		flex-shrink: 0;
		display: flex;
		align-items: center;
	}

	.perm-state {
		font-size: 26rpx;
		color: #8a9099;
		white-space: nowrap;
	}

	.state-denied {
		color: #007AFF;
	}

	.perm-chevron {
		display: flex;
		align-items: center;
		margin-left: 8rpx;
	}

	.row-hover {
		background-color: rgba(0, 0, 0, 0.03);
	}

	/* ---------- 说明与底部入口 ---------- */
	.tip {
		padding: 24rpx 40rpx 0;
	}

	.tip-text {
		display: block;
		font-size: 22rpx;
		line-height: 1.7;
		color: #a0a6ad;
	}

	.flex-space {
		flex: 1;
		min-height: 40rpx;
	}

	.all-link {
		padding: 24rpx;
		text-align: center;
	}

	.all-link-text {
		font-size: 30rpx;
		color: #007AFF;
	}
</style>
