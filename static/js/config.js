var ISCANVAS2D = true;

// 基础库 2.20+ 已废弃 getSystemInfoSync；这里只判断平台，用 getDeviceInfo 即可
var platform = ''
try {
	if (typeof uni.getDeviceInfo === 'function') platform = (uni.getDeviceInfo() || {}).platform || ''
} catch (e) { }

switch (platform) {
	case 'android':
		ISCANVAS2D = true
		break;
	case 'ios':
		ISCANVAS2D = true
		break;
	default:
		ISCANVAS2D = false
		break;
}

module.exports = {
		ISCANVAS2D
}