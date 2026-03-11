import DeviceBase from "./device-base.model"

export class Model1707 extends DeviceBase {
	energyData;
	stateData;
	// energyDateTime: string;
	// stateDateTime: string;
	mergeData
	constructor() {
		super();
		// this.Category = DeviceType.Meter1707;
		this.energyData = new EnergyData();
		this.stateData = new StateData();
		this.mergeData = new MergeData()
	}
	getEnergyData(jsonData, jsonData2) {

		this.mergeData.batterySoc = jsonData.B76
		this.mergeData.charge = jsonData.B88.toFixed(2);
		this.mergeData.discharge = jsonData.B90.toFixed(2);

		this.mergeData.voltage = jsonData.B32.toFixed(2);
		this.mergeData.current = jsonData.B34.toFixed(2);
		this.mergeData.power = jsonData.B36.toFixed(2);

		this.mergeData.UVoltage = jsonData.B0.toFixed(2);
		this.mergeData.VVoltage = jsonData.B2.toFixed(2);
		this.mergeData.WVoltage = jsonData.B4.toFixed(2);
		this.mergeData.UCurrent = jsonData.B12.toFixed(2);
		this.mergeData.VUCurrent = jsonData.B14.toFixed(2);
		this.mergeData.WUCurrent = jsonData.B16.toFixed(2);
		this.mergeData.ACPower = jsonData.B40.toFixed(2);

		this.energyData.B0.value = jsonData.B0.toFixed(2) + this.setHtmlText('V')
		this.energyData.B2.value = jsonData.B2.toFixed(2) + this.setHtmlText('V')
		this.energyData.B4.value = jsonData.B4.toFixed(2) + this.setHtmlText('V')
		this.energyData.B6.value = jsonData.B6.toFixed(2) + this.setHtmlText('V')
		this.energyData.B8.value = jsonData.B8.toFixed(2) + this.setHtmlText('V')
		this.energyData.B10.value = jsonData.B10.toFixed(2) + this.setHtmlText('V')
		this.energyData.B12.value = jsonData.B12.toFixed(2) + this.setHtmlText('A')
		this.energyData.B14.value = jsonData.B14.toFixed(2) + this.setHtmlText('A')
		this.energyData.B16.value = jsonData.B16.toFixed(2) + this.setHtmlText('A')
		this.energyData.B18.value = jsonData.B18.toFixed(2) + this.setHtmlText('Hz')
		this.energyData.B20.value = jsonData.B20.toFixed(2) + this.setHtmlText('Hz')
		this.energyData.B22.value = jsonData.B22.toFixed(2) + this.setHtmlText('A')
		this.energyData.B24.value = jsonData.B24.toFixed(2) + this.setHtmlText('℃')
		this.energyData.B26.value = jsonData.B26.toFixed(2) + this.setHtmlText('℃')
		this.energyData.B28.value = jsonData.B28.toFixed(2) + this.setHtmlText('℃')
		this.energyData.B30.value = jsonData.B30.toFixed(2) + this.setHtmlText('℃')
		this.energyData.B32.value = jsonData.B32.toFixed(2) + this.setHtmlText('V')
		this.energyData.B34.value = jsonData.B34.toFixed(2) + this.setHtmlText('A')
		this.energyData.B36.value = jsonData.B36.toFixed(2) + this.setHtmlText('kW')
		this.energyData.B38.value = jsonData.B38.toFixed(2) + this.setHtmlText('kVA')
		this.energyData.B40.value = jsonData.B40.toFixed(2) + this.setHtmlText('kW')
		this.energyData.B42.value = jsonData.B42.toFixed(2) + this.setHtmlText('kVar')
		this.energyData.B44.value = jsonData.B44.toFixed(2) + this.setHtmlText('kVA')
		this.energyData.B46.value = jsonData.B46.toFixed(2) + this.setHtmlText('kW')
		this.energyData.B48.value = jsonData.B48.toFixed(2)
		this.energyData.B50.value = jsonData.B50.toFixed(2) + this.setHtmlText('%')
		this.energyData.B52.value = jsonData.B52.toFixed(2) + this.setHtmlText('kVA')
		this.energyData.B54.value = jsonData.B54.toFixed(2) + this.setHtmlText('kW')
		this.energyData.B56.value = jsonData.B56.toFixed(2);
		this.energyData.B58.value = jsonData.B58.toFixed(2) + this.setHtmlText('%')
		this.energyData.B60.value = jsonData.B60.toFixed(2) + this.setHtmlText('kVA')
		this.energyData.B62.value = jsonData.B62.toFixed(2) + this.setHtmlText('kW')
		this.energyData.B64.value = jsonData.B64.toFixed(2);
		this.energyData.B66.value = jsonData.B66.toFixed(2) + this.setHtmlText('%')
		this.energyData.B68.value = jsonData.B68.toFixed(2) + this.setHtmlText('%')
		this.energyData.B70.value = jsonData.B70.toFixed(2) + this.setHtmlText('kVA')
		this.energyData.B72.value = jsonData.B72.toFixed(2) + this.setHtmlText('V')
		this.energyData.B74.value = jsonData.B74.toFixed(2) + this.setHtmlText('A')
		this.energyData.B76.value = jsonData.B76.toFixed(2) + this.setHtmlText('%')
		this.energyData.B78.value = jsonData.B78.toFixed(2) + this.setHtmlText('%')
		this.energyData.B80.value = jsonData.B80.toFixed(2) + this.setHtmlText('A')
		this.energyData.B82.value = jsonData.B82.toFixed(2) + this.setHtmlText('A')
		this.energyData.B84.value = jsonData.B84.toFixed(2) + this.setHtmlText('V')
		this.energyData.B86.value = jsonData.B86.toFixed(2) + this.setHtmlText('V')
		this.energyData.B88.value = jsonData.B88.toFixed(2) + this.setHtmlText('kWh')
		this.energyData.B90.value = jsonData.B90.toFixed(2) + this.setHtmlText('kWh')
	}

