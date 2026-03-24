(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["community/common/vendor"],{

/***/ 1471:
/*!***********************************!*\
  !*** D:/ems/service/websocket.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni, process) {

var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSocket = createSocket;
exports.destroySocket = destroySocket;
exports.getSocketinstance = getSocketinstance;
exports.realtimeDataProvider = void 0;
var _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ 24));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ 23));
var _uniSocket = _interopRequireDefault(__webpack_require__(/*! @hyoga/uni-socket.io */ 112));
var _system = _interopRequireDefault(__webpack_require__(/*! ./config/system */ 115));
var _realtimeDataProvider = __webpack_require__(/*! ./socket/realtime-data-provider */ 76);
// import { io2 } from 'socket.io-client/dist/socket.io.js';
// import { io } from 'socket.io-client';

var instance = "";
var realtimeDataProvider = new _realtimeDataProvider.RealtimeDataProviderService();
exports.realtimeDataProvider = realtimeDataProvider;
var NodeWebsocket = /*#__PURE__*/(0, _createClass2.default)(function NodeWebsocket() {
  var _this = this;
  (0, _classCallCheck2.default)(this, NodeWebsocket);
  this.token = uni.getStorageSync('token');
  console.log(this.token, process);

  // this.socket = io2('ws://service.iems.gree.com', {
  //     // secure: true,
  //     extraHeaders: { Authorization: this.token },
  //     path: '/homecommunity/websocket',
  //     reconnection: true,
  //     transports: ['websocket'],
  //     rejectUnauthorized: true
  // });

  this.socket = (0, _uniSocket.default)('wss://iems.neiic.com', {
    extraHeaders: {
      authorization: "".concat(encodeURIComponent(this.token)) // 强制添加Bearer前缀
    },

    query: {
      authorization: "".concat(this.token.replace(/^Bearer\s+/, ''))
    },
    secure: true,
    transports: ['websocket'],
    // path: '/socket.io',
    //  path: '/hangzhou/socket.io',
    path: "/homecommunity/websocket",
    //'/luoyang/socket.io',
    reconnectionAttempts: 20,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 30000,
    rejectUnauthorized: true,
    withCredentials: true
  });
  this.socket2 = (0, _uniSocket.default)('wss://serviceiems.gree.com', {
    extraHeaders: {
      Authorization: "".concat(this.token) // 强制添加Bearer前缀
    },

    query: {
      authorization: "".concat(this.token.replace(/^Bearer\s+/, ''))
    },
    secure: true,
    transports: ['websocket', 'polling'],
    path: '/shequKoa/websocket',
    reconnectionAttempts: 20,
    reconnectionDelay: 10000,
    reconnectionDelayMax: 30000,
    rejectUnauthorized: true,
    withCredentials: true
  });
  console.log(this.socket2, '---------------------------');
  // this.socket.on('connect', () => {
  //     console.log("socket已连接上");

  // })

  this.socket2.on('connect', function () {
    var time = new Date();
    time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
    console.log('已连接socket服务，id为' + _this.socket.id + ',开启时间：' + time);
  });

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
  this.socket2.on('connect_error', function (err) {
    var time = new Date();
    time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
    console.log('实时数据连接错误，id为' + _this.socket.id + ',发生时间：' + time);
  });
  this.socket2.on('connect_timeout', function (timeout, error) {
    console.log("socket超时", timeout, error);
  });
  this.socket2.on('connect_error', function (error) {
    console.log('尝试重新连接中...', error);
  });
  this.socket2.on('connect_failed', function (data) {
    console.log('连接失败...');
  });

  // 监听连接断开事件
  this.socket2.on('disconnect', function () {
    console.log('连接断开');
  });
  // 监听连接错误事件
  this.socket2.on('error', function (error) {
    console.log('连接错误：', error);
  });
  // 监听重连事
  console.log(this.socket, this.socket2);
  console.log("22222222");
  this.socket.on('connect', function (data) {
    var time = new Date();
    time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
    console.log('已连接socket服务，id为' + _this.socket.id + ',开启时间：' + time);
  });
  this.socket.on('error', function (err) {
    var time = new Date();
    time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
    console.log('实时数据连接错误，id为' + _this.socket.id + ',发生时间：' + time);
  });
  this.socket.on('disconnect', function (err) {
    var time = new Date();
    time = time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds() + ' ' + time.getMilliseconds();
    console.log('失去连接，断开时间：' + time);
  });
  this.socket.on('connect_error', function (error) {
    console.log('尝试重新连接中...', error);
  });
  this.socket.on('connect_failed', function (data) {
    console.log('连接失败...');
  });
});
function createSocket() {
  if (instance === "") {
    instance = new NodeWebsocket();
  }
}
function getSocketinstance() {
  createSocket();
  return instance;
}
function destroySocket() {
  if (instance !== "") {
    instance.socket.close();
    instance = "";
  }
}
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 2)["default"], __webpack_require__(/*! ./../../HBuilderX.4.76.2025082103/HBuilderX/plugins/uniapp-cli/node_modules/node-libs-browser/mock/process.js */ 131)))

/***/ }),

/***/ 1472:
/*!*****************************!*\
  !*** D:/ems/api/upgrade.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
/**
 * energy模块所用到的接口封装
 */

var upgrade = {
  /**
   * =====架构图=====
   *  */
  //日发用电量及收益数据
  findDayEnergyAndIncome: function findDayEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  //月发用电及收益数据
  findMonthEnergyAndIncome: function findMonthEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  //年发用电及收益数据
  findYearEnergyAndIncome: function findYearEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====光伏管理=====
   *  */
  //基本数据
  findPhotovoltaicEnergyInfo: function findPhotovoltaicEnergyInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPhotovoltaicEnergyInfo'),
      method: 'GET'
    });
  },
  //日月年详细曲线数据
  findDayProvideQAndPower: function findDayProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findMonthProvideQAndPower: function findMonthProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findYearProvideQAndPower: function findYearProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====储能管理=====
   *  */
  //基本数据
  findEnergyStorageInfo: function findEnergyStorageInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEnergyStorageInfo'),
      method: 'GET'
    });
  },
  findDayStorageQAndPower: function findDayStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findMonthStorageQAndPower: function findMonthStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findYearStorageQAndPower: function findYearStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====报警分析=====
   *  */
  //报警信息统计
  findDayAlarmInfoCount: function findDayAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findMonthAlarmInfoCount: function findMonthAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findYearAlarmInfoCount: function findYearAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findDayAreaAlarmInfoCount: function findDayAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findMonthAreaAlarmInfoCount: function findMonthAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findYearAreaAlarmInfoCount: function findYearAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====系统=====
   *  */
  // 报警用户管理（查询所有报警用户信息）
  findAllAlarmUser: function findAllAlarmUser() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAllAlarmUser'),
      method: 'GET'
    });
  },
  // 报警用户管理（根据工程id查询报警用户信息）
  findAlarmUserByAreaId: function findAlarmUserByAreaId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAlarmUserByAreaId'),
      method: 'GET',
      params: params
    });
  },
  // 报警用户管理（添加报警用户信息）
  addAlarmUser: function addAlarmUser(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/addAlarmUser'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====虚拟电力局=====
   *  */
  // 所有设备柔度数据
  findDeviceFlexibilityInfo: function findDeviceFlexibilityInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceFlexibilityInfo'),
      method: 'GET'
    });
  },
  // 系统柔度信息
  findSystemFlexibilityResponseInfo: function findSystemFlexibilityResponseInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findSystemFlexibilityResponseInfo'),
      method: 'GET'
    });
  },
  //获取系统总响应及收益数据
  findDaySystemResponseAndIncomeInfo: function findDaySystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDaySystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  findMonthSystemResponseAndIncomeInfo: function findMonthSystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthSystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  findYearSystemResponseAndIncomeInfo: function findYearSystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearSystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  //获取虚拟电力局每小时收益曲线数据
  findEveryHourResponseIncome: function findEveryHourResponseIncome() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEveryHourResponseIncome'),
      method: 'GET'
    });
  }
};
var _default = upgrade;
exports.default = _default;

/***/ }),

