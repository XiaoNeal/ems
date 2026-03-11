function utilAlert(msg, iconType) {
	uni.showToast({
		title: msg == null ? "" : msg,
		icon: "none",
		duration: 1500
	});
	return;
};

function utilLoading(tip, mask) {
	uni.showLoading({
		title: tip ? tip : '加载中',
		mask: mask ? mask : false
	});

	setTimeout(function() {
		uni.hideLoading();
	}, 10000)
};
function clearVuex(that) {
	console.log("清除缓存");
	that.$u.vuex('vuex_userInfo', {});
	that.$u.vuex('vuex_token', '');
}

function resetShopCar(that) {
	console.log("清空购物车");
	that.$u.vuex('vuex_shopCar', [{
		shopId: 1,
		title: '京东自营',
		total: 0,
		goodsAmount: 0,
		selected: false,
		glist: []
	}]);
}

//字节转换
function byteConvert(bytes) {
	//console.log("字节量"+bytes);
	if (isNaN(bytes)) {
		return '';
	}
	var symbols = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var exp = Math.floor(Math.log(bytes) / Math.log(2));
	if (exp < 1) {
		exp = 0;
	}
	var i = Math.floor(exp / 10);
	bytes = bytes / Math.pow(2, 10 * i);
	if (bytes.toString().length > bytes.toFixed(2).toString().length) {
		bytes = bytes.toFixed(2);
	}
	return bytes + ' ' + symbols[i];
}

module.exports = {
	utilAlert: function(msg, iconType) {
		return utilAlert(msg, iconType);
	},
	utilLoading: function(tip, mask) {
		return utilLoading(tip, mask);
	},
	clearVuex: function(that) {
		return clearVuex(that);
	},
	byteConvert: function(bytes) {
		return byteConvert(bytes);
	},
	resetShopCar: function(that) {
		return resetShopCar(that);
	}
}