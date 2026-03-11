<template>
	<view>
		wifi配置
		<button @click="connectWiFi">扫码连接</button>
		<button @click="testtWiFi">wifi测试</button>
		<button @click="tcpLink">TCP连接</button>
		<button @click="sendInfo">sendInfo</button>
	</view>
</template>

<script>
	import io from '@hyoga/uni-socket.io';
	import {
		requestAndroidPermission,
		gotoAppPermissionSetting
	} from '@/utils/permissions.js'
	export default {
		data() {
			return {

			}
		},
		mounted() {
			this.wifiip()
			this.tcpsocket()
		},
		methods: {
			wifiip() {
				// const MainActivity = plus.android.runtimeMainActivity();
				// const Context = plus.android.importClass('android.content.Context');
				// plus.android.importClass('android.net.wifi.WifiManager');
				// plus.android.importClass('android.net.wifi.WifiInfo');
				// const wifiManager = MainActivity.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
				// const wifiInfo = wifiManager.getConnectionInfo();
				// const ipAddress = wifiInfo.getIpAddress();
				// const wifiIp = ((ipAddress & 0xff) + '.' + (ipAddress >> 8 & 0xff) + '.' + (ipAddress >> 16 & 0xff) + '.' + (ipAddress >> 24 & 0xff));
				// console.log(wifiIp);
			},
			tcpsocket() {
				// const socket = io.connect('ws://127.0.0.1:3000', {
				// 	transports: ['websocket'],
				// 	path: `/socket.io`,
				// 	timeout: 5000,
				// });
				// console.log(socket);
				// socket.on('connect', () => {
				// 	// console.log("socket已连接上");

				// })
				// socket.on('connect_timeout', (timeout, error) => {
				// 	// console.log("socket超时", timeout, error)
				// });

				// socket.on('connect_error', (error) => {
				// 	// console.log('尝试重新连接中...', error);
				// });

				// socket.on('connect_failed', function(data) {
				// 	// console.log('连接失败...');
				// });

				// // 监听连接断开事件
				// socket.on('disconnect', () => {
				// 	// console.log('连接断开')
				// })
				// // 监听连接错误事件
				// socket.on('error', (error) => {
				// 	// console.log('连接错误：', error)
				// })
				// // 监听重连事件
				// socket.on('reconnect', () => {
				// 	// console.log('重新连接成功')
				// })
				uni.connectSocket({
					url: 'wss://serviceiems.gree.com', // 服务器 IP 地址和端口号
					success: function(res) {
						console.log("WebSocket连接成功",res);
					},
					fail: function(err) {
						console.error("WebSocket连接失败", err);
					}
				});
				try{
					uni.onSocketOpen(function (res) {
					  console.log('WebSocket连接已打开！');
					});
				}catch(e){
					//TODO handle the exception
					console.log(e);
				}

				uni.onSocketError(function (res) {
				  console.log('WebSocket连接打开失败，请检查！',res);
				});

			},
			sendInfo() {
				uni.sendSocketMessage({
					data: this.message,
					success: (res) => {
						console.log('消息发送成功');
					},
					fail: (err) => {
						console.error('消息发送失败', err);
					}
				});
			},
			tcpLink() {
				const connection = uni.createTCPSocket()
				console.log(connection);
			},
			testtWiFi() {
				uni.startWifi({
					success(res) {
						console.log(111, res);
					}
				})
			},
			async connectWiFi() {

				const res = await requestAndroidPermission("android.permission.CAMERA")
				console.log(res);
				if (res == 1) {
					console.log('已获取权限');
					uni.scanCode({
						complete(res) {
							console.log(res);
						},
						success(sus) {
							console.log(12345, sus);
						}

					})
				} else {
					uni.showModal({
						title: "权限申请",
						content: "请在设置中开启应用的摄像头（相机）权限。用于扫描二维码以连接设备",
						confirmText: "去设置",
						success(sus) {
							if (sus.confirm) {
								gotoAppPermissionSetting()
							}
						}
					})
				}
			}
		}
	}
</script>

<style>

</style>