/***/ 1473:
/*!*************************!*\
  !*** D:/ems/api/nyz.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var getNyzUrl = function getNyzUrl(url) {
  // 确保不会出现双斜杠
  var baseUrl = "/shequApi/shangHaiZYNYL";
  // 如果url以斜杠开头，去掉它
  var cleanUrl = url.startsWith('/') ? url.substring(1) : url;
  return "".concat(baseUrl, "/").concat(cleanUrl);

  // if (process.env.NODE_ENV === "development") {
  //     return location.origin + `/nyzkoa` + url;
  // } else {
  //     return location.origin + `/shequKoa` + url
  // }
};

var nyz = {
  /**
   * 查询指定设备某天每小时的发电量、供馈电量、用电量
   */
  findEveryHourByDeviceIds: function findEveryHourByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl("/findEveryHourByDeviceIds"),
      method: 'post',
      data: JSON.stringify({
        data: data
      })
    });
  },
  /**
   * 查询指定设备某月每天的发电量、供馈电量、用电量
   */
  findEveryDayByDeviceIds: function findEveryDayByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl("/findEveryDayByDeviceIds"),
      method: 'post',
      data: JSON.stringify({
        data: data
      })
    });
  },
  /**
   * 查询指定设备某年每月的发电量、供馈电量、用电量
   */
  findEveryMonthByDeviceIds: function findEveryMonthByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl("/findEveryMonthByDeviceIds"),
      method: 'post',
      data: JSON.stringify({
        data: data
      })
    });
  },
  /**
   * 查询储能收益和光伏收益
   */
  findSOCAndPVIncome: function findSOCAndPVIncome(dateType, areaLevelId, date) {
    var requestURI = '';
    var params = {};
    var d = new Date(date);
    if (dateType == 'hour') {
      requestURI = '/findEveryHourSOCAndPVIncome';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0')),
        areaLevelId: areaLevelId
      };
    } else if (dateType == 'day') {
      requestURI = '/findEveryDaySOCAndPVIncome';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        areaLevelId: areaLevelId
      };
    } else if (dateType == 'month') {
      requestURI = '/findEveryMonthSOCAndPVIncome';
      params = {
        year: new Date(date).getFullYear(),
        areaLevelId: areaLevelId
      };
    }
    return (0, _request.default)({
      url: getNyzUrl(requestURI),
      method: 'GET',
      params: params
    });
  },
  /**
   * 查询储能收益和光伏收益
   */
  findAlarmRecord: function findAlarmRecord(dateType, date, areaLevelId) {
    var requestURI = '';
    var d = new Date(date);
    var params = {};
    if (dateType == 'date') {
      requestURI = '/findDayAlarmRecord';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0')),
        areaLevelId: areaLevelId
      };
    } else if (dateType == 'month') {
      requestURI = '/findMonthAlarmRecord';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        areaLevelId: areaLevelId
      };
    } else if (dateType == 'year') {
      requestURI = '/findYearAlarmRecord';
      params = {
        year: new Date(date).getFullYear(),
        areaLevelId: areaLevelId
      };
    }
    return (0, _request.default)({
      url: getNyzUrl(requestURI),
      method: 'GET',
      params: params
    });
  }
};
var _default = nyz;
exports.default = _default;

/***/ }),

/***/ 1481:
/*!*********************************!*\
  !*** D:/ems/api/upgrade_new.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
/**
 * energy模块所用到的接口封装
 */
//  import request from '../utils/request'
//  import { URL, DATA, FORMDATA } from '../utils/forSpringBoot'

var upgrade = {
  /**
   * =====架构图=====
   *  */
  //日发用电量及收益数据
  findDayEnergyAndIncome: function findDayEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  //月发用电及收益数据
  findMonthEnergyAndIncome: function findMonthEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  //年发用电及收益数据
  findYearEnergyAndIncome: function findYearEnergyAndIncome(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearEnergyAndIncome'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====光伏管理=====
   *  */
  //基本数据
  findPhotovoltaicEnergyInfo: function findPhotovoltaicEnergyInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPhotovoltaicEnergyInfo'),
      method: 'GET'
    });
  },
  //日月年详细曲线数据
  findDayProvideQAndPower: function findDayProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findMonthProvideQAndPower: function findMonthProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findYearProvideQAndPower: function findYearProvideQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearProvideQAndPower'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====储能管理=====
   *  */
  //基本数据
  findEnergyStorageInfo: function findEnergyStorageInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEnergyStorageInfo'),
      method: 'GET'
    });
  },
  findDayStorageQAndPower: function findDayStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findMonthStorageQAndPower: function findMonthStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  findYearStorageQAndPower: function findYearStorageQAndPower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearStorageQAndPower'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====报警分析=====
   *  */
  //报警信息统计
  findDayAlarmInfoCount: function findDayAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findMonthAlarmInfoCount: function findMonthAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findYearAlarmInfoCount: function findYearAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findDayAreaAlarmInfoCount: function findDayAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findMonthAreaAlarmInfoCount: function findMonthAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  findYearAreaAlarmInfoCount: function findYearAreaAlarmInfoCount(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearAreaAlarmInfoCount'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====系统=====
   *  */
  // 报警用户管理（查询所有报警用户信息）
  findAllAlarmUser: function findAllAlarmUser() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAllAlarmUser'),
      method: 'GET'
    });
  },
  // 报警用户管理（根据工程id查询报警用户信息）
  findAlarmUserByAreaId: function findAlarmUserByAreaId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAlarmUserByAreaId'),
      method: 'GET',
      params: params
    });
  },
  // 报警用户管理（添加报警用户信息）
  addAlarmUser: function addAlarmUser(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/addAlarmUser'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====虚拟电力局=====
   *  */
  // 所有设备柔度数据
  findDeviceFlexibilityInfo: function findDeviceFlexibilityInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceFlexibilityInfo'),
      method: 'GET'
    });
  },
  // 系统柔度信息
  findSystemFlexibilityResponseInfo: function findSystemFlexibilityResponseInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findSystemFlexibilityResponseInfo'),
      method: 'GET'
    });
  },
  //获取系统总响应及收益数据
  findDaySystemResponseAndIncomeInfo: function findDaySystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDaySystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  findMonthSystemResponseAndIncomeInfo: function findMonthSystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthSystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  findYearSystemResponseAndIncomeInfo: function findYearSystemResponseAndIncomeInfo(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearSystemResponseAndIncomeInfo'),
      method: 'GET',
      params: params
    });
  },
  //获取虚拟电力局每小时收益曲线数据
  findEveryHourResponseIncome: function findEveryHourResponseIncome() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEveryHourResponseIncome'),
      method: 'GET'
    });
  }
};
var _default = upgrade;
exports.default = _default;

/***/ }),

/***/ 1494:
/*!**********************************************!*\
  !*** D:/ems/community/static/images/VRV.png ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 1495:
/*!**************************************************************!*\
  !*** D:/ems/community/static/images/load-airconditioner.png ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 1496:
/*!************************************************************!*\
  !*** D:/ems/community/static/images/load-chargingPile.png ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ 1527:
/*!****************************************!*\
  !*** D:/ems/service/config/storage.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * 储能装机量，直接写死了，懒得维护了
 *
 */
var storage = {
  "381": 7,
  "382": 6.68,
  "383": 6.68,
  "384": 5.25,
  "385": 3.86,
  "386": 13.2,
  "387": 6.68,
  "388": 13.2,
  "389": 5.25,
  "400": 0,
  "401": 13.2,
  "402": 5.25,
  "403": 6.68,
  "502": 5.25,
  "503": 5.25,
  "504": 10.2,
  "505": 10.2,
  "506": 10.2
};
var _default = storage;
exports.default = _default;

/***/ }),

/***/ 1535:
/*!****************************!*\
  !*** D:/ems/utils/wind.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WWindUtil = void 0;
/**
 * 气象-风向转化工具
 */
var WWindUtil = {};
/**
 * 风向json
 */
exports.WWindUtil = WWindUtil;
WWindUtil.WDJson = {
  "N": {
    "en": "N",
    "cn": "北",
    "desc": "北"
  },
  "NNE": {
    "en": "NNE",
    "cn": "北东北",
    "desc": "东北偏北"
  },
  "NE": {
    "en": "NE",
    "cn": "东北",
    "desc": "东北"
  },
  "ENE": {
    "en": "ENE",
    "cn": "东东北",
    "desc": "东北偏北"
  },
  "E": {
    "en": "E",
    "cn": "东",
    "desc": "东"
  },
  "ESE": {
    "en": "ESE",
    "cn": "东东南",
    "desc": "东南偏东"
  },
  "SE": {
    "en": "SNE",
    "cn": "东南",
    "desc": "东南"
  },
  "SSE": {
    "en": "SSE",
    "cn": "南东南",
    "desc": "东南偏南"
  },
  "S": {
    "en": "S",
    "cn": "南",
    "desc": "南"
  },
  "SSW": {
    "en": "SSW",
    "cn": "南西南",
    "desc": "西南偏南"
  },
  "SW": {
    "en": "SW",
    "cn": "西南",
    "desc": "西南"
  },
  "WSW": {
    "en": "WSW",
    "cn": "西西南",
    "desc": "西南偏西"
  },
  "W": {
    "en": "W",
    "cn": "西",
    "desc": "西"
  },
  "WNW": {
    "en": "WNW",
    "cn": "西西北",
    "desc": "西北偏西"
  },
  "NW": {
    "en": "NW",
    "cn": "西北",
    "desc": "西北"
  },
  "NNW": {
    "en": "NW",
    "cn": "北西北",
    "desc": "西北偏北"
  },
  "ERROR": {
    "en": "error value",
    "cn": "错误数值",
    "desc": "错误数值"
  }
};