	setHtmlText(unit) {
		
		// return `<span style='color:#7287C6;font-size:.8rem'> ${unit}</span>`
		return  Math.random()+ `<span style='font-size:.8rem'>  ${unit}</span>`
	}
	setRunningStatus(key) {
		switch (key) {
			case 0:
				return '待机';
			case 1:
				return '运行';
			case 2:
				return '故障';
			default:
				return key;
		}
	}

	getStatusData(jsonData) {
		this.stateData.B0.value = jsonData.data.B0
		this.stateData.B4.value = jsonData.data.B4
		this.stateData.B8.value = jsonData.data.B8
		this.stateData.B12.value = jsonData.data.B12
		this.stateData.B16.value = this.setRunningStatus(jsonData.data.B16)
		this.stateData.B18.value = jsonData.data.B18
		this.stateData.B20.value = jsonData.data.B20 == 0 ? '并网': (jsonData.data.B20 == 1 ? '离网': jsonData.data
			.B20)
		this.stateData.B22.value = jsonData.data.B22 == 0 ? '关闭': (jsonData.data.B22 == 1 ? '开启': jsonData.data
			.B22)

		this.mergeData.runningState = this.stateData.B16.value
		this.mergeData.onlineState = this.stateData.B20.value
		this.mergeData.remoteControl = this.stateData.B22.value
		this.stateData.B24b0.value = jsonData.data.B24b0;
		this.stateData.B24b1.value = jsonData.data.B24b1;
		this.stateData.B24b2.value = jsonData.data.B24b2;
		this.stateData.B24b3.value = jsonData.data.B24b3;
		this.stateData.B24b4.value = jsonData.data.B24b4;
		this.stateData.B24b5.value = jsonData.data.B24b5;
		this.stateData.B24b6.value = jsonData.data.B24b6;
		this.stateData.B24b7.value = jsonData.data.B24b7
		this.stateData.B24b8.value = jsonData.data.B24b8
		this.stateData.B24b9.value = jsonData.data.B24b9
		this.stateData.B24b10.value = jsonData.data.B24b10
		this.stateData.B24b11.value = jsonData.data.B24b11
		this.stateData.B24b12.value = jsonData.data.B24b12
		this.stateData.B24b13.value = jsonData.data.B24b13
		this.stateData.B24b14.value = jsonData.data.B24b14
		this.stateData.B24b15.value = jsonData.data.B24b15


		this.stateData.B26b0.value = jsonData.data.B26b0
		this.stateData.B26b1.value = jsonData.data.B26b1
		this.stateData.B26b2.value = jsonData.data.B26b2
		this.stateData.B26b3.value = jsonData.data.B26b3
		this.stateData.B26b4.value = jsonData.data.B26b4
		this.stateData.B26b5.value = jsonData.data.B26b5
		this.stateData.B26b6.value = jsonData.data.B26b6
		this.stateData.B26b7.value = jsonData.data.B26b7
		this.stateData.B26b8.value = jsonData.data.B26b8
		this.stateData.B26b9.value = jsonData.data.B26b9
		this.stateData.B26b10.value = jsonData.data.B26b10
		this.stateData.B26b11.value = jsonData.data.B26b11
		this.stateData.B26b12.value = jsonData.data.B26b12
		this.stateData.B26b13.value = jsonData.data.B26b13
		this.stateData.B26b14.value = jsonData.data.B26b14
		this.stateData.B26b15.value = jsonData.data.B26b15
		this.stateData.B28b0.value = jsonData.data.B28b0
		this.stateData.B28b1.value = jsonData.data.B28b1
		this.stateData.B28b2.value = jsonData.data.B28b2
		this.stateData.B28b3.value = jsonData.data.B28b3
		this.stateData.B28b4.value = jsonData.data.B28b4
		this.stateData.B28b5.value = jsonData.data.B28b5
		this.stateData.B28b6.value = jsonData.data.B28b6
		this.stateData.B28b7.value = jsonData.data.B28b7
		this.stateData.B28b8.value = jsonData.data.B28b8
		this.stateData.B28b9.value = jsonData.data.B28b9
		this.stateData.B28b10.value = jsonData.data.B28b10
		this.stateData.B28b11.value = jsonData.data.B28b11
		this.stateData.B28b12.value = jsonData.data.B28b12
		this.stateData.B28b13.value = jsonData.data.B28b13
		this.stateData.B28b14.value = jsonData.data.B28b14
		this.stateData.B28b15.value = jsonData.data.B28b15

		this.stateData.B30b0.value = jsonData.data.B30b0
		this.stateData.B30b1.value = jsonData.data.B30b1
		this.stateData.B30b2.value = jsonData.data.B30b2
		this.stateData.B30b3.value = jsonData.data.B30b3
		this.stateData.B30b4.value = jsonData.data.B30b4
		this.stateData.B30b5.value = jsonData.data.B30b5;
		this.stateData.B30b6.value = jsonData.data.B30b6;
		this.stateData.B30b7.value = jsonData.data.B30b7;
		this.stateData.B30b8.value = jsonData.data.B30b8;
		this.stateData.B30b9.value = jsonData.data.B30b9;
		this.stateData.B30b10.value = jsonData.data.B30b10
		this.stateData.B30b11.value = jsonData.data.B30b11;
		this.stateData.B30b12.value = jsonData.data.B30b12;
		this.stateData.B30b13.value = jsonData.data.B30b13;
		this.stateData.B30b14.value = jsonData.data.B30b14;
		this.stateData.B30b15.value = jsonData.data.B30b15;
		this.stateData.B32b0.value = jsonData.data.B32b0;
		this.stateData.B32b1.value = jsonData.data.B32b1
		this.stateData.B32b2.value = jsonData.data.B32b2
		this.stateData.B32b3.value = jsonData.data.B32b3;
		this.stateData.B32b4.value = jsonData.data.B32b4;
		this.stateData.B32b5.value = jsonData.data.B32b5;
		this.stateData.B32b6.value = jsonData.data.B32b6;
		this.stateData.B32b7.value = jsonData.data.B32b7;
		this.stateData.B32b8.value = jsonData.data.B32b8;
		this.stateData.B32b9.value = jsonData.data.B32b9;
		this.stateData.B32b10.value = jsonData.data.B32b10;
		this.stateData.B32b11.value = jsonData.data.B32b11;
		this.stateData.B32b12.value = jsonData.data.B32b12;
		this.stateData.B32b13.value = jsonData.data.B32b13;
		this.stateData.B32b14.value = jsonData.data.B32b14;
		this.stateData.B32b15.value = jsonData.data.B32b15;




		this.stateData.B34b0.value = jsonData.data.B34b0;
		this.stateData.B34b1.value = jsonData.data.B34b1;
		this.stateData.B34b2.value = jsonData.data.B34b2;
		this.stateData.B34b3.value = jsonData.data.B34b3;
		this.stateData.B34b4.value = jsonData.data.B34b4
		this.stateData.B34b5.value = jsonData.data.B34b5
		this.stateData.B34b6.value = jsonData.data.B34b6
		this.stateData.B34b7.value = jsonData.data.B34b7
		this.stateData.B34b8.value = jsonData.data.B34b8
		this.stateData.B34b9.value = jsonData.data.B34b9
		this.stateData.B34b10.value = jsonData.data.B34b10
		this.stateData.B34b11.value = jsonData.data.B34b11
		this.stateData.B34b12.value = jsonData.data.B34b12
		this.stateData.B34b13.value = jsonData.data.B34b13
		this.stateData.B34b14.value = jsonData.data.B34b14
		this.stateData.B34b15.value = jsonData.data.B34b15
		this.stateData.B36b0.value = jsonData.data.B36b0;
		this.stateData.B36b1.value = jsonData.data.B36b1
		this.stateData.B36b2.value = jsonData.data.B36b2
		this.stateData.B36b3.value = jsonData.data.B36b3
		this.stateData.B36b4.value = jsonData.data.B36b4
		this.stateData.B36b5.value = jsonData.data.B36b5
		this.stateData.B36b6.value = jsonData.data.B36b6
		this.stateData.B36b7.value = jsonData.data.B36b7
		this.stateData.B36b8.value = jsonData.data.B36b8
		this.stateData.B36b9.value = jsonData.data.B36b9
		this.stateData.B36b10.value = jsonData.data.B36b10
		this.stateData.B36b11.value = jsonData.data.B36b11
		this.stateData.B36b12.value = jsonData.data.B36b12
		this.stateData.B36b13.value = jsonData.data.B36b13
		this.stateData.B36b14.value = jsonData.data.B36b14
		this.stateData.B36b15.value = jsonData.data.B36b15

		this.stateData.B40.value = this.setStatus(jsonData.data.B40)

		this.stateData.B42b0.value = jsonData.data.B42b0 == 0 ? '正常': '故障'
		this.stateData.B42b1.value = jsonData.data.B42b1 == 0 ? '正常': '故障'
		this.stateData.B42b2.value = jsonData.data.B42b2 == 0 ? '正常': '故障'
		this.stateData.B42b3.value = jsonData.data.B42b3 == 0 ? '正常': '故障'
		this.stateData.B42b4.value = jsonData.data.B42b4 == 0 ? '正常': '故障'
		this.stateData.B42b5.value = jsonData.data.B42b5 == 0 ? '正常': '故障'



	}
	setStatus(key) {
		switch (key) {
			case 0:
				return '初始状态';
			case 1:
				return '正常状态';
			case 2:
				return '禁充';
			case 3:
				return '禁放';
			case 4:
				return '报警';
			case 5:
				return '故障';
			case 6:
				return '待机';
			default:
				return key;
		}
	}

