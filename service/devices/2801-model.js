import DeviceBase from "./device-base.model"

export class Model2801 extends DeviceBase {
	stateData;
	constructor() {
		super();
		// this.Category = DeviceType.Meter2801;
		this.stateData = new StateData();
	}
	getStatusData(jsonData) {
		this.stateData.B0.value = this.setStatuText(jsonData.data.B0);
		this.stateData.B1.value = this.setStatuText(jsonData.data.B1);
		this.stateData.B2.value = this.setStatuText(jsonData.data.B2);



		this.stateData.B3.value = this.setStatuText(jsonData.data.B3);
		this.stateData.B4.value = this.setStatuText(jsonData.data.B4);
		this.stateData.B5.value = this.setStatuText(jsonData.data.B5);
		this.stateData.B6.value = this.setStatuText(jsonData.data.B6);

		this.stateData.B7.value = this.setStatuText(jsonData.data.B7);
		this.stateData.B8.value = this.setStatuText(jsonData.data.B8);

		this.stateData.B9.value = this.setStatuText(jsonData.data.B9);
		this.stateData.B10.value = this.setStatuText(jsonData.data.B10);
		this.stateData.B11.value = this.setStatuText(jsonData.data.B11);
		this.stateData.B12.value = this.setStatuText(jsonData.data.B12);
		this.stateData.B13.value = this.setStatuText(jsonData.data.B13);
		this.stateData.B14.value = this.setStatuText(jsonData.data.B14);
		this.stateData.B15.value = this.setStatuText(jsonData.data.B15);

		this.stateData.B16.value = this.setStatuText(jsonData.data.B16);
		this.stateData.B17.value = this.setStatuText(jsonData.data.B17);

		this.stateData.B18.value = this.setStatuText(jsonData.data.B18);
		this.stateData.B19.value = this.setStatuText(jsonData.data.B19);
		this.stateData.B20.value = this.setStatuText(jsonData.data.B20);
		this.stateData.B21.value = this.setStatuText(jsonData.data.B21);
		this.stateData.B22.value = this.setStatuText(jsonData.data.B22);
		this.stateData.B23.value = this.setStatuText(jsonData.data.B23);
		this.stateData.B24.value = this.setStatuText(jsonData.data.B24);

		this.stateData.B25.value = this.setStatuText(jsonData.data.B25);
		this.stateData.B26.value = this.setStatuText(jsonData.data.B26);
		this.stateData.B27.value = this.setStatuText(jsonData.data.B27);


		this.stateData.B28.value = this.setStatuText(jsonData.data.B28);
		this.stateData.B29.value = this.setStatuText(jsonData.data.B29);
		this.stateData.B30.value = this.setStatuText(jsonData.data.B30);
		this.stateData.B31.value = this.setStatuText(jsonData.data.B31);
		this.stateData.B32.value = this.setStatuText(jsonData.data.B32);
		this.stateData.B33.value = this.setStatuText(jsonData.data.B33);
		this.stateData.B34.value = this.setStatuText(jsonData.data.B34);

		this.stateData.B35.value = this.setStatuText(jsonData.data.B35);
		this.stateData.B36.value = this.setStatuText(jsonData.data.B36);

		this.stateData.B37.value = this.setStatuText(jsonData.data.B37);
		this.stateData.B38.value = this.setStatuText(jsonData.data.B38);
		this.stateData.B39.value = this.setStatuText(jsonData.data.B39);
		this.stateData.B40.value = this.setStatuText(jsonData.data.B40);
		this.stateData.B41.value = this.setStatuText(jsonData.data.B41);
		this.stateData.B42.value = this.setStatuText(jsonData.data.B42);
		this.stateData.B43.value = this.setStatuText(jsonData.data.B43);
		this.stateData.B44.value = this.setStatuText(jsonData.data.B44);
		this.stateData.B45.value = this.setStatuText(jsonData.data.B45);

		this.stateData.B46.value = this.setStatuText(jsonData.data.B46);
		this.stateData.B47.value = this.setStatuText(jsonData.data.B47);
		this.stateData.B48.value = this.setStatuText(jsonData.data.B48);
		this.stateData.B49.value = this.setStatuText(jsonData.data.B49);
		this.stateData.B50.value = this.setStatuText(jsonData.data.B50);
		this.stateData.B51.value = this.setStatuText(jsonData.data.B51);
		this.stateData.B52.value = this.setStatuText(jsonData.data.B52);

		this.stateData.B53.value = this.setStatuText(jsonData.data.B53);
		this.stateData.B54.value = this.setStatuText(jsonData.data.B54);
		this.stateData.B55.value = this.setStatuText(jsonData.data.B55);



		this.stateData.B56.value = this.setStatuText(jsonData.data.B56);

		this.stateData.B57.value = this.setStatuText(jsonData.data.B57);
		this.stateData.B58.value = this.setStatuText(jsonData.data.B58);
		this.stateData.B59.value = this.setStatuText(jsonData.data.B59);
		this.stateData.B60.value = this.setStatuText(jsonData.data.B60);
		this.stateData.B61.value = this.setStatuText(jsonData.data.B61);
		this.stateData.B62.value = this.setStatuText(jsonData.data.B62);
		this.stateData.B63.value = this.setStatuText(jsonData.data.B63);

		this.stateData.B64.value = this.setStatuText(jsonData.data.B64);
		this.stateData.B65.value = this.setStatuText(jsonData.data.B65);

		this.stateData.B66.value = this.setStatuText(jsonData.data.B66);
		this.stateData.B67.value = this.setStatuText(jsonData.data.B67);
		this.stateData.B68.value = jsonData.data.B68.toFixed(2);


		this.stateData.B72.value = jsonData.data.B72.toFixed(2);
		this.stateData.B76.value = jsonData.data.B76.toFixed(2)
		this.stateData.B80.value = jsonData.data.B80.toFixed(2);
		this.stateData.B84.value = jsonData.data.B84.toFixed(2);

		this.stateData.B88.value = jsonData.data.B88.toFixed(2);
		this.stateData.B92.value = jsonData.data.B92.toFixed(2);
		this.stateData.B96.value = jsonData.data.B96.toFixed(2);
		this.stateData.B100.value = jsonData.data.B100.toFixed(2);
		this.stateData.B104.value = jsonData.data.B104.toFixed(2);
		this.stateData.B108.value = jsonData.data.B108.toFixed(2);
		this.stateData.B112.value = jsonData.data.B112.toFixed(2);

		this.stateData.B116.value = jsonData.data.B116.toFixed(2) + this.setUnitText('m³/h');
		this.stateData.B120.value = jsonData.data.B120.toFixed(2) + this.setUnitText('m');
		this.stateData.B124.value = jsonData.data.B124.toFixed(2) + this.setUnitText('m');


		this.stateData.B128.value = jsonData.data.B128.toFixed(2) + this.setUnitText('m');

		this.stateData.B132.value = jsonData.data.B132.toFixed(2) + this.setUnitText('m');
	}
	