/**
 * 风力等级
 */
WWindUtil.WRatingArr = [{
  "min": 0.0,
  "max": 0.2,
  "level": 0,
  "name": "无风",
  "landScene": "静，烟直上"
}, {
  "min": 0.3,
  "max": 1.5,
  "level": 1,
  "name": "软风",
  "landScene": "烟示风向"
}, {
  "min": 1.6,
  "max": 3.3,
  "level": 2,
  "name": "轻风",
  "landScene": "感觉有风"
}, {
  "min": 3.4,
  "max": 5.4,
  "level": 3,
  "name": "微风",
  "landScene": "旌旗展开"
}, {
  "min": 5.5,
  "max": 7.9,
  "level": 4,
  "name": "和风",
  "landScene": "吹起尘土"
}, {
  "min": 8.0,
  "max": 10.7,
  "level": 5,
  "name": "劲风",
  "landScene": "小树摇摆"
}, {
  "min": 10.8,
  "max": 13.8,
  "level": 6,
  "name": "强风",
  "landScene": "电线有声"
}, {
  "min": 13.9,
  "max": 17.1,
  "level": 7,
  "name": "疾风",
  "landScene": "步行困难"
}, {
  "min": 17.2,
  "max": 20.7,
  "level": 8,
  "name": "大风",
  "landScene": "折毁树枝"
}, {
  "min": 20.8,
  "max": 24.4,
  "level": 9,
  "name": "烈风",
  "landScene": "小损房屋"
}, {
  "min": 24.5,
  "max": 28.4,
  "level": 10,
  "name": "狂风",
  "landScene": "拔起树木"
}, {
  "min": 28.5,
  "max": 32.6,
  "level": 11,
  "name": "暴风",
  "landScene": "损毁重大"
}, {
  "min": 32.7,
  "max": 36.9,
  "level": 0,
  "name": "飓风",
  "landScene": "摧毁极大"
}, {
  "min": 37.0,
  "max": 41.4,
  "level": 13,
  "name": "",
  "landScene": ""
}, {
  "min": 41.5,
  "max": 46.1,
  "level": 14,
  "name": "",
  "landScene": ""
}, {
  "min": 46.2,
  "max": 50.9,
  "level": 15,
  "name": "",
  "landScene": ""
}, {
  "min": 51.0,
  "max": 56.0,
  "level": 16,
  "name": "",
  "landScene": ""
}, {
  "min": 56.1,
  "max": null,
  "level": 17,
  "name": "",
  "landScene": ""
}];

/** 风向值转文字风向16向
 * @param {Object} windNumberValue 风向值
 */
WWindUtil.to16WindDirection = function (windNumberValue) {
  if (windNumberValue > 360) {
    return WWindUtil.WDJson.ERROR;
  }
  var a = Math.ceil(windNumberValue / 11.25);
  var ret;
  switch (a) {
    case 32:
    case 1:
      ret = WWindUtil.WDJson.N;
      break;
    case 2:
    case 3:
      ret = WWindUtil.WDJson.NNE;
      break;
    case 4:
    case 5:
      ret = WWindUtil.WDJson.NE;
      break;
    case 6:
    case 7:
      ret = WWindUtil.WDJson.ENE;
      break;
    case 8:
    case 9:
      ret = WWindUtil.WDJson.E;
      break;
    case 10:
    case 11:
      ret = WWindUtil.WDJson.ESE;
      break;
    case 12:
    case 13:
      ret = WWindUtil.WDJson.SE;
      break;
    case 14:
    case 15:
      ret = WWindUtil.WDJson.SSE;
      break;
    case 16:
    case 17:
      ret = WWindUtil.WDJson.S;
      break;
    case 18:
    case 19:
      ret = WWindUtil.WDJson.SSW;
      break;
    case 20:
    case 21:
      ret = WWindUtil.WDJson.SW;
      break;
    case 22:
    case 23:
      ret = WWindUtil.WDJson.WSW;
      break;
    case 24:
    case 25:
      ret = WWindUtil.WDJson.W;
      break;
    case 26:
    case 27:
      ret = WWindUtil.WDJson.WNW;
      break;
    case 28:
    case 29:
      ret = WWindUtil.WDJson.NW;
      break;
    case 30:
    case 31:
      ret = WWindUtil.WDJson.NNW;
      break;
    default:
      ret = WWindUtil.WDJson.ERROR;
      break;
  }
  return ret;
};

/** 风向值转文字风向8向
 * @param {Object} windNumberValue 风向值
 */
WWindUtil.to8WindDirection = function (windNumberValue) {
  if (windNumberValue > 360) {
    return WWindUtil.WDJson.ERROR;
  }
  var a = Math.ceil(windNumberValue / 22.5);
  var ret;
  switch (a) {
    case 16:
    case 1:
      ret = WWindUtil.WDJson.N;
      break;
    case 2:
    case 3:
      ret = WWindUtil.WDJson.NE;
      break;
    case 4:
    case 5:
      ret = WWindUtil.WDJson.E;
      break;
    case 6:
    case 7:
      ret = WWindUtil.WDJson.SE;
      break;
    case 8:
    case 9:
      ret = WWindUtil.WDJson.S;
      break;
    case 10:
    case 11:
      ret = WWindUtil.WDJson.SW;
      break;
    case 12:
    case 13:
      ret = WWindUtil.WDJson.W;
      break;
    case 14:
    case 15:
      ret = WWindUtil.WDJson.NW;
      break;
    default:
      ret = WWindUtil.WDJson.ERROR;
      break;
  }
  return ret;
};

/** 风速转风力等级
 * @param {Object} value 风速值 (m/s)
 */
WWindUtil.WindtoLevel = function (value) {
  var vl = Number(value);
  if (vl < 0) {
    return null;
  }
  var arr = WWindUtil.WRatingArr;
  if (vl >= arr[arr.length - 1].min) {
    return arr[arr.length - 1];
  }
  for (var i = 0; i < arr.length; i++) {
    if (vl >= arr[i].min && vl <= arr[i].max) {
      return arr[i];
    }
  }
  return null;
};

// 风向值转文字
WWindUtil.windValueFormat = function (value) {
  try {
    var vl = Number(value);
    if (!vl || vl > 360 || vl < 0) {
      return '-';
    }
    return WWindUtil.to16WindDirection(value).desc;
  } catch (e) {
    return '-';
  }
};

/** 风速值转文字描述(只有等级)
 * @param {Object} value 风速值
 */
WWindUtil.windFormatLevel = function (value) {
  try {
    var vl = Number(value);
    if (!vl || vl > 100 || vl < 0) {
      return "-";
    }
    return WWindUtil.WindtoLevel(value).level + "级(" + WWindUtil.WindtoLevel(value).name + ")";
  } catch (e) {
    return "-";
  }
};

/***/ }),

/***/ 1536:
/*!*****************************!*\
  !*** D:/ems/api/weather.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
/**
 * 关于天气所用到的接口封装
 */

// import { findOriginBy_id, findOriginByLevel } from './utils/findOrigin'

var weather = {
  findWeatherMonitoringByFrameDatetimeBetween: function findWeatherMonitoringByFrameDatetimeBetween() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherMonitoringByFrameDatetimeBetween'),
      method: "GET"
    });
  },
  //气象站从能源站上报后用设备id查询气象数据
  findWeatherMonitoringByFrameDatetimeBetweenByDeviceId: function findWeatherMonitoringByFrameDatetimeBetweenByDeviceId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherMonitoringByFrameDatetimeBetweenByDeviceId'),
      method: "GET",
      params: params
    });
  },
  // 2.获取天气数据（辐照度和温度）用设备id查询
  findWeatherStationByDaysByDeviceId: function findWeatherStationByDaysByDeviceId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherStationByDaysByDeviceId'),
      method: 'GET',
      params: params
    });
  },
  // 获取历史最大辐照度
  queryMaxIrradiance: function queryMaxIrradiance(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/queryMaxIrradiance'),
      method: "GET",
      params: params
    });
  }
};
var _default = weather;
exports.default = _default;

