import DeviceBase from "./device-base.model"

export class Model2307 extends DeviceBase {
	stateData;
	energyData;
	alarmData;
	runningstate;
	constructor() {
		super();

		this.stateData = new StateData();
		this.energyData = new EnergyData()
		this.alarmData = new AlarmData();
		this.runningstate = new RunningState();
	}
	getEnergyData(jsonData) {}

	setHtmlText(unit) {
		return `<span style='color:#fff;font-size:0.8rem'> ${unit}</span>`
	}


	setStopStatus(data) {
		switch (data) {
			case 0:
				return '停止';
			case 1:
				return '等待自动启动  ';
			case 2:
				return '启动中';
			case 3:
				return '运行';
			case 4:
				return '停机';
			default:
				return '未知'
		}
	}

	setLoadStatus(data) {
		switch (data) {
			case 0:
				return '卸载';
			case 1:
				return '加载  ';
			case 2:
				return '固定卸载';
			case 3:
				return '固定100% 加载';
			case 4:
				return '强制卸载';
			default:
				return '未知'
		}
	}
	setrunnStatus(data) {
		switch (data) {
			case 0:
				return '启动准备结束';
			case 1:
				return '启动准备开始  ';
			case 2:
				return '启动准备结束待机';
			case 3:
				return '运行中';
			case 4:
				return '联机运行';
			case 5:
				return '冷却';
			default:
				return '未知'
		}
	}
	getStatusData(jsonData) {
		this.stateData.B34.value = jsonData.data.B34 / 1000 + this.setHtmlText('MPa');
		this.stateData.B36.value = jsonData.data.B36 / 1000 + this.setHtmlText('MPa');

		this.stateData.B38.value = jsonData.data.B38 + this.setHtmlText('A');
		this.stateData.B40.value = jsonData.data.B40 / 1000 + this.setHtmlText('MPa');
		this.stateData.B42.value = jsonData.data.B42 / 1000 + this.setHtmlText('MPa');
		this.stateData.B46.value = jsonData.data.B46 + this.setHtmlText('℃');
		this.stateData.B48.value = jsonData.data.B48 + this.setHtmlText('℃');
		this.stateData.primaryShaftVibration.value = jsonData.data.B50 + this.setHtmlText('μm');
		this.stateData.B52.value = jsonData.data.B52 + this.setHtmlText('μm');
		this.stateData.B54.value = jsonData.data.B54 + this.setHtmlText('μm');


		this.stateData.B56.value = jsonData.data.B56 + this.setHtmlText('℃');
		this.stateData.B58.value = jsonData.data.B58 + this.setHtmlText('℃');
		this.stateData.B60.value = jsonData.data.B60 + this.setHtmlText('℃');
		this.stateData.B62.value = jsonData.data.B62 + this.setHtmlText('℃');
		this.stateData.B64.value = jsonData.data.B64 + this.setHtmlText('℃');
		this.stateData.B68.value = jsonData.data.B68 + this.setHtmlText('％');
		this.stateData.B70.value = jsonData.data.B70 + this.setHtmlText('％');
		this.energyData.systemPressure = (jsonData.data.B34 / 1000).toString()
		this.energyData.exhaustPressure = (jsonData.data.B36 / 1000).toString()
		this.energyData.lubricatingOilTemperature = jsonData.data.B46
		this.energyData.IGVOpeningSignal = jsonData.data.B68
		this.stateData.B82.value = jsonData.data.B82 + this.setHtmlText('小时');
		this.stateData.B84.value = jsonData.data.B84 + this.setHtmlText('次数');
		this.stateData.B88.value = jsonData.data.B88 + this.setHtmlText('小时');
		this.stateData.B92.value = jsonData.data.B92 + this.setHtmlText('次');

		this.runningstate.IGV.value = (jsonData.data.B24 == 4 ? '手动' : (jsonData.data.B24 == 0 ? '自动' : '未知'))

		this.runningstate.runningState.value = this.setStopStatus(jsonData.data.B28)
		this.runningstate.loadAndUnloadRunningState.value = this.setLoadStatus(jsonData.data.B30)

		this.runningstate.redeyEnd.value = this.setrunnStatus(jsonData.data.B32)


		this.alarmData.alarmProerty1.value = this.setAlarmPropertyText(jsonData.data.B40, 0.078, 0.0108)
		this.alarmData.alarmProerty2.value = this.setAlarmPropertyText(jsonData.data.B48, 60, 55)
		this.alarmData.alarmProerty3.value = this.setAlarmPropertyText(jsonData.data.B46, 60, 55)
		this.alarmData.alarmProerty4.value = this.setAlarmPropertyText(jsonData.data.B50, 60, 40)
		this.alarmData.alarmProerty5.value = this.setAlarmPropertyText(jsonData.data.B52, 60, 40)
		this.alarmData.alarmProerty6.value = this.setAlarmPropertyText(jsonData.data.B54, 60, 40)
		this.alarmData.alarmProerty7.value = this.setAlarmPropertyText(jsonData.data.B62, 95, 90)
		this.alarmData.alarmProerty8.value = this.setAlarmPropertyText(jsonData.data.B56, 145, 135)
		this.alarmData.alarmProerty9.value = '--' //this.setAlarmPropertyText(jsonData.data.B38,60,55 )
	}
	toFixed(data) {
		return !isNaN(parseFloat(data)) ? parseFloat(data).toFixed(2) : '--'
	}