	setStatuText(value){
		if(value==0){
			return `<span style='color:red;font-size:0.8rem'>否</span>`
			// return ''
		}else if(value>0){
			return `<span style='color:green;font-size:0.8rem'>是</span>`
			// return '是'
		}
		// return '--'
	}
	
	

	setHtmlText(name) {
		return name
		return `<span style='color:#fff;font-size:0.8rem'>${name} </span>`
	}

	setUnitText(unit) {
		return unit
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}

	getBaseData(jsonData) {}
}
export class StateData {
	B0 = {
		name: '应急池提升泵P1A自动',
		value: '--'
	};
	B1 = {
		name: '应急池提升泵P1A运行',
		value: '--'
	};
	B2 = {
		name: '应急池提升泵P1A故障',
		value: '--'
	};



	B3 = {
		name: '应急池提升泵P1B自动',
		value: '--'
	};
	B4 = {
		name: '应急池提升泵P1B运行',
		value: '--'
	};
	B5 = {
		name: '应急池提升泵P1B故障',
		value: '--'
	};
	B6 = {
		name: '废液收集池提升泵P2A自动',
		value: '--'
	};

	B7 = {
		name: '废液收集池提升泵P2A运行',
		value: '--'
	};
	B8 = {
		name: '废液收集池提升泵P2A故障',
		value: '--'
	};

	B9 = {
		name: '废液收集池提升泵P2B自动',
		value: '--'
	};
	B10 = {
		name: '废液收集池提升泵P2B运行',
		value: '--'
	};
	B11 = {
		name: '废液收集池提升泵P2B故障',
		value: '--'
	};
	B12 = {
		name: '综合废水池提升泵P3A自动',
		value: '--'
	};
	B13 = {
		name: '综合废水池提升泵P3A运行',
		value: '--'
	};
	B14 = {
		name: '综合废水池提升泵P3A故障',
		value: '--'
	};
	B15 = {
		name: '综合废水池提升泵P3B自动',
		value: '--'
	};

	B16 = {
		name: '综合废水池提升泵P3B运行',
		value: '--'
	};
	B17 = {
		name: '综合废水池提升泵P3B故障',
		value: '--'
	};

	B18 = {
		name: '清水池提升泵P4A自动',
		value: '--'
	};
	B19 = {
		name: '清水池提升泵P4A运行',
		value: '--'
	};
	B20 = {
		name: '清水池提升泵P4A故障',
		value: '--'
	};
	B21 = {
		name: '清水池提升泵P4B自动',
		value: '--'
	};
	B22 = {
		name: '清水池提升泵P4B运行',
		value: '--'
	};
	B23 = {
		name: '清水池提升泵P4B故障',
		value: '--'
	};
	B24 = {
		name: '初沉池排泥泵NP1A自动',
		value: '--'
	};

	B25 = {
		name: '初沉池排泥泵NP1A运行',
		value: '--'
	};
	B26 = {
		name: '初沉池排泥泵NP1A故障',
		value: '--'
	};
	B27 = {
		name: '初沉池排泥泵NP1B自动',
		value: '--'
	};