/***/ }),

/***/ 1544:
/*!*****************************!*\
  !*** D:/ems/utils/tools.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
// utils/tools.js
/**
 * 防抖函数 - 限制函数的执行频率
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} - 返回一个防抖后的函数
 */
function debounce(func) {
  var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
  var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var timeout;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var context = this;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/***/ }),

/***/ 914:
/*!****************************!*\
  !*** D:/ems/api/center.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! ../utils/request */ 75));
var _getUrl = _interopRequireDefault(__webpack_require__(/*! ../utils/get-url */ 117));
var center = {
  /**
   * 获取社区所有节点列表
   */
  getCenterList: function getCenterList(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/getCenterList"),
      method: 'get',
      params: params
    });
  },
  /**
   * 根据层级获取社区所有节点列表
   */
  getCenterListByLevel: function getCenterListByLevel(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/getCenterListByLevel"),
      method: 'get',
      params: params
    });
  },
  /**
   * 更新分中心节点信息
   */
  updateCenter: function updateCenter(data) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/updateCenter"),
      method: 'post',
      data: data
    });
  },
  /**
   * 创建分中心节点信息
   */
  createCenter: function createCenter(data) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/createCenter"),
      method: 'post',
      data: data
    });
  },
  /**
   * 删除分中心节点信息
   */
  removeCenter: function removeCenter(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/removeCenter"),
      method: 'get',
      params: params
    });
  },
  /**
   * 根据选择区域的id获取该区域下的全部设备信息
   */
  findDeviceInfoByAreaLevelId: function findDeviceInfoByAreaLevelId(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/center/findDeviceInfoByAreaLevelId"),
      method: 'get',
      params: params
    });
  }
};
var _default = center;
exports.default = _default;

/***/ }),

