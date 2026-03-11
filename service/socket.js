// import io from 'socket.io-client'
// export const zhSocket = io.connect('http://10.2.44.199:9012');
// export const Socket = io.connect('http://10.2.44.199:9012');
import io from '@hyoga/uni-socket.io';
// const lifeData = uni.getStorageSync('lifeData')
export const Socket = io.connect('wss://serviceiems.gree.com', {
	secure: true,
	query: 'areaInfoId=' + 1,
	transports: ['websocket'],
	// path: '/socket.io',
	//  path: '/hangzhou/socket.io',
	path: `${uni.getStorageSync('urlPrefix')}/socket.io`, //'/luoyang/socket.io',
	reconnectionAttempts: 20,
	reconnectionDelay: 10000,
	reconnectionDelayMax: 30000
});

// export const Socket =  io.connect('ws://service.iems.gree.com:9012');
// export const Socket = uni.connectSocket({
// 	url: 'wss://https://serviceiems.gree.com:9012', //仅为示例，并非真实接口地址。
// 	complete: ()=> {}
// });

//  export const Socket = io.connect('wss://service.iems.gree.com:9012', {
//     secure: true,
//     query: 'areaInfoId=' + 307,
//     transports:['websocket'],
//     path: '/socket.io',
//     //  path: '/hangzhou/socket.io',
//     // path: '/socket.io',
//     reconnectionAttempts: 20,
//     reconnectionDelay: 10000,
//     reconnectionDelayMax: 30000
// })