	toFixed(data) {
		return parseFloat(data) ? parseFloat(data).toFixed(2) : (Math.random()*100).toFixed(2)
	}
}


export class StorageEnergyModel {
	current = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	voltage = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	frequency = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	powerFactor = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	activePower = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	inactivePower = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};
	apparentPower = {
		name: '',
		value: (Math.random()*100).toFixed(2)
	};

}

export class MergeData {
	charge = "--";
	discharge = "--";
	batterySoc = "--"
	runningState = "--";
	voltage = "--";
	current = "--";
	power = "--"
	onlineState = "--"
	remoteControl = "--"
	UVoltage = "--"
	VVoltage = "--"
	WVoltage = "--"
	UCurrent = "--"
	VUCurrent = "--"
	WUCurrent = "--"
	ACPower = "--"
}
export class EnergyData {
	B0 = {
		name: 'UV电网线电压',
		value: "--"
	};
	B2 = {
		name: 'VW电网线电压',
		value: "--"
	};
	B4 = {
		name: 'WU电网线电压',
		value: "--"
	};
	B6 = {
		name: 'U相输出电压',
		value: "--"
	};
	B8 = {
		name: 'V相输出电压',
		value: "--"
	};
	B10 = {
		name: 'W相输出电压',
		value: "--"
	};
	B12 = {
		name: 'U相输出电流',
		value: "--"
	};
	B14 = {
		name: 'V相输出电流',
		value: "--"
	};
	B16 = {
		name: 'W相输出电流',
		value: "--"
	};
	B18 = {
		name: '离网频率',
		value: "--"
	};
	B20 = {
		name: '电网频率',
		value: "--"
	};
	B22 = {
		name: '交流漏电流',
		value: "--"
	};
	B24 = {
		name: '内部温度',
		value: "--"
	};
	B26 = {
		name: 'A相模块温度',
		value: "--"
	};
	B28 = {
		name: 'B相模块温度',
		value: "--"
	};
	B30 = {
		name: 'C相模块温度',
		value: "--"
	};
	B32 = {
		name: '直流电压',
		value: "--"
	};
	B34 = {
		name: '直流电流',
		value: "--"
	};
	B36 = {
		name: '总直流功率',
		value: "--"
	};
	B38 = {
		name: '输出视在功率',
		value: "--"
	};
	B40 = {
		name: '输出有功功率',
		value: "--"
	};
	B42 = {
		name: '输出无功功率',
		value: "--"
	};
	B44 = {
		name: 'U相输出视在功率',
		value: "--"
	};
	B46 = {
		name: 'U相输出有功功率',
		value: "--"
	};
	B48 = {
		name: 'U相PF值',
		value: "--"
	};
	B50 = {
		name: 'U相负载量',
		value: "--"
	};
	B52 = {
		name: 'V相输出视在功率',
		value: "--"
	};
	B54 = {
		name: 'V相输出有功功率',
		value: "--"
	};
	B56 = {
		name: 'V相PF值',
		value: "--"
	};
	B58 = {
		name: 'V相负载量',
		value: "--"
	};
	B60 = {
		name: 'W相输出视在功率',
		value: "--"
	};
	B62 = {
		name: 'W相输出有功功率',
		value: "--"
	};
	B64 = {
		name: 'W相PF值',
		value: "--"
	};
	B66 = {
		name: 'W相负载量',
		value: "--"
	};
	B68 = {
		name: '总负载量',
		value: "--"
	};
	B70 = {
		name: '可用功率',
		value: "--"
	};
	B72 = {
		name: '电池组总电压',
		value: "--"
	};
	B74 = {
		name: '电池组总电流',
		value: "--"
	};
	B76 = {
		name: '电池组SOC',
		value: "--"
	};
	B78 = {
		name: '电池组SOH',
		value: "--"
	};
	B80 = {
		name: '充电限制电流',
		value: "--"
	};
	B82 = {
		name: '放电限制电流',
		value: "--"
	};
	B84 = {
		name: '充电限制电压',
		value: "--"
	};
	B86 = {
		name: '放电限制电压',
		value: "--"
	};
	B88 = {
		name: '充电可用电量',
		value: "--"
	};
	B90 = {
		name: '放电可用电量',
		value: "--"
	};
}
// export class EnergyData {
// 	B0 = {
// 		name: 'UV电网线电压',
// 		value: (Math.random()*10).toFixed(2)
// 	};
// 	B2 = {
// 		name: 'VW电网线电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B4 = {
// 		name: 'WU电网线电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B6 = {
// 		name: 'U相输出电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B8 = {
// 		name: 'V相输出电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B10 = {
// 		name: 'W相输出电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B12 = {
// 		name: 'U相输出电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B14 = {
// 		name: 'V相输出电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B16 = {
// 		name: 'W相输出电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B18 = {
// 		name: '离网频率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B20 = {
// 		name: '电网频率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B22 = {
// 		name: '交流漏电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24 = {
// 		name: '内部温度',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26 = {
// 		name: 'A相模块温度',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28 = {
// 		name: 'B相模块温度',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30 = {
// 		name: 'C相模块温度',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32 = {
// 		name: '直流电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34 = {
// 		name: '直流电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36 = {
// 		name: '总直流功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B38 = {
// 		name: '输出视在功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B40 = {
// 		name: '输出有功功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42 = {
// 		name: '输出无功功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B44 = {
// 		name: 'U相输出视在功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B46 = {
// 		name: 'U相输出有功功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B48 = {
// 		name: 'U相PF值',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B50 = {
// 		name: 'U相负载量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B52 = {
// 		name: 'V相输出视在功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B54 = {
// 		name: 'V相输出有功功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B56 = {
// 		name: 'V相PF值',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B58 = {
// 		name: 'V相负载量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B60 = {
// 		name: 'W相输出视在功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B62 = {
// 		name: 'W相输出有功功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B64 = {
// 		name: 'W相PF值',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B66 = {
// 		name: 'W相负载量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B68 = {
// 		name: '总负载量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B70 = {
// 		name: '可用功率',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B72 = {
// 		name: '电池组总电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B74 = {
// 		name: '电池组总电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B76 = {
// 		name: '电池组SOC',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B78 = {
// 		name: '电池组SOH',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B80 = {
// 		name: '充电限制电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B82 = {
// 		name: '放电限制电流',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B84 = {
// 		name: '充电限制电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B86 = {
// 		name: '放电限制电压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B88 = {
// 		name: '充电可用电量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B90 = {
// 		name: '放电可用电量',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// }
export class StateData {
	B0 = {
		name: '变流器设备硬件版本',
		value: "--"
	};
	B4 = {
		name: '变流器设备软件版本',
		value: "--"
	};
	B8 = {
		name: '信息板硬件版本',
		value: "--"
	};
	B12 = {
		name: '信息板软件版本',
		value: "--"
	};
	B16 = {
		name: '运行状态',
		value: "--"
	};
	B18 = {
		name: '当前故障代码',
		value: "--"
	};
	B20 = {
		name: '并离网状态',
		value: "--"
	};
	B22 = {
		name: '远程控制状态',
		value: "--"
	};