/***/ 915:
/*!*******************************!*\
  !*** D:/ems/api/statistic.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/defineProperty */ 11));
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _getUrl = _interopRequireDefault(__webpack_require__(/*! @/utils/get-url */ 117));
var _statistic;
var statistic = (_statistic = {
  /**
   * 获取当前年累计数据
   */
  getCenterTotalEnergyData: function getCenterTotalEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterTotalEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取当前日数据
   */
  getCenterDayEnergyData: function getCenterDayEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterDayEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取当前小时数据
   */
  getCenterHourEnergyData: function getCenterHourEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterHourEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取当前月数据
   */
  getCenterMonthEnergyData: function getCenterMonthEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterMonthEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取当前年数据
   */
  getCenterYearEnergyData: function getCenterYearEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterYearEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取小时统计数据列表
   */
  getCenterHourStatisticData: function getCenterHourStatisticData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterHourStatisticData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取天统计数据列表
   */
  getCenterDayStatisticData: function getCenterDayStatisticData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterDayStatisticData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取月统计数据列表
   */
  getCenterMonthStatisticData: function getCenterMonthStatisticData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterMonthStatisticData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取年统计数据列表
   */
  getCenterYearStatisticData: function getCenterYearStatisticData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getCenterYearStatisticData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的发电、储能、电网、用电的实时功率
   */
  findHomeCommunityPowerSumByLevelIds: function findHomeCommunityPowerSumByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityPowerSumByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的某日的发电、储能、电网、用电的电量总和
   */
  findHomeCommunityCapacitySumByLevelIds: function findHomeCommunityCapacitySumByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityCapacitySumByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的累计的发电、储能、电网、用电的电量总和
   */
  findHomeCommunityTotalCapacitySumByLevelIds: function findHomeCommunityTotalCapacitySumByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityTotalCapacitySumByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取当前辐照度
   */
  findDayIrradianceInfo: function findDayIrradianceInfo(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findDayIrradianceInfo"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的每小时用电量的同比值、环比值、峰平比
   */
  findDayConsumptionQProportionByLevelIds: function findDayConsumptionQProportionByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findDayConsumptionQProportionByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的每天用电量的同比值、环比值、峰平比
   */
  findMonthConsumptionQProportionByLevelIds: function findMonthConsumptionQProportionByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findMonthConsumptionQProportionByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的每月用电量的同比值、环比值、峰平比
   */
  findYearConsumptionQProportionByLevelIds: function findYearConsumptionQProportionByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findYearConsumptionQProportionByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级的低碳指标、碳中和指标
   */
  findLowCarbonDataByLevelIds: function findLowCarbonDataByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findLowCarbonDataByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取天的每个小时层级统计数据、报表数据（SOC）
   */
  findDayStatisticsDetailsByLevelIdAndDay: function findDayStatisticsDetailsByLevelIdAndDay(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findDayStatisticsDetailsByLevelIdAndDay"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取月的每天层级统计数据、报表数据（同比、环比、SOC、峰平比）
   */
  findMonthStatisticsDetailsByLevelIdAndMonth: function findMonthStatisticsDetailsByLevelIdAndMonth(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findMonthStatisticsDetailsByLevelIdAndMonth"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取年的每月层级统计数据、报表数据（同比、SOC、峰平比）
   */
  findYearStatisticsDetailsByLevelIdAndYear: function findYearStatisticsDetailsByLevelIdAndYear(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findYearStatisticsDetailsByLevelIdAndYear"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取每个层级的某日的发电、储能、电网、用电的电量
   */
  findHomeCommunityCapacityByLevelIdsAndDay: function findHomeCommunityCapacityByLevelIdsAndDay(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityCapacityByLevelIdsAndDay"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取每个层级的某月的发电、储能、电网、用电的电量
   */
  findHomeCommunityMonthCapacitySumByLevelIds: function findHomeCommunityMonthCapacitySumByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityMonthCapacitySumByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取每个层级的某年的发电、储能、电网、用电的电量
   */
  findHomeCommunityYearCapacitySumByLevelIds: function findHomeCommunityYearCapacitySumByLevelIds(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityYearCapacitySumByLevelIds"),
      method: 'get',
      params: params
    });
  },
  /**
   * 周报表每日统计数据
   */
  findStatisticsDayByLevelIdsAndDays: function findStatisticsDayByLevelIdsAndDays(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findStatisticsDayByLevelIdsAndDays"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取某个层级某天的类型（发/储/用/网）功率之和
   */
  findHomeCommunityPowerSumByLevelIdAndDataType: function findHomeCommunityPowerSumByLevelIdAndDataType(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findHomeCommunityPowerSumByLevelIdAndDataType"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级（社区/分中心）的发、储、并、用的每分钟功率
   */
  findPowerByLevelIdsAndDate: function findPowerByLevelIdsAndDate(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findPowerByLevelIdsAndDate"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级天的每小时层级统计数据
   */
  findDayStatisticsDetailsByLevelIdsAndDay: function findDayStatisticsDetailsByLevelIdsAndDay(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findDayStatisticsDetailsByLevelIdsAndDay"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级天的每小时随机的多个层级统计数据
   */
  findDayStatisticsDetailsByRandomLevelIdsAndDay: function findDayStatisticsDetailsByRandomLevelIdsAndDay(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findDayStatisticsDetailsByRandomLevelIdsAndDay"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级月的每天层级统计数据
   */
  findMonthStatisticsDetailsByLevelIdsAndMonth: function findMonthStatisticsDetailsByLevelIdsAndMonth(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findMonthStatisticsDetailsByLevelIdsAndMonth"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级月的每天随机的层级统计数据
   */
  findMonthStatisticsDetailsByRandomLevelIdsAndMonth: function findMonthStatisticsDetailsByRandomLevelIdsAndMonth(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findMonthStatisticsDetailsByRandomLevelIdsAndMonth"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级年的每月层级统计数据
   */
  findYearStatisticsDetailsByLevelIdsAndYear: function findYearStatisticsDetailsByLevelIdsAndYear(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findYearStatisticsDetailsByLevelIdsAndYear"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取多个层级年的每月随机的层级统计数据
   */
  findYearStatisticsDetailsByRandomLevelIdsAndYear: function findYearStatisticsDetailsByRandomLevelIdsAndYear(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findYearStatisticsDetailsByRandomLevelIdsAndYear"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取某个层级下的光储直柔能源数据
  */
  getOpticalStorageEnergyData: function getOpticalStorageEnergyData(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/getOpticalStorageEnergyData"),
      method: 'get',
      params: params
    });
  },
  /**
   * 获取某个层级下的能量类型
   */
  findCleanElectricityType: function findCleanElectricityType(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findCleanElectricityType"),
      method: 'get',
      params: params
    });
  },
  /**
   * 根据设备Id获取电表曲线的数据
   */
  findPowerByDeviceIdAndDate: function findPowerByDeviceIdAndDate(params) {
    return (0, _request.default)({
      url: (0, _getUrl.default)("/statistic/findPowerByDeviceIdAndDate"),
      method: 'get',
      params: params
    });
  }
}, (0, _defineProperty2.default)(_statistic, "findLowCarbonDataByLevelIds", function findLowCarbonDataByLevelIds(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findLowCarbonDataByLevelIds"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findLowCarbonDatasByLevelIds", function findLowCarbonDatasByLevelIds(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findLowCarbonDataByLevelIds"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findDayStorageEfficiency", function findDayStorageEfficiency(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findDayStorageEfficiency"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findWeatherStationByDays", function findWeatherStationByDays(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findWeatherStationByDays"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "getPersonConsumptionByDay", function getPersonConsumptionByDay(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/getPersonConsumptionByDay"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "getUnitAreaConsumptionByDay", function getUnitAreaConsumptionByDay(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/getUnitAreaConsumptionByDay"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findSubareaConsumptionByMonth", function findSubareaConsumptionByMonth(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findSubareaConsumptionByMonth"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findSubareaConsumptionByYear", function findSubareaConsumptionByYear(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findSubareaConsumptionByYear"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findMonthStorageEfficiency", function findMonthStorageEfficiency(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findMonthStorageEfficiency"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findYearStorageEfficiency", function findYearStorageEfficiency(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findYearStorageEfficiency"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findMonthIrradianceInfo", function findMonthIrradianceInfo(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findMonthIrradianceInfo"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findYearIrradianceInfo", function findYearIrradianceInfo(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findYearIrradianceInfo"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "getCenterYearStatisticData", function getCenterYearStatisticData(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/getCenterYearStatisticData"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findMaxQAndDateByLevelIdsAndYear", function findMaxQAndDateByLevelIdsAndYear(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findMaxQAndDateByLevelIdsAndYear"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findDeviceCategoryConsumptionByDay", function findDeviceCategoryConsumptionByDay(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findDeviceCategoryConsumptionByDay"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findDeviceCategoryConsumptionByMonth", function findDeviceCategoryConsumptionByMonth(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findDeviceCategoryConsumptionByMonth"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findDeviceCategoryConsumptionByYear", function findDeviceCategoryConsumptionByYear(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findDeviceCategoryConsumptionByYear"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay", function findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findDayCategoryStatisticsDetailsByRandomLevelIdsAndDay"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth", function findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findMonthCategoryStatisticsDetailsByRandomLevelIdsAndMonth"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear", function findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findYearCategoryStatisticsDetailsByRandomLevelIdsAndYear"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "getFaceAccessInformation", function getFaceAccessInformation(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/getFaceAccessInformation"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "getFaceAccessInformationsBytime", function getFaceAccessInformationsBytime(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/getFaceAccessInformationsBytime"),
    method: 'get',
    params: params
  });
}), (0, _defineProperty2.default)(_statistic, "findT1804StateByAreaLevelId", function findT1804StateByAreaLevelId(params) {
  return (0, _request.default)({
    url: (0, _getUrl.default)("/statistic/findT1804StateByAreaLevelId"),
    method: 'get',
    params: params
  });
}), _statistic);
var _default = statistic;
exports.default = _default;

/***/ }),

/***/ 916:
/*!*****************************!*\
  !*** D:/ems/api/nyz_new.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
// import Moment from 'moment'

var getNyzUrl = function getNyzUrl(url) {
  return "/shequApi" + url;
};
var nyz_new = {
  /**
   * 查询充放电最大最小功率
   */
  queryHighestChargeAndPower: function queryHighestChargeAndPower(data) {
    return (0, _request.default)({
      url: getNyzUrl("/homeCommunity/queryHighestChargeAndPower"),
      method: 'post',
      data: data
    });
  },
  /**
   * 查询储能日功率曲线
   */
  queryStoragePowerCurve: function queryStoragePowerCurve(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)("/homeCommunity/queryStoragePowerCurve"),
      method: 'post',
      data: data
    });
  },
  /**
   * 查询正反向电能
   */
  findEveryHourByDeviceIds: function findEveryHourByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl('/shangHaiZYNYL/findEveryHourByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findEveryDayByDeviceIds: function findEveryDayByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl('/shangHaiZYNYL/findEveryDayByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findEveryMonthByDeviceIds: function findEveryMonthByDeviceIds(data) {
    return (0, _request.default)({
      url: getNyzUrl('/shangHaiZYNYL/findEveryMonthByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  getStorageRemainEnergy: function getStorageRemainEnergy(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/v4/quickQuery/battery_stack_discharge/db_deviceId'),
      method: "get",
      params: params
    });
  }
};
var _default = nyz_new;
exports.default = _default;

/***/ }),

/***/ 917:
/*!********************************!*\
  !*** D:/ems/api/energy_new.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
/**
 * energy模块所用到的接口封装
 */
// import request from '../utils/request'
// // import Moment from 'moment'
// import { URL, DATA, FORMDATA } from '../utils/forSpringBoot'

var energy = {
  /**
   * =====电表曲线=====
   *  */
  // 1.获取电表曲线数据（最大值，最小值，平均值）
  findPowerByDeviceIdAndDate: function findPowerByDeviceIdAndDate(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPowerByDeviceIdAndDate'),
      method: 'GET',
      params: params
    });
  },
  //2.获取电梯A相电流数据
  findAphaseCurrentByDeviceIdAndDate: function findAphaseCurrentByDeviceIdAndDate(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAphaseCurrentByDeviceIdAndDate'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====发电分析=====
   */
  // 1.获取各个箱子的发电数据（预测发电量，实际发电量，相差）
  findHomeCommunityPowerSumByRandomLevelIdsAndDataType: function findHomeCommunityPowerSumByRandomLevelIdsAndDataType(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findHomeCommunityPowerSumByRandomLevelIdsAndDataType'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 2.获取天气数据（辐照度和温度）
  findWeatherStationByDays: function findWeatherStationByDays(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherStationByDays'),
      method: 'GET',
      params: params
    });
  },
  // 2.获取天气数据（辐照度和温度）用设备id查询
  findWeatherStationByDaysByDeviceId: function findWeatherStationByDaysByDeviceId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherStationByDaysByDeviceId'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====能源曲线数据=====
   */
  // 1.单个箱子数据
  findHomeCommunityPowerSumByLevelIdAndDataType: function findHomeCommunityPowerSumByLevelIdAndDataType(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 2.获取多个层级（社区/分中心）的发、储、并、用的每分钟功率
  findPowerByLevelIdsAndDate: function findPowerByLevelIdsAndDate(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPowerByLevelIdsAndDate'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  /**
   * 获取某日的总用电、人均用电、单位面积用电
   */
  findSubareaConsumptionByDay: function findSubareaConsumptionByDay(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findSubareaConsumptionByDay'),
      method: 'GET',
      params: params
    });
  },
  /**
   * 周报表每日统计数据
   */
  findStatisticsDayByLevelIdsAndDays: function findStatisticsDayByLevelIdsAndDays(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findStatisticsDayByLevelIdsAndDays'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findAtrributes: function findAtrributes(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/atrributes'),
      method: 'GET',
      params: params
    });
  },
  getAtrributesData: function getAtrributesData(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/atrributesData'),
      method: 'GET',
      params: params
    });
  },
  // 获取多个层级天的每小时层级统计数据 ------获取光伏未来社区、分中心的日报表数据
  findDayStatisticsDetailsByLevelIdsAndDay: function findDayStatisticsDetailsByLevelIdsAndDay(ids, time) {
    var data = {
      areaLevelIds: ids,
      date: time
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取多个层级月的每天层级统计数据 ------获取光伏未来社区、分中心的月报表数据
  findMonthStatisticsDetailsByLevelIdsAndMonth: function findMonthStatisticsDetailsByLevelIdsAndMonth(ids, time) {
    var data = {
      areaLevelIds: ids,
      month: new Date(time).getMonth() + 1,
      year: new Date(time).getFullYear()
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取多个层级年的每月层级统计数据 ------获取光伏未来社区、分中心的年报表数据
  findYearStatisticsDetailsByLevelIdsAndYear: function findYearStatisticsDetailsByLevelIdsAndYear(ids, time) {
    var data = {
      areaLevelIds: ids,
      year: new Date(time).getFullYear()
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取碳排因子
  queryCarbonFactor: function queryCarbonFactor(areaId, year) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)("/carbon/factor/areaId/".concat(areaId, "/year/").concat(year)),
      method: 'GET'
    });
  },
  // 设备管理 => 负荷曲线
  findConsumeQAndPower: function findConsumeQAndPower(dateType, date) {
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayConsumeQAndPower';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthConsumeQAndPower';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearConsumeQAndPower';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 设备管理 => 总设备信息
  findAllDeviceInfo: function findAllDeviceInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAllDeviceInfo'),
      method: 'GET'
    });
  },
  // 设备管理 => 所有设备
  findDeviceEnergyInfo: function findDeviceEnergyInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceEnergyInfo'),
      method: 'GET'
    });
  },
  // 经济性分析 => 经济性分析信息概览
  findEconomicalAnalysisInfo: function findEconomicalAnalysisInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEconomicalAnalysisInfo'),
      method: 'GET'
    });
  },
  // 经济性分析 => 峰平谷电价及运行收益
  findPeakFlatValleyElectrovalenceAndIncome: function findPeakFlatValleyElectrovalenceAndIncome(dateType, date) {
    console.log(date, "-------------");
    dateType = 'hour';
    var requestURI = '';
    var params = {};
    if (dateType == 'hour') {
      requestURI = '/homeCommunity/findDayPeakFlatValleyElectrovalenceAndIncome';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'day') {
      requestURI = '/homeCommunity/findMonthPeakFlatValleyElectrovalenceAndIncome';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findYearPeakFlatValleyElectrovalenceAndIncomeonsumeQAndPower';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 经济性分析 => 碳排因子响应及电力响应收益
  findCarbonEmissionFactorAndPowerFactorIncome: function findCarbonEmissionFactorAndPowerFactorIncome(dateType, date) {
    console.log(date, "-------------");
    var requestURI = '';
    var params = {};
    if (dateType == 'hour') {
      requestURI = '/homeCommunity/findDayCarbonEmissionFactorAndPowerFactorIncome';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'day') {
      requestURI = '/homeCommunity/findMonthCarbonEmissionFactorAndPowerFactorIncomethConsumeQAndPower';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findYearCarbonEmissionFactorAndPowerFactorIncome';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 设备管理 => 获取所有设备列表
  findDeviceInfoList: function findDeviceInfoList() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceInfoList'),
      method: 'GET'
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findAlarmInfoCount: function findAlarmInfoCount(dateType, date) {
    console.log(date, "-------------");
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAlarmInfoCount';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findAreaAlarmInfoCount: function findAreaAlarmInfoCount(dateType, date) {
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAreaAlarmInfoCount';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAreaAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAreaAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findDeviceAlarmInfoCount: function findDeviceAlarmInfoCount(dateType, date) {
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayDeviceAlarmInfoCount';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthDeviceAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearDeviceAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findSeverityLevelAlarmInfoCount: function findSeverityLevelAlarmInfoCount(dateType, date) {
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDaySeverityLevelAlarmInfoCount';
      params = {
        day: new Date(date).toISOString().split('T')[0]
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthSeverityLevelAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearSeverityLevelAlarmInfoCount';
      params = {
        year: new Date(date).getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 以列表的形式查询所有的告警信息，每个告警都有级别（紧急、次要、提示）
  findAlarmInfoList: function findAlarmInfoList(dateType, date, deviceType, area) {
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAlarmInfoList';
      params = {
        day: new Date(date).toISOString().split('T')[0],
        area: area,
        deviceType: deviceType
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAlarmInfoList';
      params = {
        year: new Date(date).getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        area: area,
        deviceType: deviceType
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAlarmInfoList';
      params = {
        year: new Date(date).getFullYear(),
        area: area,
        deviceType: deviceType
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 查询设备日功率曲线
  queryStoragePowerCurve: function queryStoragePowerCurve(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)("/homeCommunity/queryStoragePowerCurve"),
      method: 'post',
      data: data
    });
  },
  queryFlexibility: function queryFlexibility(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/queryFlexibility'),
      method: 'GET',
      params: params
    });
  },
  //柔性负载总功率
  findFlexibilityLoadPowerTotal: function findFlexibilityLoadPowerTotal(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/v3/quickQuery/flexibilityLoadPowerTotal'),
      method: "GET",
      params: params
    });
  },
  findFlexibilityLoadPowerV2: function findFlexibilityLoadPowerV2(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/v4/quickQuery/flexibilityLoadPowerV2/devId'),
      method: "GET",
      params: params
    });
  },
  findEveryHourByDeviceIds: function findEveryHourByDeviceIds(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/shangHaiZYNYL/findEveryHourByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findEveryDayByDeviceIds: function findEveryDayByDeviceIds(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/shangHaiZYNYL/findEveryDayByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findEveryMonthByDeviceIds: function findEveryMonthByDeviceIds(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/shangHaiZYNYL/findEveryMonthByDeviceIds'),
      method: "POST",
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  queryMeterDevicePower: function queryMeterDevicePower(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/v4/quickQuery/1803_V2_2power/db_deviceId'),
      method: 'GET',
      params: params
    });
  }
};
var _default = energy;
exports.default = _default;

/***/ }),

