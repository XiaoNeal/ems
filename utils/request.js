import store from '@/store'
import { decrypt, aesMinEncrypt } from "@/utils/decryptData.js"
import { RealtimeDataProviderService } from '@/service/socket/realtime-data-provider'

/**
 * 根据平台获取基础 URL
 * @returns {string} 基础 URL
 */
var getBaseURL = () => {
  return "https://iems.neiic.com";
}

/**
 * 构建完整 URL（处理参数拼接）
 * @param {string} url - 原始 URL
 * @param {Object} params - 查询参数
 * @returns {string} 完整 URL
 */
const buildURL = (url, params) => {
  if (!params) return url;
  const paramsArray = [];
  Object.keys(params).forEach(key => paramsArray.push(`${key}=${encodeURIComponent(params[key])}`));
  return url.includes('?') ? `${url}&${paramsArray.join('&')}` : `${url}?${paramsArray.join('&')}`;
}

/**
 * 判断是否为可重试的错误
 * @param {string} errMsg - 错误消息
 * @returns {boolean} 是否可重试
 */
const isRetryableError = (errMsg) => {
  const retryableErrors = [
    'CONNECTION_RESET',
    'CONNECTION_REFUSED',
    'CONNECTION_TIMED_OUT',
    'NETWORK_ERROR',
    'TIMEOUT'
  ];
  return retryableErrors.some(error => errMsg.includes(error));
}

/**
 * HTTP 请求封装
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求 URL
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {Object} options.params - 查询参数
 * @param {Object} options.header - 请求头
 * @param {number} options.timeout - 超时时间
 * @param {number} options.maxRetries - 最大重试次数
 * @returns {Promise} 请求结果
 */