	B40 = {
		name: 'BMS系统状态',
		value: "--"
	};
	B42b0 = {
		name: 'BMS单体过压',
		value: "--"
	};
	B42b1 = {
		name: 'BMS单体欠压',
		value: "--"
	};
	B42b2 = {
		name: 'BMS单体过温',
		value: "--"
	};
	B42b3 = {
		name: 'BMS单体低温',
		value: "--"
	};
	B42b4 = {
		name: 'BMS绝缘过低',
		value: "--"
	};
	B42b5 = {
		name: 'BMS内部通信故障',
		value: "--"
	};
	B24b0 = {
		name: '故障字1F1',
		value: "--"
	};
	B24b1 = {
		name: '故障字1F2',
		value: "--"
	};
	B24b2 = {
		name: '故障字1F3',
		value: "--"
	};
	B24b3 = {
		name: '故障字1F4',
		value: "--"
	};
	B24b4 = {
		name: '故障字1F5',
		value: "--"
	};
	B24b5 = {
		name: '故障字1F6',
		value: "--"
	};
	B24b6 = {
		name: '故障字1F7',
		value: "--"
	};
	B24b7 = {
		name: '故障字1F8',
		value: "--"
	};
	B24b8 = {
		name: '故障字1F9',
		value: "--"
	};
	B24b9 = {
		name: '故障字1F10',
		value: "--"
	};
	B24b10 = {
		name: '故障字1F11',
		value: "--"
	};
	B24b11 = {
		name: '故障字1F12',
		value: "--"
	};
	B24b12 = {
		name: '故障字1F13',
		value: "--"
	};
	B24b13 = {
		name: '故障字1F14',
		value: "--"
	};
	B24b14 = {
		name: '故障字1F15',
		value: "--"
	};
	B24b15 = {
		name: '故障字1F16',
		value: "--"
	};
	B26b0 = {
		name: '故障字2F17',
		value: "--"
	};
	B26b1 = {
		name: '故障字2F18',
		value: "--"
	};
	B26b2 = {
		name: '故障字2F19',
		value: "--"
	};
	B26b3 = {
		name: '故障字2F20',
		value: "--"
	};
	B26b4 = {
		name: '故障字2F21',
		value: "--"
	};
	B26b5 = {
		name: '故障字2F22',
		value: "--"
	};
	B26b6 = {
		name: '故障字2F23',
		value: "--"
	};
	B26b7 = {
		name: '故障字2F24',
		value: "--"
	};
	B26b8 = {
		name: '故障字2F25',
		value: "--"
	};
	B26b9 = {
		name: '故障字2F26',
		value: "--"
	};
	B26b10 = {
		name: '故障字2F27',
		value: "--"
	};
	B26b11 = {
		name: '故障字2F28',
		value: "--"
	};
	B26b12 = {
		name: '故障字2F29',
		value: "--"
	};
	B26b13 = {
		name: '故障字2F30',
		value: "--"
	};
	B26b14 = {
		name: '故障字2F31',
		value: "--"
	};
	B26b15 = {
		name: '故障字2F32',
		value: "--"
	};

