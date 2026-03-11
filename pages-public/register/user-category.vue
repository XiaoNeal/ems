<template>
	<view>
		<view class="box">
			<view class="image-container">
				<u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle"  width="80px" height="80px"></u--image>
			</view>
			<view class="box-container">
				<text style="font-weight:800">能源管理系统</text><br>
				<text style="font-size: 14px;color:gray">实时掌握能源运行状况</text><br>
				<text style="font-size: 14px;color:gray">请联系管理员为您创建账号</text>
			</view>
			
			
		</view>
		<view  class="box" @click="toRegist">
			<view class="image-container">
				<u--image src="https://cdn.uviewui.com/uview/album/1.jpg" shape="circle"  width="80px" height="80px"></u--image>
			</view>
			<view class="box-container">
				<text style="font-weight:800">安装商</text><br>
				<text style="font-size: 14px;color:gray">实时掌握逆变器、储能运行状况</text><br>
				<text style="color:blue;font-size: 14px;">请点击创建你的账号</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			toRegist() {
				uni.setStorageSync('isRegister', true)
				uni.navigateTo({
					url: '/pages-public/register/register'
				})
			}
		}
	}
</script>

<style>
	.box{
		height:30vw;
		width:90%;
		margin:5%;
		border:1px solid gray;
		border-radius:6px;
		box-shadow:  0px 0px 2px 2px #67b3dd;
		display: flex;
		padding:3vw;
		font-size: 16px;
	}
	
	.image-container{
		display:flex;
		align-items:center;
	}
	
	.box-container{	
		    margin-left: 6vw;
		    margin-top: 3vw;
	}
	
</style>