const request = (options) => {
  // 合并默认配置（优化超时时间，小程序环境建议不超过30秒）
  const config = {
    method: 'GET',
    timeout: 30000,
    dataType: 'json',
    responseType: 'text',
    sslVerify: false,
    maxRetries: 2,
    retryDelay: 1000,
    ...options
  };

  // 合并基础 URL 和完整 URL
  const baseURL = getBaseURL();
  const fullURL = buildURL(baseURL + config.url, config.params);
  return new Promise((resolve, reject) => {
    let retryCount = 0;

    /**
     * 内部发送请求函数
     * 支持自动重试和错误处理
     */
    const sendRequest = () => {
      // 每次请求前重新生成签名（避免签名过期）
      const token = store.state.token || uni.getStorageSync('token');
      const userInfo = store.state.userInfo;
      const sessionId = (userInfo && userInfo.sessionId) || store.state.sessionId;
      
      if (!sessionId) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (!(currentPage && currentPage.route === "pages/login/login")) {
          uni.showToast({
            title: '请先登录',
            icon: 'none',
            success() {
              RealtimeDataProviderService.closeSocket();
              uni.clearStorageSync();
              uni.reLaunch({
                url: '/pages/login/login'
              });
            }
          });
          reject(new Error('sessionId为空，请先登录'));
          return;
        }
      }
      
      const currentTime = new Date().toISOString().replace('T', ' ').slice(0, 23);
      const sign = aesMinEncrypt(
        'ABCDEFGHIJKL_key',
        'ABCDEFGHIJKLM_iv',
        (sessionId + currentTime)
      );

      // 合并请求头
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'token': token,
        'Authorization': token,
        'sessionId': sessionId,
        'Sign': sign,
        ...config.header
      };

      // 打印请求信息用于调试
      // console.log(`[Request] === 请求开始 ===`);
      // console.log(`[Request] 方法: ${config.method.toUpperCase()}`);
      // console.log(`[Request] URL: ${fullURL}`);
      // console.log(`[Request] 超时时间: ${config.timeout}ms`);
      // console.log(`[Request] 重试次数: ${retryCount}/${config.maxRetries}`);
      // console.log(`[Request] Headers:`, headers);
      // console.log(`[Request] Data:`, config.data);
      // console.log(`[Request] === 请求结束 ===`);

      uni.request({
        method: config.method.toUpperCase(),
        url: fullURL,
        header: headers,
        data: config.data,
        dataType: config.dataType,
        responseType: config.responseType,
        sslVerify: config.sslVerify,
        timeout: config.timeout,
        complete: (response) => {
          const { data, statusCode, errMsg, header } = response;
          // console.log(`[Response] === 响应开始 ===`);
          // console.log(`[Response] URL: ${fullURL}`);
          // console.log(`[Response] 状态码: ${statusCode}`);
          // console.log(`[Response] 错误信息: ${errMsg}`);
          // console.log(`[Response] 响应头:`, header);
          // console.log(`[Response] 响应数据长度: ${data ? (typeof data === 'string' ? data.length : JSON.stringify(data).length) : 0}`);
          // console.log(`[Response] === 响应结束 ===`);
          
          // 处理超时
          if (errMsg && errMsg.includes("timeout")) {
            if (retryCount < config.maxRetries) {
              retryCount++;
              console.warn(`[Request] 超时重试第${retryCount}次: ${fullURL}`);
              setTimeout(sendRequest, config.retryDelay * Math.pow(2, retryCount));
              return;
            } else {
              uni.hideLoading();
              uni.showToast({
                title: "网络连接超时，请检查网络",
                icon: "none"
              });
              resolve(false);
              return;
            }
          }

          let result = data;

          // 业务状态码判断
          if (result.status == 200 || result.code == 10000 || Array.isArray(result)) {
            resolve(result);
            return;
          }

          // 免加密处理
          if (store.state.noEncryption || store.state.currentTemplate == 2) {
            resolve(result);
            return;
          }

          // 解密处理
          try {
            // 如果data已经是对象，直接使用
            if (typeof data === 'object') {
              result = data;
              resolve(result);
              return;
            }
            // 检查data是否存在且不为空
            if (!data || typeof data !== 'string') {
              console.error('数据为空或格式错误:', data);
              reject(new Error('数据为空或格式错误'));
              return;
            }
            result = JSON.parse(decrypt(data));
            resolve(result);
          } catch (e) {
            console.error('数据解密失败:', e);
            // 尝试直接解析data，可能是未加密的数据
            try {
              result = JSON.parse(data);
              resolve(result);
            } catch (parseError) {
              console.error('直接解析也失败:', parseError);
              reject(new Error('数据解析失败'));
            }
          }
        },
        fail: (error) => {

          // 处理可重试错误
          if (retryCount < config.maxRetries && isRetryableError(error.errMsg)) {
            retryCount++;
            console.warn(`请求失败，第${retryCount}次重试...`, error.errMsg);
            setTimeout(sendRequest, config.retryDelay * Math.pow(2, retryCount));
            return;
          }

          // 最终错误处理
          const response = error.response || {};
          const { code, msg } = response.data || {};
          console.error('请求最终失败:', error);

          // 获取当前页面
          const pages = getCurrentPages();
          const currentPage = pages[pages.length - 1];
          if (currentPage?.route === "pages/login/login") {
            reject(error);
            return;
          }

          // token过期处理
          if (code === '401') {
            uni.showToast({
              title: '会话已过期，请重新登录',
              icon: 'none',
              success() {
                RealtimeDataProviderService.closeSocket();
                uni.clearStorageSync();
                uni.reLaunch({
                  url: `/pages/login/login`
                });
              }
            });
          } else {
            // 其他错误
            const errorMessage = msg || error.errMsg || '网络请求失败';
            uni.showToast({
              title: errorMessage,
              icon: 'none'
            });
            reject(new Error(errorMessage));
          }
        }
      });
    };

    // 首次发送请求
    sendRequest();
  });
};

// Add HTTP method shortcuts
/**
 * GET 请求
 * @param {string} url - 请求 URL
 * @param {Object} params - 查询参数
 * @param {Object} options - 其他配置
 * @returns {Promise} 请求结果
 */
request.get = (url, params, options = {}) => {
  return request({
    url,
    params,
    method: 'GET',
    ...options
  });
};

/**
 * POST 请求
 * @param {string} url - 请求 URL
 * @param {Object} data - 请求数据
 * @param {Object} options - 其他配置
 * @returns {Promise} 请求结果
 */
request.post = (url, data, options = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  });
};

export default request;