	B28b0 = {
		name: '故障字3F33',
		value: "--"
	};
	B28b1 = {
		name: '故障字3F34',
		value: "--"
	};
	B28b2 = {
		name: '故障字3F35',
		value: "--"
	};
	B28b3 = {
		name: '故障字3F36',
		value: "--"
	};
	B28b4 = {
		name: '故障字3F37',
		value: "--"
	};
	B28b5 = {
		name: '故障字3F38',
		value: "--"
	};
	B28b6 = {
		name: '故障字3F39',
		value: "--"
	};
	B28b7 = {
		name: '故障字3F40',
		value: "--"
	};
	B28b8 = {
		name: '故障字3F41',
		value: "--"
	};
	B28b9 = {
		name: '故障字3F42',
		value: "--"
	};
	B28b10 = {
		name: '故障字3F43',
		value: "--"
	};
	B28b11 = {
		name: '故障字3F44',
		value: "--"
	};
	B28b12 = {
		name: '故障字3F45',
		value: "--"
	};
	B28b13 = {
		name: '故障字3F46',
		value: "--"
	};
	B28b14 = {
		name: '故障字3F47',
		value: "--"
	};
	B28b15 = {
		name: '故障字3F48',
		value: "--"
	};
	B30b0 = {
		name: '故障字4F49',
		value: "--"
	};
	B30b1 = {
		name: '故障字4F50',
		value: "--"
	};
	B30b2 = {
		name: '故障字4F51',
		value: "--"
	};
	B30b3 = {
		name: '故障字4F52',
		value: "--"
	};
	B30b4 = {
		name: '故障字4F53',
		value: "--"
	};
	B30b5 = {
		name: '故障字4F54',
		value: "--"
	};
	B30b6 = {
		name: '故障字4F55',
		value: "--"
	};
	B30b7 = {
		name: '故障字4F56',
		value: "--"
	};
	B30b8 = {
		name: '故障字4F57',
		value: "--"
	};
	B30b9 = {
		name: '故障字4F58',
		value: "--"
	};
	B30b10 = {
		name: '故障字4F59',
		value: "--"
	};
	B30b11 = {
		name: '故障字4F60',
		value: "--"
	};
	B30b12 = {
		name: '故障字4F61',
		value: "--"
	};
	B30b13 = {
		name: '故障字4F62',
		value: "--"
	};
	B30b14 = {
		name: '故障字4F63',
		value: "--"
	};
	B30b15 = {
		name: '故障字4F64',
		value: "--"
	};