/***/ 948:
/*!*********************************************************!*\
  !*** D:/ems/community/static/images/monitor-active.png ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRUQ3RUM1NEJGMTExRjA4NEI0RURGNTczNjQyODE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRUQ3RUM2NEJGMTExRjA4NEI0RURGNTczNjQyODE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZFRDdFQzM0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZFRDdFQzQ0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7wPotJAAAD7klEQVR42uxZWWxNQRj+5pyjBEVri7XSIpZQsdRDxdJqkHiwPHiQklgSW5BYHyzBk+WFIBJLYgsSURIhtlpLE6qpIGIp2hBLekusrXtn/DPn3urmnntOT6W3zp/86enM3Jn55vv/b/5zLxNCoDGYhkZiHhAPiAfkPwFiVG/I2OyPoT9byTPJ4xrYfkvJD5OvuLTKKA8LhGwL+eIGevBxwb39IF9tFVqZURBJcyPJkfgoABLvqVbUqZaVdYljmDNaw+AEpv6//1pg3zWON6UieoB0i2fYMUNHy6Z/2kb0ZhiUoGPxoQCKfSI6gMwapSkQdwsFtp0PqLblE3QMS2Sqb0NWoE6bqQvbtnIktIAE4fsK5SFAQ3qwOoGQbO+cqSuGm9NhSZfPsk32uZvstc3nUjRVZnvaLr9y+SzbZJ+rQPJfmbteNl5HfAugXSw9U2hJ83OgT2frk0vrxzCgK3OdbVtATuVxcMKSksRwYpGBYwsM9SxBxDYD1k3S0T7275+XY+an61iYoUFj7rJtC0ifTkxtoPQb8L3c9FtPBRYdDKDwg1AgNk7V0bTJX+oKSuQ2zYGkDgzjBmoRs33/lXBXtdL7m8e2JzuA7MdVJ19zMoDtmQZ6dmRYPVGvoWAynMYna+qQ5SyzR2q4+YTja5nZv/8GRzLJeIjtkMl+2ecaI4l0iontmWIh51nNE/r4hdg4HcCLD2aCnllqKF8/WUdCW4Yl4zQF4Hgux6M3Aq2Jmempf5YvLhHYe9XcsAzfENvqfipxkZH0fiYbOTR52a/ax3z7CXRszSh0ql6YKYk6Ymilt58EjuRw9GhHskoX66QhGs4ViIqNpgXXOHSL4+htbkv1ImKEMRlW5tDLj7htCY0JHteOCxzlfuDpO4GLDzkMmnJemjmvDMnk7gxl1H82n9uW74iASGls2xIoIUnMfy0cXZg/icW8Skl74DrHd4r/FKoKhlNeTBlqbuV8AcfnH/VU/YbYuEJshP1iMoyEVv+cj5Tv6B3z5BeO1TCmL1NjsvKc3bCWQKSUpvZmQSDC8YVZm4Rm3TPrqE5tGAwadue5wFuHVbRlsqf2otonBij8KJSHM7sS+isgpZxj01QT7Kl7HE7NkpGxFWFlfVJSfaRcStmsfGGGk9BcYiHvpcDz9wIFRc4LN0tGHhQLdGhl5kckJt9J7Jbzu6/wKpJdL0DkBXY8t35fioqIraIS75298QPxRcG+fZEAORwFQPZFkuwrg3d0Q/4Se22NosLpj6EZm/2RDhVhChjHdmmV4Q4QG2ArgFRf3FOtxgzEldCyyBfLHHEj5NwMWuGwn3mh9a9Uy0t2D4gHxAPiuv0WYADaBaJ7DMODegAAAABJRU5ErkJggg=="

/***/ }),

