import io from '@hyoga/uni-socket.io';
import { RealtimeDataProviderService } from './socket/realtime-data-provider';

let instance = ""
let realtimeDataProvider = new RealtimeDataProviderService();

class NodeWebsocket {
    constructor() {
        this.token = uni.getStorageSync('token');

        this.socket = io.connect('wss://serviceiems.gree.com', {
            secure: true,
            query: 'areaInfoId=' + 1,
            transports: ['websocket'], 
            path: `/socket.io`, 
            reconnectionAttempts: 20,
            reconnectionDelay: 10000,
            reconnectionDelayMax: 30000
        });
        this.socket.on('connect', (data) => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('已连接 socket 服务，id 为' + this.socket.id + ',开启时间：' + time);
        })
        this.socket.on('error', err => {
            var time = new Date();
            time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
            console.log('实时数据连接错误，id 为' + this.socket.id + ',发生时间：' + time);
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