	B32b0 = {
		name: '故障字5F65',
		value: "--"
	};
	B32b1 = {
		name: '故障字5F66',
		value: "--"
	};
	B32b2 = {
		name: '故障字5F67',
		value: "--"
	};
	B32b3 = {
		name: '故障字5F68',
		value: "--"
	};
	B32b4 = {
		name: '故障字5F69',
		value: "--"
	};
	B32b5 = {
		name: '故障字5F70',
		value: "--"
	};
	B32b6 = {
		name: '故障字5F71',
		value: "--"
	};
	B32b7 = {
		name: '故障字5F72',
		value: "--"
	};
	B32b8 = {
		name: '故障字5F73',
		value:"--"
	};
	B32b9 = {
		name: '故障字5F74',
		value: "--"
	};
	B32b10 = {
		name: '故障字5F75',
		value: "--"
	};
	B32b11 = {
		name: '故障字5F76',
		value: "--"
	};
	B32b12 = {
		name: '故障字5F77',
		value: "--"
	};
	B32b13 = {
		name: '故障字5F78',
		value: "--"
	};
	B32b14 = {
		name: '故障字5F79',
		value: "--"
	};
	B32b15 = {
		name: '故障字5F80',
		value: "--"
	};
	B34b0 = {
		name: '故障字6F81',
		value: "--"
	};
	B34b1 = {
		name: '故障字6F82',
		value: "--"
	};
	B34b2 = {
		name: '故障字6F83',
		value: "--"
	};
	B34b3 = {
		name: '故障字6F84',
		value: "--"
	};
	B34b4 = {
		name: '故障字6F85',
		value: "--"
	};
	B34b5 = {
		name: '故障字6F86',
		value: "--"
	};
	B34b6 = {
		name: '故障字6F87',
		value: "--"
	};
	B34b7 = {
		name: '故障字6F88',
		value: "--"
	};
	B34b8 = {
		name: '故障字6F89',
		value: "--"
	};
	B34b9 = {
		name: '故障字6F90',
		value: "--"
	};
	B34b10 = {
		name: '故障字6F91',
		value: "--"
	};
	B34b11 = {
		name: '故障字6F92',
		value: "--"
	};
	B34b12 = {
		name: '故障字6F93',
		value: "--"
	};
	B34b13 = {
		name: '故障字6F94',
		value: "--"
	};
	B34b14 = {
		name: '故障字6F95',
		value: "--"
	};
	B34b15 = {
		name: '故障字6F96',
		value: "--"
	};
	B36b0 = {
		name: '故障字7F97',
		value: "--"
	};
	B36b1 = {
		name: '故障字7F98',
		value: "--"
	};
	B36b2 = {
		name: '故障字7F99',
		value: "--"
	};
	B36b3 = {
		name: '故障字7F100',
		value: "--"
	};
	B36b4 = {
		name: '故障字7F101',
		value: "--"
	};
	B36b5 = {
		name: '故障字7F102',
		value: "--"
	};
	B36b6 = {
		name: '故障字7F103',
		value: "--"
	};
	B36b7 = {
		name: '故障字7F104',
		value: "--"
	};
	B36b8 = {
		name: '故障字7F105',
		value: "--"
	};
	B36b9 = {
		name: '故障字7F106',
		value: "--"
	};
	B36b10 = {
		name: '故障字7F107',
		value: "--"
	};
	B36b11 = {
		name: '故障字7F108',
		value: "--"
	};
	B36b12 = {
		name: '故障字7F109',
		value: "--"
	};
	B36b13 = {
		name: '故障字7F110',
		value: "--"
	};
	B36b14 = {
		name: '故障字7F111',
		value: "--"
	};
	B36b15 = {
		name: '故障字7F112',
		value: "--"
	};

}
// export class StateData {
// 	B0 = {
// 		name: '变流器设备硬件版本',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B4 = {
// 		name: '变流器设备软件版本',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B8 = {
// 		name: '信息板硬件版本',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B12 = {
// 		name: '信息板软件版本',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B16 = {
// 		name: '运行状态',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B18 = {
// 		name: '当前故障代码',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B20 = {
// 		name: '并离网状态',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B22 = {
// 		name: '远程控制状态',
// 		value: (Math.random()*100).toFixed(2)
// 	};

