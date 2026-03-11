<template>
	<view>
		<view v-if="copyContent.length > 0" class="ranking">
			<view class="ranking-item" @click="viewDetail(content)" v-for="(content,index) in copyContent" :key="index" :style="{padding:progressPadding+'rpx'}">
				<!-- <view class="name"> -->
				<!-- <uni-tooltip content="112222"> -->
				<!-- </uni-tooltip> -->
				<!-- 	<uni-tooltip content="tooltip显示的内容" class="name" slot="显示的内容">
						{{content.name}}
					</uni-tooltip> -->
				<!-- </view> -->
				<uni-tooltip :content="content.name">
					<view class="name" :style="{color:textcolor}">{{content.name}}</view>
				</uni-tooltip>
				<view class="progress">
					<text :style="{background:content.background,width:content.width + '%',height:progressWidth+'rpx'}"></text>
				</view>
				<view class="num" :style="{color:textcolor}">{{content.num}}</view>
				<view class="unit">{{content.unit}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ranking-list',
		props: {
			textcolor:{
				type: String,
				default: "#fff"
			},
			content: {
				type: Array,
				default () {
					return []
				}
			},
			isPC: {
				type: Boolean,
				default: false
			},
			isRank: {
				type: Boolean,
				default: false
			},
			url: {

			}
		},
		data() {
			return {
				progressWidth: 24,
				progressPadding: 10,
				maxNumber: 0,
				culCount: 0,
				copyContent: []
			}
		},
		watch: {
			content(newV) {
				this.init()
			}
		},
		methods: {
			viewDetail(e) {
				
				if (this.url !== '') {
					this.$u.vuex('currentStorageArea', e);
					uni.navigateTo({
						url: '/pages/FIEMS/' + this.url
					})
				}
			},
			init() {
				this.copyContent = this.deepClone(this.content)
				if (this.copyContent && this.copyContent.length > 0) {
					if (this.isRank) {
						this.copyContent = this.copyContent.sort((a, b) => b.num - a.num);
						this.maxNumber = this.copyContent[0].num;
					} else {
						this.maxNumber = Math.max.apply(Math, this.copyContent.map(item => {
							return item.num
						}));
					}
					this.copyContent.map((item, index) => {
						item.width = this.computeWidth(this.maxNumber, item.num);
					});
				}
			},
			computeWidth(max, current) {
				let num = (current / max) * 100;
				return num.toFixed(2);
			},
			deepClone(obj) {
				var cloneObj = new obj.constructor()
				if (obj === null) return obj
				if (obj instanceof Date) return new Date(obj)
				if (obj instanceof RegExp) return new RegExp(obj)
				if (typeof obj !== 'object') return obj
				for (var i in obj) {
					if (obj.hasOwnProperty(i)) {
						cloneObj[i] = this.deepClone(obj[i])
					}
				}
				return cloneObj
			}
		},
		mounted() {
			if (this.isPC) {
				this.progressWidth = 40;
				this.progressPadding = 30;
			}
			if(this.textcolor=='black'){
				
			}
			this.init();
		}
	}
</script>

<style scoped lang="scss">
	.ranking-item {
		display: flex;
		margin-bottom: 13px;
		align-items: center;
		height: 11px;

		.name {
			padding-right: 10px;
			color: #fff;
			font-size: 20rpx;
			flex: 2;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			width:5rem;
			text-align: center;
		}

		.progress {
			flex: 4;
			text-align: left;
			padding-right: 10px;
			display: flex;

			text {
				display: inline-block;
				// border-radius: 30px;
				vertical-align: top;
			}

		}

		.num {
			font-size: 22rpx;
			color: #fff;
			flex: 1;
		}

		.unit {
			font-size: 22rpx;
			margin-left: 0.2rem;
		}
	}
</style>