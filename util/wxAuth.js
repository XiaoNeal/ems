import Vue from "@/main";
/*
获取微信电话号码,身份信息的js
*/

//第三步: 微信授权登录(后端实际登录)
function login(param) {
	let that = Vue;
	console.log("微信授权后台登录的参数", param);
	that.$u.api.sysApi.wxLogin(param).then(res => {
		if (res.code == 200) {
			console.log("微信登录响应结果", res);
			let currentUser = res.data.userInfo;
			let loginToken = res.data.token;
			if (loginToken != null && loginToken.length > 0) {
				that.$u.vuex("vuex_token", loginToken);
			}
			if (currentUser.userId != null) {
				that.$u.vuex('vuex_userInfo', currentUser); //这里要先保存一下用户的信息,假如后续用户拒绝同步,就是当前用户信息
			}
			if (currentUser.nickName.length < 1) {
				//跳转第四步
			return getWxUserInfo();
			} else {
			return skip(2);
			}
		} else {
			that.$u.vuex('vuex_wxCode', "");
			console.log("微信登录响应失败", res);
		}
	}).catch(error => {
		that.$u.vuex('vuex_wxCode', "");
		console.log("微信授权后台登录异常", error);
	});
};

// 第四步: 授权获取微信用户信息
function getWxUserInfo() {
	let that = Vue;
	if (uni.getUserProfile) {
		uni.showModal({
			title: '提示',
			content: '是否更新同步微信身份信息(性别,地区,头像)',
			success: function(res) {
				if (res.confirm) {
					uni.getUserProfile({
						desc: "仅供开发测试试用",
						lang: "zh_CN",
						success: function(data) {
							let wxUserInfo = data.userInfo;
							//跳转第五步
							return saveWxUserInfo(wxUserInfo);
						},
						fail: function(error) {
							console.log("获取微信身份信息失败,拒绝授权", error);
							return skip(1);
						}
					})
				} else if (res.cancel) {
					console.log('用户点击取消,放弃同步身份信息');
					return skip(1);
				}
			}
		});
	}
};

//第五步: 同步微信信息
function saveWxUserInfo(wxUserInfo) {
	let that = Vue;
	console.log("获取到的微信身份信息", wxUserInfo);
	let avatar = wxUserInfo.avatarUrl;
	let sex = wxUserInfo.gender;
	let address = wxUserInfo.country + "-" + wxUserInfo.province + "-" + wxUserInfo.city;
	let nickName = wxUserInfo.nickName;
	let param = that.vuex_userInfo;
	console.log("登录的用户信息", param);
	param.avatar = avatar;
	param.address = address;
	param.nickName = nickName;
	param.sex=sex;
	that.$u.api.sysApi.saveWxUserInfo(param).then(res => {
		if (res.code == 200) {
			console.log("微信同步身份信息响应结果", res);
			that.$u.vuex('vuex_userInfo', res.data);
			return skip(2);
		}
	}).catch(error => {
		console.log("微信同步身份信息响应结果", error);
	});
};

//跳过授权
function skip(status) {
	let that = Vue;
	return status;
};
//微信登录
function getWxCode() {
		let that = Vue;
		// #ifdef MP-WEIXIN
			let wxCode = that.vuex_wxCode;
			if(wxCode.length<1){
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log("微信登录授权响应信息", loginRes);
						let wxCode = loginRes.code;
						that.$u.vuex('vuex_wxCode', wxCode);
						return wxCode;
					}
				});
			}
		// #endif
		// #ifndef MP-WEIXIN
			console.log("不支持微信小程序登录");
			return null;
		// #endif
};


function getWxPhonenumber(e) {
		let that = Vue;
		let errMsg = e.detail.errMsg;
		if (errMsg.indexOf("ok") !== -1) {
			let wxCode = that.vuex_wxCode;
			if(wxCode.length<1){
				getWxCode();
				return;
			}
			let iv = e.detail.iv;
			let encryptedData = e.detail.encryptedData;
			console.log("wxCode", wxCode);
			console.log("errMsg", errMsg);
			console.log("iv", iv);
			console.log("encryptedData", encryptedData);
			let param = {
				wxCode: wxCode,
				wxIv: iv,
				wxEncryptedData: encryptedData,
				wxUserInfo: {}
			}
			//跳转第三步登录
			let status=login(param);
			return status;
		} else {
			that.$u.vuex('vuex_wxCode', "");
			console.log("拒绝授权获取手机号");
		}
	};


module.exports = {
	wxAuthLogin: function (e) {
		return getWxPhonenumber(e);
	},
	getWxCode:function(){
		return getWxCode();
	}
}