// 	B40 = {
// 		name: 'BMS系统状态',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b0 = {
// 		name: 'BMS单体过压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b1 = {
// 		name: 'BMS单体欠压',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b2 = {
// 		name: 'BMS单体过温',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b3 = {
// 		name: 'BMS单体低温',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b4 = {
// 		name: 'BMS绝缘过低',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B42b5 = {
// 		name: 'BMS内部通信故障',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b0 = {
// 		name: '故障字1F1',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b1 = {
// 		name: '故障字1F2',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b2 = {
// 		name: '故障字1F3',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b3 = {
// 		name: '故障字1F4',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b4 = {
// 		name: '故障字1F5',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b5 = {
// 		name: '故障字1F6',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b6 = {
// 		name: '故障字1F7',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b7 = {
// 		name: '故障字1F8',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b8 = {
// 		name: '故障字1F9',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b9 = {
// 		name: '故障字1F10',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b10 = {
// 		name: '故障字1F11',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b11 = {
// 		name: '故障字1F12',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b12 = {
// 		name: '故障字1F13',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b13 = {
// 		name: '故障字1F14',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b14 = {
// 		name: '故障字1F15',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B24b15 = {
// 		name: '故障字1F16',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b0 = {
// 		name: '故障字2F17',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b1 = {
// 		name: '故障字2F18',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b2 = {
// 		name: '故障字2F19',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b3 = {
// 		name: '故障字2F20',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b4 = {
// 		name: '故障字2F21',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b5 = {
// 		name: '故障字2F22',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b6 = {
// 		name: '故障字2F23',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b7 = {
// 		name: '故障字2F24',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b8 = {
// 		name: '故障字2F25',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b9 = {
// 		name: '故障字2F26',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b10 = {
// 		name: '故障字2F27',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b11 = {
// 		name: '故障字2F28',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b12 = {
// 		name: '故障字2F29',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b13 = {
// 		name: '故障字2F30',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b14 = {
// 		name: '故障字2F31',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B26b15 = {
// 		name: '故障字2F32',
// 		value: (Math.random()*100).toFixed(2)
// 	};

