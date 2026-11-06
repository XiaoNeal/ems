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
            <!-- 50kW 微能站：PCS 使用 1707_V3_5 模型 -->
            <view v-if="isHighCapacity" class="module">
              <view class="module-title">PCS</view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">设备状态</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.deviceStatus" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">交流侧</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.ac" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}{{ field.unit ? ' ' + field.unit : '' }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">直流侧</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.dc" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}{{ field.unit ? ' ' + field.unit : '' }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">温度测点</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.temperature" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}{{ field.unit ? ' ' + field.unit : '' }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">累计电量（电度统计）</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.energyTotal" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}{{ field.unit ? ' ' + field.unit : '' }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">版本与通讯</view>
                <view class="data-grid">
                  <view v-for="field in pcs1707Fields.versionComm" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}{{ field.unit ? ' ' + field.unit : '' }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device1707" class="data-group">
                <view class="group-title">故障信息</view>
                <view class="status-grid">
                  <view v-for="fault in pcs1707Fields.faults" :key="fault.key" class="fault-item">
                    <text class="fault-name" :class="{ active: fault.isFault }">{{ fault.name }}</text>
                  </view>
                </view>
              </view>

              <text v-if="!device1707" class="status-empty">未检测到PCS设备（1707_V3_5）</text>
            </view>

            <view v-if="!isHighCapacity" class="module">
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
            <!-- 50kW 微能站：储能DC 使用 170C_V1_1 模型（地址1E） -->
            <view v-if="isHighCapacity" class="module">
              <view class="module-title">储能DC</view>

              <view v-if="device170CStorage" class="data-group">
                <view class="group-title">运行参数</view>
                <view class="data-grid">
                  <view v-for="field in storage170C.fields.energy" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device170CStorage" class="data-group">
                <view class="group-title">状态参数</view>
                <view class="data-grid">
                  <view v-for="field in storage170C.fields.state" :key="field.key"
                    :class="['grid-item', { 'state-grid-item': field.states && field.states.length > 1 }]">
                    <text class="item-label">{{ field.name }}</text>
                    <view class="item-value">
                      <template v-if="field.states && field.states.length > 1">
                        <text v-for="(st, si) in field.states" :key="si"
                          :class="['state-badge', stateBadgeClass(st)]">{{ st }}</text>
                      </template>
                      <template v-else>{{ field.value }}</template>
                    </view>
                  </view>
                </view>
              </view>

              <view v-if="device170CStorage" class="data-group">
                <view class="group-title">储能DC故障信息</view>
                <view class="status-grid">
                  <view v-for="fault in storage170C.faults" :key="fault.code" class="fault-item">
                    <text class="fault-name" :class="{ active: fault.isAlarm }">{{ fault.name }}</text>
                  </view>
                </view>
              </view>

              <text v-if="!device170CStorage" class="status-empty">未检测到储能DC设备（170C_V1_1 / 地址1E）</text>
            </view>

            <view v-if="!isHighCapacity" class="module">
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
            <!-- 50kW 微能站：光伏DC 使用 170C_V1_1 模型（地址06） -->
            <view v-if="isHighCapacity" class="module">
              <view class="module-title">光伏DC</view>

              <view v-if="device170CPv" class="data-group">
                <view class="group-title">运行参数</view>
                <view class="data-grid">
                  <view v-for="field in pv170C.fields.energy" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device170CPv" class="data-group">
                <view class="group-title">状态参数</view>
                <view class="data-grid">
                  <view v-for="field in pv170C.fields.state" :key="field.key"
                    :class="['grid-item', { 'state-grid-item': field.states && field.states.length > 1 }]">
                    <text class="item-label">{{ field.name }}</text>
                    <view class="item-value">
                      <template v-if="field.states && field.states.length > 1">
                        <text v-for="(st, si) in field.states" :key="si"
                          :class="['state-badge', stateBadgeClass(st)]">{{ st }}</text>
                      </template>
                      <template v-else>{{ field.value }}</template>
                    </view>
                  </view>
                </view>
              </view>

              <view v-if="device170CPv" class="data-group">
                <view class="group-title">光伏DC故障信息</view>
                <view class="status-grid">
                  <view v-for="fault in pv170C.faults" :key="fault.code" class="fault-item">
                    <text class="fault-name" :class="{ active: fault.isAlarm }">{{ fault.name }}</text>
                  </view>
                </view>
              </view>

              <text v-if="!device170CPv" class="status-empty">未检测到光伏DC设备（170C_V1_1 / 地址06）</text>
            </view>

            <view v-if="!isHighCapacity" class="module">
              <view class="module-title">光伏DC</view>

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
            <!-- 50kW 微能站：BMS 使用 171C_V2 模型 -->
            <view v-if="isHighCapacity" class="module">
              <view class="module-title">BMS</view>

              <view v-for="group in bmsInfoGroups" :key="group.key" class="data-group">
                <view class="group-title">{{ group.title }}</view>
                <view class="data-grid">
                  <view v-for="item in group.items" :key="item.key" class="grid-item">
                    <text class="item-label">{{ item.label }}</text>
                    <text class="item-value">{{ item.value }}</text>
                  </view>
                </view>
              </view>

              <view class="data-group">
                <view class="group-title">故障信息</view>
                <view v-for="group in bmsFaultFields" :key="group.key" class="fault-word">
                  <view class="fault-word-title">{{ group.title }}</view>
                  <view class="status-grid">
                    <view v-for="item in group.items" :key="item.key" class="fault-item">
                      <text class="fault-name" :class="{ active: item.active }">{{ item.name }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <view v-if="!isHighCapacity" class="module">
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
                    <text class="item-value">{{
                      this.formatInsulationValue(device171C && device171C.energyData && device171C.energyData.B22 ?
                        device171C.energyData.B22.value : null, 1000) }}</text>
                  </view>
                  <view class="grid-item">
                    <text class="item-label">绝缘电阻R-(MΩ)</text>
                    <text class="item-value">{{
                      this.formatInsulationValue(device171C && device171C.energyData && device171C.energyData.B24 ?
                        device171C.energyData.B24.value : null, 1000) }}</text>
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

      <!-- 液冷机 Tab（仅 50kW 微能站显示） -->
      <swiper-item v-if="isHighCapacity">
        <scroll-view class="module-scroll" scroll-y="true">
          <view class="content">
            <view class="module">
              <view class="module-title">液冷机</view>

              <view v-if="device0318" class="data-group">
                <view class="group-title">运行状态</view>
                <view class="data-grid">
                  <view v-for="field in liquidCoolingFields.status" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device0318" class="data-group">
                <view class="group-title">设备信息</view>
                <view class="data-grid">
                  <view v-for="field in liquidCoolingFields.info" :key="field.key" class="grid-item">
                    <text class="item-label">{{ field.name }}</text>
                    <text class="item-value">{{ field.value }}</text>
                  </view>
                </view>
              </view>

              <view v-if="device0318" class="data-group">
                <view class="group-title">故障信息</view>
                <view v-for="group in liquidCoolingFields.faultGroups" :key="group.title" class="fault-word">
                  <view class="fault-word-title">{{ group.title }}</view>
                  <view class="status-grid">
                    <view v-for="field in group.items" :key="field.key" class="fault-item">
                      <text class="fault-name" :class="{ active: field.isFault }">{{ field.name }}</text>
                    </view>
                  </view>
                </view>
              </view>

              <text v-if="!device0318" class="status-empty">未检测到液冷机设备（0318_V2_3）</text>
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
import { DeviceFactory } from '@/service/devices/device-factory.model';
import { errorCodeEnum as storage170CFaultEnum } from '@/service/devices/170C_V1_1-model.js';

// 50kW 下从 储能DC/光伏DC Tab 迁移到"参数设置"的 170C 字段（按数据来源分组）
const MOVED_170C_ENERGY_KEYS = [
  'BATSetVoltage', 'maxChargeCurrent', 'maxDischargeCurrent', 'BUSSetVoltage', 'BUSSetCurrent',
  'sagVoltageCoefficient', 'maxPowerLimit',
  'BATUndervoltagePoint', 'BATOvervoltagePoint', 'BUSUndervoltagePoint', 'BUSOvervoltagePoint',
  'BATChargeCurrentPoint', 'BATDishargeCurrentPoint', 'BUSChargeCurrentPoint', 'BUSDishargeCurrentPoint',
  // BATVoltage/BUSVoltage 为实时显示值，保留在监控页展示，不再移入参数设置
  // 'BATVoltage', 'BUSVoltage'
];
const MOVED_170C_STATE_KEYS = ['startOrder', 'moduleMode', 'workMode', 'moduleShareCurrent'];

// 50kW 下从 PCS 板块迁移到"参数设置-PCS"的 1707_V3_5 字段（按数据来源分组）
const MOVED_PCS_ENERGY_KEYS = [
  'Fault_reset', 'Device_Start', 'Device_Shutdown', 'Remote_E_Stop',
  'Reset_Charge_Energy', 'Reset_Discharge_Energy', 'Remote_Local_Setting', 'Device_Standby',
  'External_Switch'
];
const MOVED_PCS_STATE_KEYS = [
  'operating_mode',
  'Constant_Voltage_Charge_Voltage_Setpoint', 'Constant_Current_Charge_Current_Setpoint',
  'Constant_Power_Active_Power_Target', 'Constant_Power_Reactive_Power_Target',
  'Grid_Connected_Off_Grid_Setting', 'Off_Grid_Output_Voltage_Setpoint', 'Off_Grid_Output_Frequency_Setpoint',
  'Phase_Controlled_A_Phase_Active_Power', 'Phase_Controlled_B_Phase_Active_Power', 'Phase_Controlled_C_Phase_Active_Power',
  'Phase_Controlled_A_Phase_Reactive_Power', 'Phase_Controlled_B_Phase_Reactive_Power', 'Phase_Controlled_C_Phase_Reactive_Power',
  'Off_Grid_Output_Voltage_Phase_A_Setpoint', 'Off_Grid_Output_Voltage_Phase_B_Setpoint', 'Off_Grid_Output_Voltage_Phase_C_Setpoint',
  'Microgrid_DC_Voltage_Droop_Coefficient', 'Primary_Frequency_Regulation_Frequency_Deadband', 'Primary_Frequency_Regulation_K_Value',
  'VSG_Frequency_Droop_Coefficient', 'VSG_Voltage_Droop_Coefficient', 'Switch_Operation_Mode',
  'Battery_Overcapacity_Allowed_Charge_Voltage', 'Battery_Overcapacity_Allowed_Discharge_Voltage',
  'Battery_Overcapacity_Allowed_Charge_Current', 'Battery_Overcapacity_Allowed_Discharge_Current',
  'Second', 'Minute', 'Hour', 'Day', 'Month', 'Year',
  'Enclosure_Fan_Start_Temperature', 'Enclosure_Fan_Start_Time', 'Enclosure_Fan_Stop_Temperature',
  'Enclosure_Fan_Stop_Time', 'Enclosure_Fan_Forced_Start_Command'
];

// 《液冷机数据分类》：运行状态字段（电平信号/机组运行状态/输出位）
const LIQUID_STATUS_KEYS = [
  'B38b1', 'B38b2', 'B39b0', 'B39b2', 'B39b5', 'B39b6',
  'unitRunStatus',
  'B41b3', 'B41b5', 'B41b6', 'B41b7'
];
// 《液冷机数据分类》：设备信息字段（温度/压力/转速/故障代码/累计运行）
const LIQUID_INFO_KEYS = [
  'supplyLiquidTemp', 'returnLiquidTemp', 'systemEvapInlet', 'evapOutletTemp',
  'envTemp', 'systemCondensing', 'expansionValveOpening', 'pumpSpeed',
  'compressorSpeed', 'fanSpeed', 'supplyPressure', 'returnPressure', 'dischargePressure',
  'inverterFaultCode', 'systemFaultLevel', 'systemFaultCode', 'pfcFaultCode',
  'inverterOutputPower',
  'pumpRunHours', 'pumpRunWeeks', 'heatingRunHours', 'heatingRunWeeks',
  'compressorRunHours', 'compressorRunWeeks', 'fanRunHours', 'fanRunWeeks'
];
// 《液冷机数据分类》：故障字字节 + 有效位数（B86~B95 依次为故障字1~10）
const LIQUID_FAULT_BYTES = [
  [86, 8], [87, 8], [88, 4], [89, 8], [90, 2],
  [91, 8], [92, 8], [93, 8], [94, 7], [95, 8]
];

// 50kW PCS 展示分组（依据《PCS数据页面调整》文档的数据分类）
// 设备状态：0/1 按文档映射为文案
const PCS1707_STATUS_KEYS = [
  'Shutdown_Status', 'Standby_Status', 'Operation_Status',
  'Total_Fault_Status', 'Total_Alarm_Status', 'Remote_Local_Status',
  'E_Stop_Input_Status', 'Grid_Connected_Status', 'VF_Off_Grid_Status',
  'Overload_Derating', 'BMS_Dry_Contact_Input'
];
// ⚠ 位状态的 0 是「有效读数」而不是「没有数据」：0 一律给反向文案，
//   只有模型层未收到帧（value 为 '--'/undefined）才显示 '--'，
//   避免待机/运行/总故障/并网等 10 项与「无数据」混淆（与直连设备页 PCS_STATUS 口径一致）。
const PCS1707_STATUS_VALUE_MAP = {
  Shutdown_Status: { '0': '未停机', '1': '停机' },
  Standby_Status: { '0': '未待机', '1': '待机' },
  Operation_Status: { '0': '未运行', '1': '运行' },
  Total_Fault_Status: { '0': '无故障', '1': '故障' },
  Total_Alarm_Status: { '0': '无告警', '1': '告警' },
  Remote_Local_Status: { '0': '本地', '1': '远程' },
  E_Stop_Input_Status: { '0': '未触发', '1': '已触发' },
  Grid_Connected_Status: { '0': '离网', '1': '并网' },
  VF_Off_Grid_Status: { '0': '未启用', '1': 'VF 离网' },
  Overload_Derating: { '0': '未过载', '1': '过载降容' },
  BMS_Dry_Contact_Input: { '0': '未动作', '1': '故障有效' }
};
// 交流侧：电压/电流/频率/有功/无功/视在功率/功率因数
const PCS1707_AC_KEYS = [
  'PCS_Port_A_Voltage', 'PCS_Port_B_Voltage', 'PCS_Port_C_Voltage',
  'PCS_Output_A_Current', 'PCS_Output_B_Current', 'PCS_Output_C_Current',
  'N_Phase_RMS_Current', 'Grid_Frequency',
  'PCS_A_Active_Power', 'PCS_B_Active_Power', 'PCS_C_Active_Power', 'PCS_Total_Active_Power',
  'PCS_A_Reactive_Power', 'PCS_B_Reactive_Power', 'PCS_C_Reactive_Power', 'PCS_Total_Reactive_Power',
  'PCS_A_Apparent_Power', 'PCS_B_Apparent_Power', 'PCS_C_Apparent_Power', 'PCS_Total_Apparent_Power',
  'PCS_A_Power_Factor', 'PCS_B_Power_Factor', 'PCS_C_Power_Factor', 'PCS_Total_Power_Factor'
];
// 直流侧：输入功率/电压/电流
const PCS1707_DC_KEYS = ['PCS_Input_Power', 'PCS_Input_Voltage', 'PCS_Input_Current'];
// 温度测点：散热器/SOC/IGBT 1-1 ~ 4-2
const PCS1707_TEMP_KEYS = [
  'PCS_Cooler_Temp', 'On_Chip_SOC_Temperature',
  'IGBT_Temperature_1_1', 'IGBT_Temperature_1_2',
  'IGBT_Temperature_2_1', 'IGBT_Temperature_2_2',
  'IGBT_Temperature_3_1', 'IGBT_Temperature_3_2',
  'IGBT_Temperature_4_1', 'IGBT_Temperature_4_2'
];
// 累计电量（电度统计）
const PCS1707_ENERGY_KEYS = [
  'PCS_AC_Charge_Energy', 'PCS_AC_Discharge_Energy',
  'PCS_DC_Charge_Energy', 'PCS_DC_Discharge_Energy'
];
// 版本与通讯（系统时钟单独合并后追加在末尾）
const PCS1707_VERSION_KEYS = [
  'PCS_Communication_Status', 'PCS_Program_Version', 'FPGA_Program_Version',
  'PCS_Status_Code_1', 'PCS_Status_Code_2', 'PCS_Status_Code_3', 'PCS_Status_Code_4',
  'PCS_Status_Code_5', 'PCS_Status_Code_6', 'PCS_Status_Code_7', 'PCS_Status_Code_8'
];
const PCS1707_CLOCK_KEYS = [
  'System_Clock_Year', 'System_Clock_Month', 'System_Clock_Day',
  'System_Clock_Hour', 'System_Clock_Min', 'System_Clock_Sec'
];

// 171C_V2（V2.0）BMS 能源数据中的「故障字」字段地址（每字 16 位故障标志）
const BMS_FAULT_WORD_KEYS = [
  'B78', 'B80', 'B82', 'B84', 'B86', 'B88',
  'B90', 'B92', 'B94', 'B96', 'B98', 'B100'
];
// 各故障字 bit0~bit15 的中文故障名（空串表示协议中该位预留）
const BMS_FAULT_WORD_BITS = {
  B78: ['单体过压1级', '单体欠压1级', '单体压差1级', '总压过压1级', '总压欠压1级', '总压压差1级', '放电过流1级', '充电过流1级', '放电高温1级', '充电高温1级', '放电低温1级', '充电低温1级', '温差1级', '绝缘阻值低1级', 'T1高温1级', 'T2高温1级'],
  B80: ['T3高温1级', 'T4高温1级', 'T5高温1级', '极柱高温1级', '电流异常1级', '供电电压异常1级', '电压排线脱落1级', '温感排线脱落1级', 'soc低1级', 'T6高温1级', '', '', '', '', '', ''],
  B82: ['单体过压2级', '单体欠压2级', '单体压差2级', '总压过压2级', '总压欠压2级', '总压压差2级', '放电过流2级', '充电过流2级', '放电高温2级', '充电高温2级', '放电低温2级', '充电低温2级', '温差2级', '绝缘阻值低2级', 'T1高温2级', 'T2高温2级'],
  B84: ['T3高温2级', 'T4高温2级', 'T5高温2级', '极柱高温2级', '电流异常2级', '供电电压异常2级', '电压排线脱落2级', '温感排线脱落2级', 'soc低2级', 'T6高温2级', '', '', '', '', '', ''],
  B86: ['单体过压3级', '单体欠压3级', '单体压差3级', '总压过压3级', '总压欠压3级', '总压压差3级', '放电过流3级', '充电过流3级', '放电高温3级', '充电高温3级', '放电低温3级', '充电低温3级', '温差3级', '绝缘阻值低3级', 'T1高温3级', 'T2高温3级'],
  B88: ['T3高温3级', 'T4高温3级', 'T5高温3级', '极柱高温3级', '电流异常3级', '供电电压异常3级', '电压排线脱落3级', '温感排线脱落3级', 'soc低3级', 'T6高温3级', '', '', '', '', '', ''],
  B90: ['单体过压4级', '单体欠压4级', '单体压差4级', '总压过压4级', '总压欠压4级', '总压压差4级', '放电过流4级', '充电过流4级', '放电高温4级', '充电高温4级', '放电低温4级', '充电低温4级', '温差4级', '绝缘阻值低4级', 'T1高温4级', 'T2高温4级'],
  B92: ['T3高温4级', 'T4高温4级', 'T5高温4级', '极柱高温4级', '电流异常4级', '供电电压异常4级', '电压排线脱落4级', '温感排线脱落4级', 'soc低4级', 'T6高温4级', '', '', '', '', '', ''],
  B94: ['BCU硬件故障', 'BMU硬件故障', 'EMS通信故障', '从机通信故障', '空调/TMS通信故障', 'PCS通信故障', '消防通信故障', '除湿机通信故障', '充电机通信故障', 'DCDC通信故障', '', '', '', '', '', ''],
  B96: ['总断继电器故障标志位', '熔断器异常', '断路器异常', '预充故障', '热失控故障', '加热故障', '急停故障', '水浸故障', '门禁故障', '消防一级（火警）', '消防二级（消防故障）', '消防二级（消防触发）', '气溶胶故障', '', '', ''],
  B98: ['总正继电器粘连', '总正继电器开路', '总负继电器粘连', '总负继电器开路', '充电继电器粘连', '充电继电器开路', '放电继电器粘连', '放电继电器开路', '充电负继电器粘连', '充电负继电器开路', '风扇继电器粘连', '风扇继电器开路', '加热继电器粘连', '加热继电器开路', '预留继电器粘连', '预留继电器开路'],
  B100: ['总断继电器故障标志位', '总故障标志位（任意故障）', '', '', '', '', '', '', '', '', '', '本次重启原因-看门狗复位', '本次重启原因-软件复位', '本次重启原因-上电复位', '本次重启原因-时钟异常复位', '本次重启原因-未知复位']
};

// 50kW BMS《电池簇信息记录》栏目：PACK 展开字段与消防字段
const BMS_PACK_KEYS = [
  'B114', 'B170', 'B172',
  'B176', 'B180', 'B178', 'B179', 'B182', 'B184', 'B188', 'B186', 'B190',
  'B192', 'B196', 'B194', 'B195', 'B198', 'B200', 'B204', 'B202', 'B206',
  'B208', 'B210', 'B212', 'B211', 'B214', 'B216', 'B220', 'B218', 'B222'
];
const BMS_FIRE_KEYS = ['B2b0'];
// group/key 指向 171C_V2（V2.0）模型字段：device=deviceData、energy=energyData、state=stateData；
// group 为 null 表示现有模型暂无可匹配字段，先占位展示 '--'；带 expand 的分组按 keys 顺序展开指定 store
const BMS_INFO_GROUPS = [
  {
    key: 'environment', title: '环境数据', items: [
      { label: '温度(℃)', group: 'env131', key: 'temperature' },
      { label: '湿度(%RH)', group: 'env131', key: 'humidness' }
    ]
  },
  {
    key: 'deviceStatus', title: '设备状态', items: [
      { label: '总正继电器', group: 'state', key: 'B0b0' },
      { label: '总负继电器', group: 'state', key: 'B0b1' },
      { label: '断路器脱扣控制', group: 'state', key: 'B0b2' },
      { label: '预充继电器控制', group: 'state', key: 'B0b3' },
      { label: '绿灯', group: 'state', key: 'B0b4' },
      { label: '红灯', group: 'state', key: 'B0b5' },
      { label: '从机唤醒', group: 'state', key: 'B0b7' },
      { label: '三级故障输出', group: 'state', key: 'B1b4' },
      { label: '水浸（常开）', group: 'state', key: 'B2b1' },
      { label: '总正辅助触点检{DIS1 (SWDi1)}', group: 'state', key: 'B3b5' },
      { label: '总负辅助触点检{DIS2 (SWDi2)}', group: 'state', key: 'B3b6' },
      { label: '断路器辅助点检{DIS3 (SWDi3)}', group: 'state', key: 'B3b7' },
      { label: '告警状态', group: 'energy', key: 'B1b0' },
      { label: '充放电状态', group: 'energy', key: 'B1b2' },
      { label: 'BMS运行状态', group: 'energy', key: 'B1b4' },
      { label: '接触器状态（充电连接）', group: 'energy', key: 'B0b0' },
      { label: '预充状态', group: 'energy', key: 'B47b0' },
      { label: '均衡状态', group: 'energy', key: 'B47b2' },
      { label: '高压低锁定状态', group: 'energy', key: 'B47b5' },
      { label: '准备状态', group: 'energy', key: 'B47b6' },
      { label: 'BMS模式', group: 'energy', key: 'B47b7' },
      { label: '自检状态', group: 'energy', key: 'B50' },
      { label: '总正继电器状态', group: 'energy', key: 'B53b0' },
      { label: '总负继电器状态', group: 'energy', key: 'B53b1' },
      { label: '预充继电器状态', group: 'energy', key: 'B53b2' },
      { label: '断路器状态', group: 'energy', key: 'B53b3' },
      { label: '总正继电器故障状态', group: 'energy', key: 'B55b0' },
      { label: '总负继电器故障状态', group: 'energy', key: 'B55b2' },
      { label: '预充继电器故障状态', group: 'energy', key: 'B55b4' },
      { label: '断路器故障状态', group: 'energy', key: 'B55b6' }
    ]
  },
  {
    key: 'sysInfo', title: '设备信息', items: [
      { label: 'SOC(%)', group: 'energy', key: 'B32' },
      { label: 'SOH(%)', group: 'energy', key: 'B112' },
      { label: '充电最大电压(V)', group: 'energy', key: 'B2' },
      { label: '最大放电电流(A)', group: 'energy', key: 'B4' },
      { label: '放电最小电压(V)', group: 'energy', key: 'B6' },
      { label: '最大充电电流(A)', group: 'energy', key: 'B8' },
      { label: '总电压(V)', group: 'energy', key: 'B10' },
      { label: '总电流(A)', group: 'energy', key: 'B12' },
      { label: '正极绝缘阻值(kΩ)', group: 'energy', key: 'B36' },
      { label: '负极绝缘阻值(kΩ)', group: 'energy', key: 'B38' },
      { label: 'HV1电压(V)', group: 'energy', key: 'B40' },
      { label: 'HV2电压(V)', group: 'energy', key: 'B42' },
      { label: 'BAT+电压(V)', group: 'energy', key: 'B44' },
      { label: '电池累计电压(V)', group: 'energy', key: 'B48' },
      { label: '分流器电流(A)', group: 'energy', key: 'B56' },
      { label: '累计使用时间(min)', group: 'energy', key: 'B130' },
      { label: '累计循环次数', group: 'energy', key: 'B128' },
      { label: '累计充电电量(kWh)', group: 'energy', key: 'B124' },
      { label: '累积充电时间(min)', group: 'energy', key: 'B138' },
      { label: '累计放电电量(kWh)', group: 'energy', key: 'B120' },
      { label: '累积放电时间(min)', group: 'energy', key: 'B134' },
      { label: '单次放电累计电量(kWh)', group: 'energy', key: 'B116' },
      { label: '单次充电累计电量(kWh)', group: 'energy', key: 'B118' },
      { label: 'BMS运行状态', group: 'energy', key: 'B1b4' }
    ]
  },
  {
    key: 'sysConfig', title: '系统配置', items: [
      { label: '标称容量(Ah)', group: 'state', key: 'B72' },
      { label: '额定电压(V)', group: 'state', key: 'B70' },
      { label: '电池串数', group: 'state', key: 'B74' },
      { label: '温感数量', group: 'state', key: 'B76' },
      { label: '从机（pack）数量', group: 'state', key: 'B78' },
      { label: '极柱温感数', group: 'state', key: 'B80' }
    ]
  },
  {
    key: 'pack', title: 'PACK信息', expand: { store: 'energy', keys: BMS_PACK_KEYS }, items: []
  },
  {
    key: 'extreme', title: '单体信息', items: [
      { label: '电池平均电压(mV)', group: 'energy', key: 'B14' },
      { label: '电池平均温度(℃)', group: 'energy', key: 'B27' },
      { label: '本次上电累计最大单体位置', group: 'energy', key: 'B72' },
      { label: '本次上电累计最大单体值(mV)', group: 'energy', key: 'B70' },
      { label: '最大电压电池位置', group: 'energy', key: 'B20' },
      { label: '最高单体电压(mV)', group: 'energy', key: 'B16' },
      { label: '最小电压电池位置', group: 'energy', key: 'B22' },
      { label: '最低单体电压(mV)', group: 'energy', key: 'B18' },
      { label: '单体最大压差(mV)', group: 'energy', key: 'B74' },
      { label: '最高电芯温度位置', group: 'energy', key: 'B28' },
      { label: '最高电芯温度(℃)', group: 'energy', key: 'B24' },
      { label: '最低电芯温度位置', group: 'energy', key: 'B30' },
      { label: '最低电芯温度(℃)', group: 'energy', key: 'B25' },
      { label: '单体最大温差(℃)', group: 'energy', key: 'B26' }
    ]
  },
  {
    key: 'gaoyaInfo', title: '高压盒信息', items: [
      { label: 'PDU温度数量', group: 'energy', key: 'B156' },
      { label: 'PDU1极柱温度(℃)', group: 'energy', key: 'B158' },
      { label: 'PDU2极柱温度(℃)', group: 'energy', key: 'B159' },
      { label: 'PDU3极柱温度(℃)', group: 'energy', key: 'B160' },
      { label: 'PDU4极柱温度(℃)', group: 'energy', key: 'B161' },
      { label: 'PDU5极柱温度(℃)', group: 'energy', key: 'B162' },
      { label: 'PDU6极柱温度(℃)', group: 'energy', key: 'B163' }
    ]
  },
  {
    key: 'xiaofangInfo', title: '消防信息', expand: { store: 'state', keys: BMS_FIRE_KEYS }, items: []
  }
];

export default {
  components: { DyNavbar },
  data() {
    return {
      activeTab: 0,
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
    // 装机容量 >= 50 视为大容量（50kW 微能站，使用新协议 1707/170C/171C_V2/0318）
    isHighCapacity() {
      const station = this.$store.state.currentSelectDevice || {};
      const cap = Number(station.totalInstalledCapacity);
      if (Number.isFinite(cap) && cap > 0) return cap >= 50;
      // 无容量字段时回退：设备列表中出现新协议设备即视为大容量
      const newTypes = ['1707_V3_5', '1707V3_5', '170C_V1_1', '171C_V2', '171C_V2_1', '171C_V2_2', '171C_V2_3', '171C_V2_4', '0318_V2_3', '0318V2_3'];
      return (station.list || []).some(item => newTypes.includes(String(item.typeCode || item.deviceType || '').trim()));
    },
    tabs() {
      const base = ['PCS', '储能DC', '光伏DC', 'BMS'];
      if (this.isHighCapacity) return [...base, '液冷机'];
      return base;
    },
    // 50kW 新协议设备
    device1707() {
      return this.deviceList.find(item => item.deviceType === '1707_V3_5');
    },
    device0318() {
      return this.deviceList.find(item => item.deviceType === '0318_V2_3');
    },
    // 131C_V2 环境传感器（BMS 环境数据：温度/湿度）
    device131C() {
      return this.deviceList.find(item => item.deviceType === '131C_V2');
    },
    device170CStorage() {
      return this.deviceList.find(item => item.deviceType === '170C_V1_1' && this.normalizeAddress(item.address) === '1E');
    },
    device170CPv() {
      return this.deviceList.find(item => item.deviceType === '170C_V1_1' && this.normalizeAddress(item.address) === '06');
    },
    // 1707_V3_5 展示数据：按《PCS数据页面调整》文档分类整理
    pcs1707Fields() {
      const device = this.device1707;
      const energy = (device && device.energyData) || {};
      const buildField = key => {
        const f = energy[key];
        if (!f) return null;
        return { key, name: f.name, value: f.value, unit: f.unit };
      };
      const pick = keys => keys.map(buildField).filter(Boolean);

      // 设备状态：0/1 按文档映射为文案
      const deviceStatus = PCS1707_STATUS_KEYS.map(key => {
        const f = energy[key];
        if (!f) return null;
        const map = PCS1707_STATUS_VALUE_MAP[key] || {};
        const raw = f.value;
        let value;
        if (map[String(raw)] !== undefined) {
          value = map[String(raw)];
        } else {
          value = raw === undefined || raw === null || raw === '' ? '--' : raw;
        }
        return { key, name: f.name, value, unit: '' };
      }).filter(Boolean);

      // 版本与通讯：系统时钟按年-月-日 时:分:秒 合并为一项
      const versionComm = pick(PCS1707_VERSION_KEYS);
      const clockNums = PCS1707_CLOCK_KEYS.map(key => {
        const f = energy[key];
        if (!f || f.value === '--' || f.value === undefined || f.value === null || f.value === '') return NaN;
        return Number(f.value);
      });
      let clockStr = '--';
      if (clockNums.every(n => Number.isFinite(n))) {
        const [y, mo, d, h, mi, s] = clockNums;
        const p2 = n => String(n).padStart(2, '0');
        clockStr = `${y}-${p2(mo)}-${p2(d)} ${p2(h)}:${p2(mi)}:${p2(s)}`;
      }
      versionComm.push({ key: 'System_Clock', name: '系统时钟', value: clockStr, unit: '' });

      // 故障信息：FPGA硬件故障 / ARM软件故障 / ARM软件告警，按协议顺序排列
      const isFaultField = name =>
        name.startsWith('FPGA硬件故障-') || name.startsWith('ARM软件故障-') || name.startsWith('ARM软件告警-');
      const faults = Object.keys(energy)
        .map(key => ({ key, name: energy[key].name, value: energy[key].value }))
        .filter(field => isFaultField(field.name))
        .map(field => ({ key: field.key, name: field.name, isFault: Number(field.value) === 1 }));

      return {
        deviceStatus,
        ac: pick(PCS1707_AC_KEYS),
        dc: pick(PCS1707_DC_KEYS),
        temperature: pick(PCS1707_TEMP_KEYS),
        energyTotal: pick(PCS1707_ENERGY_KEYS),
        versionComm,
        faults
      };
    },
    storage170C() {
      return this.build170CData(this.device170CStorage);
    },
    pv170C() {
      return this.build170CData(this.device170CPv);
    },
    // 液冷机(0318V2_3)数据：按《液冷机数据分类》分为运行状态、设备信息、故障信息（按故障字）
    liquidCoolingFields() {
      const energyData = (this.device0318 && this.device0318.energyData) || {};
      const toField = key => {
        const src = energyData[key] || {};
        return { key, name: src.name || key, value: src.value === undefined || src.value === null || src.value === '' ? '--' : src.value };
      };
      const status = LIQUID_STATUS_KEYS.filter(key => energyData[key]).map(toField);
      const info = LIQUID_INFO_KEYS.filter(key => energyData[key]).map(toField);
      // 故障信息：按故障字分组，位值为 1 的故障名称标红
      const faultGroups = LIQUID_FAULT_BYTES.map(([byte, bits], index) => ({
        title: `故障字${index + 1}`,
        items: Array.from({ length: bits }, (_, bit) => `B${byte}b${bit}`)
          .filter(key => energyData[key])
          .map(key => {
            const src = energyData[key];
            return {
              key,
              name: src.name,
              isFault: Number(src.raw) === 1 || src.value === '有故障'
            };
          })
      })).filter(group => group.items.length);
      return { status, info, faultGroups };
    },
    // 50kW BMS：按《电池簇信息记录》栏目分组展示，取 171C_V2 与 131C_V2 实时值
    bmsInfoGroups() {
      const dev = this._bmsDevice('171C_V2');
      const env131 = this.device131C;
      const stores = {
        device: (dev && dev.deviceData) || {},
        energy: (dev && dev.energyData) || {},
        state: (dev && dev.stateData) || {},
        env131: (env131 && env131.statusData) || {}
      };
      console.log(stores);
      const toVal = v => (v !== undefined && v !== null && v !== '' ? v : '--');
      return BMS_INFO_GROUPS.map(group => {
        if (group.expand) {
          const store = stores[group.expand.store] || {};
          return {
            key: group.key,
            title: group.title,
            items: group.expand.keys.map(key => {
              const field = store[key];
              return {
                key: group.expand.store + ':' + key,
                label: field ? field.name : key,
                value: field ? toVal(field.value) : '--'
              };
            })
          };
        }
        return {
          key: group.key,
          title: group.title,
          items: group.items.map(item => {
            const store = item.group ? stores[item.group] : {};
            const field = item.key ? store[item.key] : null;
            return { key: item.key || (group.key + ':' + item.label), label: item.label, value: field ? toVal(field.value) : '--' };
          })
        };
      });
    },
    bmsFaultFields() {
      const dev = this._bmsDevice('171C_V2');
      const energy = (dev && dev.energyData) || {};
      return BMS_FAULT_WORD_KEYS.map(key => {
        const field = energy[key] || {};
        const word = this._toWordValue(field.value);
        return {
          key,
          title: field.name || key,
          items: (BMS_FAULT_WORD_BITS[key] || [])
            .map((name, bit) => ({ key: key + '-' + bit, bit, name, active: word !== null && ((word >> bit) & 1) === 1 }))
            .filter(item => item.name)
        };
      });
    },
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
    // 绝缘阻值：无效或 0 表示无穷大，其余按换算系数换算后保留两位小数
    formatInsulationValue(value, divisor = 1) {
      if (value === null || value === undefined || value === '--') return '∞';
      if (!(Number(value) > 0)) return '∞';
      return (Number(value) / divisor).toFixed(2);
    },
    getDeviceValue(device, key) {
      if (!device || !device.energyData || device.energyData[key] === undefined || device.energyData[key] === null) {
        return '--';
      }
      return device.energyData[key].value;
    },
    // 设备地址统一转为大写字符串，便于与 '06' / '1E' 比较
    normalizeAddress(value) {
      return value === undefined || value === null ? '' : String(value).toUpperCase();
    },
    // 机器运行状态徽标配色：按状态名映射不同色调
    stateBadgeClass(state) {
      if (!state) return 'badge-default';
      if (state.includes('故障')) return 'badge-danger';
      if (state.includes('过载')) return 'badge-warn';
      if (state.includes('停机')) return 'badge-muted';
      if (state.includes('运行')) return 'badge-success';
      if (state.includes('软起')) return 'badge-info';
      if (state.includes('主接')) return 'badge-primary';
      return 'badge-default';
    },
    // 170C 模型展示数据：状态参数不含故障码，故障码单独在故障信息中列出；已迁移到参数设置的字段从运行参数中排除
    build170CData(device) {
      const toList = (obj) => obj
        ? Object.keys(obj).map(key => ({ key, name: obj[key].name, value: obj[key].value, states: obj[key].states || null }))
        : [];
      const errorCode = device && device.stateData ? device.stateData.errorCode : null;
      const current = errorCode && errorCode.raw !== undefined ? String(errorCode.raw) : '';
      return {
        fields: {
          energy: toList(device && device.energyData).filter(field => !MOVED_170C_ENERGY_KEYS.includes(field.key)),
          state: toList(device && device.stateData)
            .filter(field => field.key !== 'errorCode' && !MOVED_170C_STATE_KEYS.includes(field.key))
        },
        // 列出所有故障，当前故障码对应的故障标红
        faults: Object.keys(storage170CFaultEnum)
          .filter(code => storage170CFaultEnum[code] !== '无故障' && storage170CFaultEnum[code] !== '保留')
          .map(code => ({
            code,
            name: storage170CFaultEnum[code],
            isAlarm: code === current
          }))
      };
    },
    _toFieldList(obj, prefix = '') {
      if (!obj) return [];
      return Object.keys(obj).map(key => ({
        key: prefix ? prefix + '-' + key : key,
        name: obj[key].name,
        value: obj[key].value !== undefined && obj[key].value !== null && obj[key].value !== '' ? obj[key].value : '--'
      }));
    },
    // 故障字取值 → 低 16 位整数：兼容网关以十进制数或十六进制字符串上报
    _toWordValue(value) {
      if (value === undefined || value === null || value === '' || value === '--') return null;
      let num;
      if (typeof value === 'number') {
        num = Math.trunc(value);
      } else {
        const text = String(value).trim();
        num = /^0x/i.test(text) || /[a-fA-F]/.test(text) ? parseInt(text, 16) : parseInt(text, 10);
      }
      return Number.isFinite(num) ? num & 0xFFFF : null;
    },
    // BMS 辅助：按归一化 deviceType 从 deviceList 取（兼容 171C_V2 / 171CV2 等写法）
    _bmsDevice(type) {
      const norm = t => String(t == null ? '' : t).toUpperCase().replace(/_/g, '');
      const target = norm(type);
      const candidates = (this.deviceList || []).filter(item => item && (
        norm(item.deviceType) === target ||
        norm(item.typeCode) === target ||
        norm(item.rawDeviceType) === target));
      if (candidates.length) {
        const hasData = dev => [dev.controlData, dev.energyData, dev.stateData, dev.deviceData]
          .some(group => group && Object.keys(group).some(key => {
            const v = group[key] && group[key].value;
            return v !== undefined && v !== null && v !== '' && v !== '--';
          }));
        return candidates.find(hasData) || candidates[0];
      }
      // 未上报时用工厂创建空实例（保证字段定义始终可见）
      return DeviceFactory.create({ deviceType: type });
    },
    initDeviceList() {
      const currentDevice = this.$store.state.currentSelectDevice || {};
      const rawList = Array.isArray(currentDevice.list) ? currentDevice.list : [];
      const findDevice = (deviceType, address) => rawList.find(item => {
        const code = String(item.typeCode || item.deviceType || '');
        const typeOk = code === deviceType || (item.description || '').includes(deviceType);
        if (!typeOk) return false;
        if (address === undefined) return true;
        return this.normalizeAddress(item.address) === this.normalizeAddress(address);
      });
      // barCode 提取辅助：homeBarCode/barCode/gateway/gateWay/serialCode/sn/serialNumber/deviceCode/code 任一可用
      const extractBarCode = (found) => (
        found.homeBarCode || found.barCode || found.gateway || found.gateWay ||
        found.serialCode || found.sn || found.serialNumber || found.deviceCode || found.code || ''
      );
      const deviceList = [];

      if (this.isHighCapacity) {
        // 50kW 微能站：新协议设备（1707_V3_5 / 170C_V1_1(06,1E) / 171C_V2 / 0318_V2_3）
        const specs = [
          { deviceType: '1707_V3_5' },
          { deviceType: '170C_V1_1', address: '1E' },
          { deviceType: '170C_V1_1', address: '06' },
          { deviceType: '171C_V2' },
          { deviceType: '131C_V2' },
          { deviceType: '0318_V2_3' }
        ];
        specs.forEach(spec => {
          const foundDevice = findDevice(spec.deviceType, spec.address);
          if (foundDevice) {
            deviceList.push({
              deviceType: spec.deviceType,
              typeCode: spec.deviceType,
              address: foundDevice.address || spec.address || '',
              barCode: extractBarCode(foundDevice),
              deviceId: foundDevice.deviceId || foundDevice.id || `${spec.deviceType}${spec.address || ''}`,
              name: foundDevice.name || foundDevice.deviceName || `设备${spec.deviceType}`
            });
          }
        });
      } else {
        const deviceTypes = ['171B', '171C', '171D', '171E'];
        deviceTypes.forEach(deviceType => {
          const foundDevice = findDevice(deviceType);
          if (foundDevice) {
            deviceList.push({
              deviceType: deviceType,
              typeCode: deviceType,
              address: foundDevice.address || '',
              barCode: extractBarCode(foundDevice),
              deviceId: foundDevice.deviceId || foundDevice.id || `${deviceType}001`,
              name: foundDevice.name || foundDevice.deviceName || `设备${deviceType}`
            });
          }
        });
        if (deviceList.length === 0) {
          const defaultDevices = [
            { deviceType: '171B', typeCode: '171B', address: '01', barCode: '', deviceId: '171B001', name: 'DCDC设备' },
            { deviceType: '171C', typeCode: '171C', address: '01', barCode: '', deviceId: '171C001', name: '设备171C' },
            { deviceType: '171D', typeCode: '171D', address: '1E', barCode: '', deviceId: '171D001', name: '设备171D' },
            { deviceType: '171E', typeCode: '171E', address: '06', barCode: '', deviceId: '171E001', name: '设备171E' }
          ];
          deviceList.push(...defaultDevices);
        }
      }

      // 兜底：如果全部设备 barCode 都为空，用 currentDevice.areaId 作为 fallback
      const fallbackBarCode = currentDevice?.areaId ? String(currentDevice.areaId) : ''
      if (fallbackBarCode && deviceList.every(c => !c.barCode)) {
        console.warn('[社区监控] 所有设备 barCode 为空，使用 areaId=' + fallbackBarCode + ' 作为 fallback')
        deviceList.forEach(c => { c.barCode = fallbackBarCode })
      }

      realtimeDataProvider.initDeviceList(deviceList);
      this.deviceList = [...realtimeDataProvider.getDeviceList()];
      console.log(this.deviceList, 'deviceList111111111');
    },
    refreshDeviceData() {
      this.deviceList = [...realtimeDataProvider.getDeviceList()];
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

/* 机器运行状态多徽标：状态独立着色，多位命中时换行展示 */
.state-badge {
  display: inline-block;
  margin: 2rpx 4rpx;
  padding: 2rpx 10rpx;
  border-radius: 6rpx;
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.5;

  &.badge-success { color: #15803d; background: #dcfce7; }
  &.badge-danger { color: #b91c1c; background: #fee2e2; }
  &.badge-warn { color: #c2410c; background: #ffedd5; }
  &.badge-info { color: #1d4ed8; background: #dbeafe; }
  &.badge-primary { color: #0f766e; background: #ccfbf1; }
  &.badge-muted { color: #64748b; background: #f1f5f9; }
  &.badge-default { color: #475569; background: #e2e8f0; }
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

.fault-word {
  margin-bottom: 20rpx;
  width: 100%;
}

.fault-word-title {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
  font-weight: 600;
}
</style>