	setAlarmPropertyText(value, stopValue, alarmValue) {
		if (value >= stopValue) {
			return '停机报警'
		} else if (value >= alarmValue) {
			return '报警'
		}
		return '正常'
	}


	setAlarmText(data) {
		if (data == 0) {
			return '正常'
		} else if (data == 1) {
			return '故障'
		} else return '--'
	}
}
export class RunningState {
	IGV = {
		name: 'IGV自动/手动',
		value: '--'
	};
	runningState = {
		name: '压缩机状态',
		value: '--'
	};
	loadAndUnloadRunningState = {
		name: '加载状态',
		value: '--'
	};
	redeyEnd = {
		name: '准备结束待机',
		value: '--'
	};

}
export class StateData {

	B62 = {
		name: '主电机轴承温度(驱动端)',
		value: '--'
	};
	B64 = {
		name: '主电机轴承温度(反驱动端)',
		value: '--'
	};
	secondaryInletTemp = {
		name: '二级进气温度',
		value: '--'
	};
	B56 = {
		name: '主电机定子温度U相',
		value: '--'
	};
	B58 = {
		name: '主电机定子温度V相',
		value: '--'
	};
	B60 = {
		name: '主电机定子温度W相',
		value: '--'
	};
	B36 = {
		name: '排气压力',
		value: '--'
	};
	B34 = {
		name: '系统压力',
		value: '--'
	};
	B38 = {
		name: '主电机电流',
		value: '--'
	};
	primaryShaftVibration = {
		name: '一级轴振动',
		value: '--'
	};
	B54 = {
		name: '三级轴振动',
		value: '--'
	};
	B52 = {
		name: '二级轴振动',
		value: '--'
	};
	B48 = {
		name: '最后一级进气温度',
		value: '--'
	};
	B46 = {
		name: '润滑油温(油冷却器出口)',
		value: '--'
	};
	B40 = {
		name: '润滑油压(出口压力)',
		value: '--'
	};
	B42 = {
		name: '润滑油压(入口压力)',
		value: '--'
	};
	oilPresureDifference = {
		name: '润滑油压力差△p',
		value: '--'
	};


	B68 = {
		name: 'IGV开度',
		value: '--'
	};
	B70 = {
		name: 'BOV开度',
		value: '--'
	};

	B82 = {
		name: '运行时间 ',
		value: '--'
	};
	B84 = {
		name: '启动次数',
		value: '--'
	};
	B88 = {
		name: '加载时间',
		value: '--'
	};
	B92 = {
		name: '加载次数  ',
		value: '--'
	};
}




export class EnergyData {
	IGV="--"
	BOV="--"
	compressorState="--"
	loadingState="--"
	standbyEndState="--"
	systemPressure="--"
	exhaustPressure="--"
	mainMotorCurrent="--"
	lubricatingOilPressureOutlet="--"
	lubricatingOilPressureInlet="--"
	lubricatingOilTemperature="--"
	inletTemperature="--"
	tertiaryShaftVibration="--"
	secondaryShaftVibration="--"
	IGVOpeningSignal="--"
}
export class AlarmData {
	alarmProerty1 = {
		name: '润滑油(出口)压力下限',
		value: '--'
	};
	alarmProerty2 = {
		name: '末级进气温度上限',
		value: '--'
	};
	alarmProerty3 = {
		name: '润滑油温度上限',
		value: '--'
	};
	alarmProerty4 = {
		name: '一级轴振动上限',
		value: '--'
	};
	alarmProerty5 = {
		name: '二级轴振动上限',
		value: '--'
	};
	alarmProerty6 = {
		name: '三级轴振动上限',
		value: '--'
	};
	alarmProerty7 = {
		name: '主电机轴温度上限',
		value: '--'
	};
	alarmProerty8 = {
		name: '主电机定子轴温度(U)上限',
		value: '--'
	};
	alarmProerty9 = {
		name: '二级进气温度',
		value: '--'
	};
}