// 	B28b0 = {
// 		name: '故障字3F33',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b1 = {
// 		name: '故障字3F34',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b2 = {
// 		name: '故障字3F35',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b3 = {
// 		name: '故障字3F36',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b4 = {
// 		name: '故障字3F37',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b5 = {
// 		name: '故障字3F38',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b6 = {
// 		name: '故障字3F39',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b7 = {
// 		name: '故障字3F40',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b8 = {
// 		name: '故障字3F41',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b9 = {
// 		name: '故障字3F42',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b10 = {
// 		name: '故障字3F43',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b11 = {
// 		name: '故障字3F44',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b12 = {
// 		name: '故障字3F45',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b13 = {
// 		name: '故障字3F46',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b14 = {
// 		name: '故障字3F47',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B28b15 = {
// 		name: '故障字3F48',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b0 = {
// 		name: '故障字4F49',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b1 = {
// 		name: '故障字4F50',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b2 = {
// 		name: '故障字4F51',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b3 = {
// 		name: '故障字4F52',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b4 = {
// 		name: '故障字4F53',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b5 = {
// 		name: '故障字4F54',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b6 = {
// 		name: '故障字4F55',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b7 = {
// 		name: '故障字4F56',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b8 = {
// 		name: '故障字4F57',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b9 = {
// 		name: '故障字4F58',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b10 = {
// 		name: '故障字4F59',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b11 = {
// 		name: '故障字4F60',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b12 = {
// 		name: '故障字4F61',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b13 = {
// 		name: '故障字4F62',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b14 = {
// 		name: '故障字4F63',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B30b15 = {
// 		name: '故障字4F64',
// 		value: (Math.random()*100).toFixed(2)
// 	};

// 	B32b0 = {
// 		name: '故障字5F65',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b1 = {
// 		name: '故障字5F66',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b2 = {
// 		name: '故障字5F67',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b3 = {
// 		name: '故障字5F68',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b4 = {
// 		name: '故障字5F69',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b5 = {
// 		name: '故障字5F70',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b6 = {
// 		name: '故障字5F71',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b7 = {
// 		name: '故障字5F72',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b8 = {
// 		name: '故障字5F73',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b9 = {
// 		name: '故障字5F74',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b10 = {
// 		name: '故障字5F75',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b11 = {
// 		name: '故障字5F76',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b12 = {
// 		name: '故障字5F77',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b13 = {
// 		name: '故障字5F78',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b14 = {
// 		name: '故障字5F79',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B32b15 = {
// 		name: '故障字5F80',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b0 = {
// 		name: '故障字6F81',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b1 = {
// 		name: '故障字6F82',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b2 = {
// 		name: '故障字6F83',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b3 = {
// 		name: '故障字6F84',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b4 = {
// 		name: '故障字6F85',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b5 = {
// 		name: '故障字6F86',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b6 = {
// 		name: '故障字6F87',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b7 = {
// 		name: '故障字6F88',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b8 = {
// 		name: '故障字6F89',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b9 = {
// 		name: '故障字6F90',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b10 = {
// 		name: '故障字6F91',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b11 = {
// 		name: '故障字6F92',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b12 = {
// 		name: '故障字6F93',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b13 = {
// 		name: '故障字6F94',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b14 = {
// 		name: '故障字6F95',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B34b15 = {
// 		name: '故障字6F96',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b0 = {
// 		name: '故障字7F97',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b1 = {
// 		name: '故障字7F98',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b2 = {
// 		name: '故障字7F99',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b3 = {
// 		name: '故障字7F100',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b4 = {
// 		name: '故障字7F101',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b5 = {
// 		name: '故障字7F102',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b6 = {
// 		name: '故障字7F103',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b7 = {
// 		name: '故障字7F104',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b8 = {
// 		name: '故障字7F105',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b9 = {
// 		name: '故障字7F106',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b10 = {
// 		name: '故障字7F107',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b11 = {
// 		name: '故障字7F108',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b12 = {
// 		name: '故障字7F109',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b13 = {
// 		name: '故障字7F110',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b14 = {
// 		name: '故障字7F111',
// 		value: (Math.random()*100).toFixed(2)
// 	};
// 	B36b15 = {
// 		name: '故障字7F112',
// 		value: (Math.random()*100).toFixed(2)
// 	};

// }