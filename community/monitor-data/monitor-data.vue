<template>
  <view class="container" :class="platformClass">
    <DyNavbar title="监控数据" :fixed="true" :placeholder="true" />
    <view class="fixed-placeholder"></view>
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

    <swiper class="content-swiper" :current="activeTab" @change="onSwiperChange" :duration="300">
      <swiper-item>
        <scroll-view class="module-scroll" scroll-y="true">
          <view class="content">
            <view class="module">
              <view class="module-title">PCS</view>

              <view class="data-group">
                <view class="group-title">运行状态</view>
                <view class="status-grid">
                  <view
                    v-for="(status, index) in parsedB64Status.filter(s => ['工作模式', 'U1状态', 'U2状态'].includes(s.name))"
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
                </view>
              </view>

              <view class="data-group">
                <view class="group-title">故障状态</view>
                <view class="status-grid">
                  <view
                    v-for="(status, index) in parsedB64Status.filter(s => !['工作模式', 'U1状态', 'U2状态'].includes(s.name))"
                    :key="index" class="fault-item">
                    <text class="fault-name" :class="{ active: status.value === '发生' }">{{ status.name }}</text>
                  </view>
                  <text v-if="parsedB64Status.length === 0" class="status-empty">暂无数据</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view class="module-scroll" scroll-y="true">
          <view class="content">
            <view class="module">
              <view class="module-title">储能DC</view>

              <view class="data-group">
                <view class="group-title">DCDC状态</view>
                <view class="data-grid">
                  <view class="grid-item">
                    <text class="item-label">故障标志</text>
                    <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B0 ?
                      device171D.energyData.B0.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">运行状态</text>
                    <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B2 ?
                      device171D.energyData.B2.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">工作状态</text>
                    <text class="item-value">{{ device171D && device171D.energyData && device171D.energyData.B4 ?
                      device171D.energyData.B4.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">充电模式</text>
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
                </view>
              </view>

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
          </view>
        </scroll-view>
      </swiper-item>

      <swiper-item>
        <scroll-view class="module-scroll" scroll-y="true">
          <view class="content">
            <view class="module">
              <view class="module-title">光伏</view>

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

              <!-- <view class="data-group">
                <view class="group-title">电气参数</view>
                <view class="data-grid">
                  <view class="grid-item">
                    <text class="item-label">光伏输入电压(V)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B0 ?
                      this.formatValue(device171E.energyData.B0.value, 1) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">光伏输入电流(A)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B2 ?
                      device171E.energyData.B2.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">光伏输入功率(kW)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B4 ?
                      this.formatValue(device171E.energyData.B4.value, 2) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">输出电压(V)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B6 ?
                      this.formatValue(device171E.energyData.B6.value, 1) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">输出电流(A)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B8 ?
                      device171E.energyData.B8.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">输出功率(kW)</text>
                    <text class="item-value">{{ device171E && device171E.energyData && device171E.energyData.B10 ?
                      this.formatValue(device171E.energyData.B10.value, 2) : "--" }}</text>
                  </view>
                </view>
              </view> -->

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
      </swiper-item>

      <swiper-item>
        <scroll-view class="module-scroll" scroll-y="true">
          <view class="content">
            <view class="module">
              <view class="module-title">BMS</view>


              <!-- 2. 绿色框：电池簇运行状态 -->
              <view class="data-group">
                <view class="group-title">电池簇运行状态</view>
                <view class="data-grid">
                  <view class="grid-item">
                    <text class="item-label">电池簇电池状态</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B26 ?
                      device171C.energyData.B26.value : "--" }}</text>
                  </view>
                </view>
              </view>

              <view class="data-group">
                <view class="group-title">簇级核心电气参数</view>
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
                  <view class="grid-item"><text class="item-label">电池组负载电压(V)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B144 ?
                      this.formatValue(device171C.energyData.B144.value, 1) : "--" }}</text></view>
                  <!-- <view class="grid-item"><text class="item-label">备用1总电压(V)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B146 ?
                      this.formatValue(device171C.energyData.B146.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">备用1电流(A)</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B148 ? device171C.energyData.B148.value : "--"
                  }}</text></view> -->
                  <view class="grid-item">
                    <text class="item-label">电池簇总SOC(%)</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B16 ?
                      this.formatValue(device171C.energyData.B16.value, 2) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">电池簇总SOH(%)</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B18 ?
                      this.formatValue(device171C.energyData.B18.value, 2) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">电池簇总SOE(kWh)</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B20 ?
                      device171C.energyData.B20.value : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">绝缘电阻R+(MΩ)</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B22 ?
                      (device171C.energyData.B22.value / 1000).toFixed(2) : "--" }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">绝缘电阻R-(MΩ)</text>
                    <text class="item-value">{{ device171C && device171C.energyData && device171C.energyData.B24 ?
                      (device171C.energyData.B24.value / 1000).toFixed(2) : "--" }}</text>
                  </view>

                  <!-- 
                  <view class="grid-item"><text class="item-label">备用2电流(A)</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B150 ? device171C.energyData.B150.value : "--"
                  }}</text></view> -->
                </view>
              </view>



              <!-- 3. 浅蓝色框：数字输入输出DI/DO状态 -->
              <view class="data-group">
                <view class="group-title">数字输入输出状态</view>
                <view class="data-grid">
                  <view class="grid-item"><text class="item-label">DI1状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b0 ? device171C.energyData.B28b0.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI2状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b1 ? device171C.energyData.B28b1.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI3状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b2 ? device171C.energyData.B28b2.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI4状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b3 ? device171C.energyData.B28b3.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI5状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b4 ? device171C.energyData.B28b4.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI6状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b5 ? device171C.energyData.B28b5.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI7状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b6 ? device171C.energyData.B28b6.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DI8状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B28b7 ? device171C.energyData.B28b7.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">SLP信号</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B29b0 ? device171C.energyData.B29b0.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO1输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b0 ? device171C.energyData.B30b0.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO2输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b1 ? device171C.energyData.B30b1.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO3输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b2 ? device171C.energyData.B30b2.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO4输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b3 ? device171C.energyData.B30b3.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO5输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b4 ? device171C.energyData.B30b4.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO6输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b5 ? device171C.energyData.B30b5.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO7输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b6 ? device171C.energyData.B30b6.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">DO8输出状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B30b7 ? device171C.energyData.B30b7.value : "--"
                  }}</text></view>
                </view>
              </view>

              <!-- 4. 深蓝色框：温度采集参数 -->
              <view class="data-group">
                <view class="group-title">温度采集参数</view>
                <view class="data-grid">
                  <view class="grid-item"><text class="item-label">实际温度采集点数</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B32 ? device171C.energyData.B32.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">电池最高温度(℃)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B34 ?
                      this.formatValue(device171C.energyData.B34.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最高温所在模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B36 ? device171C.energyData.B36.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最高温模块内序号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B38 ? device171C.energyData.B38.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">电池最低温度(℃)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B40 ?
                      this.formatValue(device171C.energyData.B40.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最低温所在模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B42 ? device171C.energyData.B42.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低温模块内序号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B44 ? device171C.energyData.B44.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">电池平均温度(℃)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B46 ?
                      this.formatValue(device171C.energyData.B46.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最高温度(℃)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B106 ?
                      this.formatValue(device171C.energyData.B106.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最高温模块号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B108 ? device171C.energyData.B108.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最高温模块序号</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B110 ? device171C.energyData.B110.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最低温度(℃)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B112 ?
                      this.formatValue(device171C.energyData.B112.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最低温模块号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B114 ? device171C.energyData.B114.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱最低温模块序号</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B116 ? device171C.energyData.B116.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">电池箱平均温度(℃)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B118 ?
                      this.formatValue(device171C.energyData.B118.value, 1) : "--" }}</text></view>

                  <view class="grid-item"><text class="item-label">电池模组最高电压(V)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B120 ?
                      this.formatValue(device171C.energyData.B120.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">模组最高电压序号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B122 ? device171C.energyData.B122.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">电池模组最低电压(V)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B124 ?
                      this.formatValue(device171C.energyData.B124.value, 1) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">模组最低电压序号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B126 ? device171C.energyData.B126.value : "--"
                  }}</text></view>
                </view>
              </view>

              <!-- 5. 粉色框：单体电芯参数（电压/SOC/SOH） -->
              <view class="data-group">
                <view class="group-title">单体电芯参数</view>
                <view class="data-grid">
                  <view class="grid-item"><text class="item-label">电池组电池总节数</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B48 ? device171C.energyData.B48.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">单体平均电压(V)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B50 ?
                      this.formatValue(device171C.energyData.B50.value, 3) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最高单体电压(V)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B52 ?
                      this.formatValue(device171C.energyData.B52.value, 3) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最高单体电压模块号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B54 ? device171C.energyData.B54.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最高单体电压模块序号</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B56 ? device171C.energyData.B56.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最低单体电压(V)</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B58 ?
                      this.formatValue(device171C.energyData.B58.value, 3) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最低单体电压模块号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B60 ? device171C.energyData.B60.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低单体电压模块序号</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B62 ? device171C.energyData.B62.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">单体平均SOC(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B64 ? this.formatValue(device171C.energyData.B64.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最高单体SOC(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B66 ? this.formatValue(device171C.energyData.B66.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最高SOC模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B68 ? device171C.energyData.B68.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最高SOC模块序号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B70 ? device171C.energyData.B70.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低单体SOC(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B72 ? this.formatValue(device171C.energyData.B72.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最低SOC模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B74 ? device171C.energyData.B74.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低SOC模块序号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B76 ? device171C.energyData.B76.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">单体平均SOH(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B78 ? this.formatValue(device171C.energyData.B78.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最高单体SOH(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B80 ? this.formatValue(device171C.energyData.B80.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最高SOH模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B82 ? device171C.energyData.B82.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最高SOH模块序号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B84 ? device171C.energyData.B84.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低单体SOH(%)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B86 ? this.formatValue(device171C.energyData.B86.value, 2) : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最低SOH模块号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B88 ? device171C.energyData.B88.value : "--"
                  }}</text>
                  </view>
                  <view class="grid-item"><text class="item-label">最低SOH模块序号</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B90 ? device171C.energyData.B90.value : "--"
                  }}</text>
                  </view>

                  <view class="grid-item"><text class="item-label">最大单体电压节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B172 ? device171C.energyData.B172.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最小单体电压节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B174 ? device171C.energyData.B174.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大单体温度节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B176 ? device171C.energyData.B176.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最小单体温度节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B178 ? device171C.energyData.B178.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大SOC节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B180 ? device171C.energyData.B180.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最小SOC节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B182 ? device171C.energyData.B182.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大SOH节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B184 ? device171C.energyData.B184.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最小SOH节号</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B186 ? device171C.energyData.B186.value : "--"
                  }}</text></view>

                </view>
              </view>

              <!-- 6. 紫色框：电量统计参数 -->
              <view class="data-group">
                <view class="group-title">电量统计参数</view>
                <view class="data-grid">
                  <view class="grid-item"><text class="item-label">累计充电电量(kWh)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B128 ? device171C.energyData.B128.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">累计放电电量(kWh)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B132 ? device171C.energyData.B132.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">单次充电电量(kWh)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B136 ? device171C.energyData.B136.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">单次放电电量(kWh)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B138 ? device171C.energyData.B138.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">累计充电次数</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B140 ? device171C.energyData.B140.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">累计放电次数</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B142 ? device171C.energyData.B142.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">单日累计充电电量(kWh)</text><text class="item-value">{{
                    device171C && device171C.energyData && device171C.energyData.B192 ?
                      device171C.energyData.B192.value :
                      "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">单日累计放电电量(kWh)</text><text class="item-value">{{
                    device171C && device171C.energyData && device171C.energyData.B196 ?
                      device171C.energyData.B196.value :
                      "--" }}</text></view>
                </view>
              </view>

              <!-- 7. 红色补充框：备用电压电流参数 -->
              <!-- <view class="data-group">
            <view class="group-title">备用电压电流参数</view>
            <view class="data-grid">

            </view>
          </view> -->

              <!-- 8. 蓝色大框：系统控制与限值参数 -->
              <view class="data-group">
                <view class="group-title">系统控制与限值参数</view>
                <view class="data-grid">
                  <view class="grid-item"><text class="item-label">系统运行心跳</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B152 ? device171C.energyData.B152.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">绝缘采集状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B154 ? device171C.energyData.B154.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">禁充标志</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B156b0 ? device171C.energyData.B156b0.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">禁放标志</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B156b1 ? device171C.energyData.B156b1.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">告警状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B156b2 ? device171C.energyData.B156b2.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">充满状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B156b3 ? device171C.energyData.B156b3.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">放空状态</text><text class="item-value">{{ device171C &&
                    device171C.energyData && device171C.energyData.B156b4 ? device171C.energyData.B156b4.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">系统告警状态</text><text class="item-value">{{ device171C
                    &&
                    device171C.energyData && device171C.energyData.B158 ? device171C.energyData.B158.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">禁充/禁放解除条件</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B160 ? device171C.energyData.B160.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">禁充/禁放解除时间</text><text class="item-value">{{
                    device171C &&
                      device171C.energyData && device171C.energyData.B162 ? device171C.energyData.B162.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大允许充电电流(A)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B164 ? device171C.energyData.B164.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大允许放电电流(A)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B166 ? device171C.energyData.B166.value : "--"
                  }}</text></view>
                  <view class="grid-item"><text class="item-label">最大充电功率(kW)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B168 ?
                      this.formatValue(device171C.energyData.B168.value, 2) : "--" }}</text></view>
                  <view class="grid-item"><text class="item-label">最大放电功率(kW)</text><text class="item-value">{{
                    device171C
                      && device171C.energyData && device171C.energyData.B170 ?
                      this.formatValue(device171C.energyData.B170.value, 2) : "--" }}</text></view>

                </view>
              </view>

              <!-- 底部独立分组：告警状态 -->
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
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { realtimeDataProvider } from '@/service/websocket';
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'

export default {
  components: { DyNavbar },
  data() {
    return {
      activeTab: 0,
      tabs: ['PCS', '储能DC', '光伏', 'BMS'],
      deviceList: [],
      dataRefreshTimer: null,
      platformClass: ''
    };
  },
  watch: {
    '$store.state.currentSelectDevice': {
      handler() {
        this.initDeviceList();
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    device171B() {
      return this.deviceList.find(item => item.deviceType === '171B');
    },
    device171C() {
      return this.deviceList.find(item => item.deviceType === '171C');
    },
    device171D() {
      return this.deviceList.find(item => item.deviceType === '171D');
    },
    device171E() {
      return this.deviceList.find(item => item.deviceType === '171E');
    },
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
        '交流侧接线错误': '#FF4D4F',
        '孤岛告警': '#FAAD14',
        '内部母线过温': '#FF4D4F',
        '交流侧欠压': '#FAAD14',
        '交流侧过压': '#FAAD14',
        '直流侧过温': '#FF4D4F',
        '直流侧欠压': '#FAAD14',
        '熔丝故障': '#FF4D4F',
        'U1过流保护': '#FF4D4F',
        '风扇故障': '#FF4D4F',
        'CAN通信故障': '#FF4D4F',
        '模块不均流': '#FAAD14',
        '地址重复': '#FF4D4F',
        '励磁故障': '#FF4D4F',
        '模块限功率': '#FAAD14',
        '温度限功率': '#FAAD14',
        '交流限功率': '#FAAD14',
        '交流侧欠压': '#FAAD14',
        '交流侧过压': '#FAAD14',
        '直流侧短路': '#FF4D4F',
        '散热器过温': '#FF4D4F',
        '模块过温': '#FF4D4F',
        '环境过温': '#FF4D4F'
      };

      return b64Value.split('; ').map(item => {
        const [name, value] = item.split(':');
        const isError = value === '告警';
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
        { key: 'B47b1', name: 'BuckBoost 软启故障' },
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
        { key: 'B49b6', name: 'DC 机型配置错误' },
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
        { key: 'B0b0', name: '组端过压1级告警' },
        { key: 'B0b1', name: '组端过压2级告警' },
        { key: 'B0b2', name: '组端过压3级告警' },
        { key: 'B0b3', name: '组端欠压1级告警' },
        { key: 'B0b4', name: '组端欠压2级告警' },
        { key: 'B0b5', name: '组端欠压3级告警' },
        { key: 'B0b6', name: '组端放电过流1级告警' },
        { key: 'B0b7', name: '组端放电过流2级告警' },
        { key: 'B1b0', name: '组端放电过流3级告警' },
        { key: 'B1b1', name: '组端充电过流1级告警' },
        { key: 'B1b2', name: '组端充电过流2级告警' },
        { key: 'B1b3', name: '组端充电过流3级告警' },
        { key: 'B1b4', name: '组端温度1级告警' },
        { key: 'B1b5', name: '组端温度2级告警' },
        { key: 'B1b6', name: '组端温度3级告警' },
        { key: 'B1b7', name: '单体电池充电过温1级告警' },
        { key: 'B2b0', name: '单体电池充电过温2级告警' },
        { key: 'B2b1', name: '单体电池充电过温3级告警' },
        { key: 'B2b2', name: '单体电池充电欠温1级告警' },
        { key: 'B2b3', name: '单体电池充电欠温2级告警' },
        { key: 'B2b4', name: '单体电池充电欠温3级告警' },
        { key: 'B2b5', name: '单体电压过压1级告警' },
        { key: 'B2b6', name: '单体电压过压2级告警' },
        { key: 'B2b7', name: '单体电压过压3级告警' },
        { key: 'B3b0', name: '单体电压欠压1级告警' },
        { key: 'B3b1', name: '单体电压欠压2级告警' },
        { key: 'B3b2', name: '单体电压欠压3级告警' },
        { key: 'B3b3', name: '单体压差过高1级告警' },
        { key: 'B3b4', name: '单体压差过高2级告警' },
        { key: 'B3b5', name: '单体压差过高3级告警' },
        { key: 'B3b6', name: '单体温差过高1级告警' },
        { key: 'B3b7', name: '单体温差过高2级告警' },
        { key: 'B4b0', name: '单体温差过高3级告警' },
        { key: 'B4b1', name: 'SOC过低1级告警' },
        { key: 'B4b2', name: 'SOC过低2级告警' },
        { key: 'B4b3', name: 'SOC过低3级告警' },
        { key: 'B4b4', name: '动力母线温度过高1级告警' },
        { key: 'B4b5', name: '动力母线温度过高2级告警' },
        { key: 'B4b6', name: '动力母线温度过高3级告警' },
        { key: 'B4b7', name: '电池模组过压1级告警' },
        { key: 'B5b0', name: '电池模组过压2级告警' },
        { key: 'B5b1', name: '电池模组过压3级告警' },
        { key: 'B5b2', name: '电池模组欠压1级告警' },
        { key: 'B5b3', name: '电池模组欠压2级告警' },
        { key: 'B5b4', name: '电池模组欠压3级告警' },
        { key: 'B5b5', name: 'DI1故障' },
        { key: 'B5b6', name: 'DI2故障' },
        { key: 'B5b7', name: 'DI3故障' },
        { key: 'B6b0', name: 'DI4故障' },
        { key: 'B6b1', name: 'DI5故障' },
        { key: 'B6b2', name: 'DI6故障' },
        { key: 'B6b3', name: 'DI7故障' },
        { key: 'B6b4', name: 'DI8故障' },
        { key: 'B6b5', name: '内网通信故障' },
        { key: 'B6b6', name: '单体电压采集异常' },
        { key: 'B6b7', name: '单体温度采集异常' },
        { key: 'B7b0', name: '绝缘检测故障' },
        { key: 'B7b1', name: '组内压差大' },
        { key: 'B7b2', name: '组内线路故障' },
        { key: 'B7b3', name: '电池熔断故障' },
        { key: 'B7b4', name: '项目固件版本参数不一致' },
        { key: 'B7b5', name: '非CAN通信故障' },
        { key: 'B7b6', name: 'PC保护调试模式' },
        { key: 'B7b7', name: 'CAN总线传感器故障' },
        { key: 'B8b0', name: 'CAN总线传感器通信故障' },
        { key: 'B8b1', name: '硬件自检异常' },
        { key: 'B8b2', name: '单体电压断线故障' },
        { key: 'B8b3', name: '校准故障' },
        { key: 'B8b4', name: 'EMS通信故障' },
        { key: 'B8b5', name: '与三级BMS通信故障' },
        { key: 'B8b6', name: '单体电池放电过温1级告警' },
        { key: 'B8b7', name: '单体电池放电过温2级告警' },
        { key: 'B9b0', name: '单体电池放电过温3级告警' },
        { key: 'B9b1', name: '单体电池放电欠温1级告警' },
        { key: 'B9b2', name: '单体电池放电欠温2级告警' },
        { key: 'B9b3', name: '单体电池放电欠温3级告警' },
        { key: 'B9b4', name: 'SOC过高1级告警' },
        { key: 'B9b5', name: 'SOC过高2级告警' },
        { key: 'B9b6', name: 'SOC过高3级告警' },
        { key: 'B9b7', name: '温升过快1级告警' },
        { key: 'B10b0', name: '温升过快2级告警' },
        { key: 'B10b1', name: '温升过快3级告警' }
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
  methods: {
    switchTab(index) {
      this.activeTab = index;
    },
    onSwiperChange(e) {
      this.activeTab = e.detail.current;
    },
    formatValue(value, decimals) {
      if (value === null || value === undefined || value === '--') return '--';
      return Number(value).toFixed(decimals);
    },
    initDeviceList() {
      const currentDevice = this.$store.state.currentSelectDevice || {};
      const deviceList = [];
      if (currentDevice.list && Array.isArray(currentDevice.list)) {
        const deviceTypes = ['171B', '171C', '171D', '171E'];
        deviceTypes.forEach(deviceType => {
          const foundDevice = currentDevice.list.find(item =>
            item.typeCode === deviceType || item.deviceType === deviceType || item.description?.includes(deviceType)
          );
          if (foundDevice) {
            deviceList.push({
              deviceType: deviceType,
              typeCode: deviceType,
              address: foundDevice.address || '',
              barCode: foundDevice.barCode || foundDevice.homeBarCode || '',
              deviceId: foundDevice.deviceId || `${deviceType}001`,
              name: foundDevice.name || `设备${deviceType}`
            });
          }
        });
      }
      if (deviceList.length === 0) {
        const defaultDevices = [
          { deviceType: '171B', typeCode: '171B', address: '01', barCode: '', deviceId: '171B001', name: 'DCDC设备' },
          { deviceType: '171C', typeCode: '171C', address: '01', barCode: '', deviceId: '171C001', name: '设备171C' },
          { deviceType: '171D', typeCode: '171D', address: '1E', barCode: '', deviceId: '171D001', name: '设备171D' },
          { deviceType: '171E', typeCode: '171E', address: '06', barCode: '', deviceId: '171E001', name: '设备171E' }
        ];
        deviceList.push(...defaultDevices);
      }
      realtimeDataProvider.initDeviceList(deviceList);
      this.deviceList = realtimeDataProvider.getDeviceList();
    },
    refreshDeviceData() {
      this.deviceList = realtimeDataProvider.getDeviceList();
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform';
      },
    });
  },
  mounted() {
    this.initDeviceList();
    this.dataRefreshTimer = setInterval(() => {
      this.refreshDeviceData();
    }, 2000);
  },
  beforeUnmount() {
    if (this.dataRefreshTimer) {
      clearInterval(this.dataRefreshTimer);
      this.dataRefreshTimer = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;

  .fixed-placeholder {
    height: calc(25px + 20px + 44px);
  }

  &.android-platform {
    .fixed-placeholder {
      height: calc(25px + 20px + 44px);
      background: #fff;
    }
  }

  &.ios-platform {
    .fixed-placeholder {
      height: calc(44px);
      background: #fff;
    }
  }

}



.navbar-placeholder {
  height: 44px;
  flex-shrink: 0;
}

.tab-container {
  flex-shrink: 0;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
  // margin-top: 44px;
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
  padding: 20rpx 20rpx;
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

.content-swiper {
  flex: 1;
  touch-action: pan-y;
}

.swiper-item {
  height: 100%;
}

.module-scroll {
  height: 100%;
  touch-action: pan-y;
}

.content {
  padding: 20rpx;
}

.module {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
}

.module-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 10rpx;
  border-bottom: 1px solid #e5e5e5;
}

.data-group {
  margin-bottom: 24rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #666;
  margin-bottom: 16rpx;
}

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

  &:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }

  &:nth-child(3n) {
    border-right: none;
  }
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

.status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.status-item {
  width: calc(33.333% - 12rpx);
  padding: 16rpx 2rpx;
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

  &.error {
    color: #FF4D4F;
  }
}

.fault-item {
  width: calc(33.333% - 12rpx);
  padding: 16rpx 2rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fault-name {
  font-size: 24rpx;
  color: #999;
  text-align: center;

  &.active {
    color: #FF4D4F;
    font-weight: 600;
  }
}

.status-empty {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 28rpx;
  padding: 40rpx 0;
}
</style>