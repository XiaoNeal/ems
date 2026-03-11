//获取底部tabbar
function getBottomTabbarList(templateId) {
	let tabbarList = [];
	//默认
	if (templateId == "0") {
		tabbarList = []
	}
	// //其他
	// else if (templateId == 1) {
	// 	tabbarList = [{
	// 			title: '首页',
	// 			icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/index-nor.png',
	// 			activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/index-nor.png',
	// 			activeColor: '#ccaf8b',
	// 			inactiveColor: '#000',
	// 			tabbarBackground: 'tabbar-unselect'
	// 		},

	// 		{
	// 			title: '我的',
	// 			icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/my-nor.png',
	// 			activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/my-nor.png',
	// 			activeColor: '#ccaf8b',
	// 			inactiveColor: '#000',
	// 			tabbarBackground: 'tabbar-unselect'
	// 		},
	// 	]
	// } 
	// else if (templateId == 2) {
	// 	tabbarList = [{

	// 			title: '首页',
	// 			icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/index-nor.png',
	// 			activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/icon_09.png',
	// 			activeColor: '#7c2bfe',
	// 			inactiveColor: '#000',
	// 			tabbarBackground: 'tabbar-unselect'
	// 		},

	// 		{
	// 			title: '能源',
	// 			icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/dayEnergy.png',
	// 			activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/icon_10.png',
	// 			activeColor: '#7c2bfe',
	// 			inactiveColor: '#000',
	// 			tabbarBackground: 'tabbar-unselect'
	// 		},
	// 		// {
	// 		// 	title: '信息',
	// 		// 	icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/dayInfo.png',
	// 		// 	activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/icon_11.png',
	// 		// 	activeColor: '#7c2bfe',
	// 		// 	inactiveColor:'#000',
	// 		// 	tabbarBackground:'tabbar-unselect'
	// 		// },

	// 		{
	// 			title: '我的',
	// 			icon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/my-nor.png',
	// 			activeIcon: 'https://serviceiems.gree.com/api/upload/wximages/uiImages/icon_13.png',
	// 			activeColor: '#7c2bfe',
	// 			inactiveColor: '#000',
	// 			tabbarBackground: 'tabbar-unselect'
	// 		},
	// 	]
	// } 
	else if (templateId == 3) {
		tabbarList = [{
				title: '首页',
				icon: '../../static/uiImages/menu/home.png',
				activeIcon: '../../static/uiImages/menu/home.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			},

			{
				title: '能源监测',
				icon: '../../static/uiImages/menu/energy.png',
				activeIcon: '../../static/uiImages/menu/energy.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			},
			{
				title: '能效专家',
				icon: '../../static/uiImages/menu/expert.png',
				activeIcon: '../../static/uiImages/menu/expert.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			},

			{
				title: '我的',
				icon: '../../static/uiImages/menu/user.png',
				activeIcon: '../../static/uiImages/menu/user.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			}
		]
	} else if (templateId == 4) {
		tabbarList = [{
				title: '首页',
				icon: '../../static/uiImages/menu/home.png',
				activeIcon: '../../static/uiImages/menu/home.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			},
			{
				title: '我的',
				icon: '../../static/uiImages/menu/user.png',
				activeIcon: '../../static/uiImages/menu/user.png',
				activeColor: '#fff',
				inactiveColor: '#fff',
				tabbarBackground: 'tabbar-background'
			}
		]

	}
	return tabbarList;
}


module.exports = {
	getBottomTabbarList: function(templateId) {
		return getBottomTabbarList(templateId);
	}
}