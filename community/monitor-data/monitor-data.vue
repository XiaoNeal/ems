<template>
  <view class="container">
    <!-- 顶部导航 -->
    <u-navbar title="监控数据" :autoBack="true" :placeholder="true">
    </u-navbar>

    <!-- 标签切换 -->
    <view class="tab-container">
      <scroll-view scroll-x="true" class="tab-scroll">
        <view class="tab-list">
          <view v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }"
            @click="switchTab(index)">
            <text>{{ item }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 内容区域 -->
    <scroll-view class="content-scroll" scroll-y="true">
      <view class="content">
        <!-- PCS模块 -->
        <view v-if="activeTab === 0" class="module">
          <view class="module-title">PCS</view>

          <view class="data-group">
            <view class="group-title">功率因数</view>
            <view class="data-item">
              <text class="data-value">{{ pcsData.powerFactor }}</text>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相电压</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相(V)</text>
                <text class="item-value">{{ pcsData.phaseVoltage.A }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相(V)</text>
                <text class="item-value">{{ pcsData.phaseVoltage.B }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相(V)</text>
                <text class="item-value">{{ pcsData.phaseVoltage.C }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相电流</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">Ia(A)</text>
                <text class="item-value">{{ pcsData.phaseCurrent.Ia }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ib(A)</text>
                <text class="item-value">{{ pcsData.phaseCurrent.Ib }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ic(A)</text>
                <text class="item-value">{{ pcsData.phaseCurrent.Ic }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相功率</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相(kW)</text>
                <text class="item-value">{{ pcsData.phasePower.A }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相(kW)</text>
                <text class="item-value">{{ pcsData.phasePower.B }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相(kW)</text>
                <text class="item-value">{{ pcsData.phasePower.C }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">交流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">输出有功功率(kW)</text>
                <text class="item-value">{{ pcsData.acSide.activePowerOut }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">N相电流有效值(A)</text>
                <text class="item-value">{{ pcsData.acSide.nPhaseCurrent }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">A相无功功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.aReactivePower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相无功功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.bReactivePower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相无功功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.cReactivePower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">输出无功功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.reactivePowerOut }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">A相视在功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.aApparentPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相视在功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.bApparentPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相视在功率(kVar)</text>
                <text class="item-value">{{ pcsData.acSide.cApparentPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总功率因数</text>
                <text class="item-value">{{ pcsData.acSide.totalPowerFactor || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电网频率(Hz)</text>
                <text class="item-value">{{ pcsData.acSide.gridFrequency || "--" }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">直流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">直流侧电压(V)</text>
                <text class="item-value">{{ pcsData.dcSide.voltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">直流侧电流(A)</text>
                <text class="item-value">{{ pcsData.dcSide.current }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总直流功率(kW)</text>
                <text class="item-value">{{ pcsData.dcSide.totalPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">散热器温度(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.radiatorTemp || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">机上SC温度(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.scTemp || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">IGBT温度1(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.igbtTemp1 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">IGBT温度2(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.igbtTemp2 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">IGBT温度3(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.igbtTemp3 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">IGBT温度4(℃)</text>
                <text class="item-value">{{ pcsData.dcSide.igbtTemp4 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询1</text>
                <text class="item-value">{{ pcsData.dcSide.status1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询2</text>
                <text class="item-value">{{ pcsData.dcSide.status2 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询3</text>
                <text class="item-value">{{ pcsData.dcSide.status3 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询4</text>
                <text class="item-value">{{ pcsData.dcSide.status4 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询5</text>
                <text class="item-value">{{ pcsData.dcSide.status5 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询6</text>
                <text class="item-value">{{ pcsData.dcSide.status6 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询7</text>
                <text class="item-value">{{ pcsData.dcSide.status7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PCS状态查询8</text>
                <text class="item-value">{{ pcsData.dcSide.status8 || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">停机状态</text>
                <text class="item-value">{{ pcsData.dcSide.stopStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">运行状态</text>
                <text class="item-value">{{ pcsData.dcSide.runStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">故障状态</text>
                <text class="item-value">{{ pcsData.dcSide.faultStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总报警状态</text>
                <text class="item-value">{{ pcsData.dcSide.alarmStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">四/牧场/坑地状态</text>
                <text class="item-value">{{ pcsData.dcSide.pitStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">急停输入状态</text>
                <text class="item-value">{{ pcsData.dcSide.emergencyStopStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">V离网状态</text>
                <text class="item-value">{{ pcsData.dcSide.offGridStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">过温管</text>
                <text class="item-value">{{ pcsData.dcSide.overTempStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BMS干点接入点</text>
                <text class="item-value">{{ pcsData.dcSide.bmsStatus || "--" }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 电池组1 -->
        <view v-if="activeTab === 1" class="module">
          <view class="module-title">电池组1 (DCDC)</view>

          <view class="data-group">
            <view class="group-title">DCDC</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">高压侧电压(V)</text>
                <text class="item-value">{{ battery1Data.dcdc.hvVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池侧电流(A)</text>
                <text class="item-value">{{ battery1Data.dcdc.batteryCurrent }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">高压侧电流(A)</text>
                <text class="item-value">{{ battery1Data.dcdc.hvCurrent }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计发电量(kWh)</text>
                <text class="item-value">{{ battery1Data.dcdc.totalPowerGen }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块最高温度(℃)</text>
                <text class="item-value">{{ battery1Data.dcdc.moduleMaxTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">当前运行功率(kW)</text>
                <text class="item-value">{{ battery1Data.dcdc.currentPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池侧电压(V)</text>
                <text class="item-value">{{ battery1Data.dcdc.batteryVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">允许运行率(%)</text>
                <text class="item-value">{{ battery1Data.dcdc.allowRunRate || "--" }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">电池簇</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">电压(V)</text>
                <text class="item-value">{{ battery1Data.cluster.voltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最高电压(V)</text>
                <text class="item-value">{{ battery1Data.cluster.maxCellVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电流(A)</text>
                <text class="item-value">{{ battery1Data.cluster.current }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最高温度(℃)</text>
                <text class="item-value">{{ battery1Data.cluster.maxCellTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC(%)</text>
                <text class="item-value">{{ battery1Data.cluster.soc }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高箱温度(℃)</text>
                <text class="item-value">{{ battery1Data.cluster.maxBoxTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOE(%)</text>
                <text class="item-value">{{ battery1Data.cluster.soe || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最低温度(℃)</text>
                <text class="item-value">{{ battery1Data.cluster.minCellTemp || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">运行状态</text>
                <text class="item-value">{{ battery1Data.cluster.runStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最低电压(V)</text>
                <text class="item-value">{{ battery1Data.cluster.minCellVoltage || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充放电状态</text>
                <text class="item-value">{{ battery1Data.cluster.chargeDischargeStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">预充电机状态</text>
                <text class="item-value">{{ battery1Data.cluster.preChargeStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">告警等级</text>
                <text class="item-value">{{ battery1Data.cluster.alarmLevel || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">主正主继电器状态</text>
                <text class="item-value">{{ battery1Data.cluster.mainRelayStatus || "--" }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 电池组2 -->
        <view v-if="activeTab === 2" class="module">
          <view class="module-title">电池组2 (DCDC)</view>

          <view class="data-group">
            <view class="group-title">DCDC</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">高压侧电压(V)</text>
                <text class="item-value">{{ battery2Data.dcdc.hvVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池侧电流(A)</text>
                <text class="item-value">{{ battery2Data.dcdc.batteryCurrent }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">高压侧电流(A)</text>
                <text class="item-value">{{ battery2Data.dcdc.hvCurrent }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计发电量(kWh)</text>
                <text class="item-value">{{ battery2Data.dcdc.totalPowerGen }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块最高温度(℃)</text>
                <text class="item-value">{{ battery2Data.dcdc.moduleMaxTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">当前运行功率(kW)</text>
                <text class="item-value">{{ battery2Data.dcdc.currentPower }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池侧电压(V)</text>
                <text class="item-value">{{ battery2Data.dcdc.batteryVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">允许运行率(%)</text>
                <text class="item-value">{{ battery2Data.dcdc.allowRunRate || "--" }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">电池簇</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">电压(V)</text>
                <text class="item-value">{{ battery2Data.cluster.voltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最高电压(V)</text>
                <text class="item-value">{{ battery2Data.cluster.maxCellVoltage }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电流(A)</text>
                <text class="item-value">{{ battery2Data.cluster.current }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最高温度(℃)</text>
                <text class="item-value">{{ battery2Data.cluster.maxCellTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC(%)</text>
                <text class="item-value">{{ battery2Data.cluster.soc }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高箱温度(℃)</text>
                <text class="item-value">{{ battery2Data.cluster.maxBoxTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOE(%)</text>
                <text class="item-value">{{ battery2Data.cluster.soe || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最低温度(℃)</text>
                <text class="item-value">{{ battery2Data.cluster.minCellTemp || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">运行状态</text>
                <text class="item-value">{{ battery2Data.cluster.runStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体最低电压(V)</text>
                <text class="item-value">{{ battery2Data.cluster.minCellVoltage || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充放电状态</text>
                <text class="item-value">{{ battery2Data.cluster.chargeDischargeStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">预充电机状态</text>
                <text class="item-value">{{ battery2Data.cluster.preChargeStatus || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">告警等级</text>
                <text class="item-value">{{ battery2Data.cluster.alarmLevel || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">主正主继电器状态</text>
                <text class="item-value">{{ battery2Data.cluster.mainRelayStatus || "--" }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 光伏1 -->
        <view v-if="activeTab === 3" class="module">
          <view class="module-title">光伏1</view>

          <!-- 运行状态区域 - 修复布局 -->
          <view class="data-group">
            <view class="group-title">运行状态</view>
            
            <!-- 第一行状态：停机/运行/故障/过载 -->
            <view class="status-row status-row-4">
              <view class="status-btn" :class="{ active: pv1Data.status.stopActive }">
                <text class="status-btn-text">停机</text>
              </view>
              <view class="status-btn" :class="{ active: pv1Data.status.runActive }">
                <text class="status-btn-text">运行</text>
              </view>
              <view class="status-btn" :class="{ active: pv1Data.status.faultActive }">
                <text class="status-btn-text">故障</text>
              </view>
              <view class="status-btn" :class="{ active: pv1Data.status.overActive }">
                <text class="status-btn-text">过载</text>
              </view>
            </view>

            <!-- 第二行状态：BAT主接/BAT软起 -->
            <view class="status-row status-row-2">
              <view class="status-btn" :class="{ active: pv1Data.status.batMainActive }">
                <text class="status-btn-text">BAT主接</text>
              </view>
              <view class="status-btn" :class="{ active: pv1Data.status.batSoftActive }">
                <text class="status-btn-text">BAT软起</text>
              </view>
            </view>

            <!-- 第三行状态：BUS主接/BUS软起 -->
            <view class="status-row status-row-2">
              <view class="status-btn" :class="{ active: pv1Data.status.busMainActive }">
                <text class="status-btn-text">BUS主接</text>
              </view>
              <view class="status-btn" :class="{ active: pv1Data.status.busSoftActive }">
                <text class="status-btn-text">BUS软起</text>
              </view>
            </view>
          </view>

          <!-- 参数区域 - 修复两列布局对齐 -->
          <view class="data-group">
            <view class="pv-params-grid">
              <view class="pv-param-item">
                <text class="pv-param-label">高压侧电压(V)</text>
                <text class="pv-param-value">{{ pv1Data.params.hvVoltage }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">电池侧电流(A)</text>
                <text class="pv-param-value">{{ pv1Data.params.batteryCurrent }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">高压侧电流(A)</text>
                <text class="pv-param-value">{{ pv1Data.params.hvCurrent }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">累计发电量(kWh)</text>
                <text class="pv-param-value">{{ pv1Data.params.totalPowerGen }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">模块最高温度(℃)</text>
                <text class="pv-param-value">{{ pv1Data.params.moduleMaxTemp }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">当前运行功率(kW)</text>
                <text class="pv-param-value">{{ pv1Data.params.currentPower }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">电池侧电压(V)</text>
                <text class="pv-param-value">{{ pv1Data.params.batteryVoltage || "--" }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">允许运行功率(kW)</text>
                <text class="pv-param-value">{{ pv1Data.params.allowRunRate || "--" }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 光伏2 -->
        <view v-if="activeTab === 4" class="module">
          <view class="module-title">光伏2</view>

          <!-- 运行状态区域 - 修复布局 -->
          <view class="data-group">
            <view class="group-title">运行状态</view>
            
            <!-- 第一行状态：停机/运行/故障/过载 -->
            <view class="status-row status-row-4">
              <view class="status-btn" :class="{ active: pv2Data.status.stopActive }">
                <text class="status-btn-text">停机</text>
              </view>
              <view class="status-btn" :class="{ active: pv2Data.status.runActive }">
                <text class="status-btn-text">运行</text>
              </view>
              <view class="status-btn" :class="{ active: pv2Data.status.faultActive }">
                <text class="status-btn-text">故障</text>
              </view>
              <view class="status-btn" :class="{ active: pv2Data.status.overActive }">
                <text class="status-btn-text">过载</text>
              </view>
            </view>

            <!-- 第二行状态：BAT主接/BAT软起 -->
            <view class="status-row status-row-2">
              <view class="status-btn" :class="{ active: pv2Data.status.batMainActive }">
                <text class="status-btn-text">BAT主接</text>
              </view>
              <view class="status-btn" :class="{ active: pv2Data.status.batSoftActive }">
                <text class="status-btn-text">BAT软起</text>
              </view>
            </view>

            <!-- 第三行状态：BUS主接/BUS软起 -->
            <view class="status-row status-row-2">
              <view class="status-btn" :class="{ active: pv2Data.status.busMainActive }">
                <text class="status-btn-text">BUS主接</text>
              </view>
              <view class="status-btn" :class="{ active: pv2Data.status.busSoftActive }">
                <text class="status-btn-text">BUS软起</text>
              </view>
            </view>
          </view>

          <!-- 参数区域 - 修复两列布局对齐 -->
          <view class="data-group">
            <view class="pv-params-grid">
              <view class="pv-param-item">
                <text class="pv-param-label">高压侧电压(V)</text>
                <text class="pv-param-value">{{ pv2Data.params.hvVoltage }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">电池侧电流(A)</text>
                <text class="pv-param-value">{{ pv2Data.params.batteryCurrent }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">高压侧电流(A)</text>
                <text class="pv-param-value">{{ pv2Data.params.hvCurrent }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">累计发电量(kWh)</text>
                <text class="pv-param-value">{{ pv2Data.params.totalPowerGen }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">模块最高温度(℃)</text>
                <text class="pv-param-value">{{ pv2Data.params.moduleMaxTemp }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">当前运行功率(kW)</text>
                <text class="pv-param-value">{{ pv2Data.params.currentPower }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">电池侧电压(V)</text>
                <text class="pv-param-value">{{ pv2Data.params.batteryVoltage || "--" }}</text>
              </view>
              <view class="pv-param-item">
                <text class="pv-param-label">允许运行功率(kW)</text>
                <text class="pv-param-value">{{ pv2Data.params.allowRunRate || "--" }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 环控/消防 -->
        <view v-if="activeTab === 5" class="module">
          <view class="module-title">环控/消防</view>

          <view class="data-group">
            <view class="group-title">液冷</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">室外温度(℃)</text>
                <text class="item-value">{{ envData.liquidCool.outdoorTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">快速泵运行档位</text>
                <text class="item-value">{{ envData.liquidCool.fastPumpGear }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">供液温度(℃)</text>
                <text class="item-value">{{ envData.liquidCool.supplyTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">快速泵工作状态</text>
                <text class="item-value">{{ envData.liquidCool.fastPumpStatus }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">回液温度(℃)</text>
                <text class="item-value">{{ envData.liquidCool.returnTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">压风机一状态</text>
                <text class="item-value">{{ envData.liquidCool.fan1Status }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">供液压力(kPa)</text>
                <text class="item-value">{{ envData.liquidCool.supplyPressure || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统一风机状态</text>
                <text class="item-value">{{ envData.liquidCool.systemFan1Status || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">回液压力(kPa)</text>
                <text class="item-value">{{ envData.liquidCool.returnPressure || "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电加热状态</text>
                <text class="item-value">{{ envData.liquidCool.heaterStatus || "--" }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">环境监测</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">电池仓温度(℃)</text>
                <text class="item-value">{{ envData.env.batteryTemp }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池仓湿度(RH%)</text>
                <text class="item-value">{{ envData.env.batteryHumidity }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">消防</view>
            <view class="fire-grid">
              <view class="fire-item">
                <text class="fire-title">电池箱1</text>
                <view class="fire-detail">
                  <text class="detail-label">预警级别：</text>
                  <text class="detail-value">{{ envData.fire.box1.warningLevel }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">故障类型：</text>
                  <text class="detail-value">{{ envData.fire.box1.faultType }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">无/子门状态：</text>
                  <text class="detail-value">{{ envData.fire.box1.doorStatus }}</text>
                </view>
              </view>

              <view class="fire-item">
                <text class="fire-title">电池箱2</text>
                <view class="fire-detail">
                  <text class="detail-label">预警级别：</text>
                  <text class="detail-value">{{ envData.fire.box2.warningLevel }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">故障类型：</text>
                  <text class="detail-value">{{ envData.fire.box2.faultType }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">无/子门状态：</text>
                  <text class="detail-value">{{ envData.fire.box2.doorStatus }}</text>
                </view>
              </view>

              <view class="fire-item">
                <text class="fire-title">电池箱3</text>
                <view class="fire-detail">
                  <text class="detail-label">预警级别：</text>
                  <text class="detail-value">{{ envData.fire.box3.warningLevel }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">故障类型：</text>
                  <text class="detail-value">{{ envData.fire.box3.faultType }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">无/子门状态：</text>
                  <text class="detail-value">{{ envData.fire.box3.doorStatus }}</text>
                </view>
              </view>

              <view class="fire-item">
                <text class="fire-title">电池箱4</text>
                <view class="fire-detail">
                  <text class="detail-label">预警级别：</text>
                  <text class="detail-value">{{ envData.fire.box4.warningLevel }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">故障类型：</text>
                  <text class="detail-value">{{ envData.fire.box4.faultType }}</text>
                </view>
                <view class="fire-detail">
                  <text class="detail-label">无/子门状态：</text>
                  <text class="detail-value">{{ envData.fire.box4.doorStatus }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      tabs: ['PCS', '电池组1', '电池组2', '光伏1', '光伏2', '环控/消防'],
      // PCS数据
      pcsData: {
        powerFactor: "08:00",
        phaseVoltage: {
          A: "08:00",
          B: "10:00",
          C: "20:00"
        },
        phaseCurrent: {
          Ia: "08:00",
          Ib: "10:00",
          Ic: "20:00"
        },
        phasePower: {
          A: "08:00",
          B: "10:00",
          C: "20:00"
        },
        acSide: {
          activePowerOut: "08:00",
          nPhaseCurrent: "10:00",
          aReactivePower: "20:00",
          bReactivePower: "20:00",
          cReactivePower: "20:00",
          reactivePowerOut: "20:00",
          aApparentPower: "08:00",
          bApparentPower: "10:00",
          cApparentPower: "20:00",
          totalPowerFactor: "",
          gridFrequency: ""
        },
        dcSide: {
          voltage: "08:00",
          current: "10:00",
          totalPower: "20:00",
          radiatorTemp: "",
          scTemp: "",
          igbtTemp1: "",
          igbtTemp2: "",
          igbtTemp3: "",
          igbtTemp4: "",
          status1: "08:00",
          status2: "",
          status3: "",
          status4: "",
          status5: "",
          status6: "",
          status7: "08:00",
          status8: "",
          stopStatus: "",
          runStatus: "",
          faultStatus: "",
          alarmStatus: "",
          pitStatus: "",
          emergencyStopStatus: "",
          offGridStatus: "",
          overTempStatus: "",
          bmsStatus: ""
        }
      },
      // 电池组1数据
      battery1Data: {
        dcdc: {
          hvVoltage: "08:00",
          batteryCurrent: "08:00",
          hvCurrent: "10:00",
          totalPowerGen: "10:00",
          moduleMaxTemp: "20:00",
          currentPower: "20:00",
          batteryVoltage: "20:00",
          allowRunRate: ""
        },
        cluster: {
          voltage: "08:00",
          maxCellVoltage: "08:00",
          current: "10:00",
          maxCellTemp: "10:00",
          soc: "20:00",
          maxBoxTemp: "20:00",
          soe: "",
          minCellTemp: "",
          runStatus: "",
          minCellVoltage: "",
          chargeDischargeStatus: "",
          preChargeStatus: "",
          alarmLevel: "",
          mainRelayStatus: ""
        }
      },
      // 电池组2数据
      battery2Data: {
        dcdc: {
          hvVoltage: "08:00",
          batteryCurrent: "08:00",
          hvCurrent: "10:00",
          totalPowerGen: "10:00",
          moduleMaxTemp: "20:00",
          currentPower: "20:00",
          batteryVoltage: "20:00",
          allowRunRate: ""
        },
        cluster: {
          voltage: "08:00",
          maxCellVoltage: "08:00",
          current: "10:00",
          maxCellTemp: "10:00",
          soc: "20:00",
          maxBoxTemp: "20:00",
          soe: "",
          minCellTemp: "",
          runStatus: "",
          minCellVoltage: "",
          chargeDischargeStatus: "",
          preChargeStatus: "",
          alarmLevel: "",
          mainRelayStatus: ""
        }
      },
      // 光伏1数据（更新状态字段为布尔值，控制按钮激活）
      pv1Data: {
        status: {
          stopActive: true,    // 停机激活
          runActive: false,    // 运行未激活
          faultActive: false,  // 故障未激活
          overActive: false,   // 过载未激活
          batMainActive: true, // BAT主接激活
          batSoftActive: false,// BAT软起未激活
          busMainActive: true, // BUS主接激活
          busSoftActive: false // BUS软起未激活
        },
        params: {
          hvVoltage: "08:00",
          batteryCurrent: "08:00",
          hvCurrent: "10:00",
          totalPowerGen: "10:00",
          moduleMaxTemp: "20:00",
          currentPower: "20:00",
          batteryVoltage: "",
          allowRunRate: ""
        }
      },
      // 光伏2数据（更新状态字段为布尔值，控制按钮激活）
      pv2Data: {
        status: {
          stopActive: false,   // 停机未激活
          runActive: true,     // 运行激活
          faultActive: false,  // 故障未激活
          overActive: false,   // 过载未激活
          batMainActive: false,// BAT主接未激活
          batSoftActive: true, // BAT软起激活
          busMainActive: false,// BUS主接未激活
          busSoftActive: true  // BUS软起激活
        },
        params: {
          hvVoltage: "06:00",
          batteryCurrent: "08:00",
          hvCurrent: "10:00",
          totalPowerGen: "10:00",
          moduleMaxTemp: "20:00",
          currentPower: "20:00",
          batteryVoltage: "",
          allowRunRate: ""
        }
      },
      // 环控消防数据
      envData: {
        liquidCool: {
          outdoorTemp: "08:00",
          fastPumpGear: "08:00",
          supplyTemp: "10:00",
          fastPumpStatus: "10:00",
          returnTemp: "20:00",
          fan1Status: "20:00",
          supplyPressure: "",
          systemFan1Status: "",
          returnPressure: "",
          heaterStatus: ""
        },
        env: {
          batteryTemp: "25.00",
          batteryHumidity: "25.00"
        },
        fire: {
          box1: {
            warningLevel: "系统正常",
            faultType: "无故障",
            doorStatus: "子网关"
          },
          box2: {
            warningLevel: "系统正常",
            faultType: "无故障",
            doorStatus: "子网关"
          },
          box3: {
            warningLevel: "系统正常",
            faultType: "无故障",
            doorStatus: "子网关"
          },
          box4: {
            warningLevel: "系统正常",
            faultType: "无故障",
            doorStatus: "子网关"
          }
        }
      }
    };
  },
  methods: {
    // 返回上一页
    goBack() {
      uni.navigateBack();
    },
    // 切换标签
    switchTab(index) {
      this.activeTab = index;
      // 滚动到顶部
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
    },
    // 刷新数据
    refreshData() {
      uni.showLoading({
        title: '刷新中...'
      });

      setTimeout(() => {
        // 模拟数据刷新
        this.pcsData.powerFactor = (Math.random() * 24).toFixed(2) + ":00";
        this.pcsData.phaseVoltage.A = (Math.random() * 24).toFixed(2) + ":00";
        this.pcsData.phaseVoltage.B = (Math.random() * 24).toFixed(2) + ":00";
        this.pcsData.phaseVoltage.C = (Math.random() * 24).toFixed(2) + ":00";

        this.battery1Data.dcdc.hvVoltage = (Math.random() * 24).toFixed(2) + ":00";
        this.battery1Data.dcdc.batteryCurrent = (Math.random() * 24).toFixed(2) + ":00";

        this.pv1Data.params.hvVoltage = (Math.random() * 24).toFixed(2) + ":00";

        this.envData.env.batteryTemp = (Math.random() * 10 + 20).toFixed(2);
        this.envData.env.batteryHumidity = (Math.random() * 10 + 20).toFixed(2);

        uni.hideLoading();
        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        });
      }, 800);
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.container {
  width: 100%;
  height: 100vh;
  background-color: #f2f2f2;
  font-size: 28rpx;
}

/* 导航栏 */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.nav-left,
.nav-right {
  width: 120rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: bold;
}

/* 标签栏 */
.tab-container {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  padding: 0 20rpx;
}

.tab-item {
  padding: 20rpx 30rpx;
  border-bottom: 3px solid transparent;
}

.tab-item.active {
  border-bottom: 3px solid #007aff;
}

.tab-item.active text {
  color: #007aff;
  font-weight: bold;
}

/* 内容区域 */
.content-scroll {
  height: calc(100vh - 140rpx);
}

.content {
  padding: 20rpx;
}

/* 模块样式 */
.module {
  background-color: #fff;
  padding: 20rpx;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.module-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1px solid #e5e5e5;
}

/* 数据组 */
.data-group {
  margin-bottom: 30rpx;
}

.group-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
  color: #666;
}

/* 数据网格 */
.data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.grid-item {
  width: calc(33.333% - 10rpx);
  background-color: #f9f9f9;
  padding: 15rpx;
  border-radius: 4rpx;
}

.item-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 5rpx;
}

.item-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

/* 光伏状态按钮样式 - 核心修复 */
.status-row {
  display: flex;
  gap: 10rpx; /* 统一间距 */
  margin-bottom: 15rpx;
}
/* 4个按钮的行 */
.status-row-4 {
  justify-content: space-between;
}
/* 2个按钮的行 */
.status-row-2 {
  justify-content: flex-start;
}

.status-btn {
  height: 80rpx;
  border-radius: 8rpx; /* 统一圆角，贴合设计图 */
  border: 2rpx solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  transition: all 0.2s ease;
  /* 固定按钮最小宽度，避免拉伸变形 */
  min-width: 140rpx;
  /* 按数量分配宽度 */
  flex: 1;
  max-width: calc(25% - 7.5rpx); /* 4个按钮时的最大宽度 */
}
/* 2个按钮时的宽度调整 */
.status-row-2 .status-btn {
  max-width: calc(50% - 5rpx);
}

.status-btn.active {
  background-color: #007aff;
  border-color: #007aff;
}

.status-btn-text {
  font-size: 26rpx;
  color: #333;
}

.status-btn.active .status-btn-text {
  color: #fff;
  font-weight: bold;
}

/* 光伏参数两列布局 - 核心修复 */
.pv-params-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx; /* 统一间距 */
}

.pv-param-item {
  width: calc(50% - 5rpx); /* 精准计算，避免间隙溢出 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx;
  background-color: #f9f9f9;
  border-radius: 4rpx;
  box-sizing: border-box; /* 避免padding撑大宽度 */
}

.pv-param-label {
  font-size: 24rpx;
  color: #666;
  flex: 1; /* 标签占比 */
}

.pv-param-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  text-align: right; /* 数值右对齐，更整齐 */
  min-width: 80rpx; /* 数值最小宽度，避免抖动 */
}

/* 消防网格 */
.fire-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.fire-item {
  width: calc(50% - 7.5rpx);
  background-color: #f9f9f9;
  padding: 15rpx;
  border-radius: 4rpx;
}

.fire-title {
  font-size: 26rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10rpx;
  padding-bottom: 5rpx;
  border-bottom: 1px solid #e5e5e5;
}

.fire-detail {
  display: flex;
  margin-bottom: 8rpx;
  font-size: 24rpx;
}

.detail-label {
  color: #666;
  width: 120rpx;
}

.detail-value {
  color: #333;
  flex: 1;
}

/* 响应式适配 - 优化 */
@media (max-width: 750rpx) {
  .grid-item {
    width: calc(50% - 7.5rpx);
  }

  .fire-item {
    width: 100%;
  }

  /* 小屏时状态按钮自适应 */
  .status-btn {
    min-width: 120rpx;
  }
}

@media (max-width: 480rpx) {
  .grid-item {
    width: 100%;
  }

  .status-row {
    flex-wrap: wrap;
  }

  .status-btn {
    width: calc(50% - 5rpx);
    max-width: none;
    margin-bottom: 10rpx;
  }
  
  .pv-param-item {
    width: 100%;
  }
}
</style>