/***/ 951:
/*!******************************************************!*\
  !*** D:/ems/community/static/images/mine-active.png ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRUI0MTg5NEJGMTExRjA4NEI0RURGNTczNjQyODE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRUI0MThBNEJGMTExRjA4NEI0RURGNTczNjQyODE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZFQjQxODc0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZFQjQxODg0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5KPmoDAAACOElEQVR42uyaSyiEURTHvxHyCFMeeW5EFpImjx1pahZCE1ZYIGUhYsVKiZWF2FiQYkEppWwsWNhIFiyIUh4LTY2FRGSiYfxvc2zUaOZ+Z+bepu/Ur6b57ty5/3vPvfecM2MLBAJGPFiCESdmCbGERMkSQz1wzfo5+k8BBTRhXvButsP9icSYrUgZWAC3wAfuwA14AxdgGuTo7Fpi9ufBJRgFpX+e20AlmCSR4/SeVkLywQEYA8lhtM8Es2ALpEV1j0RgYiB7oEris500hnYQUL0ic5Iifs1NrqjUtYTPDzJMxhSwqxQywrSqWaBPpRA346nnViWkmE4rLqtRJaSQ+U7LIBeLuRCt4jQzg3lgHosIZ15VCLkHT4xCzsC3CiHiS3cZhewaCv18kdGtVlQKOabAjyPM8aqOtYaAx+RkzOgQxj8CJ+UYkdoRaAOfuuQj16AebIfZ3k/7y0kToVWG+ET5RQPYCZGfP4M1UA2GwUfUiw8m7JBIpnQ3j157aOW+YlpFYTDh91eE1iGKVpYg0b4VrBvBEo+Pcm0OXoxguUj03RxphSUS16oDS8ARpUnNpNRZ0ANOwAA451yRXtrAjhh6Sy1dlh1cQrrBqhFevYrbUsEmcJkVUg6WDcaKoIQlgQ2Qa0aIKIGma3AoCRFTskLE7dui0QnbD7JlhHRpdlWI/eKWEdKk4b3XKCOkQkMhJTJC7BoKKYqXWCvVChotIZYQS0h82H+J1amG4w35C4DN+r+WZvYjwAADl20wvCWligAAAABJRU5ErkJggg=="

/***/ }),

/***/ 952:
/*!**************************************************!*\
  !*** D:/ems/community/static/images/monitor.png ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRUQ3RUMxNEJGMTExRjA4NEI0RURGNTczNjQyODE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRUQ3RUMyNEJGMTExRjA4NEI0RURGNTczNjQyODE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZFQjQxOEI0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZFQjQxOEM0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4o1kImAAAC8UlEQVR42uyZX4hMURzH564lKbKKhCQlovwpf0ZsaUgZ0vjzIMwDmwcP7EYktSVp8qf82ad94EFLebBM1LahiUzyQP68MOFts5RYthardX1PfaeO28yde+6co2v2/OrTOXvO3Lnne3+/8/udO+u4rhurBauL1YhZIVaIFTJMhNR7B7JduVFozoA0aIjYer+ADnAolUwM+gqBnQb7I/rgG7i27+BIpdBKs20ETsRo5Nr2BNkjE9jmI+iRvGeNNmvVlJBZoBN8JZ0ci1b6rWCzwWMwXhrbDBIgDgr/i0cyFNENppBujmU0rCe0t1U9sobtbtAr9d+DtVWKqMrbqh5xSozpejOrytuqQu6xvQgmg6ngEsfEkWFZgO/YLhU2P2/3sh8L4m3V0LoANoKkFFrCfrFIXQfLQU+Z68VnzjEUF4MhXd5W9chSMAJ8BP3kBlgCXoBp4BYYU+b6U2ASWAh2KXj7rm4hO9keAOPIForYQE8s4gnVayKcmqSnnPFs7KOgT/J2D/t9nNMmZAGYTy9kS8yLG28Fz7lAOYXOBe0Mn5PgEZgIWqXrX4vjOftDkrfjnNMmZAfbm2CgzGfE05vBlFn0mEihTynmHTgOmsFvsA/MKXGPY5K3Czr3SJ10k44QKXQ05/eCH+AJuAxGgrOcEyG5iu8a7aYq+2ouSmSbnELBlFPogGfTirj/BtaB9aBF2uyfTAkpbvKrDIkwBdN73Qdwgv02sI2faTN11hKpdBP7V6oomKVSqFj0GzATiN8KboO3poSkwFjwkviZagr9CQ5Kf583efpNB/RGMYXGmTb7A6ZQ4YU74Bm4b/J95AGYzv0RxApMmyrWwjpl9H1EFLB5zFim7BW4Zt/Za13IZ7YrI7jeFZ41+gopHkEesphFibxUpypmrcOs0FH+Ebs1iJBBnk6bNd3c9Tm+aDPH5H91s125v4SkkgmbtYaNEC2hxRAKvUd0hFy9xofihpx3bGj9q6xlN7sVYoVYIdrtjwADAHa34Gdb4g3QAAAAAElFTkSuQmCC"

/***/ }),

/***/ 955:
/*!***********************************************!*\
  !*** D:/ems/community/static/images/mine.png ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRUI0MTg1NEJGMTExRjA4NEI0RURGNTczNjQyODE5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkVGRUI0MTg2NEJGMTExRjA4NEI0RURGNTczNjQyODE5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RUZFQjQxODM0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RUZFQjQxODQ0QkYxMTFGMDg0QjRFREY1NzM2NDI4MTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4EkogbAAADLklEQVR42uyaa4iMYRTHZ9wyOwzFuq9bbrm2WXxBUsp9XT/gw5K2FCGkfHDJfiEJscklNrmVyKYmba1bSKFY93uxGuy27eQyFmv8T/ufmibTet/nnfd5dsypX89bO++Z+T+Xc55zWm80GvWkgzXzpIllhGSEpMhaJPvD+eAlJ/y3Bl05YSHwTdXhrKkTXVuRfmA3eAUi4DV4Cb6Ah2Ar6Gjy1pLZ3wUegVWgL/gO3oBK8AsMARspcj3wmiakC7gMVoPmoASMAX4KyuGz7ItSEADbwRmQldIzYsHkB5aBYeA5mA8q/vK5nxQrTAYnwVz+htkgqntFdlKEnIOxSUQk2kUwDoRBPrei1q01FBRy/88DVRbelbO0lM9bQHudQlbQxxFw38b7Z8E10A4s1ikkn+MhBR/FCb5cF9KD0aoG3FXwc4XjSF1CunF8pxhxPoE60JZbzHUhsXcjDkS+Op1R6wPHnoq/IUBkQj7rEPKW50O22GAFP+M5StT7rUOIfGmQzwUKfgo5BnWG3/1x+aSXjfflJjCT2+qwTiE3mdSy4kYrUe9Y3DUnpPuutYzXdMkDV5lfGrPh4AboA26BIhOu8dW8nkuNkQeesObonKTo2gdug95c0Rnghyn1yAswGpwDbVgFhnitl1UqZ6Uon1vO7y3mBFSbUo/ErIb1hRzgdWAS6E9iVivtALADPHal+aBg10krVoed+FzJFal3tYvigMm+f0pSbv9tg04+Px0cZ2kb4c3XCcJsF4nvKVY7LFa21ihwAOSmaFIDbBcJi8AdlsIVTq5IAQ9wLi+Lm5nUfJw5J/DRfxFr/zwmyzlOCVkIjjLy7AWDmCceeBoacE6Z+LoHNoEB4BTFnWYoVxIiOeAgZ2wDWOlQIdWY1XJ77QEtwQmQrSJEWqB+OtrmciCSALDW09DQy2bLyJaQEWAa+EqHOkyS5xqKWgI62BGygGMJ+KgxRci5KeN5ybcjZALHCwbku9KEstiSkIFxtbRue8Yxx46QWC+2ygAh7zl2V8kj9QYIiYV8X+bSaJh5m7qQcNzFMrO1moT9Sz1i0r8P+dNlRZJOvDfz/1qG2R8BBgCvvLgtCUW+1wAAAABJRU5ErkJggg=="

/***/ }),

/***/ 964:
/*!****************************!*\
  !*** D:/ems/api/energy.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _request = _interopRequireDefault(__webpack_require__(/*! @/utils/request */ 75));
