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
            <view class="group-title">相电压</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相(V)</text>
                <text class="item-value">{{ pcsData.B0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相(V)</text>
                <text class="item-value">{{ pcsData.B4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相(V)</text>
                <text class="item-value">{{ pcsData.B8 }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相电流</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">Ia(A)</text>
                <text class="item-value">{{ pcsData.B2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ib(A)</text>
                <text class="item-value">{{ pcsData.B6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">Ic(A)</text>
                <text class="item-value">{{ pcsData.B10 }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">线电压</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">AB(V)</text>
                <text class="item-value">{{ pcsData.B12 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BC(V)</text>
                <text class="item-value">{{ pcsData.B16 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">CA(V)</text>
                <text class="item-value">{{ pcsData.B20 }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">相功率</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">A相有功(kW)</text>
                <text class="item-value">{{ pcsData.B24 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">A相无功(kVar)</text>
                <text class="item-value">{{ pcsData.B26 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相有功(kW)</text>
                <text class="item-value">{{ pcsData.B28 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">B相无功(kVar)</text>
                <text class="item-value">{{ pcsData.B30 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相有功(kW)</text>
                <text class="item-value">{{ pcsData.B32 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">C相无功(kVar)</text>
                <text class="item-value">{{ pcsData.B34 }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">交流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">交流频率(Hz)</text>
                <text class="item-value">{{ pcsData.B36 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块面板温度(℃)</text>
                <text class="item-value">{{ pcsData.B40 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总有功功率(kW)</text>
                <text class="item-value">{{ pcsData.B44 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总无功功率(kVar)</text>
                <text class="item-value">{{ pcsData.B48 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">总视在功率(kVA)</text>
                <text class="item-value">{{ pcsData.B52 }}</text>
              </view>
            </view>
          </view>

          <view class="data-group">
            <view class="group-title">直流侧</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">直流侧电压(V)</text>
                <text class="item-value">{{ pcsData.B56 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">直流侧电流(A)</text>
                <text class="item-value">{{ pcsData.B58 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">额定输出功率(kW)</text>
                <text class="item-value">{{ pcsData.B60 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块状态</text>
                <text class="item-value">{{ pcsData.B64 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">欠压复位状态</text>
                <text class="item-value">{{ pcsData.B68 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块组号</text>
                <text class="item-value">{{ pcsData.B72 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块地址</text>
                <text class="item-value">{{ pcsData.B74 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">海拔值(m)</text>
                <text class="item-value">{{ pcsData.B76 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">软件版本</text>
                <text class="item-value">{{ pcsData.B82 }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 电池组 -->
        <view v-if="activeTab === 1" class="module">
          <view class="module-title">电池组 (DCDC)</view>

          <view class="data-group">
            <view class="group-title">DCDC状态</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">DCDC故障区标志</text>
                <text class="item-value">{{ batteryData.B0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统工作状态</text>
                <text class="item-value">{{ batteryData.B2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池工作状态</text>
                <text class="item-value">{{ batteryData.B4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池充电状态</text>
                <text class="item-value">{{ batteryData.B6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池电压(V)</text>
                <text class="item-value">{{ batteryData.B8 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池电流(A)</text>
                <text class="item-value">{{ batteryData.B10 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充电功率(kW)</text>
                <text class="item-value">{{ batteryData.B12 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">放电功率(kW)</text>
                <text class="item-value">{{ batteryData.B14 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS母线电压(V)</text>
                <text class="item-value">{{ batteryData.B16 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS+母线电压(V)</text>
                <text class="item-value">{{ batteryData.B18 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">BUS-母线电压(V)</text>
                <text class="item-value">{{ batteryData.B20 }}</text>
              </view>
            </view>
          </view>
          <view class="data-group">
            <view class="group-title">DCDC电气参数</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">环境温度(℃)</text>
                <text class="item-value">{{ batteryData.B22 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">放电量</text>
                <text class="item-value">{{ batteryData.B24 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">输出电压(V)</text>
                <text class="item-value">{{ batteryData.B26 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">输出电流(A)</text>
                <text class="item-value">{{ batteryData.B28 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">输入功率(kW)</text>
                <text class="item-value">{{ batteryData.B30 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC固件版本</text>
                <text class="item-value">{{ batteryData.B32 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC软件版本</text>
                <text class="item-value">{{ batteryData.B34 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC告警字0</text>
                <text class="item-value">{{ batteryData.B36 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC告警字1</text>
                <text class="item-value">{{ batteryData.B38 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC告警字2</text>
                <text class="item-value">{{ batteryData.B40 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC告警字3</text>
                <text class="item-value">{{ batteryData.B42 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC告警字4</text>
                <text class="item-value">{{ batteryData.B44 }}</text>
              </view>
            </view>
          </view>

          <!-- BMS报警状态 -->
          <view class="data-group">
            <view class="group-title">BMS报警状态</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">组端过压1级报警</text>
                <text class="item-value">{{ batteryData.B0b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端过压2级报警</text>
                <text class="item-value">{{ batteryData.B0b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端过压3级报警</text>
                <text class="item-value">{{ batteryData.B0b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端欠压1级报警</text>
                <text class="item-value">{{ batteryData.B0b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端欠压2级报警</text>
                <text class="item-value">{{ batteryData.B0b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端欠压3级报警</text>
                <text class="item-value">{{ batteryData.B0b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端放电过流1级报警</text>
                <text class="item-value">{{ batteryData.B0b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端放电过流2级报警</text>
                <text class="item-value">{{ batteryData.B0b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端放电过流3级报警</text>
                <text class="item-value">{{ batteryData.B1b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端充电过流1级报警</text>
                <text class="item-value">{{ batteryData.B1b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端充电过流2级报警</text>
                <text class="item-value">{{ batteryData.B1b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端充电过流3级报警</text>
                <text class="item-value">{{ batteryData.B1b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端绝缘1级报警</text>
                <text class="item-value">{{ batteryData.B1b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端绝缘2级报警</text>
                <text class="item-value">{{ batteryData.B1b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组端绝缘3级报警</text>
                <text class="item-value">{{ batteryData.B1b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电过温1级报警</text>
                <text class="item-value">{{ batteryData.B1b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电过温2级报警</text>
                <text class="item-value">{{ batteryData.B2b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电过温3级报警</text>
                <text class="item-value">{{ batteryData.B2b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电欠温1级报警</text>
                <text class="item-value">{{ batteryData.B2b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电欠温2级报警</text>
                <text class="item-value">{{ batteryData.B2b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池充电欠温3级报警</text>
                <text class="item-value">{{ batteryData.B2b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压过压1级报警</text>
                <text class="item-value">{{ batteryData.B2b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压过压2级报警</text>
                <text class="item-value">{{ batteryData.B2b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压过压3级报警</text>
                <text class="item-value">{{ batteryData.B2b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压欠压1级报警</text>
                <text class="item-value">{{ batteryData.B3b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压欠压2级报警</text>
                <text class="item-value">{{ batteryData.B3b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压欠压3级报警</text>
                <text class="item-value">{{ batteryData.B3b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体压差过高1级报警</text>
                <text class="item-value">{{ batteryData.B3b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体压差过高2级报警</text>
                <text class="item-value">{{ batteryData.B3b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体压差过高3级报警</text>
                <text class="item-value">{{ batteryData.B3b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体温差过高1级报警</text>
                <text class="item-value">{{ batteryData.B3b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体温差过高2级报警</text>
                <text class="item-value">{{ batteryData.B3b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体温差过高3级报警</text>
                <text class="item-value">{{ batteryData.B4b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过低1级告警</text>
                <text class="item-value">{{ batteryData.B4b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过低2级告警</text>
                <text class="item-value">{{ batteryData.B4b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过低3级告警</text>
                <text class="item-value">{{ batteryData.B4b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">动力插箱温度过高1级报警</text>
                <text class="item-value">{{ batteryData.B4b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">动力插箱温度过高2级报警</text>
                <text class="item-value">{{ batteryData.B4b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">动力插箱温度过高3级报警</text>
                <text class="item-value">{{ batteryData.B4b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组过压1级报警</text>
                <text class="item-value">{{ batteryData.B4b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组过压2级报警</text>
                <text class="item-value">{{ batteryData.B5b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组过压3级报警</text>
                <text class="item-value">{{ batteryData.B5b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组欠压1级报警</text>
                <text class="item-value">{{ batteryData.B5b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组欠压2级报警</text>
                <text class="item-value">{{ batteryData.B5b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组欠压3级报警</text>
                <text class="item-value">{{ batteryData.B5b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI1故障</text>
                <text class="item-value">{{ batteryData.B5b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI2故障</text>
                <text class="item-value">{{ batteryData.B5b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI3故障</text>
                <text class="item-value">{{ batteryData.B5b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI4故障</text>
                <text class="item-value">{{ batteryData.B6b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI5故障</text>
                <text class="item-value">{{ batteryData.B6b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI6故障</text>
                <text class="item-value">{{ batteryData.B6b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI7故障</text>
                <text class="item-value">{{ batteryData.B6b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DI8故障</text>
                <text class="item-value">{{ batteryData.B6b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">内网通讯失联</text>
                <text class="item-value">{{ batteryData.B6b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压采集异常</text>
                <text class="item-value">{{ batteryData.B6b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体温度采集异常</text>
                <text class="item-value">{{ batteryData.B6b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">显控检测故障</text>
                <text class="item-value">{{ batteryData.B7b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">簇间压差大</text>
                <text class="item-value">{{ batteryData.B7b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">簇间跳机故障</text>
                <text class="item-value">{{ batteryData.B7b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池极限故障</text>
                <text class="item-value">{{ batteryData.B7b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">项目软件版本参数不一致</text>
                <text class="item-value">{{ batteryData.B7b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">与PCS通讯故障</text>
                <text class="item-value">{{ batteryData.B7b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PC强控调试模式</text>
                <text class="item-value">{{ batteryData.B7b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">CAN霍尔传感器故障</text>
                <text class="item-value">{{ batteryData.B7b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">CAN霍尔传感器通讯故障</text>
                <text class="item-value">{{ batteryData.B8b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">硬件自检异常</text>
                <text class="item-value">{{ batteryData.B8b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电压线束故障</text>
                <text class="item-value">{{ batteryData.B8b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">均衡故障</text>
                <text class="item-value">{{ batteryData.B8b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">EMS通讯故障</text>
                <text class="item-value">{{ batteryData.B8b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">与三级BMS通讯故障</text>
                <text class="item-value">{{ batteryData.B8b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电过温1级报警</text>
                <text class="item-value">{{ batteryData.B8b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电过温2级报警</text>
                <text class="item-value">{{ batteryData.B8b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电过温3级报警</text>
                <text class="item-value">{{ batteryData.B9b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电欠温1级报警</text>
                <text class="item-value">{{ batteryData.B9b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电欠温2级报警</text>
                <text class="item-value">{{ batteryData.B9b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体电池放电欠温3级报警</text>
                <text class="item-value">{{ batteryData.B9b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过高1级告警</text>
                <text class="item-value">{{ batteryData.B9b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过高2级告警</text>
                <text class="item-value">{{ batteryData.B9b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SOC过高3级告警</text>
                <text class="item-value">{{ batteryData.B9b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">温升快报警1级报警</text>
                <text class="item-value">{{ batteryData.B9b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">温升快报警2级报警</text>
                <text class="item-value">{{ batteryData.B10b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">温升快报警3级报警</text>
                <text class="item-value">{{ batteryData.B10b1 }}</text>
              </view>
            </view>
          </view>

          <!-- BMS电池簇状态 -->
          <view class="data-group">
            <view class="group-title">BMS电池簇状态</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">电池簇电压</text>
                <text class="item-value">{{ batteryData.B12 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电流值</text>
                <text class="item-value">{{ batteryData.B14 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOC</text>
                <text class="item-value">{{ batteryData.B16 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOH</text>
                <text class="item-value">{{ batteryData.B18 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇总SOE</text>
                <text class="item-value">{{ batteryData.B20 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇绝缘电阻R+</text>
                <text class="item-value">{{ batteryData.B22 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇绝缘电阻R-</text>
                <text class="item-value">{{ batteryData.B24 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B26 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池簇电池状态</text>
                <text class="item-value">{{ batteryData.B28b7 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">SLP信号</text>
                <text class="item-value">{{ batteryData.B29b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO1输出状态</text>
                <text class="item-value">{{ batteryData.B30b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO2输出状态</text>
                <text class="item-value">{{ batteryData.B30b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO3输出状态</text>
                <text class="item-value">{{ batteryData.B30b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO4输出状态</text>
                <text class="item-value">{{ batteryData.B30b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO5输出状态</text>
                <text class="item-value">{{ batteryData.B30b4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO6输出状态</text>
                <text class="item-value">{{ batteryData.B30b5 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO7输出状态</text>
                <text class="item-value">{{ batteryData.B30b6 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DO8输出状态</text>
                <text class="item-value">{{ batteryData.B30b7 }}</text>
              </view>
            </view>
          </view>

          <!-- BMS参数 -->
          <view class="data-group">
            <view class="group-title">BMS参数</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">实际温度采集点数</text>
                <text class="item-value">{{ batteryData.B32 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度</text>
                <text class="item-value">{{ batteryData.B34 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度所在模块号</text>
                <text class="item-value">{{ batteryData.B36 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最高温度模块内序号</text>
                <text class="item-value">{{ batteryData.B38 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度</text>
                <text class="item-value">{{ batteryData.B40 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度所在模块号</text>
                <text class="item-value">{{ batteryData.B42 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池最低温度模块内序号</text>
                <text class="item-value">{{ batteryData.B44 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池平均温度</text>
                <text class="item-value">{{ batteryData.B46 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电池总节数</text>
                <text class="item-value">{{ batteryData.B48 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均电压</text>
                <text class="item-value">{{ batteryData.B50 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压</text>
                <text class="item-value">{{ batteryData.B52 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压所在模块号</text>
                <text class="item-value">{{ batteryData.B54 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体电压模块内序号</text>
                <text class="item-value">{{ batteryData.B56 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压</text>
                <text class="item-value">{{ batteryData.B58 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压所在模块号</text>
                <text class="item-value">{{ batteryData.B60 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体电压模块内序号</text>
                <text class="item-value">{{ batteryData.B62 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均SOC</text>
                <text class="item-value">{{ batteryData.B64 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC</text>
                <text class="item-value">{{ batteryData.B66 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC所在模块号</text>
                <text class="item-value">{{ batteryData.B68 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOC模块内序号</text>
                <text class="item-value">{{ batteryData.B70 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC</text>
                <text class="item-value">{{ batteryData.B72 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC所在模块号</text>
                <text class="item-value">{{ batteryData.B74 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOC模块内序号</text>
                <text class="item-value">{{ batteryData.B76 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均SOH</text>
                <text class="item-value">{{ batteryData.B78 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH</text>
                <text class="item-value">{{ batteryData.B80 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH所在模块号</text>
                <text class="item-value">{{ batteryData.B82 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体SOH模块内序号</text>
                <text class="item-value">{{ batteryData.B84 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH</text>
                <text class="item-value">{{ batteryData.B86 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH所在模块号</text>
                <text class="item-value">{{ batteryData.B88 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体SOH模块内序号</text>
                <text class="item-value">{{ batteryData.B90 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单体平均内阻</text>
                <text class="item-value">{{ batteryData.B92 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体内阻</text>
                <text class="item-value">{{ batteryData.B94 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体内阻所在模块号</text>
                <text class="item-value">{{ batteryData.B96 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最高单体内阻模块内序号</text>
                <text class="item-value">{{ batteryData.B98 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻</text>
                <text class="item-value">{{ batteryData.B100 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻所在模块号</text>
                <text class="item-value">{{ batteryData.B102 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">最低单体内阻模块内序号</text>
                <text class="item-value">{{ batteryData.B104 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最高温度</text>
                <text class="item-value">{{ batteryData.B106 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最高温度所在模块号</text>
                <text class="item-value">{{ batteryData.B108 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最高温度模块内序号</text>
                <text class="item-value">{{ batteryData.B110 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度</text>
                <text class="item-value">{{ batteryData.B112 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度所在模块号</text>
                <text class="item-value">{{ batteryData.B114 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱最低温度模块内序号</text>
                <text class="item-value">{{ batteryData.B116 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池箱箱平均温度</text>
                <text class="item-value">{{ batteryData.B118 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最高电压值</text>
                <text class="item-value">{{ batteryData.B120 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最高电压序号</text>
                <text class="item-value">{{ batteryData.B122 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最低电压值</text>
                <text class="item-value">{{ batteryData.B124 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池模组最低电压序号</text>
                <text class="item-value">{{ batteryData.B126 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计充电电量</text>
                <text class="item-value">{{ batteryData.B128 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计放电电量</text>
                <text class="item-value">{{ batteryData.B132 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单次充电电量</text>
                <text class="item-value">{{ batteryData.B136 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">单次放电电量</text>
                <text class="item-value">{{ batteryData.B138 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计充电次数</text>
                <text class="item-value">{{ batteryData.B140 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">累计放电次数</text>
                <text class="item-value">{{ batteryData.B142 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组负载电压</text>
                <text class="item-value">{{ batteryData.B144 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组总电压-备用1</text>
                <text class="item-value">{{ batteryData.B146 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电流值-备用1</text>
                <text class="item-value">{{ batteryData.B148 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">电池组电流值-备用2</text>
                <text class="item-value">{{ batteryData.B150 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">系统运行心跳</text>
                <text class="item-value">{{ batteryData.B152 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">绝缘采集状态</text>
                <text class="item-value">{{ batteryData.B154 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">禁充标志</text>
                <text class="item-value">{{ batteryData.B156b0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">禁放标志</text>
                <text class="item-value">{{ batteryData.B156b1 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">告警状态</text>
                <text class="item-value">{{ batteryData.B156b2 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">充满状态</text>
                <text class="item-value">{{ batteryData.B156b3 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">放空状态</text>
                <text class="item-value">{{ batteryData.B156b4 }}</text>
              </view>
            </view>
          </view>

        </view>

        <!-- 光伏 -->
        <view v-if="activeTab === 2" class="module">
          <view class="module-title">光伏</view>

          <!-- 运行状态区域 -->
          <view class="data-group">
            <view class="group-title">运行状态</view>
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">模块当前告警/状态</text>
                <text class="item-value">{{ pvData.B56 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">组号和拨码地址</text>
                <text class="item-value">{{ pvData.B60 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">当前模块输入工作模式</text>
                <text class="item-value">{{ pvData.B72 }}</text>
              </view>
            </view>
          </view>

          <!-- 参数区域 -->
          <view class="data-group">
            <view class="data-grid">
              <view class="grid-item">
                <text class="item-label">模块电压(V)</text>
                <text class="item-value">{{ pvData.B0 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块电流(A)</text>
                <text class="item-value">{{ pvData.B4 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块限流点</text>
                <text class="item-value">{{ pvData.B8 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块DC板温度(℃)</text>
                <text class="item-value">{{ pvData.B12 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块输入相电压(V)</text>
                <text class="item-value">{{ pvData.B16 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块PFC0电压(V)</text>
                <text class="item-value">{{ pvData.B20 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块PFC1电压(V)</text>
                <text class="item-value">{{ pvData.B24 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块面板温度(℃)</text>
                <text class="item-value">{{ pvData.B28 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块交流A相电压(V)</text>
                <text class="item-value">{{ pvData.B32 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块交流B相电压(V)</text>
                <text class="item-value">{{ pvData.B36 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块交流C相电压(V)</text>
                <text class="item-value">{{ pvData.B40 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块PFC板温度(℃)</text>
                <text class="item-value">{{ pvData.B44 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块额定输出功率(kW)</text>
                <text class="item-value">{{ pvData.B48 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">模块额定输出电流(A)</text>
                <text class="item-value">{{ pvData.B52 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">输入功率(kW)</text>
                <text class="item-value">{{ pvData.B64 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">当前设定海拔值</text>
                <text class="item-value">{{ pvData.B68 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">节点SerialNo低位</text>
                <text class="item-value">{{ pvData.B76 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">节点SerialNo高位</text>
                <text class="item-value">{{ pvData.B80 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">DCDC版本号</text>
                <text class="item-value">{{ pvData.B84 }}</text>
              </view>
              <view class="grid-item">
                <text class="item-label">PFC版本号</text>
                <text class="item-value">{{ pvData.B88 }}</text>
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
      tabs: ['PCS', '电池组', '光伏'],
      // PCS数据（从171B-model.js的EnergyData字段映射）
      pcsData: {
        // 相电压
        B0: "--",  // 交流A相相电压
        B4: "--",  // 交流B相相电压
        B8: "--",  // 交流C相相电压
        // 相电流
        B2: "--",  // 交流A相相电流
        B6: "--",  // 交流B相相电流
        B10: "--", // 交流C相相电流
        // 线电压
        B12: "--", // 交流AB线电压
        B16: "--", // 交流BC线电压
        B20: "--", // 交流CA线电压
        // 相功率
        B24: "--", // A相有功功率
        B26: "--", // A相无功功率
        B28: "--", // B相有功功率
        B30: "--", // B相无功功率
        B32: "--", // C相有功功率
        B34: "--", // C相无功功率
        // 交流侧
        B36: "--", // 交流频率
        B40: "--", // 模块面板（环境）温度
        B44: "--", // 总有功功率
        B48: "--", // 总无功功率
        B52: "--", // 总视在功率
        // 直流侧
        B56: "--", // 直流侧电压
        B58: "--", // 直流侧电流
        B60: "--", // 额定输出功率
        B64: "--", // 模块当前告警/状态
        B68: "--", // 逆变模式直流侧欠压复位状态
        B72: "--", // 模块组号
        B74: "--", // 模块地址
        B76: "--", // 当前设定的海拔值
        B82: "--"  // 模块软件版本号
      },
      // 电池组数据（从171D-model.js和171c-model.js的EnergyData字段映射）
      batteryData: {
        // DCDC状态（171D-model.js）
        B0: "--",   // DCDC故障区标志
        B2: "--",   // 系统工作状态
        B4: "--",   // 电池工作状态
        B6: "--",   // DCDC故障字1
        B8: "--",   // DCDC故障字2
        B10: "--",  // DCDC故障字3
        B12: "--",  // DCDC故障字4
        B14: "--",  // DCDC告警字1
        B16: "--",  // DCDC告警字2
        B18: "--",  // DCDC告警字3
        B20: "--",  // DCDC告警字4
        // DCDC电气参数（171D-model.js）
        B22: "--",  // 输入电压
        B24: "--",  // 输入电流
        B26: "--",  // 输出电压
        B28: "--",  // 输出电流
        B30: "--",  // 输入功率
        B32: "--",  // 输出功率
        B34: "--",  // 模块温度
        B36: "--",  // 散热器温度
        B38: "--",  // 环境温度
        // BMS参数（171c-model.js）
        B90: "--",  // BMS故障码
        B91: "--",  // BMS告警码
        B92: "--",  // BMS保护码
        B93: "--",  // BMS状态字
        B94: "--",  // BMS控制字
        B95: "--",  // BMS工作模式
        B96: "--",  // BMS充电模式
        B97: "--",  // BMS放电模式
        B98: "--",  // BMS平衡模式
        B99: "--",  // BMS加热模式
        B100: "--", // BMS冷却模式
        B101: "--", // BMS SOC
        B102: "--", // BMS SOH
        B103: "--", // BMS SOE
        B110: "--", // BMS总电压
        B111: "--", // BMS总电流
        B112: "--", // BMS总功率
        B114: "--", // BMS总充电能量
        B115: "--", // BMS总放电能量
        B118: "--", // BMS总循环次数
        B122: "--", // BMS最大电芯电压
        B123: "--", // BMS最小电芯电压
        B125: "--", // BMS最大电芯温度
        B126: "--"  // BMS最小电芯温度
      },
      // 光伏数据（从171E-model.js的EnergyData字段映射）
      pvData: {
        B0: "--",   // 模块电压
        B4: "--",   // 模块电流
        B8: "--",   // 模块限流点
        B12: "--",  // 模块DC板温度
        B16: "--",  // 模块输入相电压（直流输入电压）
        B20: "--",  // 模块PFC0电压（正半母线）
        B24: "--",  // 模块PFC1电压（负半母线）
        B28: "--",  // 模块面板（环境）温度
        B32: "--",  // 模块交流A相电压
        B36: "--",  // 模块交流B相电压
        B40: "--",  // 模块交流C相电压
        B44: "--",  // 模块PFC板温度
        B48: "--",  // 模块额定输出功率
        B52: "--",  // 模块额定输出电流
        B56: "--",  // 读取当前告警/状态
        B60: "--",  // 读取组号和拨码地址
        B64: "--",  // 读取输入功率
        B68: "--",  // 读取当前设定的海拔值
        B72: "--",  // 读取当前模块输入工作模式
        B76: "--",  // 读节点SerialNo号低位
        B80: "--",  // 读节点SerialNo号高位
        B84: "--",  // 读DCDC版本号
        B88: "--"   // 读PFC版本号
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

      // 模拟从后端171B-model.js获取EnergyData数据
      this.fetchPcsDataFromBackend();

      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '刷新成功',
          icon: 'success'
        });
      }, 1000);
    },
    // 从后端获取PCS数据（模拟171B-model.js的EnergyData字段映射）
    fetchPcsDataFromBackend() {
      // 模拟调用后端API获取设备数据
      // 实际项目中这里应该是调用真实的后端接口
      const mockEnergyData = this.getMockEnergyData();

      // 将后端EnergyData字段直接映射到前端pcsData
      this.pcsData.B0 = mockEnergyData.B0 || "--";   // 交流A相相电压
      this.pcsData.B2 = mockEnergyData.B2 || "--";   // 交流A相相电流
      this.pcsData.B4 = mockEnergyData.B4 || "--";   // 交流B相相电压
      this.pcsData.B6 = mockEnergyData.B6 || "--";   // 交流B相相电流
      this.pcsData.B8 = mockEnergyData.B8 || "--";   // 交流C相相电压
      this.pcsData.B10 = mockEnergyData.B10 || "--"; // 交流C相相电流
      this.pcsData.B12 = mockEnergyData.B12 || "--"; // 交流AB线电压
      this.pcsData.B16 = mockEnergyData.B16 || "--"; // 交流BC线电压
      this.pcsData.B20 = mockEnergyData.B20 || "--"; // 交流CA线电压
      this.pcsData.B24 = mockEnergyData.B24 || "--"; // A相有功功率
      this.pcsData.B26 = mockEnergyData.B26 || "--"; // A相无功功率
      this.pcsData.B28 = mockEnergyData.B28 || "--"; // B相有功功率
      this.pcsData.B30 = mockEnergyData.B30 || "--"; // B相无功功率
      this.pcsData.B32 = mockEnergyData.B32 || "--"; // C相有功功率
      this.pcsData.B34 = mockEnergyData.B34 || "--"; // C相无功功率
      this.pcsData.B36 = mockEnergyData.B36 || "--"; // 交流频率
      this.pcsData.B40 = mockEnergyData.B40 || "--"; // 模块面板（环境）温度
      this.pcsData.B44 = mockEnergyData.B44 || "--"; // 总有功功率
      this.pcsData.B48 = mockEnergyData.B48 || "--"; // 总无功功率
      this.pcsData.B52 = mockEnergyData.B52 || "--"; // 总视在功率
      this.pcsData.B56 = mockEnergyData.B56 || "--"; // 直流侧电压
      this.pcsData.B58 = mockEnergyData.B58 || "--"; // 直流侧电流
      this.pcsData.B60 = mockEnergyData.B60 || "--"; // 额定输出功率
      this.pcsData.B64 = mockEnergyData.B64 || "--"; // 模块当前告警/状态
      this.pcsData.B68 = mockEnergyData.B68 || "--"; // 逆变模式直流侧欠压复位状态
      this.pcsData.B72 = mockEnergyData.B72 || "--"; // 模块组号
      this.pcsData.B74 = mockEnergyData.B74 || "--"; // 模块地址
      this.pcsData.B76 = mockEnergyData.B76 || "--"; // 当前设定的海拔值
      this.pcsData.B82 = mockEnergyData.B82 || "--"; // 模块软件版本号
    },
    // 模拟后端EnergyData数据（匹配171B-model.js的字段）
    getMockEnergyData() {
      return {
        B0: (220 + Math.random() * 10).toFixed(1) + 'V',    // 交流A相相电压
        B2: (10 + Math.random() * 20).toFixed(1) + 'A',     // 交流A相相电流
        B4: (220 + Math.random() * 10).toFixed(1) + 'V',    // 交流B相相电压
        B6: (10 + Math.random() * 20).toFixed(1) + 'A',     // 交流B相相电流
        B8: (220 + Math.random() * 10).toFixed(1) + 'V',    // 交流C相相电压
        B10: (10 + Math.random() * 20).toFixed(1) + 'A',    // 交流C相相电流
        B12: (380 + Math.random() * 20).toFixed(1) + 'V',   // 交流AB线电压
        B16: (380 + Math.random() * 20).toFixed(1) + 'V',   // 交流BC线电压
        B20: (380 + Math.random() * 20).toFixed(1) + 'V',   // 交流CA线电压
        B24: (Math.random() * 50).toFixed(1) + 'kW',        // A相有功功率
        B26: (Math.random() * 10).toFixed(1) + 'kVar',      // A相无功功率
        B28: (Math.random() * 50).toFixed(1) + 'kW',        // B相有功功率
        B30: (Math.random() * 10).toFixed(1) + 'kVar',      // B相无功功率
        B32: (Math.random() * 50).toFixed(1) + 'kW',        // C相有功功率
        B34: (Math.random() * 10).toFixed(1) + 'kVar',      // C相无功功率
        B36: (50 + Math.random() * 2).toFixed(1) + 'Hz',    // 交流频率
        B44: (Math.random() * 100).toFixed(1) + 'kW',       // 总有功功率
        B48: (Math.random() * 20).toFixed(1) + 'kVar',      // 总无功功率
        B52: (Math.random() * 150).toFixed(1) + 'kVA',      // 总视在功率
        B56: (600 + Math.random() * 50).toFixed(1) + 'V',   // 直流侧电压
        B58: (100 + Math.random() * 50).toFixed(1) + 'A',   // 直流侧电流
        B60: (Math.random() * 500).toFixed(1) + 'kW',       // 额定输出功率
        B64: '正常',                                         // 模块当前告警/状态
        B68: '正常',                                         // 逆变模式直流侧欠压复位状态
        B72: '1',                                           // 模块组号
        B74: '0x01',                                        // 模块地址
        B76: (1000 + Math.random() * 500).toFixed(0) + 'm', // 当前设定的海拔值
        B82: 'V1.0.0'                                       // 模块软件版本号
      };
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