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


          <!-- 运行状态板块 -->
          <view class="data-group">
            <view class="group-title">运行状态</view>
            <view class="status-grid">
              <view v-for="(status, index) in parsedB64Status.filter(s => ['工作模式', 'U1状态', 'U2状态'].includes(s.name))"
                :key="index" class="status-item"
                :style="{ backgroundColor: status.bgColor, borderColor: status.borderColor }">
                <text class="status-name" :style="{ color: status.color }">{{ status.name }}</text>
                <text class="status-value" :class="{ error: status.value === '发生' }">{{ status.value }}</text>
              </view>
              <text v-if="parsedB64Status.length === 0" class="status-empty">暂无数据</text>
            </view>
          </view>


          <view class="data-group">
            <view class="group-title">相电压</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B0 ? device171B.energyData.B0.value :
                    "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B4 ? device171B.energyData.B4.value :
                    "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B8 ? device171B.energyData.B8.value :
                    "--"
                }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相电流</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">Ia(A)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B2 ? device171B.energyData.B2.value :
                    "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ib(A)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B6 ? device171B.energyData.B6.value :
                    "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ic(A)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B10 ?
                    device171B.energyData.B10.value : "--"
                }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">线电压</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">AB(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B12 ?
                    device171B.energyData.B12.value : "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BC(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B16 ?
                    device171B.energyData.B16.value : "--"
                }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">CA(V)</text>
                <text class="item-value">{{
                  device171B && device171B.energyData && device171B.energyData.B20 ?
                    device171B.energyData.B20.value : "--"
                }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相功率</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相有功(kW)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B24 ?
                  device171B.energyData.B24.value : "--" }}</text>
              </view>

              <view class="grid-item">
                <text class="item-label">B相有功(kW)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B28 ?
                  device171B.energyData.B28.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相有功(kW)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B32 ?
                  device171B.energyData.B32.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">A相无功(kVar)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B26 ?
                  device171B.energyData.B26.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相无功(kVar)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B30 ?
                  device171B.energyData.B30.value : "--" }}</text>
              </view>

              <view class="grid-item">
                <text class="item-label">C相无功(kVar)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B34 ?
                  device171B.energyData.B34.value : "--" }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">交流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">总有功功率(kW)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B44 ?
                  this.formatValue(device171B.energyData.B44.value, 2) : "--" }}</text>
              </view>

              <view class="grid-item">
                <text class="item-label">总无功功率(kVar)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B48 ?
                  this.formatValue(device171B.energyData.B48.value, 2) : "--" }}</text>
              </view>

              <view class="grid-item">
                <text class="item-label">总视在功率(kVA)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B52 ?
                  this.formatValue(device171B.energyData.B52.value, 2) : "--" }}</text>
              </view>

              <view class="grid-item">
                <text class="item-label">交流频率(Hz)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B36 ?
                  device171B.energyData.B36.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块面板温度(℃)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B40 ?
                  this.formatValue(device171B.energyData.B40.value, 1) : "--" }}</text>
              </view>



            </view>
          </view>

          <view class="data-group">
            <view class="group-title">直流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">直流侧电压(V)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B56 ?
                  this.formatValue(device171B.energyData.B56.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">直流侧电流(A)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B58 ?
                  device171B.energyData.B58.value : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">额定输出功率(kW)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B60 ?
                  device171B.energyData.B60.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">模块状态</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B64 ?
                  device171B.energyData.B64.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">欠压复位状态</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B68 ? device171B.energyData.B68.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">模块组号</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B72 ?
                  device171B.energyData.B72.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块地址</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B74 ?
                  device171B.energyData.B74.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">海拔值(m)</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B76 ?
                  device171B.energyData.B76.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">软件版本</text>
                <text class="item-value">{{ device171B && device171B.energyData && device171B.energyData.B82 ?
                  device171B.energyData.B82.value : "--" }}</text>
              </view> -->
            </view>
          </view>


          <!-- 故障状态板块 -->
          <view class="data-group">
            <view class="group-title">故障状态</view>
            <view class="status-grid">
              <view v-for="(status, index) in parsedB64Status.filter(s => !['工作模式', 'U1状态', 'U2状态'].includes(s.name))"
                :key="index" class="fault-item">
                <text class="fault-name" :class="{ active: status.value === '发生' }">{{ status.name }}</text>
              </view>
              <text v-if="parsedB64Status.length === 0" class="status-empty">暂无数据</text>
            </view>
          </view>

        </view>

        <!-- 电池组 -->
        <view v-if="activeTab === 1" class="module">
          <view class="module-title">储能DC</view>

          <view class="data-group">
            <view class="group-title">DCDC状态</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">DCDC故障区标志</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B0 ?
                  device171D.energyData.B0.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统工作状态</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B2 ?
                  device171D.energyData.B2.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池工作状态</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B4 ?
                  device171D.energyData.B4.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池充电状态</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B6 ?
                  device171D.energyData.B6.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池电压(V)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B8 ?
                  this.formatValue(device171D.energyData.B8.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池电流(A)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B10 ?
                  device171D.energyData.B10.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充电功率(kW)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B12 ?
                  this.formatValue(device171D.energyData.B12.value, 2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">放电功率(kW)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B14 ?
                  this.formatValue(device171D.energyData.B14.value, 2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS母线电压(V)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B16 ?
                  this.formatValue(device171D.energyData.B16.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS+母线电压(V)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B18 ?
                  this.formatValue(device171D.energyData.B18.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS-母线电压(V)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B20 ?
                  this.formatValue(device171D.energyData.B20.value, 1) : "--" }}</text>
              </view>
            </view>
          </view>
          <view class="data-group">
            <view class="group-title">DCDC电气参数</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">环境温度(℃)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B22 ?
                  this.formatValue(device171D.energyData.B22.value, 1) : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">放电量(kWh)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B24 ?
                  device171D.energyData.B24.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充电量(kWh)</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B28 ?
                  device171D.energyData.B28.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">协议版本</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B32 ?
                  device171D.energyData.B32.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC固件版本</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B34 ?
                  device171D.energyData.B34.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC软件版本</text>
                <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B36 ?
                  device171D.energyData.B36.value : "--" }}</text>
              </view> -->
            </view>
          </view>

          <!-- DCDC报警状态 -->
          <view class="data-group">
            <view class="group-title">DCDC报警状态</view>
            <view class="status-grid">
              <view v-for="(status, index) in dcdcAlarmStatus" :key="index" class="fault-item">
                <text class="fault-name" :class="{ active: status.isAlarm }">{{ status.name }}</text>
              </view>
              <text v-if="dcdcAlarmStatus.length === 0" class="status-empty">暂无数据</text>
            </view>
          </view>

        </view>

        <!-- BMS -->
        <view v-if="activeTab === 2" class="module">
          <view class="module-title">BMS</view>
          <!-- 电气参数 -->
          <view class="data-group">
            <view class="group-title">电气参数</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">电池簇电压(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B12 ?
                  this.formatValue(device171C.energyData.B12.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电流值(A)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B14 ?
                  device171C.energyData.B14.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOC(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B16 ?
                  device171C.energyData.B16.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOH(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B18 ?
                  device171C.energyData.B18.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOE(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B20 ?
                  device171C.energyData.B20.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇绝缘电阻R+(MΩ)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B22 ?
                  (device171C.energyData.B22.value / 1000).toFixed(2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇绝缘电阻R-(MΩ)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B24 ?
                  (device171C.energyData.B24.value / 1000).toFixed(2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B26 ?
                  device171C.energyData.B26.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI1状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b0 ?
                  device171C.energyData.B28b0.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI2状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b1 ?
                  device171C.energyData.B28b1.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI3状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b2 ?
                  device171C.energyData.B28b2.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI4状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b3 ?
                  device171C.energyData.B28b3.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI5状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b4 ?
                  device171C.energyData.B28b4.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI6状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b5 ?
                  device171C.energyData.B28b5.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI7状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b6 ?
                  device171C.energyData.B28b6.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI8状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B28b7 ?
                  device171C.energyData.B28b7.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SLP信号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B29b0 ?
                  device171C.energyData.B29b0.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO1输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b0 ?
                  device171C.energyData.B30b0.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO2输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b1 ?
                  device171C.energyData.B30b1.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO3输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b2 ?
                  device171C.energyData.B30b2.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO4输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b3 ?
                  device171C.energyData.B30b3.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO5输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b4 ?
                  device171C.energyData.B30b4.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO6输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b5 ?
                  device171C.energyData.B30b5.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO7输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b6 ?
                  device171C.energyData.B30b6.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO8输出状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B30b7 ?
                  device171C.energyData.B30b7.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">实际温度采集点数</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B32 ?
                  device171C.energyData.B32.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B34 ?
                  this.formatValue(device171C.energyData.B34.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B36 ?
                  device171C.energyData.B36.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B38 ?
                  device171C.energyData.B38.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B40 ?
                  this.formatValue(device171C.energyData.B40.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B42 ?
                  device171C.energyData.B42.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B44 ?
                  device171C.energyData.B44.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池平均温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B46 ?
                  this.formatValue(device171C.energyData.B46.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电池总节数</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B48 ?
                  device171C.energyData.B48.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均电压(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B50 ?
                  this.formatValue(device171C.energyData.B50.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B52 ?
                  this.formatValue(device171C.energyData.B52.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B54 ?
                  device171C.energyData.B54.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B56 ?
                  device171C.energyData.B56.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B58 ?
                  this.formatValue(device171C.energyData.B58.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B60 ?
                  device171C.energyData.B60.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B62 ?
                  device171C.energyData.B62.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均SOC(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B64 ?
                  device171C.energyData.B64.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B66 ?
                  device171C.energyData.B66.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B68 ?
                  device171C.energyData.B68.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B70 ?
                  device171C.energyData.B70.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B72 ?
                  device171C.energyData.B72.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B74 ?
                  device171C.energyData.B74.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B76 ?
                  device171C.energyData.B76.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均SOH(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B78 ?
                  device171C.energyData.B78.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B80 ?
                  device171C.energyData.B80.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B82 ?
                  device171C.energyData.B82.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B84 ?
                  device171C.energyData.B84.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH(%)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B86 ?
                  device171C.energyData.B86.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B88 ?
                  device171C.energyData.B88.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B90 ?
                  device171C.energyData.B90.value : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">单体平均内阻(mΩ)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B92 ?
                  device171C.energyData.B92.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体内阻(mΩ)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B94 ?
                  device171C.energyData.B94.value : "--" }}</text>
              </view> -->
              <!-- <view class="grid-item">
                <text class="item-label">最高单体内阻所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B96 ?
                  device171C.energyData.B96.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体内阻模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B98 ?
                  device171C.energyData.B98.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻(mΩ)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B100 ?
                  device171C.energyData.B100.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B102 ?
                  device171C.energyData.B102.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B104 ?
                  device171C.energyData.B104.value : "--" }}</text>
              </view> -->
              <view class="grid-item">
                <text class="item-label">电池箱最高温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B106 ?
                  this.formatValue(device171C.energyData.B106.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最高温度所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B108 ?
                  device171C.energyData.B108.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最高温度模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B110 ?
                  device171C.energyData.B110.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B112 ?
                  this.formatValue(device171C.energyData.B112.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度所在模块号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B114 ?
                  device171C.energyData.B114.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度模块内序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B116 ?
                  device171C.energyData.B116.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱平均温度(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B118 ?
                  this.formatValue(device171C.energyData.B118.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最高电压值(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B120 ?
                  this.formatValue(device171C.energyData.B120.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最高电压序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B122 ?
                  device171C.energyData.B122.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最低电压值(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B124 ?
                  this.formatValue(device171C.energyData.B124.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最低电压序号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B126 ?
                  device171C.energyData.B126.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计充电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B128 ?
                  device171C.energyData.B128.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计放电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B132 ?
                  device171C.energyData.B132.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单次充电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B136 ?
                  device171C.energyData.B136.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单次放电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B138 ?
                  device171C.energyData.B138.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计充电次数</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B140 ?
                  device171C.energyData.B140.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计放电次数</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B142 ?
                  device171C.energyData.B142.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组负载电压(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B144 ?
                  this.formatValue(device171C.energyData.B144.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组总电压-备用1(V)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B146 ?
                  this.formatValue(device171C.energyData.B146.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电流值-备用1(A)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B148 ?
                  device171C.energyData.B148.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电流值-备用2(A)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B150 ?
                  device171C.energyData.B150.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统运行心跳</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B152 ?
                  device171C.energyData.B152.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">绝缘采集状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B154 ?
                  device171C.energyData.B154.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">禁充标志</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B156b0 ?
                  device171C.energyData.B156b0.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">禁放标志</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B156b1 ?
                  device171C.energyData.B156b1.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">告警状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B156b2 ?
                  device171C.energyData.B156b2.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充满状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B156b3 ?
                  device171C.energyData.B156b3.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">放空状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B156b4 ?
                  device171C.energyData.B156b4.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统告警状态</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B158 ?
                  device171C.energyData.B158.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统告警状态-禁充/禁放解除条件</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B160 ?
                  device171C.energyData.B160.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统告警状态-禁充/禁放解除时间</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B162 ?
                  device171C.energyData.B162.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大允许充电电流(A)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B164 ?
                  device171C.energyData.B164.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大允许放电电流(A)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B166 ?
                  device171C.energyData.B166.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大允许充电功率(kW)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B168 ?
                  this.formatValue(device171C.energyData.B168.value, 2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大允许放电功率(kW)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B170 ?
                  this.formatValue(device171C.energyData.B170.value, 2) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大单体电压节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B172 ?
                  device171C.energyData.B172.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最小单体电压节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B174 ?
                  device171C.energyData.B174.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大单体温度节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B176 ?
                  device171C.energyData.B176.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最小单体温度节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B178 ?
                  device171C.energyData.B178.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大SOC节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B180 ?
                  device171C.energyData.B180.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最小SOC节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B182 ?
                  device171C.energyData.B182.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最大SOH节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B184 ?
                  device171C.energyData.B184.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最小SOH节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B186 ?
                  device171C.energyData.B186.value : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">最大电池内阻节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B188 ?
                  device171C.energyData.B188.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最小电池内阻节号</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B190 ?
                  device171C.energyData.B190.value : "--" }}</text>
              </view> -->
              <view class="grid-item">
                <text class="item-label">单日累计充电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B192 ?
                  device171C.energyData.B192.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单日累计放电电量(kWh)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B196 ?
                  device171C.energyData.B196.value : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">主控采集NTC温度1(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B200 ?
                  device171C.energyData.B200.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">主控采集NTC温度2(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B202 ?
                  device171C.energyData.B202.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">主控采集NTC温度3(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B204 ?
                  device171C.energyData.B204.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">主控采集NTC温度4(℃)</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B206 ?
                  device171C.energyData.B206.value : "--" }}</text>
              </view> -->
              <view class="grid-item">
                <text class="item-label">通讯协议版本号主版本</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B208 ?
                  device171C.energyData.B208.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">通讯协议版本号子版本</text>
                <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B210 ?
                  device171C.energyData.B210.value : "--" }}</text>
              </view>
            </view>
          </view>
          <!-- 告警状态 -->
          <view class="data-group">
            <view class="group-title">告警状态</view>
            <view class="status-grid">
              <view v-for="(status, index) in bmsAlarmStatus" :key="index" class="fault-item">
                <text class="fault-name" :class="{ active: status.isAlarm }">{{ status.name }}</text>
              </view>
              <text v-if="bmsAlarmStatus.length === 0" class="status-empty">暂无数据</text>
            </view>
          </view>


        </view>

        <!-- 光伏 -->
        <view v-if="activeTab === 3" class="module">
          <view class="module-title">光伏</view>

          <!-- 运行状态区域 -->
          <view class="data-group">
            <view class="group-title">运行状态</view>
            <view class="data-grid">
              <view v-for="(status, index) in parsedB56Status.filter(s => ['DCDC状态'].includes(s.name))" :key="index"
                class="grid-item">
                <text class="item-label">{{ status.name }}</text>
                <text class="item-value">{{ status.value }}</text>
              </view>
              <view v-if="device171E && device171E.energyData && device171E.energyData.B72" class="grid-item">
                <text class="item-label">工作模式</text>
                <text class="item-value">{{ device171E.energyData.B72.value }}</text>
              </view>
            </view>
          </view>



          <!-- 参数区域 -->
          <view class="data-group">
            <view class="data-grid">
              <view class="grid-item">
                <!-- <text class="item-label">模块电压(V)</text> -->
                <text class="item-label">BUS侧电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B0 ?
                  this.formatValue(device171E.energyData.B0.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块电流(A)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B4 ?
                  device171E.energyData.B4.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块限流点</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B8 ?
                  device171E.energyData.B8.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块DC板温度(℃)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B12 ?
                  this.formatValue(device171E.energyData.B12.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">光伏侧电压(V)</text>
                <!-- <text class="item-label">模块输入相电压(V)</text> -->
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B16 ?
                  this.formatValue(device171E.energyData.B16.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块PFC0电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B20 ?
                  this.formatValue(device171E.energyData.B20.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块PFC1电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B24 ?
                  this.formatValue(device171E.energyData.B24.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块面板温度(℃)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B28 ?
                  this.formatValue(device171E.energyData.B28.value, 1) : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">模块交流A相电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B32 ?
                  this.formatValue(device171E.energyData.B32.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块交流B相电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B36 ?
                  this.formatValue(device171E.energyData.B36.value, 1) : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块交流C相电压(V)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B40 ?
                  this.formatValue(device171E.energyData.B40.value, 1) : "--" }}</text>
              </view> -->
              <view class="grid-item">
                <text class="item-label">模块PFC板温度(℃)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B44 ?
                  this.formatValue(device171E.energyData.B44.value, 1) : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">模块额定输出功率(kW)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B48 ?
                  device171E.energyData.B48.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块额定输出电流(A)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B52 ?
                  device171E.energyData.B52.value : "--" }}</text>
              </view> -->
              <view class="grid-item">
                <text class="item-label">输入功率(kW)</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B64 ?
                  this.formatValue(device171E.energyData.B64.value, 2) : "--" }}</text>
              </view>
              <!-- <view class="grid-item">
                <text class="item-label">当前设定海拔值</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B68 ?
                  device171E.energyData.B68.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">节点SerialNo低位</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B76 ?
                  device171E.energyData.B76.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">节点SerialNo高位</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B80 ?
                  device171E.energyData.B80.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC版本号</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B84 ?
                  device171E.energyData.B84.value : "--" }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PFC版本号</text>
                <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B88 ?
                  device171E.energyData.B88.value : "--" }}</text>
              </view> -->
            </view>
          </view>


          <!-- 告警状态区域 -->
          <view class="data-group">
            <view class="group-title">告警状态</view>
            <view class="status-grid">
              <view v-for="(status, index) in parsedB56Status.filter(s => s.name !== 'DCDC状态')" :key="index"
                class="fault-item">
                <text class="fault-name" :class="{ active: status.isAlarm }">{{ status.name }}</text>
              </view>
              <text v-if="parsedB56Status.filter(s => s.name !== 'DCDC状态').length === 0"
                class="status-empty">暂无数据</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { realtimeDataProvider } from '@/service/websocket';
export default {
  data() {
    return {
      activeTab: 0,
      tabs: ['PCS', '储能DC', 'BMS', '光伏'],
      // 电池组数据（从171D-model.js和171c-model.js的energyData字段映射）
      deviceList: [],
    };
  },
  computed: {
    // 获取 PCS 设备（171B）
    device171B() {
      const deviceList = realtimeDataProvider.getDeviceList();
      console.log(this.deviceList, "------1111111-------------", this.deviceList.find(item => item && item.deviceType.includes('171B')));
      return this.deviceList.find(item => item && item.deviceType.includes('171B'));
    },
    // 获取电池设备（171D）
    device171D() {
      const deviceList = realtimeDataProvider.getDeviceList();
      return this.deviceList.find(item => item && item.deviceType.includes('171D'));
    },
    // 获取 BMS 设备（171C）
    device171C() {
      const deviceList = realtimeDataProvider.getDeviceList();
      return this.deviceList.find(item => item && item.deviceType.includes('171C'));
    },
    // 获取光伏设备（171E）
    device171E() {
      const deviceList = realtimeDataProvider.getDeviceList();
      return this.deviceList.find(item => item && item.deviceType.includes('171E'));
    },
    // 解析模块状态B64为对象数组
    parsedB64Status() {
      const b64Value = this.device171B && this.device171B.energyData && this.device171B.energyData.B64 ?
        this.device171B.energyData.B64.value : '';
      if (!b64Value || b64Value === '--') return [];

      const statusMap = {
        '工作模式': '#1890FF',
        'U1状态': '#52c41a',
        'U2状态': '#52c41a',
        '模块故障': '#FF4D4F',
        '模块保护': '#FAAD14',
        '交流输入缺相': '#FF4D4F',
        'SCI通信故障': '#FF4D4F',
        '交流侧接线错相': '#FF4D4F',
        '孤岛告警': '#FAAD14',
        '内部母线过欠压': '#FF4D4F',
        '交流侧欠压': '#FAAD14',
        '交流侧过压': '#FAAD14',
        '直流侧过压': '#FF4D4F',
        '直流侧欠压': '#FAAD14',
        '锁相错误': '#FF4D4F',
        'U1过流保护': '#FF4D4F',
        '风扇故障': '#FF4D4F',
        'CAN通信故障': '#FF4D4F',
        '模块不均流': '#FAAD14',
        '地址重复': '#FF4D4F',
        '泄放故障': '#FF4D4F',
        '模块限功率': '#FAAD14',
        '温度限功率': '#FAAD14',
        '交流限功率': '#FAAD14',
        '交流侧欠频': '#FAAD14',
        '交流侧过频': '#FAAD14',
        '直流侧短路': '#FF4D4F',
        '堵风道过温': '#FF4D4F',
        '模块过温': '#FF4D4F',
        '环温过温': '#FF4D4F'
      };

      return b64Value.split('; ').map(item => {
        const [name, value] = item.split(':');
        const isError = value === '发生';
        return {
          name: name || '',
          value: value || '',
          color: isError ? '#FF4D4F' : (statusMap[name] || '#666'),
          bgColor: isError ? '#FFF1F0' : '#F6FFED',
          borderColor: isError ? '#FFCCC7' : '#B7EB8F'
        };
      });
    },
    parsedB56Status() {
      const b56Value = this.device171E && this.device171E.energyData && this.device171E.energyData.B56 ?
        this.device171E.energyData.B56.value : null;
      if (!Array.isArray(b56Value)) return [];
      return b56Value;
    },
    dcdcAlarmStatus() {
      const energyData = this.device171D && this.device171D.energyData;
      if (!energyData) return [];

      const alarmFields = [
        { key: 'B40b0', name: '电池过压告警' },
        { key: 'B40b1', name: '电池过压关机' },
        { key: 'B40b2', name: '电池快速过压' },
        { key: 'B40b3', name: '电池欠压告警' },
        { key: 'B40b4', name: '电池欠压关机' },
        { key: 'B40b5', name: '电池快速欠压' },
        { key: 'B40b6', name: '电池输入短路' },
        { key: 'B40b7', name: '充放电过流' },
        { key: 'B41b0', name: '充放电快速过流' },
        { key: 'B41b1', name: '充放电硬件过流' },
        { key: 'B41b2', name: '电池未接' },
        { key: 'B41b3', name: '电池反接' },
        { key: 'B41b4', name: 'BUS3过压' },
        { key: 'B41b5', name: 'BUS3快速过压' },
        { key: 'B41b6', name: 'BUS3欠压' },
        { key: 'B41b7', name: 'BUS3快速欠压' },
        { key: 'B42b0', name: 'BUS2过压' },
        { key: 'B42b1', name: 'BUS2快速过压' },
        { key: 'B42b5', name: 'BUS2欠压' },
        { key: 'B42b7', name: 'BUS1+过压' },
        { key: 'B43b0', name: 'BUS1+快速过压' },
        { key: 'B43b1', name: 'BUS1-过压' },
        { key: 'B43b2', name: 'BUS1-快速过压' },
        { key: 'B43b3', name: 'BUS1电压不平衡' },
        { key: 'B43b4', name: 'BUS1+快速欠压' },
        { key: 'B43b5', name: 'BUS1-快速欠压' },
        { key: 'B43b6', name: 'BUS+母线过压' },
        { key: 'B43b7', name: 'BUS+母线快速过压' },
        { key: 'B44b0', name: 'BUS-母线过压' },
        { key: 'B44b1', name: 'BUS-母线快速过压' },
        { key: 'B44b2', name: 'BUS母线电压不平衡' },
        { key: 'B44b3', name: 'BUS母线未接' },
        { key: 'B44b4', name: 'BUS母线反接' },
        { key: 'B44b5', name: 'BUS母线短路' },
        { key: 'B44b6', name: 'BUS母线欠压关机' },
        { key: 'B44b7', name: 'BUS+母线快速欠压' },
        { key: 'B45b0', name: 'BUS-母线快速欠压' },
        { key: 'B45b1', name: 'DCDC1过流' },
        { key: 'B45b2', name: 'DCDC1快速过流' },
        { key: 'B45b3', name: 'DCDC1硬件过流' },
        { key: 'B45b4', name: 'DCDC2过流' },
        { key: 'B45b5', name: 'DCDC2快速过流' },
        { key: 'B45b6', name: 'DCDC2硬件过流' },
        { key: 'B45b7', name: 'DCDC3过流' },
        { key: 'B46b0', name: 'DCDC3快速过流' },
        { key: 'B46b1', name: 'DCDC3硬件过流' },
        { key: 'B46b2', name: 'DCDC不均流' },
        { key: 'B46b3', name: 'BUS1+硬件过压' },
        { key: 'B46b4', name: '谐振电感A1硬件过流' },
        { key: 'B46b5', name: 'BUS1-硬件过压' },
        { key: 'B46b6', name: '谐振电感A2硬件过流' },
        { key: 'B46b7', name: '过载110%' },
        { key: 'B47b0', name: '过载125%' },
        { key: 'B47b1', name: 'BuckBoost软启故障' },
        { key: 'B47b2', name: 'DCDC母线软启故障' },
        { key: 'B47b3', name: 'DCDC电池软启故障' },
        { key: 'B47b4', name: 'BAT散热器过温' },
        { key: 'B47b5', name: 'DCDC原边过温' },
        { key: 'B47b6', name: 'DCDC副边过温' },
        { key: 'B47b7', name: 'DCDC环境过温' },
        { key: 'B48b0', name: '辅助电源故障' },
        { key: 'B48b1', name: 'DCDC功率降额' },
        { key: 'B48b2', name: 'DCDC风扇A故障' },
        { key: 'B48b3', name: 'DCDC风扇B故障' },
        { key: 'B48b4', name: 'E2PROM读故障' },
        { key: 'B48b5', name: 'E2PROM写故障' },
        { key: 'B48b6', name: 'DCDC心跳检测异常' },
        { key: 'B48b7', name: 'DCDC软件版本错误' },
        { key: 'B49b0', name: '监控CANA通讯故障' },
        { key: 'B49b1', name: '并机CANB通讯故障' },
        { key: 'B49b2', name: 'SPI通讯故障' },
        { key: 'B49b3', name: '485通讯故障' },
        { key: 'B49b4', name: '母线侧主继电器故障' },
        { key: 'B49b5', name: '电池侧主继电器故障' },
        { key: 'B49b6', name: 'DC机型配置错误' },
        { key: 'B49b7', name: 'EPO故障' }
      ];

      return alarmFields.map(field => {
        const value = energyData[field.key] && energyData[field.key].value;
        const isAlarm = value === '告警';
        return {
          name: field.name,
          value: value || '--',
          isAlarm: isAlarm
        };
      });
    },
    bmsAlarmStatus() {
      const energyData = this.device171C && this.device171C.energyData;
      if (!energyData) return [];

      const alarmFields = [
        { key: 'B0b0', name: '组端过压1级报警' },
        { key: 'B0b1', name: '组端过压2级报警' },
        { key: 'B0b2', name: '组端过压3级报警' },
        { key: 'B0b3', name: '组端欠压1级报警' },
        { key: 'B0b4', name: '组端欠压2级报警' },
        { key: 'B0b5', name: '组端欠压3级报警' },
        { key: 'B0b6', name: '组端放电过流1级报警' },
        { key: 'B0b7', name: '组端放电过流2级报警' },
        { key: 'B1b0', name: '组端放电过流3级报警' },
        { key: 'B1b1', name: '组端充电过流1级报警' },
        { key: 'B1b2', name: '组端充电过流2级报警' },
        { key: 'B1b3', name: '组端充电过流3级报警' },
        { key: 'B1b4', name: '组端绝缘1级报警' },
        { key: 'B1b5', name: '组端绝缘2级报警' },
        { key: 'B1b6', name: '组端绝缘3级报警' },
        { key: 'B1b7', name: '单体电池充电过温1级报警' },
        { key: 'B2b0', name: '单体电池充电过温2级报警' },
        { key: 'B2b1', name: '单体电池充电过温3级报警' },
        { key: 'B2b2', name: '单体电池充电欠温1级报警' },
        { key: 'B2b3', name: '单体电池充电欠温2级报警' },
        { key: 'B2b4', name: '单体电池充电欠温3级报警' },
        { key: 'B2b5', name: '单体电压过压1级报警' },
        { key: 'B2b6', name: '单体电压过压2级报警' },
        { key: 'B2b7', name: '单体电压过压3级报警' },
        { key: 'B3b0', name: '单体电压欠压1级报警' },
        { key: 'B3b1', name: '单体电压欠压2级报警' },
        { key: 'B3b2', name: '单体电压欠压3级报警' },
        { key: 'B3b3', name: '单体压差过高1级报警' },
        { key: 'B3b4', name: '单体压差过高2级报警' },
        { key: 'B3b5', name: '单体压差过高3级报警' },
        { key: 'B3b6', name: '单体温差过高1级报警' },
        { key: 'B3b7', name: '单体温差过高2级报警' },
        { key: 'B4b0', name: '单体温差过高3级报警' },
        { key: 'B4b1', name: 'SOC过低1级告警' },
        { key: 'B4b2', name: 'SOC过低2级告警' },
        { key: 'B4b3', name: 'SOC过低3级告警' },
        { key: 'B4b4', name: '动力插箱温度过高1级报警' },
        { key: 'B4b5', name: '动力插箱温度过高2级报警' },
        { key: 'B4b6', name: '动力插箱温度过高3级报警' },
        { key: 'B4b7', name: '电池模组过压1级报警' },
        { key: 'B5b0', name: '电池模组过压2级报警' },
        { key: 'B5b1', name: '电池模组过压3级报警' },
        { key: 'B5b2', name: '电池模组欠压1级报警' },
        { key: 'B5b3', name: '电池模组欠压2级报警' },
        { key: 'B5b4', name: '电池模组欠压3级报警' },
        { key: 'B5b5', name: 'DI1故障' },
        { key: 'B5b6', name: 'DI2故障' },
        { key: 'B5b7', name: 'DI3故障' },
        { key: 'B6b0', name: 'DI4故障' },
        { key: 'B6b1', name: 'DI5故障' },
        { key: 'B6b2', name: 'DI6故障' },
        { key: 'B6b3', name: 'DI7故障' },
        { key: 'B6b4', name: 'DI8故障' },
        { key: 'B6b5', name: '内网通讯失联' },
        { key: 'B6b6', name: '单体电压采集异常' },
        { key: 'B6b7', name: '单体温度采集异常' },
        { key: 'B7b0', name: '显控检测故障' },
        { key: 'B7b1', name: '簇间压差大' },
        { key: 'B7b2', name: '簇间跳机故障' },
        { key: 'B7b3', name: '电池极限故障' },
        { key: 'B7b4', name: '项目软件版本参数不一致' },
        { key: 'B7b5', name: '与PCS通讯故障' },
        { key: 'B7b6', name: 'PC强控调试模式' },
        { key: 'B7b7', name: 'CAN霍尔传感器故障' },
        { key: 'B8b0', name: 'CAN霍尔传感器通讯故障' },
        { key: 'B8b1', name: '硬件自检异常' },
        { key: 'B8b2', name: '单体电压线束故障' },
        { key: 'B8b3', name: '均衡故障' },
        { key: 'B8b4', name: 'EMS通讯故障' },
        { key: 'B8b5', name: '与三级BMS通讯故障' },
        { key: 'B8b6', name: '单体电池放电过温1级报警' },
        { key: 'B8b7', name: '单体电池放电过温2级报警' },
        { key: 'B9b0', name: '单体电池放电过温3级报警' },
        { key: 'B9b1', name: '单体电池放电欠温1级报警' },
        { key: 'B9b2', name: '单体电池放电欠温2级报警' },
        { key: 'B9b3', name: '单体电池放电欠温3级报警' },
        { key: 'B9b4', name: 'SOC过高1级告警' },
        { key: 'B9b5', name: 'SOC过高2级告警' },
        { key: 'B9b6', name: 'SOC过高3级告警' },
        { key: 'B9b7', name: '温升快报警1级报警' },
        { key: 'B10b0', name: '温升快报警2级报警' },
        { key: 'B10b1', name: '温升快报警3级报警' }
      ];

      return alarmFields.map(field => {
        const value = energyData[field.key] && energyData[field.key].value;
        const isAlarm = value === '告警';
        return {
          name: field.name,
          value: value || '--',
          isAlarm: isAlarm
        };
      });
    }
  },
  mounted() {
    // 页面加载时初始化实时数据
    this.initRealtimeData();
  },
  beforeUnmount() {
    // 页面卸载时取消注册
    realtimeDataProvider.unregister();
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
    // 初始化设备列表并获取实时数据
    initRealtimeData() {
      // 参考architecture-diagram.vue中的设备配置
      const device171B = {
        deviceType: '171B',
        address: '01',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '170C001',
        name: 'DCDC设备'
      };

      const device171C = {
        deviceType: '171C',
        address: '01',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '170F001',
        name: 'DCDC设备170F'
      };

      const device171D = {
        deviceType: '171D',
        address: '1E',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '170F001',
        name: 'DCDC设备170F'
      };

      const device171E = {
        deviceType: '171E',
        address: '06',
        barCode: '00 00 02 20 26 05 18 15 21 04 02 00 00 00 00',
        deviceId: '170F001',
        name: 'DCDC设备170F'
      };
      // 初始化设备列表
      realtimeDataProvider.initDeviceList([device171B, device171C, device171D, device171E]);


      //  realtimeDataProvider.initDeviceList([device170C, device171F]);
      this.deviceList = realtimeDataProvider.getDeviceList();
      console.log('deviceList---------------------------', this.deviceList);

    },
    formatValue(value, decimals) {
      const num = parseFloat(value);
      return isNaN(num) ? "--" : num.toFixed(decimals);
    },
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
  justify-content: space-around;
}

.tab-item {
  padding: 20rpx 60rpx;
  border-bottom: 3px solid transparent;
  flex-shrink: 0;
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
  background-color: #EFF4FB;
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

.status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.status-item {
  width: calc(33.333% - 8rpx);
  padding: 16rpx 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.status-name {
  font-size: 22rpx;
  font-weight: 500;
  margin-bottom: 6rpx;
}

.status-value {
  font-size: 24rpx;
  font-weight: 600;
  color: #52c41a;
}

.status-value.error {
  color: #FF4D4F;
}

.status-empty {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 40rpx 0;
}

.fault-item {
  width: calc(33.333% - 8rpx);
  padding: 16rpx 12rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fault-name {
  font-size: 24rpx;
  color: #999;
}

.fault-name.active {
  color: #FF4D4F;
  font-weight: 600;
}

/* 数据网格 */
.data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 16rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 16rpx;
}

.grid-item {
  width: calc(33.333% - 12rpx);
  background: #fff;
  padding: 24rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06), 0 1rpx 3rpx rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: none;
}

.grid-item:active {
  transform: scale(0.96);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.grid-item:nth-child(3n) {
  border-right: none;
}

.item-label {
  font-size: 24rpx;
  color: #8a8a8a;
  display: block;
  margin-bottom: 12rpx;
  text-align: center;
  font-weight: 400;
}

.item-value {
  font-size: 32rpx;
  color: #1a1a1a;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5rpx;
}

/* 光伏状态按钮样式 - 核心修复 */
.status-row {
  display: flex;
  gap: 10rpx;
  /* 统一间距 */
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
  border-radius: 8rpx;
  /* 统一圆角，贴合设计图 */
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
  max-width: calc(25% - 7.5rpx);
  /* 4个按钮时的最大宽度 */
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
  gap: 10rpx;
  /* 统一间距 */
}

.pv-param-item {
  width: calc(50% - 5rpx);
  /* 精准计算，避免间隙溢出 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx;
  background-color: #f9f9f9;
  border-radius: 4rpx;
  box-sizing: border-box;
  /* 避免padding撑大宽度 */
}

.pv-param-label {
  font-size: 24rpx;
  color: #666;
  flex: 1;
  /* 标签占比 */
}

.pv-param-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  text-align: right;
  /* 数值右对齐，更整齐 */
  min-width: 80rpx;
  /* 数值最小宽度，避免抖动 */
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
/* 小屏幕一行显示三个 */
@media (max-width: 750rpx) {
  .data-grid {
    gap: 12rpx;
    padding: 12rpx;
    border-radius: 12rpx;
  }

  .grid-item {
    width: calc(33.333% - 8rpx);
    padding: 18rpx 12rpx;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  }

  .item-label {
    font-size: 22rpx;
    margin-bottom: 8rpx;
  }

  .item-value {
    font-size: 28rpx;
  }

  .fire-item {
    width: 100%;
  }

  /* 小屏时状态按钮自适应 */
  .status-btn {
    min-width: 120rpx;
  }
}
</style>