var _forSpringBoot = __webpack_require__(/*! @/utils/forSpringBoot */ 114);
/**
 * energy模块所用到的接口封装
 */

var energy = {
  /**
   * =====电表曲线=====
   *  */
  // 1.获取电表曲线数据（最大值，最小值，平均值）
  findPowerByDeviceIdAndDate: function findPowerByDeviceIdAndDate(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPowerByDeviceIdAndDate'),
      method: 'GET',
      params: params
    });
  },
  //2.获取电梯A相电流数据
  findAphaseCurrentByDeviceIdAndDate: function findAphaseCurrentByDeviceIdAndDate(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAphaseCurrentByDeviceIdAndDate'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====发电分析=====
   */
  // 1.获取各个箱子的发电数据（预测发电量，实际发电量，相差）
  findHomeCommunityPowerSumByRandomLevelIdsAndDataType: function findHomeCommunityPowerSumByRandomLevelIdsAndDataType(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findHomeCommunityPowerSumByRandomLevelIdsAndDataType'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 2.获取天气数据（辐照度和温度）
  findWeatherStationByDays: function findWeatherStationByDays(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherStationByDays'),
      method: 'GET',
      params: params
    });
  },
  // 2.获取天气数据（辐照度和温度）用设备id查询
  findWeatherStationByDaysByDeviceId: function findWeatherStationByDaysByDeviceId(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findWeatherStationByDaysByDeviceId'),
      method: 'GET',
      params: params
    });
  },
  /**
   * =====能源曲线数据=====
   */
  // 1.单个箱子数据
  findHomeCommunityPowerSumByLevelIdAndDataType: function findHomeCommunityPowerSumByLevelIdAndDataType(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findHomeCommunityPowerSumByLevelIdAndDataType'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 2.获取多个层级（社区/分中心）的发、储、并、用的每分钟功率
  findPowerByLevelIdsAndDate: function findPowerByLevelIdsAndDate(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findPowerByLevelIdsAndDate'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  /**
   * 获取某日的总用电、人均用电、单位面积用电
   */
  findSubareaConsumptionByDay: function findSubareaConsumptionByDay(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findSubareaConsumptionByDay'),
      method: 'GET',
      params: params
    });
  },
  /**
   * 周报表每日统计数据
   */
  findStatisticsDayByLevelIdsAndDays: function findStatisticsDayByLevelIdsAndDays(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findStatisticsDayByLevelIdsAndDays'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  findAtrributes: function findAtrributes(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/atrributes'),
      method: 'GET',
      params: params
    });
  },
  getAtrributesData: function getAtrributesData(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/atrributesData'),
      method: 'GET',
      params: params
    });
  },
  // 获取多个层级天的每小时层级统计数据 ------获取光伏未来社区、分中心的日报表数据
  findDayStatisticsDetailsByLevelIdsAndDay: function findDayStatisticsDetailsByLevelIdsAndDay(ids, time) {
    var data = {
      areaLevelIds: ids,
      date: time
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDayStatisticsDetailsByLevelIdsAndDay'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取多个层级月的每天层级统计数据 ------获取光伏未来社区、分中心的月报表数据
  findMonthStatisticsDetailsByLevelIdsAndMonth: function findMonthStatisticsDetailsByLevelIdsAndMonth(ids, time) {
    var data = {
      areaLevelIds: ids,
      month: new Date(time).getMonth() + 1,
      year: new Date(time).getFullYear()
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findMonthStatisticsDetailsByLevelIdsAndMonth'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取多个层级年的每月层级统计数据 ------获取光伏未来社区、分中心的年报表数据
  findYearStatisticsDetailsByLevelIdsAndYear: function findYearStatisticsDetailsByLevelIdsAndYear(ids, time) {
    var data = {
      areaLevelIds: ids,
      year: new Date(time).getFullYear()
    };
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findYearStatisticsDetailsByLevelIdsAndYear'),
      method: 'POST',
      data: (0, _forSpringBoot.DATA)(data)
    });
  },
  // 获取碳排因子
  queryCarbonFactor: function queryCarbonFactor(areaId, year) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)("/carbon/factor/areaId/".concat(areaId, "/year/").concat(year)),
      method: 'GET'
    });
  },
  // 设备管理 => 负荷曲线
  findConsumeQAndPower: function findConsumeQAndPower(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayConsumeQAndPower';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthConsumeQAndPower';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearConsumeQAndPower';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 设备管理 => 总设备信息
  findAllDeviceInfo: function findAllDeviceInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findAllDeviceInfo'),
      method: 'GET'
    });
  },
  // 设备管理 => 所有设备
  findDeviceEnergyInfo: function findDeviceEnergyInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceEnergyInfo'),
      method: 'GET'
    });
  },
  queryFlexibility: function queryFlexibility(params) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/queryFlexibility'),
      method: 'GET',
      params: params
    });
  },
  // 经济性分析 => 经济性分析信息概览
  findEconomicalAnalysisInfo: function findEconomicalAnalysisInfo() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findEconomicalAnalysisInfo'),
      method: 'GET'
    });
  },
  // 经济性分析 => 峰平谷电价及运行收益
  findPeakFlatValleyElectrovalenceAndIncome: function findPeakFlatValleyElectrovalenceAndIncome(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'hour') {
      requestURI = '/homeCommunity/findDayPeakFlatValleyElectrovalenceAndIncome';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'day') {
      requestURI = '/homeCommunity/findMonthPeakFlatValleyElectrovalenceAndIncome';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findYearPeakFlatValleyElectrovalenceAndIncomeonsumeQAndPower';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 经济性分析 => 碳排因子响应及电力响应收益
  findCarbonEmissionFactorAndPowerFactorIncome: function findCarbonEmissionFactorAndPowerFactorIncome(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'hour') {
      requestURI = '/homeCommunity/findDayCarbonEmissionFactorAndPowerFactorIncome';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'day') {
      requestURI = '/homeCommunity/findMonthCarbonEmissionFactorAndPowerFactorIncomethConsumeQAndPower';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findYearCarbonEmissionFactorAndPowerFactorIncome';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 设备管理 => 获取所有设备列表
  findDeviceInfoList: function findDeviceInfoList() {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)('/homeCommunity/findDeviceInfoList'),
      method: 'GET'
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findAlarmInfoCount: function findAlarmInfoCount(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAlarmInfoCount';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAlarmInfoCount';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAlarmInfoCount';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findAreaAlarmInfoCount: function findAreaAlarmInfoCount(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAreaAlarmInfoCount';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAreaAlarmInfoCount';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAreaAlarmInfoCount';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findDeviceAlarmInfoCount: function findDeviceAlarmInfoCount(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayDeviceAlarmInfoCount';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthDeviceAlarmInfoCount';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearDeviceAlarmInfoCount';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 告警信息统计按日月年查询
  findSeverityLevelAlarmInfoCount: function findSeverityLevelAlarmInfoCount(dateType, date) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDaySeverityLevelAlarmInfoCount';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0'))
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthSeverityLevelAlarmInfoCount';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0')
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearSeverityLevelAlarmInfoCount';
      params = {
        year: d.getFullYear()
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 报警分析 => 以列表的形式查询所有的告警信息，每个告警都有级别（紧急、次要、提示）
  findAlarmInfoList: function findAlarmInfoList(dateType, date, deviceType, area) {
    var d = new Date(date);
    var requestURI = '';
    var params = {};
    if (dateType == 'date') {
      requestURI = '/homeCommunity/findDayAlarmInfoList';
      params = {
        day: "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, '0'), "-").concat(String(d.getDate()).padStart(2, '0')),
        area: area,
        deviceType: deviceType
      };
    } else if (dateType == 'month') {
      requestURI = '/homeCommunity/findMonthAlarmInfoList';
      params = {
        year: d.getFullYear(),
        month: String(d.getMonth() + 1).padStart(2, '0'),
        area: area,
        deviceType: deviceType
      };
    } else if (dateType == 'year') {
      requestURI = '/homeCommunity/findYearAlarmInfoList';
      params = {
        year: d.getFullYear(),
        area: area,
        deviceType: deviceType
      };
    }
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)(requestURI),
      method: 'GET',
      params: params
    });
  },
  // 查询设备日功率曲线
  queryStoragePowerCurve: function queryStoragePowerCurve(data) {
    return (0, _request.default)({
      url: (0, _forSpringBoot.URL)("/homeCommunity/queryStoragePowerCurve"),
      method: 'post',
      data: data
    });
  }
};
var _default = energy;
exports.default = _default;

/***/ })

}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/community/common/vendor.js.map