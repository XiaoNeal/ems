var ISCANVAS2D = true;

switch (uni.getSystemInfoSync().platform) {
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