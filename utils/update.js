export let appUpdate = ()=>{
	plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
		let version = widgetInfo.version
		let osName = plus.os.name;
		var server = `https://serviceiems.gree.com/appletAPI/downloadAPK?version=${version}&osName=${osName}`; //检查新地址
		
		uni.request({
			url: server,
			// data: req,
			success: (res) => {
				console.log(res);
				if (res.statusCode == 200 && res.data.data.updateStatus == 3) return
		
				// 整包更新 
				if (res.statusCode == 200 && res.data.data.updateStatus === 1) {
					console.log('整包更新2.02');
					uni.showModal({ //提醒用户更新  
						title: "更新提示",
						content: res.data.data.note,
						success: (res) => {
							if (res.confirm) {
								plus.runtime.openURL(res.data.url);
							}
						},
						complete: (com) => {
							console.log(com);
						}
					})
				}
	
				// 热更新
				if (res.statusCode == 200 && res.data.data.updateStatus === 2) {
					console.log('热更新');
					uni.downloadFile({
						url: res.data.url,
						success: (downloadResult) => {
							if (downloadResult.statusCode === 200) {
								plus.runtime.install(downloadResult
									.tempFilePath, {
										force: false
									},
									function() {
										plus.runtime.restart();
									},
									function(e) {});
							}
						}
					});
				}
	
	
			}
		
		})
	})
}