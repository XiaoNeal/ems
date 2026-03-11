import request from '@/utils/request.js'

// H5/Android/IOS 手机短信验证码登录
export function login(username, password) {
	uni.showLoading({
		title:'登录中，请稍等'
	})
	
	let paramData = JSON.stringify({
			username: username,
			password: password
		})
		
		// uni.request('/api/token/authorization',{data:paramData})
		
	return	request({
			// url: '/youlai-auth/oauth/token',
			url: '/api/token/authorization',
			method: 'POST',
			data:{data:paramData},
			header: {
				'content-type': 'application/json;'
			}
			
		})

	
}