	B28 = {
		name: '初沉池排泥泵NP1B运行',
		value: '--'
	};
	B29 = {
		name: '初沉池排泥泵NP1B故障',
		value: '--'
	};
	B30 = {
		name: '二沉池排泥泵NP2A自动',
		value: '--'
	};
	B31 = {
		name: '二沉池排泥泵NP2A运行',
		value: '--'
	};
	B32 = {
		name: '二沉池排泥泵NP2A故障',
		value: '--'
	};
	B33 = {
		name: '二沉池排泥泵NP2B自动',
		value: '--'
	};
	B34 = {
		name: '二沉池排泥泵NP2B运行',
		value: '--'
	};

	B35 = {
		name: '二沉池排泥泵NP2B故障',
		value: '--'
	};
	B36 = {
		name: '隔膜压泥泵YNP1自动',
		value: '--'
	};

	B37 = {
		name: '隔膜压泥泵YNP1运行',
		value: '--'
	};
	B38 = {
		name: '高压水泵GYP1自动',
		value: '--'
	};
	B39 = {
		name: '高压水泵GYP1运行',
		value: '--'
	};
	B40 = {
		name: '高压水泵GYP1故障',
		value: '--'
	};
	B41 = {
		name: '高压水泵GYP2自动',
		value: '--'
	};
	B42 = {
		name: '高压水泵GYP2运行',
		value: '--'
	};
	B43 = {
		name: '高压水泵GYP2故障',
		value: '--'
	};

	B44 = {
		name: '板框压滤机TS1自动',
		value: '--'
	};
	B45 = {
		name: '板框压滤机TS1运行',
		value: '--'
	};

	B46 = {
		name: '板框压滤机TS1故障',
		value: '--'
	};
	B47 = {
		name: '混凝反应池加药泵YP1自动',
		value: '--'
	};
	B48 = {
		name: '混凝反应池加药泵YP1运行',
		value: '--'
	};
	B49 = {
		name: 'PH中和池加药泵YP2自动',
		value: '--'
	};
	B50 = {
		name: 'PH中和池加药泵YP2运行',
		value: '--'
	};
	B51 = {
		name: '物化PAC加药泵YP3自动',
		value: '--'
	};
	B52 = {
		name: '物化PAC加药泵YP3运行',
		value: '--'
	};

	B53 = {
		name: '生化PAC加药泵YP4自动',
		value: '--'
	};
	B54 = {
		name: '生化PAC加药泵YP4运行',
		value: '--'
	};
	B55 = {
		name: '亚铁加药泵YP5自动',
		value: '--'
	};
	B56 = {
		name: '亚铁加药泵YP5运行',
		value: '--'
	};

	B57 = {
		name: '氯化钙加药泵YP6自动',
		value: '--'
	};
	B58 = {
		name: '氯化钙加药泵YP6运行',
		value: '--'
	};
	B59 = {
		name: 'PAM加药泵YP7自动',
		value: '--'
	};
	B60 = {
		name: 'PAM加药泵YP7运行',
		value: '--'
	};
	B61 = {
		name: '综合调节池水泵出水口压力低报警',
		value: '--'
	};
	B62 = {
		name: '应急池水泵出水口压力低报警',
		value: '--'
	};
	B63 = {
		name: '废液收集池水泵出水口压力低报警',
		value: '--'
	};

	B64 = {
		name: '初沉池水泵出水口压力低报警',
		value: '--'
	};
	B65 = {
		name: '二沉池水泵出水口压力低报警',
		value: '--'
	};

	B66 = {
		name: '清水池水泵水口压力低报警',
		value: '--'
	};
	B67 = {
		name: '污泥池水泵水口压力低报警',
		value: '--'
	};
	B68 = {
		name: 'YP1加药超时时间',
		value: '--'
	};


	B72 = {
		name: 'YP2加药超时时间',
		value: '--'
	};
	B76 = {
		name: '综合调节池水泵出水口低压判断时间',
		value: '--'
	};
	B80 = {
		name: '应急池水泵出水口低压判断时间',
		value: '--'
	};
	B84 = {
		name: '废液收集池水泵出水口低压判断时间',
		value: '--'
	};

	B88 = {
		name: '初沉池水泵出水口低压判断时间',
		value: '--'
	};
	B92 = {
		name: '二沉池水泵出水口低压判断时间',
		value: '--'
	};
	B96 = {
		name: '清水池水泵水口低压判断时间',
		value: '--'
	};

	B100 = {
		name: '污泥池水泵水口低压判断时间',
		value: '--'
	};
	B104 = {
		name: '反应池PH',
		value: '--'
	};
	B108 = {
		name: 'PH回调池PH',
		value: '--'
	};
	B112 = {
		name: '清水池PH',
		value: '--'
	};
	B116 = {
		name: '综合废水调节池提升泵出口流量',
		value: '--'
	};
	B120 = {
		name: '应急池-超声波液位计LC1',
		value: '--'
	};
	B124 = {
		name: '废液收集池-超声波液位计LC2',
		value: '--'
	};


	B128 = {
		name: '综合废水调节池-超声波液位计LC3',
		value: '--'
	};

	B132 = {
		name: '清水池-超声波液位计LC4',
		value: '--'
	};



}