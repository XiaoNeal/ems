// utils/tools.js
/**
 * 防抖函数 - 限制函数的执行频率
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {boolean} immediate - 是否立即执行
 * @returns {Function} - 返回一个防抖后的函数
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  return function(...args) {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * 计算图表Y轴最大值
 * @param {number[]} dataArrays - 多个数据数组
 * @returns {number} - Y轴最大值
 */
export function calculateYAxisMax(...dataArrays) {
  const allData = dataArrays.flat();
  const rawMax = Math.max(...allData, 0);
  let targetMax;

  if (rawMax < 0) {
    targetMax = Math.floor(rawMax);
  } else if (rawMax < 1) {
    targetMax = 1;
  } else {
    targetMax = Math.ceil(rawMax);
  }

  return targetMax;
}