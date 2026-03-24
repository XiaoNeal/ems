import io from '@hyoga/uni-socket.io';
import io2 from '@hyoga/uni-socket.io';
import systemConfig from './config/system';
import { RealtimeDataProviderService } from './socket/realtime-data-provider';
// import { io2 } from 'socket.io-client/dist/socket.io.js';
// import { io } from 'socket.io-client';


let instance = ""
let realtimeDataProvider = new RealtimeDataProviderService();

class NodeWebsocket {
    constructor() {
        this.token = uni.getStorageSync('token');
        console.log(this.token, process)

        // this.socket = io2('ws://service.iems.gree.com', {
        //     // secure: true,
        //     extraHeaders: { Authorization: this.token },
        //     path: '/homecommunity/websocket',
        //     reconnection: true,
        //     transports: ['websocket'],
        //     rejectUnauthorized: true
        // });


        this.socket = io('wss://iems.neiic.com', {
            extraHeaders: {
                authorization: `${encodeURIComponent(this.token)}` // 强制添加Bearer前缀
            },
            query: {authorization: `${(this.token.replace(/^Bearer\s+/, ''))}`},
            secure: true,
            transports: ['websocket'],
            // path: '/socket.io',
            //  path: '/hangzhou/socket.io',
            path: `/homecommunity/websocket`, //'/luoyang/socket.io',
            reconnectionAttempts: 20,
            reconnectionDelay: 10000,
            reconnectionDelayMax: 30000,
            rejectUnauthorized: true,
            withCredentials:true
        });

        this.socket2 = io('wss://serviceiems.gree.com', {
            extraHeaders: {
                Authorization: `${this.token}` // 强制添加Bearer前缀
            },
            query: {authorization: `${(this.token.replace(/^Bearer\s+/, ''))}`},
            secure: true,
            transports: ['websocket', 'polling'],
            path: '/shequKoa/websocket',
            reconnectionAttempts: 20,
            reconnectionDelay: 10000,
            reconnectionDelayMax: 30000,
            rejectUnauthorized: true,
            withCredentials:true
           
        });
        console.log(this.socket2, '---------------------------')
        // this.socket.on('connect', () => {
        //     console.log("socket已连接上");

        // })

        this.socket2.on('connect', () => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('已连接socket服务，id为' + this.socket.id + ',开启时间：' + time);
        })

        // this.socket.on('connect', (data) => {
        //     var time = new Date();
        //     time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
        //     console.log('已连接socket服务，id为' + this.socket.id + ',开启时间：' + time);
        // })
        // this.socket.on('error', err => {
        //     var time = new Date();
        //     time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
        //     console.log('实时数据连接错误，id为' + this.socket.id + ',发生时间：' + time);
        // })
        this.socket2.on('connect_error', err => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('实时数据连接错误，id为' + this.socket.id + ',发生时间：' + time);
        })
        this.socket2.on('connect_timeout', (timeout, error) => {
            console.log("socket超时", timeout, error)
        });

        this.socket2.on('connect_error', (error) => {
            console.log('尝试重新连接中...', error);
        });

        this.socket2.on('connect_failed', function (data) {
            console.log('连接失败...');
        });

        // 监听连接断开事件
        this.socket2.on('disconnect', () => {
            console.log('连接断开')
        })
        // 监听连接错误事件
        this.socket2.on('error', (error) => {
            console.log('连接错误：', error)
        })
        // 监听重连事
        console.log(this.socket, this.socket2)
        console.log("22222222")

        this.socket.on('connect', (data) => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('已连接socket服务，id为' + this.socket.id + ',开启时间：' + time);
        })
        this.socket.on('error', err => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('实时数据连接错误，id为' + this.socket.id + ',发生时间：' + time);
        })
        this.socket.on('disconnect', err => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('失去连接，断开时间：' + time);
        })

        this.socket.on('connect_error', (error) => {
            console.log('尝试重新连接中...', error);
        });

        this.socket.on('connect_failed', function (data) {
            console.log('连接失败...');
        });
    }
}

function createSocket() {
    if (instance === "") {
        instance = new NodeWebsocket();
    }
}

function getSocketinstance() {
    createSocket();
    return instance
}

function destroySocket() {
    if (instance !== "") {
        instance.socket.close();
        instance = "";
    }
}

export { createSocket, getSocketinstance, destroySocket, realtimeDataProvider };