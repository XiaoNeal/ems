<template>
  <view class="sub-page" :class="platformClass">
    <DyNavbar title="直连设备监测" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :placeholder="true" :leftIconColor="fontColor"></DyNavbar>
    <view class="fixed-placeholder"></view>

    <!-- 顶部设备卡片 -->
    <view class="device-card" :class="connectionState">
      <!-- 装饰光斑背景 -->
      <view class="device-card-bg">
        <view class="bg-orb bg-orb-1"></view>
        <view class="bg-orb bg-orb-2"></view>
        <view class="bg-orb bg-orb-3"></view>
      </view>

      <view class="device-card-content">
        <!-- 头部：图标 + 信息 + 操作按钮 -->
        <view class="device-header">
          <view class="device-icon-wrap">
            <view class="device-icon">
              <uni-icons type="gear-filled" size="26" color="#fff"></uni-icons>
            </view>
            <view v-if="connectionState === 'online'" class="icon-pulse"></view>
          </view>

          <view class="device-info">
            <view class="device-name-row">
              <text class="device-name">{{ currentDeviceName }}</text>
              <view class="status-badge" :class="connectionState">
                <view class="status-dot" :class="connectionState"></view>
                <text class="status-text">{{ statusText }}</text>
              </view>
            </view>
            <view class="device-model">
              <text class="model-label">{{ currentDeviceSubtitle }}</text>
              <view class="model-chip">{{ config.protocol === 'mqtt' ? 'MQTT直连' : 'TCP' }}</view>
            </view>
          </view>

          <view class="header-actions">
            <view class="action-btn" :class="{ disabled: connecting }" @click="!connecting && manualRefresh()">
              <uni-icons type="refresh" size="16" color="#fff"></uni-icons>
            </view>
            <view class="action-btn" @click="goConfig">
              <uni-icons type="gear" size="16" color="#fff"></uni-icons>
            </view>
            <view class="action-btn more" @click="showDeviceMeta = !showDeviceMeta">
              <uni-icons :type="showDeviceMeta ? 'up' : 'more'" size="16" color="#fff"></uni-icons>
            </view>
          </view>
        </view>

        <!-- 展开详情 -->
        <view v-if="showDeviceMeta" class="device-meta">
          <view class="meta-row">
            <view class="meta-icon"><uni-icons type="server" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
            <text class="meta-label">{{ config.protocol === 'mqtt' ? 'Broker' : 'IP' }}</text>
            <text class="meta-value">{{ config.protocol === 'mqtt' ? (config.brokerUrl || '--') : (config.ip || '--') }}</text>
          </view>
          <view class="meta-row">
            <view class="meta-icon"><uni-icons type="paperplane" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
            <text class="meta-label">{{ config.protocol === 'mqtt' ? 'Topic' : 'Port' }}</text>
            <text class="meta-value">{{ config.protocol === 'mqtt' ? (config.realtimeTopic || '--') : (config.port || '--') }}</text>
          </view>
          <view class="meta-row">
            <view class="meta-icon"><uni-icons type="clock" size="12" color="rgba(255,255,255,0.6)"></uni-icons></view>
            <text class="meta-label">更新</text>
            <text class="meta-value">{{ lastUpdateText }}</text>
          </view>
          <view v-if="isConnected" class="disconnect-row" @click="onDisconnect">
            <text class="disconnect-text">断开连接</text>
            <uni-icons type="right" size="12" color="rgba(255,255,255,0.25)"></uni-icons>
          </view>
        </view>
      </view>
    </view>

    <!-- 离线 / 未配置 提示 -->
    <view v-if="!config.enabled" class="empty-state">
      <uni-icons type="wifi" size="56" color="#ccc"></uni-icons>
      <text class="empty-text">直连模式未开启</text>
      <text class="empty-sub">请先在设置中配置 IP 与端口</text>
      <button class="btn primary" @click="goConfig">前往配置</button>
    </view>

    <view v-else-if="connectionState === 'offline' && !connecting" class="empty-state">
      <uni-icons type="wifi-off" size="56" color="#ccc"></uni-icons>
      <text class="empty-text">设备离线</text>
      <text class="empty-sub">{{ errorMsg || '无法连接到设备，请检查网络与配置' }}</text>
      <button class="btn primary" @click="reconnect">重新连接</button>
    </view>

    <view v-else class="connected-view">
    <!-- 标签页 + 数据区 -->
    <!-- 标签页 -->
    <view class="tab-container">
        <scroll-view scroll-x="true" class="tab-scroll">
          <view class="tab-list">
            <!-- 监测数据胶囊组 -->
            <view class="tab-pill tab-pill-monitor">
              <view v-for="index in tabGroupMonitor" :key="index"
                class="tab-item"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <text>{{ tabList[index] }}</text>
              </view>
            </view>
            <!-- 控制数据胶囊组 -->
            <view class="tab-pill tab-pill-control">
              <view v-for="index in tabGroupControl" :key="index"
                class="tab-item"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)">
                <text>{{ tabList[index] }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 数据区 -->
      <swiper class="content-swiper" :style="swiperStyle" :current="currentTab" @change="onSwiperChange" :duration="300">
        <!-- 概览标签页 -->
        <swiper-item>
          <scroll-view class="module-scroll" scroll-y="true">
            <view class="content">
              <view class="system-img">
                <image src="/static/images/system-architecture-new.png"
                  style="width:100%; height:96%; position: absolute; top:0; left:0; z-index: 1; padding: 20rpx;"></image>
                <!-- 光伏 -->
                <view class="device-label-top-left">
                  <text class="device-name">光伏</text>
                  <view class="power-row">
                    <text class="device-power">{{ formattedValues['archPvPower'] || '--' }}</text>
                    <text class="power-unit">kW</text>
                  </view>
                </view>
                <!-- 电网 -->
                <view class="device-label-top-right">
                  <text class="device-name">电网</text>
                  <view class="power-row">
                    <text class="device-power">{{ formattedValues['archGridPower'] || '--' }}</text>
                    <text class="power-unit">kW</text>
                  </view>
                </view>
                <!-- 负荷 -->
                <view class="device-label" style="left: 36%; top: 31%;">
                  <view class="power-row">
                    <text class="device-power">{{ formattedValues['archLoadMidPower'] || '--' }}</text>
                    <text class="power-unit">kW</text>
                  </view>
                </view>
                <!-- 储能 -->
                <view class="device-label" style="left: 18%; top: 78%;">
                  <text class="device-name">储能</text>
                  <view class="power-row">
                    <text class="device-power">
                      <text>{{ formattedValues['archStorageStatus'] || '--' }}</text>
                      <text> {{ formattedValues['archStoragePower'] || '--' }}</text>
                    </text>
                    <text class="power-unit">kW</text>
                  </view>
                  <text class="device-soc">{{ formattedValues['archSoc'] || '--' }}%</text>
                </view>
                <!-- 交流负荷 -->
                <view class="device-label" style="left: 3%; top: 75%;">
                  <text class="device-name">交流负荷</text>
                  <view class="power-row">
                    <text class="device-power">{{ formattedValues['archLoadPower'] || '--' }}</text>
                    <text class="power-unit">kW</text>
                  </view>
                </view>
              </view>

              <!-- 数据卡片 -->
              <view class="card-section">
                <view class="card-row">
                  <view class="card card-top-left">
                    <view class="card-item">
                      <text class="card-title">今日发电</text>
                    </view>
                    <view class="card-item">
                      <text class="card-value">{{ formattedValues['archGenToday'] || '--' }}</text>
                      <text class="card-unit"> kWh</text>
                    </view>
                  </view>
                  <view class="card-horizontal-divider"></view>
                  <view class="card card-top-right">
                    <view class="card-item">
                      <text class="card-title">今日用电</text>
                    </view>
                    <view class="card-item">
                      <text class="card-value">{{ formattedValues['archUseToday'] || '--' }}</text>
                      <text class="card-unit"> kWh</text>
                    </view>
                  </view>
                </view>
                <view class="card-divider"></view>
                <view class="card-row">
                  <view class="card card-bottom-left">
                    <view class="card-item">
                      <text class="card-title">储能剩余</text>
                    </view>
                    <view class="card-item">
                      <text class="card-value">{{ formattedValues['archStorageRemaining'] || '--' }}</text>
                      <text class="card-unit">%</text>
                    </view>
                  </view>
                  <view class="card-horizontal-divider"></view>
                  <view class="card card-bottom-right">
                    <view class="card-item">
                      <text class="card-title">电网供电</text>
                    </view>
                    <view class="card-item">
                      <text class="card-value">{{ formattedValues['archGridSupply'] || '--' }}</text>
                      <text class="card-unit"> kWh</text>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 储能SOC/状态模块（对齐 energy-storage.vue L7-29） -->
              <view class="arch-status-container">
                <view class="arch-status-content">
                  <view class="arch-status-indicator">
                    <image class="arch-battery-icon" src="/static/images/img-storage.png" />
                    <view class="arch-soc-container">
                      <view class="arch-soc-progress">
                        <image src="/static/images/storage.svg" class="arch-soc-icon" />
                        <view class="arch-progress-track">
                          <view class="arch-progress-fill" :style="{
                            width: (formattedValues['archSocNumeric'] || 0) + '%',
                            background: formattedValues['archStorageStatusGradient'] || '#8c8c8c'
                          }">
                            <text class="arch-progress-text">{{ formattedValues['archSoc'] || '--' }}%</text>
                          </view>
                        </view>
                        <text class="arch-status-text" :style="{ color: formattedValues['archStorageStatusGradient'] || '#8c8c8c' }">
                          {{ formattedValues['archStorageStatusExtended'] || '--' }}
                        </text>
                      </view>
                      <view class="arch-soc-remaining">
                        <text>剩余电量预计可用</text>
                        <text class="arch-soc-hours">{{ formattedValues['archStorageRemainingHours'] || '--' }} 小时</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 电网统计模块（对齐 grid-management.vue L14-68） -->
              <view class="arch-stats-section">
                <view class="arch-section-title">
                  <text class="arch-title-text">电网数据</text>
                </view>
                <view class="arch-stats-container">
                  <view class="arch-stat-row">
                    <view class="arch-stat-item double">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网实时功率</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archGridPower'] || '--' }}</text>
                          <text class="arch-stat-unit">kW</text>
                        </view>
                      </view>
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网频率</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archGridFrequency'] || '--' }}</text>
                          <text class="arch-stat-unit">Hz</text>
                        </view>
                      </view>
                    </view>
                    <view class="arch-stat-divider"></view>
                    <view class="arch-stat-item double">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网今日馈电量</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archTodayFeedEnergy'] || '--' }}</text>
                          <text class="arch-stat-unit">kWh</text>
                        </view>
                      </view>
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网累计馈电量</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archTotalFeedEnergy'] || '--' }}</text>
                          <text class="arch-stat-unit">kWh</text>
                        </view>
                      </view>
                    </view>
                  </view>
                  <view class="arch-stat-row">
                    <view class="arch-stat-item double">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网今日供电</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archTodaySupplyEnergy'] || '--' }}</text>
                          <text class="arch-stat-unit">kWh</text>
                        </view>
                      </view>
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">电网累计供电</text>
                        <view>
                          <text class="arch-stat-value">{{ formattedValues['archTotalSupplyEnergy'] || '--' }}</text>
                          <text class="arch-stat-unit">kWh</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 光伏统计模块（对齐 pv-management.vue L13-35） -->
              <view class="arch-stats-section">
                <view class="arch-section-title">
                  <text class="arch-title-text">光伏数据</text>
                </view>
                <view class="arch-stats-box">
                  <view class="arch-stat-row">
                    <view class="arch-stat-item vertical arch-center">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">当日发电量</text>
                        <text class="arch-stat-value">{{ formattedValues['archPvTodayGen'] || '--' }}<text class="arch-stat-unit">kWh</text></text>
                      </view>
                    </view>
                    <view class="arch-stat-divider"></view>
                    <view class="arch-stat-item vertical">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">累计发电量</text>
                        <text class="arch-stat-value">{{ formattedValues['archPvTotalGen'] || '--' }}<text class="arch-stat-unit">kWh</text></text>
                      </view>
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">累计发电时长</text>
                        <text class="arch-stat-value">{{ formattedValues['archPvTotalGenDays'] || '--' }}<text class="arch-stat-unit">天</text></text>
                      </view>
                    </view>
                  </view>
                  <view class="arch-section-divider"></view>
                  <view class="arch-stat-row">
                    <view class="arch-stat-item vertical">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">日最高发电量</text>
                        <text class="arch-stat-value">{{ formattedValues['archPvDayMaxGen'] || '--' }}<text class="arch-stat-unit">kWh</text></text>
                      </view>
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">出现在</text>
                        <text class="arch-stat-value small">{{ formattedValues['archPvDayMaxGenTime'] || '--' }}</text>
                      </view>
                    </view>
                    <view class="arch-stat-divider"></view>
                    <view class="arch-stat-item vertical">
                      <view class="arch-stat-subitem">
                        <text class="arch-stat-label">历史最高发电功率</text>
                        <text class="arch-stat-value">{{ formattedValues['archPvHistMaxPower'] || '--' }}<text class="arch-stat-unit">kW</text></text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <!-- 负荷设备模块（对齐 load-management.vue L7-25） -->
              <view class="arch-device-stats">
                <view class="arch-section-title">
                  <text class="arch-title-text">设备信息</text>
                </view>
                <view class="arch-device-grid">
                  <view class="arch-device-item">
                    <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].dljQuantity : 0 }}</text>
                    <text class="arch-device-text">空调</text>
                  </view>
                  <view class="arch-device-item">
                    <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].cdzQuantity : 0 }}</text>
                    <text class="arch-device-text">充电桩</text>
                  </view>
                  <view class="arch-device-item">
                    <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].lightQuantity : 0 }}</text>
                    <text class="arch-device-text">照明</text>
                  </view>
                  <view class="arch-device-item">
                    <text class="arch-device-number">{{ formattedValues['archDeviceCounts'] ? formattedValues['archDeviceCounts'].unknownDeviceQuantity : 0 }}</text>
                    <text class="arch-device-text">未知设备</text>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>

        <!-- PCS标签页 -->
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
                    <view class="grid-item"><text class="item-label">A相(V)</text><text class="item-value">{{ formattedValues['171B_B0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">B相(V)</text><text class="item-value">{{ formattedValues['171B_B4'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">C相(V)</text><text class="item-value">{{ formattedValues['171B_B8'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">相电流</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">Ia(A)</text><text class="item-value">{{ formattedValues['171B_B2'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">Ib(A)</text><text class="item-value">{{ formattedValues['171B_B6'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">Ic(A)</text><text class="item-value">{{ formattedValues['171B_B10'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">线电压</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">AB(V)</text><text class="item-value">{{ formattedValues['171B_B12'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">BC(V)</text><text class="item-value">{{ formattedValues['171B_B16'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">CA(V)</text><text class="item-value">{{ formattedValues['171B_B20'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">相功率</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">A相有功(kW)</text><text class="item-value">{{ formattedValues['171B_B24'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">B相有功(kW)</text><text class="item-value">{{ formattedValues['171B_B28'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">C相有功(kW)</text><text class="item-value">{{ formattedValues['171B_B32'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">A相无功(kVar)</text><text class="item-value">{{ formattedValues['171B_B26'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">B相无功(kVar)</text><text class="item-value">{{ formattedValues['171B_B30'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">C相无功(kVar)</text><text class="item-value">{{ formattedValues['171B_B34'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">交流侧</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">总有功(kW)</text><text class="item-value">{{ formattedValues['171B_B44'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">总无功(kVar)</text><text class="item-value">{{ formattedValues['171B_B48'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">总视在(kVA)</text><text class="item-value">{{ formattedValues['171B_B52'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">频率(Hz)</text><text class="item-value">{{ formattedValues['171B_B36'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">温度(℃)</text><text class="item-value">{{ formattedValues['171B_B40'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">直流侧</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">直流电压(V)</text><text class="item-value">{{ formattedValues['171B_B56'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">直流电流(A)</text><text class="item-value">{{ formattedValues['171B_B58'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">故障状态</view>
                  <view class="status-grid">
                    <view
                      v-for="(status, index) in parsedB64Status.filter(s => !['工作模式','U1状态','U2状态'].includes(s.name))"
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
                    <view class="grid-item"><text class="item-label">故障标志</text><text class="item-value">{{ formattedValues['171D_B0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">运行状态</text><text class="item-value">{{ formattedValues['171D_B2'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">工作状态</text><text class="item-value">{{ formattedValues['171D_B4'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">充电模式</text><text class="item-value">{{ formattedValues['171D_B6'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">电池电压(V)</text><text class="item-value">{{ formattedValues['171D_B8'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">电池电流(A)</text><text class="item-value">{{ formattedValues['171D_B10'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">充电功率(kW)</text><text class="item-value">{{ formattedValues['171D_B12'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">放电功率(kW)</text><text class="item-value">{{ formattedValues['171D_B14'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">BUS电压(V)</text><text class="item-value">{{ formattedValues['171D_B16'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">BUS+(V)</text><text class="item-value">{{ formattedValues['171D_B18'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">BUS-(V)</text><text class="item-value">{{ formattedValues['171D_B20'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">DCDC电气参数</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">环境温度(℃)</text><text class="item-value">{{ formattedValues['171D_B22'] || '--' }}</text></view>
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
                    <view v-if="rawValues['171E'] && rawValues['171E']['B72'] !== undefined" class="grid-item">
                      <text class="item-label">工作模式</text>
                      <text class="item-value">{{ formattedValues['171E_B72'] || '--' }}</text>
                    </view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">电气参数</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">BUS侧电压(V)</text><text class="item-value">{{ formattedValues['171E_B0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">模块电流(A)</text><text class="item-value">{{ formattedValues['171E_B4'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">模块限流点</text><text class="item-value">{{ formattedValues['171E_B8'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DC板温度(℃)</text><text class="item-value">{{ formattedValues['171E_B12'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">光伏侧电压(V)</text><text class="item-value">{{ formattedValues['171E_B16'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">PFC0电压(V)</text><text class="item-value">{{ formattedValues['171E_B20'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">PFC1电压(V)</text><text class="item-value">{{ formattedValues['171E_B24'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">面板温度(℃)</text><text class="item-value">{{ formattedValues['171E_B28'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">PFC板温度(℃)</text><text class="item-value">{{ formattedValues['171E_B44'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">输入功率(kW)</text><text class="item-value">{{ formattedValues['171E_B64'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">告警状态</view>
                  <view class="status-grid">
                    <view v-for="(status, index) in parsedB56Status.filter(s => s.name !== 'DCDC状态')" :key="index"
                      class="fault-item">
                      <text class="fault-name" :class="{ active: status.isAlarm }">{{ status.name }}</text>
                    </view>
                    <text v-if="parsedB56Status.filter(s => s.name !== 'DCDC状态').length === 0" class="status-empty">暂无数据</text>
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
                <view class="data-group">
                  <view class="group-title">电池簇运行状态</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">电池状态</text><text class="item-value">{{ formattedValues['171C_B26'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">簇级核心电气参数</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">簇电压(V)</text><text class="item-value">{{ formattedValues['171C_B12'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">簇电流(A)</text><text class="item-value">{{ formattedValues['171C_B14'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">负载电压(V)</text><text class="item-value">{{ formattedValues['171C_B144'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">SOC(%)</text><text class="item-value">{{ formattedValues['171C_B16'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">SOH(%)</text><text class="item-value">{{ formattedValues['171C_B18'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">SOE(kWh)</text><text class="item-value">{{ formattedValues['171C_B20'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">绝缘R+(MΩ)</text><text class="item-value">{{ formattedValues['171C_B22'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">绝缘R-(MΩ)</text><text class="item-value">{{ formattedValues['171C_B24'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">DI/DO状态</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">DI1</text><text class="item-value">{{ formattedValues['171C_B28b0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI2</text><text class="item-value">{{ formattedValues['171C_B28b1'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI3</text><text class="item-value">{{ formattedValues['171C_B28b2'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI4</text><text class="item-value">{{ formattedValues['171C_B28b3'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI5</text><text class="item-value">{{ formattedValues['171C_B28b4'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI6</text><text class="item-value">{{ formattedValues['171C_B28b5'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI7</text><text class="item-value">{{ formattedValues['171C_B28b6'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DI8</text><text class="item-value">{{ formattedValues['171C_B28b7'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">SLP</text><text class="item-value">{{ formattedValues['171C_B29b0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO1</text><text class="item-value">{{ formattedValues['171C_B30b0'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO2</text><text class="item-value">{{ formattedValues['171C_B30b1'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO3</text><text class="item-value">{{ formattedValues['171C_B30b2'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO4</text><text class="item-value">{{ formattedValues['171C_B30b3'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO5</text><text class="item-value">{{ formattedValues['171C_B30b4'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO6</text><text class="item-value">{{ formattedValues['171C_B30b5'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO7</text><text class="item-value">{{ formattedValues['171C_B30b6'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">DO8</text><text class="item-value">{{ formattedValues['171C_B30b7'] || '--' }}</text></view>
                  </view>
                </view>
                <view class="data-group">
                  <view class="group-title">温度采集参数</view>
                  <view class="data-grid">
                    <view class="grid-item"><text class="item-label">温度点数</text><text class="item-value">{{ formattedValues['171C_B32'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最高温度(℃)</text><text class="item-value">{{ formattedValues['171C_B34'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最高温模块</text><text class="item-value">{{ formattedValues['171C_B36'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最高温序号</text><text class="item-value">{{ formattedValues['171C_B38'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最低温度(℃)</text><text class="item-value">{{ formattedValues['171C_B40'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最低温模块</text><text class="item-value">{{ formattedValues['171C_B42'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">最低温序号</text><text class="item-value">{{ formattedValues['171C_B44'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">平均温度(℃)</text><text class="item-value">{{ formattedValues['171C_B46'] || '--' }}</text></view>
                    <view class="grid-item"><text class="item-label">电池箱最高温(℃)</text><text class="item-value">{{ formattedValues['171C_B106'] || '--' }}</text></view>
                  </view>
                </view>

                <view class="data-group">
                  <view class="group-title">
                    <text>控制指令</text>
                    <text class="group-count">{{ controlList.length }}</text>
                  </view>
                  <view class="control-card">
                    <view v-for="ctrl in controlList" :key="ctrl.field" class="control-row">
                      <view class="control-info">
                        <text class="control-name">{{ ctrl.name }}</text>
                        <text class="control-current">当前: {{ ctrl.currentLabel || '--' }}</text>
                      </view>
                      <view class="control-btns" :class="{ 'btn-disabled': !isConnected }">
                        <view
                          v-for="opt in ctrl.options"
                          :key="opt.value"
                          class="ctrl-btn"
                          :class="{
                            'btn-active': String(ctrl.currentValue) === String(opt.value),
                            'btn-danger': opt.dangerous,
                            'btn-clicked': clickedBtn === ctrl.field + '-' + opt.value
                          }"
                          @click="onControlClick(ctrl, opt)"
                        >{{ opt.label }}</view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>

        <!-- 设置标签页（数据驱动，v-for 遍历 SETTINGS_TABS） -->
        <swiper-item v-for="tabCfg in settingsTabs" :key="tabCfg.tab">
          <scroll-view class="module-scroll" scroll-y="true">
            <view class="content">
              <view class="settings-header" :class="tabCfg.theme">
                <text class="settings-title">{{ tabCfg.title }}</text>
                <view class="edit-toggle" :class="{ active: isEditing(tabCfg.editKey) }" @click="toggleEdit(tabCfg.editKey)">
                  <text>{{ isEditing(tabCfg.editKey) ? '完成编辑' : '修改配置' }}</text>
                </view>
              </view>

              <!-- 开关控制（常规：单段 / 快捷：多段 v-for） -->
              <template v-if="tabCfg.switchSections">
                <view v-for="ss in tabCfg.switchSections" :key="ss.filterKey" class="settings-section">
                  <view class="section-title"><text>{{ ss.title }}</text></view>
                  <view v-for="p in getParams(tabCfg.dataKey).filter(item => item.key === ss.filterKey)" :key="p.key" class="param-row">
                    <view class="param-info">
                      <text class="param-label">{{ p.label }}</text>
                      <text class="param-current">{{ getParamCurrentLabel(p) }}</text>
                    </view>
                    <view class="param-btns">
                      <view
                        v-for="opt in p.options"
                        :key="opt.value"
                        class="param-btn"
                        :class="{
                          'btn-danger': opt.dangerous,
                          'btn-active': getParamCurrentValue(p) === opt.value
                        }"
                        @click="onSwitchParamClick(p, opt)"
                      >{{ opt.label }}</view>
                    </view>
                  </view>
                </view>
              </template>
              <template v-else>
                <view class="settings-section">
                  <view class="section-title"><text>{{ tabCfg.switchTitle }}</text></view>
                  <view v-for="p in getParams(tabCfg.dataKey)" :key="p.key" class="param-row">
                    <view class="param-info">
                      <text class="param-label">{{ p.label }}</text>
                      <text class="param-current">{{ getParamCurrentLabel(p) }}</text>
                    </view>
                    <view class="param-btns">
                      <view
                        v-for="opt in p.options"
                        :key="opt.value"
                        class="param-btn"
                        :class="{
                          'btn-danger': opt.dangerous,
                          'btn-active': getParamCurrentValue(p) === opt.value
                        }"
                        @click="onSwitchParamClick(p, opt)"
                      >{{ opt.label }}</view>
                    </view>
                  </view>
                </view>
                <!-- 额外开关控制（BMS 的"开关控制"段） -->
                <view v-if="tabCfg.extraSwitchKey" class="settings-section">
                  <view class="section-title"><text>{{ tabCfg.extraSwitchTitle }}</text></view>
                  <view v-for="p in getParams(tabCfg.extraSwitchKey)" :key="p.key" class="param-row">
                    <view class="param-info">
                      <text class="param-label">{{ p.label }}</text>
                      <text class="param-current">{{ getParamCurrentLabel(p) }}</text>
                    </view>
                    <view class="param-btns">
                      <view
                        v-for="opt in p.options"
                        :key="opt.value"
                        class="param-btn"
                        :class="{
                          'btn-danger': opt.dangerous,
                          'btn-active': getParamCurrentValue(p) === opt.value
                        }"
                        @click="onSwitchParamClick(p, opt)"
                      >{{ opt.label }}</view>
                    </view>
                  </view>
                </view>
              </template>

              <!-- 数值参数 -->
              <view class="settings-section">
                <view class="section-title"><text>{{ tabCfg.numericTitle }}</text></view>
                <view v-for="p in getParams(tabCfg.numericKey)" :key="p.key" class="param-row">
                  <view class="param-info">
                    <text class="param-label">{{ p.label }}</text>
                    <text class="param-current">{{ getParamCurrentText(p) }}{{ p.unit ? ' ' + p.unit : '' }}</text>
                  </view>
                  <view class="param-edit" v-if="isEditing(tabCfg.editKey)" @click="onNumericParamEdit(p)">
                    <uni-icons type="compose" size="16" color="#1890ff"></uni-icons>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 设置面板确认弹窗 -->
    <view v-if="showConfirm" class="confirm-mask" @click="showConfirm = false">
      <view class="confirm-dialog" @click.stop>
        <view class="confirm-title"><text>{{ confirmTitle || '确认操作' }}</text></view>
        <view class="confirm-content"><text>{{ confirmContent }}</text></view>
        <view class="confirm-btns">
          <view class="confirm-btn cancel" @click="showConfirm = false"><text>取消</text></view>
          <view class="confirm-btn ok" @click="onConfirmOk"><text>确认</text></view>
        </view>
      </view>
    </view>

    <!-- 操作反馈 Toast -->
    <view v-if="showOpToast" class="op-toast" :class="{ success: opToast.indexOf('成功') >= 0 }">
      <text>{{ opToast }}</text>
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import DyNavbar from '@/components/dy-navbar/dy-navbar.vue'
import { MqttDirectClient } from '@/service/socket/mqtt-client.js'
import {
  isIemsBinaryFrame,
  parseIemsFrame,
  parseIemsControlFrame,
  IEMS_DATA_TYPE
} from '@/service/socket/iems-frame-parser.js'
import {
  getRegisterMap
} from '@/service/devices/modbus-register-map.js'
import { realtimeDataProvider } from '@/service/websocket'
import {
  BMS_NUMERIC_PARAMS,
  BMS_SWITCH_PARAMS,
  BMS_POWER_PARAMS,
  PCS_NUMERIC_PARAMS,
  PCS_SWITCH_PARAMS,
  PV_NUMERIC_PARAMS,
  PV_SWITCH_PARAMS,
  STORAGE_NUMERIC_PARAMS,
  STORAGE_SWITCH_PARAMS,
  QUICK_CONTROL_PARAMS,
  QUICK_POWER_PARAMS
} from '@/service/devices/control-params.js'

const STORAGE_KEY = 'direct_device_config'

const DEVICE_TYPES = [null, '171B', '171D', '171E', '171C', null, null, null, null, null]

const TAB_LIST = ['概览', 'PCS', '储能DC', '光伏', 'BMS', 'PCS设置', 'BMS设置', '光伏设置', '储能设置', '快捷控制']
const TAB_GROUP_MONITOR = [0, 1, 2, 3, 4]
const TAB_GROUP_CONTROL = [5, 6, 7, 8, 9]
const MONITOR_LAST_INDEX = 4

const GROUP_TITLE = {
  cluster: '电池簇核心',
  temp: '温度信息',
  cell: '单体电压与内阻',
  soc: '单体 SOC / SOH',
  box: '电池箱温度',
  energy: '累计电量',
  limit: '允许值',
  system: '系统信息',
  status: '运行状态',
  battery: '电池参数',
  power: '功率数据',
  bus: '母线电压',
  voltage: '相电压',
  current: '相电流',
  lineVoltage: '线电压',
  acSide: '交流侧',
  dcSide: '直流侧',
  electrical: '电气参数',
  info: '设备信息'
}

const DEVICE_GROUPS = {
  '171B': ['status', 'voltage', 'current', 'lineVoltage', 'power', 'acSide', 'dcSide', 'system'],
  '171C': ['cluster', 'temp', 'cell', 'soc', 'box', 'energy', 'limit', 'system'],
  '171D': ['status', 'battery', 'power', 'bus', 'temp', 'system'],
  '171E': ['status', 'electrical', 'info']
}

const DEVICE_NAME_MAP = {
  '171B': 'PCS 功率变换系统',
  '171C': 'BMS 电池管理系统',
  '171D': '储能DC-DC变流器',
  '171E': '光伏逆变器'
}

// ============ 状态位/告警位定义（模块级常量，避免每次 computed 重建） ============

// PCS B64 状态位定义：[name, bitPos, isError?]
const PCS_B64_BITS = [
  ['工作模式', 12, false, true], // 特殊：modeMap
  ['U1状态', 21, false, true],
  ['U2状态', 22, false, true],
  ['模块故障', 0, true], ['模块保护', 1, true], ['交流输入缺相', 2, true],
  ['SCI通信故障', 3, true], ['交流侧接线错相', 4, true], ['孤岛告警', 5, true],
  ['内部母线过欠压', 6, true], ['交流侧欠压', 7, true], ['交流侧过压', 8, true],
  ['直流侧过压', 9, true], ['直流侧欠压', 10, true], ['锁相错误', 11, true],
  ['U1过流保护', 14, true], ['风扇故障', 15, true], ['CAN通信故障', 16, true],
  ['模块不均流', 17, true], ['地址重复', 18, true], ['泄放故障', 20, true],
  ['模块限功率', 23, true], ['温度限功率', 24, true], ['交流限功率', 25, true],
  ['交流侧欠频', 26, true], ['交流侧过频', 27, true], ['直流侧短路', 28, true],
  ['堵风道过温', 29, true], ['模块过温', 30, true], ['环温过温', 31, true]
]
const PCS_B64_STATUS_MAP = {
  '工作模式': '#1890FF', 'U1状态': '#52c41a', 'U2状态': '#52c41a',
  '模块故障': '#FF4D4F', '模块保护': '#FAAD14', '交流输入缺相': '#FF4D4F',
  'SCI通信故障': '#FF4D4F', '交流侧接线错相': '#FF4D4F', '孤岛告警': '#FAAD14',
  '内部母线过欠压': '#FF4D4F', '交流侧欠压': '#FAAD14', '交流侧过压': '#FAAD14',
  '直流侧过压': '#FF4D4F', '直流侧欠压': '#FAAD14', '锁相错误': '#FF4D4F',
  'U1过流保护': '#FF4D4F', '风扇故障': '#FF4D4F', 'CAN通信故障': '#FF4D4F',
  '模块不均流': '#FAAD14', '地址重复': '#FF4D4F', '泄放故障': '#FF4D4F',
  '模块限功率': '#FAAD14', '温度限功率': '#FAAD14', '交流限功率': '#FAAD14',
  '交流侧欠频': '#FAAD14', '交流侧过频': '#FAAD14', '直流侧短路': '#FF4D4F',
  '堵风道过温': '#FF4D4F', '模块过温': '#FF4D4F', '环温过温': '#FF4D4F'
}
const PCS_MODE_MAP = { 0: '并网', 1: '离网', 2: '整流' }

// 光伏 B56 状态位定义：[name, bitPos]
const PV_B56_BITS = [
  ['模块故障', 0], ['模块保护', 1], ['SCI通信故障', 3], ['输入模式检测错误', 4],
  ['输入模式不匹配', 5], ['DCDC过压', 7], ['PFC电压异常', 8], ['光伏侧欠压', 9],
  ['光伏侧欠压2', 14], ['CAN通信故障', 16], ['模块不均流', 17], ['模块限功率', 23],
  ['温度限功率', 24], ['光伏侧限功率', 25], ['风扇故障', 27], ['DCDC短路', 28],
  ['DCDC过温', 30], ['DCDC输出过压', 31], ['DCDC状态', 22, false, true] // 特殊：开机/关机
]

// 储能DC DCDC告警位定义
const DCDC_ALARM_FIELDS = [
  { key: 'B40b0', name: '电池过压告警' }, { key: 'B40b1', name: '电池过压关机' },
  { key: 'B40b2', name: '电池快速过压' }, { key: 'B40b3', name: '电池欠压告警' },
  { key: 'B40b4', name: '电池欠压关机' }, { key: 'B40b5', name: '电池快速欠压' },
  { key: 'B40b6', name: '电池输入短路' }, { key: 'B40b7', name: '充放电过流' },
  { key: 'B41b0', name: '充放电快速过流' }, { key: 'B41b1', name: '充放电硬件过流' },
  { key: 'B41b2', name: '电池未接' }, { key: 'B41b3', name: '电池反接' },
  { key: 'B41b4', name: 'BUS3过压' }, { key: 'B41b5', name: 'BUS3快速过压' },
  { key: 'B41b6', name: 'BUS3欠压' }, { key: 'B41b7', name: 'BUS3快速欠压' },
  { key: 'B42b0', name: 'BUS2过压' }, { key: 'B42b1', name: 'BUS2快速过压' },
  { key: 'B42b5', name: 'BUS2欠压' }, { key: 'B42b7', name: 'BUS1+过压' },
  { key: 'B43b0', name: 'BUS1+快速过压' }, { key: 'B43b1', name: 'BUS1-过压' },
  { key: 'B43b2', name: 'BUS1-快速过压' }, { key: 'B43b3', name: 'BUS1电压不平衡' },
  { key: 'B43b4', name: 'BUS1+快速欠压' }, { key: 'B43b5', name: 'BUS1-快速欠压' },
  { key: 'B43b6', name: 'BUS+母线过压' }, { key: 'B43b7', name: 'BUS+母线快速过压' },
  { key: 'B44b0', name: 'BUS-母线过压' }, { key: 'B44b1', name: 'BUS-母线快速过压' },
  { key: 'B44b2', name: 'BUS母线电压不平衡' }, { key: 'B44b3', name: 'BUS母线未接' },
  { key: 'B44b4', name: 'BUS母线反接' }, { key: 'B44b5', name: 'BUS母线短路' },
  { key: 'B44b6', name: 'BUS母线欠压关机' }, { key: 'B44b7', name: 'BUS+母线快速欠压' },
  { key: 'B45b0', name: 'BUS-母线快速欠压' }, { key: 'B45b1', name: 'DCDC1过流' },
  { key: 'B45b2', name: 'DCDC1快速过流' }, { key: 'B45b3', name: 'DCDC1硬件过流' },
  { key: 'B45b4', name: 'DCDC2过流' }, { key: 'B45b5', name: 'DCDC2快速过流' },
  { key: 'B45b6', name: 'DCDC2硬件过流' }, { key: 'B45b7', name: 'DCDC3过流' },
  { key: 'B46b0', name: 'DCDC3快速过流' }, { key: 'B46b1', name: 'DCDC3硬件过流' },
  { key: 'B46b2', name: 'DCDC不均流' }, { key: 'B46b3', name: 'BUS1+硬件过压' },
  { key: 'B46b4', name: '谐振电感A1硬件过流' }, { key: 'B46b5', name: 'BUS1-硬件过压' },
  { key: 'B46b6', name: '谐振电感A2硬件过流' }, { key: 'B46b7', name: '过载110%' },
  { key: 'B47b0', name: '过载125%' }, { key: 'B47b1', name: 'BuckBoost 软启故障' },
  { key: 'B47b2', name: 'DCDC母线软启故障' }, { key: 'B47b3', name: 'DCDC电池软启故障' },
  { key: 'B47b4', name: 'BAT散热器过温' }, { key: 'B47b5', name: 'DCDC原边过温' },
  { key: 'B47b6', name: 'DCDC副边过温' }, { key: 'B47b7', name: 'DCDC环境过温' },
  { key: 'B48b0', name: '辅助电源故障' }, { key: 'B48b1', name: 'DCDC功率降额' },
  { key: 'B48b2', name: 'DCDC风扇A故障' }, { key: 'B48b3', name: 'DCDC风扇B故障' },
  { key: 'B48b4', name: 'E2PROM读故障' }, { key: 'B48b5', name: 'E2PROM写故障' },
  { key: 'B48b6', name: 'DCDC心跳检测异常' }, { key: 'B48b7', name: 'DCDC软件版本错误' },
  { key: 'B49b0', name: '监控CANA通讯故障' }, { key: 'B49b1', name: '并机CANB通讯故障' },
  { key: 'B49b2', name: 'SPI通讯故障' }, { key: 'B49b3', name: '485通讯故障' },
  { key: 'B49b4', name: '母线侧主继电器故障' }, { key: 'B49b5', name: '电池侧主继电器故障' },
  { key: 'B49b6', name: 'DC 机型配置错误' }, { key: 'B49b7', name: 'EPO故障' }
]

// BMS告警位定义
const BMS_ALARM_FIELDS = [
  { key: 'B0b0', name: '组端过压1级告警' }, { key: 'B0b1', name: '组端过压2级告警' },
  { key: 'B0b2', name: '组端过压3级告警' }, { key: 'B0b3', name: '组端欠压1级告警' },
  { key: 'B0b4', name: '组端欠压2级告警' }, { key: 'B0b5', name: '组端欠压3级告警' },
  { key: 'B0b6', name: '组端放电过流1级告警' }, { key: 'B0b7', name: '组端放电过流2级告警' },
  { key: 'B1b0', name: '组端放电过流3级告警' }, { key: 'B1b1', name: '组端充电过流1级告警' },
  { key: 'B1b2', name: '组端充电过流2级告警' }, { key: 'B1b3', name: '组端充电过流3级告警' },
  { key: 'B1b4', name: '组端温度1级告警' }, { key: 'B1b5', name: '组端温度2级告警' },
  { key: 'B1b6', name: '组端温度3级告警' }, { key: 'B1b7', name: '单体电池充电过温1级告警' },
  { key: 'B2b0', name: '单体电池充电过温2级告警' }, { key: 'B2b1', name: '单体电池充电过温3级告警' },
  { key: 'B2b2', name: '单体电池充电欠温1级告警' }, { key: 'B2b3', name: '单体电池充电欠温2级告警' },
  { key: 'B2b4', name: '单体电池充电欠温3级告警' }, { key: 'B2b5', name: '单体电压过压1级告警' },
  { key: 'B2b6', name: '单体电压过压2级告警' }, { key: 'B2b7', name: '单体电压过压3级告警' },
  { key: 'B3b0', name: '单体电压欠压1级告警' }, { key: 'B3b1', name: '单体电压欠压2级告警' },
  { key: 'B3b2', name: '单体电压欠压3级告警' }, { key: 'B3b3', name: '单体压差过高1级告警' },
  { key: 'B3b4', name: '单体压差过高2级告警' }, { key: 'B3b5', name: '单体压差过高3级告警' },
  { key: 'B3b6', name: '单体温差过高1级告警' }, { key: 'B3b7', name: '单体温差过高2级告警' },
  { key: 'B4b0', name: '单体温差过高3级告警' }, { key: 'B4b1', name: 'SOC过低1级告警' },
  { key: 'B4b2', name: 'SOC过低2级告警' }, { key: 'B4b3', name: 'SOC过低3级告警' },
  { key: 'B4b4', name: '动力母线温度过高1级告警' }, { key: 'B4b5', name: '动力母线温度过高2级告警' },
  { key: 'B4b6', name: '动力母线温度过高3级告警' }, { key: 'B4b7', name: '电池模组过压1级告警' },
  { key: 'B5b0', name: '电池模组过压2级告警' }, { key: 'B5b1', name: '电池模组过压3级告警' },
  { key: 'B5b2', name: '电池模组欠压1级告警' }, { key: 'B5b3', name: '电池模组欠压2级告警' },
  { key: 'B5b4', name: '电池模组欠压3级告警' }, { key: 'B5b5', name: 'DI1故障' },
  { key: 'B5b6', name: 'DI2故障' }, { key: 'B5b7', name: 'DI3故障' },
  { key: 'B6b0', name: 'DI4故障' }, { key: 'B6b1', name: 'DI5故障' },
  { key: 'B6b2', name: 'DI6故障' }, { key: 'B6b3', name: 'DI7故障' },
  { key: 'B6b4', name: 'DI8故障' }, { key: 'B6b5', name: '内网通信故障' },
  { key: 'B6b6', name: '单体电压采集异常' }, { key: 'B6b7', name: '单体温度采集异常' },
  { key: 'B7b0', name: '绝缘检测故障' }, { key: 'B7b1', name: '组内压差大' },
  { key: 'B7b2', name: '组内线路故障' }, { key: 'B7b3', name: '电池熔断故障' },
  { key: 'B7b4', name: '项目固件版本参数不一致' }, { key: 'B7b5', name: '非CAN通信故障' },
  { key: 'B7b6', name: 'PC保护调试模式' }, { key: 'B7b7', name: 'CAN总线传感器故障' },
  { key: 'B8b0', name: 'CAN总线传感器通信故障' }, { key: 'B8b1', name: '硬件自检异常' },
  { key: 'B8b2', name: '单体电压断线故障' }, { key: 'B8b3', name: '校准故障' },
  { key: 'B8b4', name: 'EMS通信故障' }, { key: 'B8b5', name: '与三级BMS通信故障' },
  { key: 'B8b6', name: '单体电池放电过温1级告警' }, { key: 'B8b7', name: '单体电池放电过温2级告警' },
  { key: 'B9b0', name: '单体电池放电过温3级告警' }, { key: 'B9b1', name: '单体电池放电欠温1级告警' },
  { key: 'B9b2', name: '单体电池放电欠温2级告警' }, { key: 'B9b3', name: '单体电池放电欠温3级告警' },
  { key: 'B9b4', name: 'SOC过高1级告警' }, { key: 'B9b5', name: 'SOC过高2级告警' },
  { key: 'B9b6', name: 'SOC过高3级告警' }, { key: 'B9b7', name: '温升过快1级告警' },
  { key: 'B10b0', name: '温升过快2级告警' }, { key: 'B10b1', name: '温升过快3级告警' }
]

// 设置面板配置：驱动 init/sync/toggle 的统一数据源
const SETTINGS_PANELS = [
  { dataKey: 'bmsNumericParams',   source: BMS_NUMERIC_PARAMS,   deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'bmsSwitchParams',    source: BMS_SWITCH_PARAMS,    deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'bmsPowerParams',     source: BMS_POWER_PARAMS,     deviceType: '171C', editKey: 'isEditingBms' },
  { dataKey: 'pcsNumericParams',   source: PCS_NUMERIC_PARAMS,   deviceType: '171B', editKey: 'isEditingPcs' },
  { dataKey: 'pcsSwitchParams',     source: PCS_SWITCH_PARAMS,    deviceType: '171B', editKey: 'isEditingPcs' },
  { dataKey: 'pvNumericParams',     source: PV_NUMERIC_PARAMS,    deviceType: '171E', editKey: 'isEditingPv' },
  { dataKey: 'pvSwitchParams',      source: PV_SWITCH_PARAMS,     deviceType: '171E', editKey: 'isEditingPv' },
  { dataKey: 'storageNumericParams',source: STORAGE_NUMERIC_PARAMS,deviceType: '171D', editKey: 'isEditingStorage' },
  { dataKey: 'storageSwitchParams', source: STORAGE_SWITCH_PARAMS,deviceType: '171D', editKey: 'isEditingStorage' },
  { dataKey: 'quickControlParams',  source: QUICK_CONTROL_PARAMS, deviceType: '171F', editKey: 'isEditingQuickControl' },
  { dataKey: 'quickPowerParams',    source: QUICK_POWER_PARAMS,   deviceType: '171F', editKey: 'isEditingQuickControl' }
]

// 设置标签页配置（模板 v-for 驱动）
const SETTINGS_TABS = [
  { tab: 5, dataKey: 'pcsSwitchParams', numericKey: 'pcsNumericParams', title: 'PCS 设置 (171B)', theme: 'pcs-theme', editKey: 'isEditingPcs', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 6, dataKey: 'bmsPowerParams', numericKey: 'bmsNumericParams', title: 'BMS 设置 (171C)', theme: 'bms-theme', editKey: 'isEditingBms', switchTitle: '上下电 / 模式控制', numericTitle: '数值参数', extraSwitchKey: 'bmsSwitchParams', extraSwitchTitle: '开关控制' },
  { tab: 7, dataKey: 'pvSwitchParams', numericKey: 'pvNumericParams', title: '光伏设置 (171E)', theme: 'pv-theme', editKey: 'isEditingPv', switchTitle: '开关控制', numericTitle: '数值参数' },
  { tab: 8, dataKey: 'storageSwitchParams', numericKey: 'storageNumericParams', title: '储能设置 (171D)', theme: 'storage-theme', editKey: 'isEditingStorage', switchTitle: '开关控制', numericTitle: '数值参数' },
  {
    tab: 9, dataKey: 'quickControlParams', numericKey: 'quickPowerParams',
    title: '快捷控制 (171F)', theme: 'quick-theme', editKey: 'isEditingQuickControl',
    numericTitle: '功率设置', isQuick: true,
    switchSections: [
      { title: '储能DC一键控制', filterKey: 'qc_storage_dc' },
      { title: '光伏DC控制', filterKey: 'qc_pv_dc' },
      { title: 'PCS模式选择', filterKey: 'qc_pcs_mode' },
      { title: 'PCS开关机', filterKey: 'qc_pcs_action' }
    ]
  }
]

export default {
  components: { DyNavbar },
  data() {
    return {
      currentTab: 0,
      config: {
        enabled: false,
        protocol: 'mqtt',
        ip: '', port: '1883',
        brokerUrl: '', username: '', password: '',
        realtimeTopic: 'neiic/microEnergyStation001',
        controlSetTopic: 'neiic/microEnergyStationCtl002',
        controlRespTopic: 'neiic/microEnergyStationCtl002'
      },
      client: null,
      connecting: false,
      connected: false,
      errorMsg: '',
      lastUpdate: null,
      deviceTypes: DEVICE_TYPES,
      rawValues: { '171B': {}, '171C': {}, '171D': {}, '171E': {}, '171F': {} },
      // 预格式化显示值（key: 'deviceType_field'，直接绑定确保响应式）
      formattedValues: {
        archDeviceCounts: { dljQuantity: 0, cdzQuantity: 0, lightQuantity: 0, unknownDeviceQuantity: 0 },
        archSocNumeric: 0,
        archStorageStatusGradient: '#8c8c8c'
      },
      // 显示用结构（由 updateDisplay 同步重建）
      displayItems: [],
      // 分组显示结构（由 updateDisplay 同步重建，避免 computed 全量重建）
      groupedDisplay: [],
      controlList: [],
      clickedBtn: '',
      clickedResetTimer: null,
      platformClass: '',
      showDeviceMeta: false,
      archRefreshTimer: null,
      // ============ 设置面板状态 ============
      bmsNumericParams: [],
      bmsSwitchParams: [],
      bmsPowerParams: [],
      pcsNumericParams: [],
      pcsSwitchParams: [],
      isEditingBms: false,
      isEditingPcs: false,
      editingParamKey: null,
      editingParamValue: '',
      editingParamDeviceType: '171C',
      // 确认弹窗
      showConfirm: false,
      confirmTitle: '',
      confirmContent: '',
      confirmPayload: null,
      confirmCallback: null,
      // 操作反馈 Toast
      opToast: '',
      showOpToast: false,
      // PV 设置
      pvNumericParams: [],
      pvSwitchParams: [],
      isEditingPv: false,
      // Storage 设置
      storageNumericParams: [],
      storageSwitchParams: [],
      isEditingStorage: false,
      // Quick Control
      quickControlParams: [],
      quickPowerParams: [],
      isEditingQuickControl: false
    }
  },
  computed: {
    ...mapState({
      fontColor: state => state.fontColor,
      currentSelectDevice: state => state.currentSelectDevice
    }),
    connectionState() {
      if (this.connecting) return 'connecting'
      return this.connected ? 'online' : 'offline'
    },
    statusText() {
      if (this.connecting) return '连接中'
      return this.connected ? '在线' : '离线'
    },
    protocolLabel() {
      return 'MQTT'
    },
    isConnected() {
      return this.connected
    },
    tabList() {
      return TAB_LIST
    },
    tabGroupMonitor() {
      return TAB_GROUP_MONITOR
    },
    tabGroupControl() {
      return TAB_GROUP_CONTROL
    },
    settingsTabs() {
      return SETTINGS_TABS
    },
    // swiper 可用高度：窗口高度减去固定头部（设备卡片 + 标签栏 + 占位）
    // 架构图和卡片已移入标签页滚动内容内，不再占用固定高度
    swiperStyle() {
      const sysInfo = uni.getSystemInfoSync()
      const h = sysInfo.windowHeight || 667
      // 固定头部占位：placeholder ~89px + device-card ~95px + tab-container ~50px
      const fixed = 89 + 95 + 50
      return { height: `${Math.max(250, h - fixed)}px` }
    },
    currentDeviceType() {
      // 设置面板：从 SETTINGS_PANELS 配置获取 deviceType
      const tab = SETTINGS_TABS.find(t => t.tab === this.currentTab)
      if (tab) {
        const panel = SETTINGS_PANELS.find(p => p.dataKey === tab.dataKey)
        if (panel) return panel.deviceType
      }
      // 监控面板：走 DEVICE_TYPES 映射
      return DEVICE_TYPES[this.currentTab] || null
    },
    /** 设备卡片副标题：用户可读的设备说明（不暴露内部编号） */
    currentDeviceSubtitle() {
      // 概览
      if (this.currentTab === 0) return '场站综合监测'
      // 快捷控制
      if (this.currentTab === 9) return '快捷控制'
      // 设置面板（tab 5-8）：取 SETTINGS_TABS 标题去掉 "(171X)" 后缀
      const settingTab = SETTINGS_TABS.find(t => t.tab === this.currentTab)
      if (settingTab) return settingTab.title.replace(/\s*\(\d+\)\s*$/, '')
      // 监控面板（tab 1-4）：取 DEVICE_NAME_MAP
      const dt = DEVICE_TYPES[this.currentTab]
      if (dt && DEVICE_NAME_MAP[dt]) return DEVICE_NAME_MAP[dt]
      return '设备监测'
    },
    currentDeviceName() {
      return 'IEMS 微能量站'
    },
    lastUpdateText() {
      if (!this.lastUpdate) return '--'
      const d = new Date(this.lastUpdate)
      const pad = n => String(n).padStart(2, '0')
      return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    kpiList() {
      const pick = (field) => {
        const it = this.displayItems.find(i => i.field === field)
        return it || { name: '', value: '--', unit: '', field }
      }
      const map = getRegisterMap(this.currentDeviceType)
      const kpiFields = map.monitor.slice(0, 4).map(p => p.field)
      return kpiFields.map(f => pick(f))
    },
    archSoc() {
      return this.getVal('171F', 'B128', 1) !== '--'
        ? this.getVal('171F', 'B128', 1)
        : this.getVal('171F', 'B58', 1)
    },
    archStorageStatus() {
      const val = this.rawValues['171F'] && this.rawValues['171F']['B60']
      if (val === undefined || val === null || val === '--') return '静置'
      const num = Number(val)
      if (isNaN(num)) return '静置'
      if (num > 0) return '充电'
      if (num < 0) return '放电'
      return '静置'
    },
    archStoragePower() {
      return this.getVal('171F', 'B8', 2)
    },
    archLoadPower() {
      return this.getVal('171F', 'B68', 2) !== '--'
        ? this.getVal('171F', 'B68', 2)
        : this.getVal('171F', 'B14', 2)
    },
    archGridPower() {
      return this.getVal('171F', 'B4', 2)
    },
    archPvPower() {
      return this.getVal('171F', 'B0', 2)
    },
    archLoadMidPower() {
      return this.getVal('171F', 'B14', 2)
    },
    archGenToday() {
      return this.getVal('171F', 'B34', 1)
    },
    archUseToday() {
      return this.getVal('171F', 'B38', 1)
    },
    archGridSupply() {
      return this.getVal('171F', 'B42', 1)
    },
    archStorageRemaining() {
      return this.getVal('171F', 'B128', 1) !== '--'
        ? this.getVal('171F', 'B128', 1)
        : this.getVal('171F', 'B58', 1)
    },
    parsedB64Status() {
      const b64Value = this.rawValues['171B'] && this.rawValues['171B']['B64']
      if (b64Value === undefined || b64Value === null || b64Value === '--') return []
      // 字符串格式（带冒号分隔）：直接解析
      if (typeof b64Value === 'string' && b64Value.includes(':')) {
        return b64Value.split('; ').map(item => {
          const [name, value] = item.split(':')
          const isError = value === '发生'
          return {
            name: name || '', value: value || '',
            color: isError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
            bgColor: isError ? '#FFF1F0' : '#F6FFED',
            borderColor: isError ? '#FFCCC7' : '#B7EB8F'
          }
        })
      }
      // 数值格式：按位解析
      const b64 = Number(b64Value) || 0
      return PCS_B64_BITS.map(([name, bitPos, isError, isMode]) => {
        let value
        if (isMode && name === '工作模式') {
          value = PCS_MODE_MAP[(b64 >>> 12) & 0x03] || String((b64 >>> 12) & 0x03)
        } else if (isMode) {
          const v = (b64 >>> bitPos) & 1
          value = name === 'U1状态' || name === 'U2状态' ? (v === 0 ? '开机' : '关机') : String(v)
        } else {
          value = (b64 >>> bitPos) & 1 ? '发生' : '正常'
        }
        const finalIsError = isError && value === '发生'
        return {
          name, value,
          color: finalIsError ? '#FF4D4F' : (PCS_B64_STATUS_MAP[name] || '#666'),
          bgColor: finalIsError ? '#FFF1F0' : '#F6FFED',
          borderColor: finalIsError ? '#FFCCC7' : '#B7EB8F'
        }
      })
    },
    parsedB56Status() {
      const b56 = this.rawValues['171E'] && this.rawValues['171E']['B56']
      if (b56 === undefined || b56 === null || b56 === '--') return []
      const v = Number(b56)
      if (!Number.isFinite(v)) return []
      return PV_B56_BITS.map(([name, bitPos, , isMode]) => {
        if (isMode) {
          return { name, value: (v >> bitPos) & 1 ? '关机' : '开机', isAlarm: 0 }
        }
        const alarmed = (v >> bitPos) & 1
        return { name, value: alarmed ? '发生' : '正常', isAlarm: alarmed ? 1 : 0 }
      })
    },
    dcdcAlarmStatus() {
      const data = this.rawValues['171D'] || {}
      return DCDC_ALARM_FIELDS.map(f => {
        const value = data[f.key]
        return { name: f.name, value: value || '--', isAlarm: value === '告警' || Number(value) === 1 }
      })
    },
    bmsAlarmStatus() {
      const data = this.rawValues['171C'] || {}
      return BMS_ALARM_FIELDS.map(f => {
        const value = data[f.key]
        return { name: f.name, value: value || '--', isAlarm: value === '告警' || Number(value) === 1 }
      })
    }
  },
  watch: {
    currentTab() {
      this.updateDisplay()
      this.rebuildFormattedValues()
    },
    currentSelectDevice: {
      handler() {
        this.sync171FFromRealtimeProvider()
      },
      immediate: true,
      deep: true
    }
  },
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.platformClass = res.platform === 'ios' ? 'ios-platform' : 'android-platform'
      }
    })
    this.loadConfig()
    this.initControlList()
    this.updateDisplay()
    this.rebuildFormattedValues()
    // 从 realtimeDataProvider 获取 171F 架构数据
    this.sync171FFromRealtimeProvider()
    // 监听 WebSocket 数据更新以刷新架构图
    const prevOnDataUpdate = realtimeDataProvider.onDataUpdate
    realtimeDataProvider.onDataUpdate = () => {
      if (typeof prevOnDataUpdate === 'function') {
        try { prevOnDataUpdate() } catch (e) {}
      }
      this.sync171FFromRealtimeProvider()
    }
    this.startArchRefreshTimer()
    if (this.config.enabled) {
      // 进入页面即尝试连接
      this.$nextTick(() => this.start())
    }
  },
  onUnload() {
    this.stopArchRefreshTimer()
    // 清理 onDataUpdate 钩子，避免内存泄漏
    realtimeDataProvider.onDataUpdate = null
    // 清除直连激活标记——离开直连监测页后不再视为直连模式
    try {
      uni.removeStorageSync('direct_device_activated')
      console.log('[直连] 页面卸载，清除激活标记')
    } catch (e) { }
    this.stop()
  },
  onHide() {
    this.stopArchRefreshTimer()
  },
  onShow() {
    // 刷新架构图 171F 数据
    this.sync171FFromRealtimeProvider()
    this.startArchRefreshTimer()
  },
  methods: {
    /**
     * 从全局 realtimeDataProvider 同步 171F 能量控制器数据
     * 用于架构图展示：光伏、电网、储能、负荷等系统级功率数据
     */
    sync171FFromRealtimeProvider() {
      try {
        const deviceList = realtimeDataProvider.getDeviceList() || []
        // === 1. 同步 171F 能量控制器数据 ===
        const device171F = deviceList.find(item => item && item.deviceType === '171F')
        if (device171F && device171F.energyData) {
          const energyData = device171F.energyData
          const bucket = this.rawValues['171F'] || {}
          const batch = {}
          let hasNew = false

          // 将 energyData[key].value 转换为 rawValues[key] = value
          Object.keys(energyData).forEach(key => {
            const entry = energyData[key]
            if (entry && entry.value !== undefined && entry.value !== null) {
              const val = entry.value
              batch[key] = val
              if (bucket[key] !== val) hasNew = true
            }
          })

          if (hasNew) {
            this.rawValues['171F'] = { ...bucket, ...batch }
          }
        }
        // === 2. 计算负荷设备数量 ===
        let dlj = 0, cdz = 0, light = 0, unknown = 0
        const hasDeviceList = deviceList.length > 0
        if (hasDeviceList) {
          deviceList.forEach(item => {
            const hex = this.getTypeHex(item && item.type)
            if (hex === '0x0305' || hex === '0x0306' || hex === '0x1313') {
              dlj++
            } else if (hex === '0x1310') {
              cdz++
            } else if (hex === '0x0201') {
              light++
            } else {
              unknown++
            }
          })
        } else {
          // MQTT 直连模式：基于收到的设备消息类型估算
          if (this.rawValues['171C'] && Object.keys(this.rawValues['171C']).length > 0) dlj += 2
          if (this.rawValues['171D'] && Object.keys(this.rawValues['171D']).length > 0) cdz += 1
          if (this.rawValues['171B'] && Object.keys(this.rawValues['171B']).length > 0) light += 3
          if (this.rawValues['171E'] && Object.keys(this.rawValues['171E']).length > 0) dlj += 1
        }

        const prevCounts = this.formattedValues['archDeviceCounts'] || {}
        const countsStr = `${dlj}-${cdz}-${light}-${unknown}`
        const prevCountsStr = `${prevCounts.dljQuantity || 0}-${prevCounts.cdzQuantity || 0}-${prevCounts.lightQuantity || 0}-${prevCounts.unknownDeviceQuantity || 0}`
        const countsChanged = countsStr !== prevCountsStr

        if (countsChanged || !this.formattedValues['archDeviceCounts']) {
          this.formattedValues = {
            ...this.formattedValues,
            archDeviceCounts: {
              dljQuantity: dlj,
              cdzQuantity: cdz,
              lightQuantity: light,
              unknownDeviceQuantity: unknown
            }
          }
        }

        // 重建所有 arch* 字段（保证 171F 与设备数量都能刷新）
        this.rebuildFormattedValues('171F')
      } catch (e) {
        console.warn('同步 171F 架构数据失败:', e.message)
      }
    },
    /**
     * 设备类型转十六进制字符串（与 load-management.vue / 项目规范一致）
     * 4 位字符串按 hex 解析，其它按十进制解析
     */
    getTypeHex(type) {
      if (type === undefined || type === null) return '0x0000'
      const s = String(type)
      let n
      if (/^[0-9a-fA-F]{4}$/.test(s)) {
        n = parseInt(s, 16)
      } else {
        n = parseInt(s, 10)
      }
      if (isNaN(n)) return '0x0000'
      return '0x' + n.toString(16).toUpperCase().padStart(4, '0')
    },
    /**
     * 启动架构图数据定时刷新兜底定时器（WebSocket 回调为主，定时器兜底）
     */
    startArchRefreshTimer() {
      this.stopArchRefreshTimer()
      this.archRefreshTimer = setInterval(() => {
        this.sync171FFromRealtimeProvider()
      }, 5000)
    },
    stopArchRefreshTimer() {
      if (this.archRefreshTimer) {
        clearInterval(this.archRefreshTimer)
        this.archRefreshTimer = null
      }
    },
    updateDisplay(deviceType) {
      const dtype = deviceType || this.currentDeviceType
      // 概览标签页没有对应的设备类型，清空显示列表
      if (!dtype) {
        this.displayItems = []
        this.groupedDisplay = []
        return
      }
      const map = getRegisterMap(dtype)
      const bucket = this.rawValues[dtype] || {}
      this.displayItems = map.monitor.map(p => this._formatOneItem(p, bucket))
      const groupsConfig = DEVICE_GROUPS[dtype] || []
      const groups = {}
      this.displayItems.forEach(item => {
        const g = item.group || 'system'
        if (groupsConfig.length > 0 && !groupsConfig.includes(g)) return
        if (!groups[g]) groups[g] = { title: GROUP_TITLE[g] || '其他', items: [] }
        groups[g].items.push(item)
      })
      const orderMap = {}
      map.monitor.forEach((p, i) => { orderMap[p.field] = i })
      Object.keys(groups).forEach(k => {
        groups[k].items.sort((a, b) => (orderMap[a.field] ?? 999) - (orderMap[b.field] ?? 999))
      })
      this.groupedDisplay = Object.values(groups)
    },
    formatValue(value, decimals) {
      if (value === null || value === undefined || value === '--') return '--'
      const num = Number(value)
      if (!Number.isFinite(num)) return '--'
      return decimals > 0 ? num.toFixed(decimals) : String(Math.round(num))
    },
    getVal(bucket, field, decimals) {
      const val = this.rawValues[bucket] && this.rawValues[bucket][field]
      if (val === undefined || val === null) return '--'
      return this.formatValue(val, decimals !== undefined ? decimals : 2)
    },
    /**
     * 重建指定设备类型的预格式化显示值
     * 模板直接绑定 formattedValues['171B_B0'] 以确保响应式更新
     */
    rebuildFormattedValues(deviceType) {
      const types = deviceType
        ? (deviceType === '171F' ? ['171F'] : [deviceType, '171F'])
        : DEVICE_TYPES.concat(['171F'])
      const newVals = {}
      types.forEach(dt => {
        const bucket = this.rawValues[dt] || {}
        const map = getRegisterMap(dt)
        if (!map || !map.monitor) return
        map.monitor.forEach(p => {
          const raw = bucket[p.field]
          const decimals = p.decimals !== undefined ? p.decimals : 2
          newVals[`${dt}_${p.field}`] = this.formatValue(raw, decimals)
        })
        Object.keys(bucket).forEach(field => {
          const key = `${dt}_${field}`
          if (newVals[key] === undefined) {
            const val = bucket[field]
            const isBitField = field.includes('b')
            newVals[key] = this.formatValue(val, isBitField ? 0 : 2)
          }
        })
      })
      const f = this.formatValue.bind(this)
      const r = (t, k) => (this.rawValues[t] && this.rawValues[t][k])
      newVals['archPvPower'] = f(r('171F', 'B0'), 2)
      newVals['archGridPower'] = f(r('171F', 'B4'), 2)
      newVals['archStoragePower'] = f(r('171F', 'B8'), 2)
      newVals['archLoadPower'] = f(r('171F', 'B68') !== undefined ? r('171F', 'B68') : r('171F', 'B14'), 2)
      newVals['archLoadMidPower'] = f(r('171F', 'B14'), 2)
      newVals['archGenToday'] = f(r('171F', 'B34'), 1)
      newVals['archUseToday'] = f(r('171F', 'B38'), 1)
      newVals['archGridSupply'] = f(r('171F', 'B42'), 1)
      // === 与 grid-management.vue 对齐的电网统计字段 ===
      // B174: 频率 (Hz), B176: 正向有功电度(累计供电 kWh), B180: 反向有功电度(累计馈电 kWh)
      // B184: 当天正向有功电度(今日供电 kWh), B188: 当天反向有功电度(今日馈电 kWh)
      newVals['archGridFrequency'] = f(r('171F', 'B174'), 2)
      newVals['archTotalSupplyEnergy'] = f(r('171F', 'B176'), 1)
      newVals['archTotalFeedEnergy'] = f(r('171F', 'B180'), 1)
      newVals['archTodaySupplyEnergy'] = f(r('171F', 'B184'), 1)
      newVals['archTodayFeedEnergy'] = f(r('171F', 'B188'), 1)
      const socVal = r('171F', 'B128') !== undefined ? r('171F', 'B128') : r('171F', 'B58')
      newVals['archSoc'] = f(socVal, 1)
      newVals['archStorageRemaining'] = f(socVal, 1)
      // 储能SOC数值（用于进度条百分比）
      newVals['archSocNumeric'] = socVal !== undefined && socVal !== null ? Number(socVal) : 0
      // 剩余电量预计可用小时
      newVals['archStorageRemainingHours'] = f(r('171F', 'B130'), 0)
      const storagePow = r('171F', 'B60')
      if (storagePow !== undefined) {
        const n = Number(storagePow)
        newVals['archStorageStatus'] = isNaN(n) ? '静置' : n > 0 ? '充电' : n < 0 ? '放电' : '静置'
        newVals['archStorageStatusExtended'] = isNaN(n) ? '不充不放' : n > 0 ? '充电中' : n < 0 ? '放电中' : '不充不放'
        newVals['archStorageStatusGradient'] = isNaN(n)
          ? '#8c8c8c'
          : n > 0
            ? '#2ecc71'
            : n < 0
              ? '#f39c12'
              : '#8c8c8c'
      } else {
        newVals['archStorageStatus'] = '--'
        newVals['archStorageStatusExtended'] = '--'
        newVals['archStorageStatusGradient'] = '#8c8c8c'
      }
      // === 与 pv-management.vue 对齐的光伏统计字段（B78区）===
      // B78: 当日发电量 kWh, B106: 累计发电量 kWh, B110: 累计发电时长 天
      // B82: 日最高发电量 kWh, B92: 历史最高发电功率 kW
      newVals['archPvTodayGen'] = f(r('171F', 'B78'), 1)
      newVals['archPvTotalGen'] = f(r('171F', 'B106'), 1)
      newVals['archPvTotalGenDays'] = f(r('171F', 'B110'), 0)
      newVals['archPvDayMaxGen'] = f(r('171F', 'B82'), 1)
      const year86 = r('171F', 'B86')
      const month88 = r('171F', 'B88')
      const day90 = r('171F', 'B90')
      if (year86 !== undefined && month88 !== undefined && day90 !== undefined) {
        const mm = String(Number(month88)).padStart(2, '0')
        const dd = String(Number(day90)).padStart(2, '0')
        newVals['archPvDayMaxGenTime'] = `${year86}-${mm}-${dd}`
      } else {
        newVals['archPvDayMaxGenTime'] = '--'
      }
      newVals['archPvHistMaxPower'] = f(r('171F', 'B92'), 2)
      // === 设备数量估算（MQTT 直连模式）===
      if (!this.formattedValues['archDeviceCounts'] || !this.formattedValues['archDeviceCounts'].dljQuantity) {
        let dlj = 0, cdz = 0, light = 0, unknown = 0
        if (this.rawValues['171C'] && Object.keys(this.rawValues['171C']).length > 0) dlj += 2
        if (this.rawValues['171D'] && Object.keys(this.rawValues['171D']).length > 0) cdz += 1
        if (this.rawValues['171B'] && Object.keys(this.rawValues['171B']).length > 0) light += 3
        if (this.rawValues['171E'] && Object.keys(this.rawValues['171E']).length > 0) dlj += 1
        newVals['archDeviceCounts'] = {
          dljQuantity: dlj, cdzQuantity: cdz,
          lightQuantity: light, unknownDeviceQuantity: unknown
        }
      }
      this.formattedValues = { ...this.formattedValues, ...newVals }
    },
    getArchValue(deviceType, field) {
      const bucket = this.rawValues[deviceType] || {}
      const map = getRegisterMap(deviceType)
      const reg = map.monitor.find(p => p.field === field)
      if (!reg) return '--'
      const raw = bucket[reg.reg]
      if (raw === undefined || raw === null) return '--'
      return this.formatValue(raw, reg.decimals !== undefined ? reg.decimals : 2)
    },
    _computeItemText(p, bucket) {
      let raw
      const b = bucket || this.rawValues[this.currentDeviceType] || {}
      if (p.combined) {
        raw = b[p.field]
      } else {
        raw = b[p.reg]
      }
      if (raw === undefined || raw === null) return '--'
      if (p.status) {
        return p.status[raw] !== undefined ? p.status[raw] : String(raw)
      }
      let val = raw
      if (p.scale && p.scale !== 1) {
        val = raw * p.scale
      }
      const decimals = p.decimals !== undefined ? p.decimals : 2
      return this.formatValue(val, decimals)
    },
    _formatOneItem(p, bucket) {
      return { ...p, value: this._computeItemText(p, bucket), isAlarm: false }
    },
    switchTab(index) {
      if (index !== this.currentTab) {
        this.currentTab = index
        if (DEVICE_TYPES[index] === '171C') {
          this.initControlList()
        }
        // 切换到设置/快捷标签页时同步最新数据
        if (index >= 5 && index <= 9) {
          this.syncSettingsFromRealtime()
        }
      }
    },
    onSwiperChange(e) {
      const newIndex = e.detail.current
      if (newIndex !== this.currentTab) {
        this.currentTab = newIndex
        if (DEVICE_TYPES[newIndex] === '171C') {
          this.initControlList()
        }
        if (newIndex >= 5 && newIndex <= 9) {
          this.syncSettingsFromRealtime()
        }
      }
    },
    loadConfig() {
      try {
        const cfg = uni.getStorageSync(STORAGE_KEY)
        if (cfg) {
          // 协议规范化：确保 brokerUrl 带 tcp:// 协议头
          let brokerUrl = cfg.brokerUrl || ''
          if (brokerUrl && !/^tcp:\/\//i.test(brokerUrl)) {
            // 兼容旧的 ws:// 或无协议配置，统一转为 tcp://
            const m = brokerUrl.match(/^(?:wss?:\/\/)?([^:\/]+):(\d+)/i)
            const host = m ? m[1] : brokerUrl
            const wsPort = m ? parseInt(m[2], 10) : 1883
            const tcpPort = wsPort === 9001 ? 1883 : wsPort
            brokerUrl = `tcp://${host}:${tcpPort}`
            console.log('[loadConfig] 协议规范化 → tcp:', brokerUrl)
          }
          this.config = {
            enabled: !!cfg.enabled,
            protocol: 'mqtt',
            ip: cfg.ip || '',
            port: cfg.port || '1883',
            brokerUrl,
            username: cfg.username || '',
            password: cfg.password || '',
            realtimeTopic: cfg.realtimeTopic || 'neiic/microEnergyStation001',
            controlSetTopic: cfg.controlSetTopic || 'neiic/microEnergyStationCtl002',
            controlRespTopic: cfg.controlRespTopic || 'neiic/microEnergyStationCtl002'
          }
        }
      } catch (e) {
        console.error('加载直连配置失败:', e)
      }
    },
    initControlList() {
      const map = getRegisterMap(this.currentDeviceType)
      this.controlList = map.control.map(c => ({
        ...c,
        currentValue: null,
        currentLabel: '--'
      }))
    },
    async start() {
      if (!this.config.enabled) return
      this.errorMsg = ''
      this.connecting = true
      try {
        await this.startMqtt()
      } catch (e) {
        this.errorMsg = e.message || '连接失败'
        uni.showToast({ title: this.errorMsg, icon: 'none' })
      } finally {
        this.connecting = false
      }
    },
    stop() {
      if (this.client) {
        try { this.client.disconnect() } catch (e) {}
        this.client = null
      }
      this.connected = false
      this.rawValues = { '171B': {}, '171C': {}, '171D': {}, '171E': {}, '171F': {} }
      this.formattedValues = {}
      this.displayItems = []
      this.groupedDisplay = []
    },
    // ============ MQTT 路径 ============
    async startMqtt() {
      await this.connectMqtt()
      await this.subscribeMqttTopics()
      this.initSettingsParams()
      // MQTT 推流模式：连接后无需主动拉取，等模拟器定时 publish
    },
    async connectMqtt() {
      if (!this.client) {
        this.client = new MqttDirectClient({
          brokerUrl: this.config.brokerUrl,
          username: this.config.username,
          password: this.config.password,
          realtimeTopic: this.config.realtimeTopic,
          controlSetTopic: this.config.controlSetTopic,
          controlRespTopic: this.config.controlRespTopic
        })
      } else {
        this.client.setConfig({
          brokerUrl: this.config.brokerUrl,
          username: this.config.username,
          password: this.config.password,
          realtimeTopic: this.config.realtimeTopic,
          controlSetTopic: this.config.controlSetTopic,
          controlRespTopic: this.config.controlRespTopic
        })
      }
      // 断线/错误回调
      this.client.onDisconnect = () => {
        // MQTT 异常断开：UI 切回离线
        this.connected = false
      }
      this.client.onError = (err) => {
        console.warn('MQTT error:', err.message)
      }
      await this.client.connect()
      this.connected = true
      // 激活直连模式——只有真正连上 MQTT 才打激活标记
      try {
        uni.setStorageSync('direct_device_activated', true)
        console.log('[直连] MQTT 已连接，激活直连标记')
      } catch (e) { }
    },
    async subscribeMqttTopics() {
      const realtimeTopic = this.config.realtimeTopic
      const controlTopic = this.config.controlSetTopic
      console.log('[MQTT] 订阅主题: realtime=' + realtimeTopic + ' control=' + controlTopic)
      this.client.setTopics({
        realtime: realtimeTopic,
        controlSet: controlTopic,
        controlResp: controlTopic
      })
      await this.client.subscribeAll({
        onRealtime: (payloadStr, topic, payloadBytes) => this.handleMqttRealtime(payloadStr, payloadBytes),
        onControlResp: (payloadStr, topic, payloadBytes) => this.handleMqttControlResp(payloadStr, topic, payloadBytes)
      })
    },
    /**
     * 处理 MQTT 实时数据 payload
     * 支持两种格式：
     *   1) 模拟器 JSON：{ ts, deviceType, slaveId, fields: { B12: { name, raw, eng, unit }, ... } }
     *   2) 真机二进制 IEMS 帧：首字节 0x07/0x17/0x18，用 iems-frame-parser 解析
     */
    handleMqttRealtime(payloadStr, payloadBytes) {
      try {
        let realBytes = payloadBytes

        // 先解开可能的 JSON 信封（{"Send Data": "17 17..."} → "17 17..."）
        const unwrapped = this._unwrapHexPayload(payloadStr)

        // 尝试从 hex 字符串转二进制（unwrapped 已经是剥掉信封的纯 hex 或原始字符串）
        if (unwrapped) {
          const converted = this._hexStringToBytes(unwrapped)
          if (converted && converted.length >= 10) {
            realBytes = converted
            // console.log('[MQTT] 检测到 hex IEMS 帧, 转换后长度=' + converted.length + ' 首字节=0x' + converted[0].toString(16))
          }
        }

        if (realBytes && isIemsBinaryFrame(realBytes)) {
          // console.log('[MQTT] 收到 IEMS 状态帧, 长度=' + realBytes.length + ' 字节')
          this.applyIemsFrame(realBytes)
          this.lastUpdate = Date.now()
          return
        }

        // 兼容模拟器 JSON 格式
        if (payloadStr && typeof payloadStr === 'string' && payloadStr.trim().startsWith('{')) {
          try {
            const data = JSON.parse(payloadStr)
            // 只对模拟器格式（带 fields 字段）才走 JSON
            if (data.fields && data.deviceType) {
              this._applyJsonRealtime(data)
              return
            }
          } catch (e) { /* 不是 JSON，跳过 */ }
        }

        console.warn('[MQTT] realtime 无法识别, strLen=' + (payloadStr ? payloadStr.length : 0) +
          ' payloadBytes=' + (payloadBytes ? payloadBytes.length : 0))
      } catch (e) {
        console.error('MQTT realtime 解析失败:', e)
      }
    },
    _applyJsonRealtime(data) {
      const fields = data.fields || {}
      const deviceType = (data.deviceType || '171C').toUpperCase()
      if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}
      // console.log('[MQTT] 收到 JSON 数据 deviceType=' + deviceType + ' 字段数=' + Object.keys(fields).length)
      Object.entries(fields).slice(0, 8).forEach(([k, v]) => {
        if (v && v.eng !== undefined) {
          console.log(`    ${k}: ${v.name || ''} = ${v.eng}${v.unit ? ' ' + v.unit : ''} (raw=${v.raw})`)
        } else if (v !== null && v !== undefined) {
          console.log(`    ${k}: ${v}`)
        }
      })
      if (Object.keys(fields).length > 8) console.log(`    ... 共 ${Object.keys(fields).length} 个字段`)

      const bucket = this.rawValues[deviceType]
      const batch = {}
      let hasNew = false
      Object.keys(fields).forEach(field => {
        const f = fields[field]
        if (f && f.raw !== undefined) {
          const val = (f.eng !== undefined && typeof f.eng === 'number') ? f.eng : f.raw
          batch[field] = val
          if (bucket[field] !== val) hasNew = true
        }
      })
      if (hasNew) {
        this.rawValues[deviceType] = { ...bucket, ...batch }
        this.updateDisplay(deviceType)
        this.rebuildFormattedValues(deviceType)
        this.syncSettingsFromRealtime()
      }
      if (deviceType === this.currentDeviceType) {
        this.controlList.forEach(c => {
          const f = fields[c.field]
          if (f && f.raw !== undefined) {
            c.currentValue = f.raw
            const opt = c.options && c.options.find(o => String(o.value) === String(f.raw))
            c.currentLabel = opt ? opt.label : String(f.raw)
          }
        })
      }
      this.lastUpdate = Date.now()
    },
    /**
     * 解析二进制 IEMS 帧并写入 rawValues
     * 输出与 DataCenter 推送格式一致：{frameType, deviceType, address, dataType, data:{B0:..}, dateTime}
     */
    applyIemsFrame(frameBytes) {
      try {
        const parsed = parseIemsFrame(frameBytes)
        const deviceType = (parsed.deviceType || '171C').toUpperCase()
        if (!this.rawValues[deviceType]) this.rawValues[deviceType] = {}
        // console.log('[MQTT] IEMS 帧解析完成: deviceType=' + deviceType + ' dataType=0x' + parsed._dataTypeNum.toString(16) +
            // ' (frameType=' + parsed._frameTypeNum.toString(16) + ') 字段数=' + Object.keys(parsed.data || {}).length +
            // ' startAddr=' + parsed._startAddrNum + ' CRC=' + (parsed.crcOk ? 'OK' : 'FAIL'))
        if (parsed._dataTypeNum === IEMS_DATA_TYPE.DEVICEINFO) return

        const map = getRegisterMap(deviceType)
        const data = parsed.data || {}
        const dataTypeNum = parsed._dataTypeNum
        const bucket = this.rawValues[deviceType]

        // 所有非 DEVICEINFO 类型的帧：都把解析到的数据存入 rawValues
        // ENERGY / STATE / CONTROL 只是用途不同，但都包含寄存器值
        const fieldToReg = {}
        map.monitor.forEach(p => { if (p.reg !== undefined && p.field) fieldToReg[p.field] = p.reg })

        const batch = {}
        let hasNewValue = false
        Object.keys(data).forEach(field => {
          const v = data[field]
          if (v === undefined || v === null) return
          batch[field] = v
          if (fieldToReg[field] !== undefined) {
            batch[fieldToReg[field]] = v
          }
          if (bucket[field] !== v) hasNewValue = true
        })

        if (hasNewValue) {
          this.rawValues[deviceType] = { ...bucket, ...batch }
          // ENERGY 和 STATE 帧都会更新数值显示
          if (dataTypeNum === IEMS_DATA_TYPE.ENERGY || dataTypeNum === IEMS_DATA_TYPE.STATE) {
            this.updateDisplay(deviceType)
            this.rebuildFormattedValues(deviceType)
          }
          // CONTROL 帧：更新设置面板上的开关/控制参数
          if (dataTypeNum === IEMS_DATA_TYPE.CONTROL) {
            if (deviceType === this.currentDeviceType) {
              this.controlList.forEach(c => {
                const v = data[c.field]
                if (v !== undefined && v !== null) {
                  c.currentValue = v
                  const opt = c.options && c.options.find(o => String(o.value) === String(v))
                  c.currentLabel = opt ? opt.label : String(v)
                }
              })
            }
            // 某些设备的 CONTROL 帧也携带状态量（如 171D 同时包含一些状态位）
            // 所以 CONTROL 帧也触发 display 更新，确保不会漏掉任何变化
            this.updateDisplay(deviceType)
            this.rebuildFormattedValues(deviceType)
          }
        }
        this.lastUpdate = Date.now()
      } catch (e) {
        console.error('IEMS 帧解析失败:', e)
      }
    },
    handleMqttStatus(payloadStr) {
      try {
        const data = JSON.parse(payloadStr)
        // online: false 通常表示其他客户端离线；不影响本连接状态
        // 仅用于日志展示，这里仅 toast 提示
        if (data.online === false && data.clientId) {
          console.log('设备端离线:', data.clientId)
        }
      } catch (e) {
        console.error('MQTT status 解析失败:', e)
      }
    },
    handleMqttControlResp(payloadStr, topic, payloadBytes) {
      // console.log('[MQTT CONTROL RESP] topic=' + topic + ' strLen=' + (payloadStr ? payloadStr.length : 0))

      // 先解开可能的 JSON 信封（{"Send Data": "17 17..."} → "17 17..."）
      const unwrapped = this._unwrapHexPayload(payloadStr)

      // 1. 尝试 hex 字符串 → 二进制 → 用 parseIemsFrame 解析
      if (unwrapped) {
        const bytes = this._hexStringToBytes(unwrapped)
        if (bytes && bytes.length >= 9) {
          const ft = bytes[0]
          // console.log('[MQTT CONTROL RESP] hex 帧, frameType=0x' + ft.toString(16) + ' 长度=' + bytes.length)

          // 0x16 = 下行控制帧（设备控制指令的直接应答）
          if (ft === 0x16) {
            try {
              const ctrlFrame = parseIemsControlFrame(bytes)
              // console.log('[MQTT CONTROL RESP] parseIemsControlFrame OK: ' + JSON.stringify(ctrlFrame))
              if (ctrlFrame.registers) {
                const changes = Object.entries(ctrlFrame.registers).map(([field, newValue]) => ({ field, newValue }))
                changes.forEach(c => this._applyControlChange(c))
                uni.showToast({ title: '指令已生效', icon: 'success' })
              }
            } catch (e) {
              // console.warn('[MQTT CONTROL RESP] parseIemsControlFrame 失败:', e.message)
              // fallback 到通用解析提取寄存器
              try {
                const frame = parseIemsFrame(bytes)
                const changes = this._extractRegisterChangesFromFrame(frame)
                if (changes.length > 0) {
                  changes.forEach(c => this._applyControlChange(c))
                  uni.showToast({ title: '指令已生效', icon: 'success' })
                }
              } catch (e2) {
                console.warn('[MQTT CONTROL RESP] parseIemsFrame fallback 失败:', e2.message)
              }
            }
            return
          }

          // 0x17 = COMMON_STATUS（实时数据帧，设备收到控制后在同一 topic 上回发当前状态）
          // 0x07 = DEVICE_REPORT / 0x18 = PROJECT_REGISTER
          if (ft === 0x17 || ft === 0x07 || ft === 0x18) {
            // console.log('[MQTT CONTROL RESP] 收到状态帧 0x' + ft.toString(16) + ' (realtime handler 也会收到)')
            return
          }

          // 未知 frameType 也尝试 parse
          try {
            const frame = parseIemsFrame(bytes)
            if (frame) {
              // console.log('[MQTT CONTROL RESP] 通用 parseIemsFrame OK: frameType=0x' + frame._frameType.toString(16))
              return
            }
          } catch (e) {
            console.warn('[MQTT CONTROL RESP] parseIemsFrame 未知帧类型失败:', e.message)
          }
        }
      }

      // 2. 尝试原始二进制
      if (payloadBytes && payloadBytes.length >= 9) {
        const ft = payloadBytes[0]
        if (ft === 0x16 || ft === 0x17 || ft === 0x07) {
          try {
            const frame = parseIemsFrame(payloadBytes)
            if (frame) {
              // console.log('[MQTT CONTROL RESP] 原始二进制帧 frameType=0x' + ft.toString(16) + ' 长度=' + payloadBytes.length)
              if (ft === 0x16) {
                uni.showToast({ title: '指令已生效', icon: 'success' })
              }
              return
            }
          } catch (e) { /* fallthrough */ }
        }
      }

      console.warn('[MQTT CONTROL RESP] 无法识别的消息格式，str=' + (payloadStr ? payloadStr.slice(0, 120) : '(empty)'))
    },
    /**
     * 把各种格式的 hex 字符串转换成 Uint8Array
     * 支持的输入格式：
     *   - "17 17 1f 00 01"  (纯空格分隔)
     *   - "Send Data: 17 17 1f 00 01"  (带前缀)
     *   - "17,17,1f,00"  (逗号分隔)
     *   - "{\"Send Data\": \"17 17 1f...\"}"  (JSON 里的 hex 值——此时应先 JSON.parse 再取 value)
     */
    /**
     * 把 hex 字符串转换成 Uint8Array
     * 只匹配"连续的空格/逗号分隔的 2 位 hex 序列"，排除 Send/Data 里的 en/da 等巧合
     * 纯 hex 输入："17 17 1f 00 01" 或 "17,17,1f"
     */
    _hexStringToBytes(hexStr) {
      if (!hexStr || typeof hexStr !== 'string') return null
      // 找第一段连续的、以空白或冒号为边界的 hex 序列
      // 先尝试"冒号 + 空格分隔 + 闭合大括号"格式：Send Data: 17 17 1f ... }
      // 再尝试"纯空格/逗号分隔"：17 17 1f ... 或 17,17,1f
      let hexPart = hexStr.trim()
      // 剥掉可能包裹的 { ... } 外壳
      if (hexPart.startsWith('{')) {
        const endBrace = hexPart.lastIndexOf('}')
        if (endBrace > 0) hexPart = hexPart.substring(1, endBrace)
        else hexPart = hexPart.substring(1)
      }
      // 冒号后面才是真正的 hex 值（处理 "Send Data: 17 17..."）
      const colonIdx = hexPart.indexOf(':')
      if (colonIdx >= 0) hexPart = hexPart.substring(colonIdx + 1)
      // 现在 hexPart 应该是 "17 17 1f 00 01 ..." 这样的了
      // 按空白/逗号 split，每个片段必须恰好是 2 位 hex
      const parts = hexPart
        .split(/[\s,]+/)
        .map(s => s.trim())
        .filter(s => /^[0-9a-fA-F]{2}$/.test(s))
      if (parts.length < 3) return null
      const bytes = new Uint8Array(parts.length)
      for (let i = 0; i < parts.length; i++) {
        bytes[i] = parseInt(parts[i], 16) & 0xff
      }
      return bytes
    },
    /**
     * 从可能的信封中提取 hex 部分
     * 支持：
     *   - JSON 信封: {"Send Data": "17 17..."} 或 {"data": "17 17..."}
     *   - JS object literal: {Send Data: 17 17...} (key/value 都没引号)
     *   - 纯 hex 字符串直接返回
     */
    _unwrapHexPayload(payloadStr) {
      if (!payloadStr || typeof payloadStr !== 'string') return payloadStr
      const trimmed = payloadStr.trim()
      if (trimmed.startsWith('{')) {
        // 1) 先尝试标准 JSON
        try {
          const data = JSON.parse(trimmed)
          const envelopeKeys = ['Send Data', 'sendData', 'SendData', 'data', 'hex', 'payload']
          for (const key of envelopeKeys) {
            const val = data[key]
            if (typeof val === 'string' && val.length >= 4) {
              console.log('[MQTT] 从 JSON 信封提取 hex payload, key=' + key)
              return val.trim()
            }
          }
        } catch (e) { /* 不是合法 JSON，继续 */ }

        // 2) 非标准 JSON（JS object literal）→ 用正则硬捞
        // 格式: {Send Data: 17 17 1f ... } 或 { "data": 17 17 ... }
        // 匹配冒号后面到 } 之前的所有内容
        const match = trimmed.match(/\{\s*[^:]+:\s*([0-9a-fA-F\s,]+)\s*\}/)
        if (match && match[1] && match[1].trim().length >= 4) {
          console.log('[MQTT] 从非标准信封提取 hex payload (regex)')
          return match[1].trim()
        }
      }
      return trimmed
    },
    _extractRegisterChangesFromFrame(frame) {
      const changes = []
      if (!frame || !frame.data) return changes
      // frame.data 是 { '0': value, '2': value, ... } 按寄存器偏移
      // 需要结合 startAddr 算出 B 编号
      const startAddr = frame.startAddr || 0
      for (const regOffset of Object.keys(frame.data)) {
        const val = frame.data[regOffset]
        const bNum = startAddr + parseInt(regOffset, 10)
        changes.push({ field: 'B' + bNum, newValue: val })
      }
      return changes
    },
    _applyControlChange(change) {
      // 更新快捷控制/设置面板的按钮状态
      if (change.field && change.newValue !== undefined) {
        this.controlList.forEach(c => {
          if (c.field === change.field) {
            c.currentValue = change.newValue
            const opt = c.options && c.options.find(o => String(o.value) === String(change.newValue))
            if (opt) c.currentLabel = opt.label
          }
        })
        // 同步设置面板参数状态
        this.syncAllParamsFromResp(change)
      }
    },
    syncParamFromResp(params, data) {
      params.forEach(p => {
        if (p.field === data.field && data.newValue !== undefined) {
          const raw = data.newValue
          p.currentValue = raw
          if (p.options) {
            const opt = p.options.find(o => String(o.value) === String(raw))
            p.currentLabel = opt ? opt.label : String(raw)
          }
          if (p.scale && p.scale !== 1) {
            const scaled = Number(raw) / p.scale
            p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
          } else {
            p.currentText = String(raw)
          }
        }
      })
    },
    syncAllParamsFromResp(data) {
      SETTINGS_PANELS.forEach(cfg => {
        this.syncParamFromResp(this[cfg.dataKey], data)
      })
    },
    reconnect() {
      this.stop()
      this.start()
    },
    onDisconnect() {
      this.stop()
      uni.showToast({ title: '已断开连接', icon: 'none' })
    },
    async manualRefresh() {
      if (this.connecting) return
      if (!this.connected) {
        await this.start()
        return
      }
      // MQTT 推流模式：数据自动到达，无需主动刷新
      uni.showToast({ title: 'MQTT 推流模式，数据自动到达', icon: 'none' })
    },
    async onControlClick(ctrl, opt) {
      if (!this.isConnected) {
        uni.showToast({ title: '设备未连接', icon: 'none' })
        return
      }
      if (String(ctrl.currentValue) === String(opt.value)) {
        uni.showToast({ title: '已是当前状态', icon: 'none' })
        return
      }
      this.clickedBtn = ctrl.field + '-' + opt.value
      if (this.clickedResetTimer) clearTimeout(this.clickedResetTimer)
      this.clickedResetTimer = setTimeout(() => { this.clickedBtn = '' }, 600)

      const doWrite = async () => {
        try {
          // MQTT 模式：publish 控制指令到 control/set 主题，等模拟器回 controlResp
          await this.client.sendControl(ctrl.field, opt.value, this.currentDeviceType)
          uni.showToast({ title: '指令已下发，等待设备响应', icon: 'none' })
        } catch (e) {
          uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        }
      }

      if (opt.dangerous) {
        uni.showModal({
          title: '操作确认',
          content: `确定要执行「${opt.label}」吗？此操作可能影响设备运行状态。`,
          success: (res) => {
            if (res.confirm) doWrite()
          }
        })
      } else {
        await doWrite()
      }
    },
    // ============ 设置面板方法 ============

    initSettingsParams() {
      SETTINGS_PANELS.forEach(cfg => {
        const hasOptions = cfg.source.length > 0 && cfg.source[0].options
        this[cfg.dataKey] = cfg.source.map(p => ({
          ...p, currentValue: null,
          currentLabel: hasOptions ? '--' : undefined,
          currentText: hasOptions ? undefined : '--'
        }))
      })
      this.syncSettingsFromRealtime()
    },
    syncSettingsFromRealtime() {
      SETTINGS_PANELS.forEach(cfg => {
        const params = this[cfg.dataKey]
        const bucket = this.rawValues[cfg.deviceType] || {}
        params.forEach(p => {
          const val = bucket[p.field]
          if (val !== undefined && val !== null) {
            const raw = typeof val === 'object' ? (val.raw !== undefined ? val.raw : val.eng) : val
            const eng = typeof val === 'object' ? (val.eng !== undefined ? val.eng : raw) : raw
            if (p.scale && p.scale !== 1) {
              const scaled = Number(eng) / p.scale
              p.currentValue = scaled
              p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
            } else {
              p.currentValue = raw
              p.currentText = raw !== undefined ? String(raw) : '--'
            }
            if (p.options) {
              const opt = p.options.find(o => String(o.value) === String(raw))
              p.currentLabel = opt ? opt.label : (raw !== undefined ? String(raw) : '--')
            }
          }
        })
      })
    },
    getParamCurrentValue(p) {
      return p.currentValue
    },
    /** 模板辅助：通过 dataKey 动态获取参数数组（小程序模板不支持 this[变量]） */
    getParams(dataKey) {
      return this[dataKey] || []
    },
    /** 模板辅助：通过 editKey 动态获取编辑状态 */
    isEditing(editKey) {
      return !!this[editKey]
    },
    getParamCurrentLabel(p) {
      return p.currentLabel || '--'
    },
    getParamCurrentText(p) {
      return p.currentText || '--'
    },
    toggleEdit(editKey) {
      this[editKey] = !this[editKey]
      if (this[editKey]) {
        this.syncSettingsFromRealtime()
      }
    },
    async onSwitchParamClick(p, opt) {
      if (!this.isConnected) {
        uni.showToast({ title: '设备未连接', icon: 'none' })
        return
      }
      if (String(p.currentValue) === String(opt.value)) {
        this.showOpToast = true
        this.opToast = `${p.label}: 当前已是 ${opt.label}`
        setTimeout(() => { this.showOpToast = false }, 2000)
        return
      }

      const deviceType = p.deviceType || '171C'
      const doSend = async () => {
        try {
          this.client.setDeviceType(deviceType)
          await this.client.sendControl(p.field, opt.value)
          // Optimistic update：本地立即更新，设备回显后再校准
          p.currentValue = opt.value
          p.currentLabel = opt.label
          this.opToast = `${p.label} → ${opt.label} 指令已下发`
          this.showOpToast = true
          setTimeout(() => { this.showOpToast = false }, 2500)
        } catch (e) {
          uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
        }
      }

      if (opt.dangerous) {
        this.confirmTitle = '操作确认'
        this.confirmContent = `确定要执行「${p.label} - ${opt.label}」吗？此操作可能影响设备运行状态。`
        this.confirmPayload = { param: p, option: opt, deviceType }
        this.confirmCallback = doSend
        this.showConfirm = true
      } else {
        await doSend()
      }
    },
    onNumericParamEdit(p) {
      this.editingParamKey = p.key
      this.editingParamDeviceType = p.deviceType || '171C'
      this.editingParamValue = p.currentText ? String(p.currentText) : ''
      uni.showModal({
        title: `修改 ${p.label}`,
        editable: true,
        placeholderText: `当前值: ${p.currentText || '--'}${p.unit ? ' ' + p.unit : ''}，请输入新值`,
        success: async (res) => {
          if (res.confirm && res.content !== undefined && res.content !== '') {
            const newVal = parseFloat(res.content)
            if (isNaN(newVal)) {
              uni.showToast({ title: '请输入有效数字', icon: 'none' })
              return
            }
            if (p.min !== undefined && newVal < p.min) {
              uni.showToast({ title: `不能小于 ${p.min}`, icon: 'none' })
              return
            }
            if (p.max !== undefined && newVal > p.max) {
              uni.showToast({ title: `不能大于 ${p.max}`, icon: 'none' })
              return
            }
            const rawVal = p.scale ? Math.round(newVal * p.scale) : newVal
            try {
              this.client.setDeviceType(this.editingParamDeviceType)
              await this.client.sendControl(p.field, rawVal)
              // Optimistic update
              const scaled = rawVal / (p.scale || 1)
              p.currentValue = scaled
              p.currentText = this.formatValue(scaled, p.decimals !== undefined ? p.decimals : 1)
              this.opToast = `${p.label} 已修改为 ${p.currentText}${p.unit ? ' ' + p.unit : ''}`
              this.showOpToast = true
              setTimeout(() => { this.showOpToast = false }, 2500)
            } catch (e) {
              uni.showModal({ title: '下发失败', content: e.message || '请重试', showCancel: false })
            }
          }
        }
      })
    },
    onConfirmOk() {
      if (this.confirmCallback && typeof this.confirmCallback === 'function') {
        this.confirmCallback()
      }
      this.showConfirm = false
      this.confirmPayload = null
      this.confirmCallback = null
    },
    goConfig() {
      uni.navigateTo({ url: '/pages/profile/direct-device-config' })
    }
  }
}
</script>

<style lang="scss" scoped>
.sub-page {
  background: #f4f6fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 设备卡片 */
.device-card {
  flex-shrink: 0;
  margin: 20rpx;
  border-radius: 28rpx;
  overflow: hidden;
  position: relative;
  box-shadow: 0 12rpx 40rpx rgba(0, 122, 255, 0.25);

  /* ========== 装饰光斑背景 ========== */
  .device-card-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #007AFF 0%, #00C6FF 60%, #5AC8FA 100%);

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      filter: blur(2rpx);
    }
    .bg-orb-1 { width: 260rpx; height: 260rpx; top: -80rpx; right: -60rpx; background: rgba(255,255,255,0.18); }
    .bg-orb-2 { width: 140rpx; height: 140rpx; bottom: -30rpx; right: 80rpx; background: rgba(255,255,255,0.1); }
    .bg-orb-3 { width: 80rpx;  height: 80rpx;  top: 50rpx;  right: 200rpx; background: rgba(255,255,255,0.12); }
  }

  &.offline {
    box-shadow: 0 12rpx 40rpx rgba(138, 148, 166, 0.25);
    .device-card-bg { background: linear-gradient(135deg, #6b7280 0%, #9ca3af 60%, #d1d5db 100%); }
  }

  &.connecting {
    box-shadow: 0 12rpx 40rpx rgba(240, 160, 32, 0.3);
    .device-card-bg { background: linear-gradient(135deg, #d97706 0%, #f0a020 50%, #fbbf24 100%); }
  }

  /* ========== 内容 ========== */
  .device-card-content {
    position: relative;
    padding: 28rpx 32rpx;
    z-index: 1;
  }

  .device-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }

  /* 图标 + 呼吸光圈 */
  .device-icon-wrap {
    position: relative;
    width: 72rpx;
    height: 72rpx;
    flex-shrink: 0;

    .device-icon {
      width: 72rpx;
      height: 72rpx;
      border-radius: 20rpx;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.12);
    }

    .icon-pulse {
      position: absolute;
      inset: -8rpx;
      border-radius: 24rpx;
      border: 4rpx solid rgba(76, 217, 100, 0.6);
      animation: iconPulse 2s ease-out infinite;
    }
  }

  .device-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6rpx;
  }

  .device-name-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .device-name {
    font-size: 32rpx;
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.5rpx;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }

  /* 状态徽章：带脉冲点 */
  .status-badge {
    display: flex;
    align-items: center;
    gap: 6rpx;
    font-size: 22rpx;
    padding: 4rpx 14rpx;
    border-radius: 20rpx;
    background: rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(4px);
    flex-shrink: 0;

    .status-dot {
      width: 10rpx;
      height: 10rpx;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
    }
    .status-dot.online {
      background: #4cd964;
      box-shadow: 0 0 8rpx rgba(76, 217, 100, 0.8);
      animation: dotPulse 1.5s ease-in-out infinite;
    }
    .status-dot.connecting {
      background: #ffc960;
      animation: dotPulse 1s ease-in-out infinite;
    }

    &.online { background: rgba(76, 217, 100, 0.25); }
    &.offline { background: rgba(0, 0, 0, 0.18); }
    &.connecting { background: rgba(255, 201, 96, 0.3); }

    .status-text { color: #fff; font-weight: 500; }
  }

  /* 副标题 + 连接方式 */
  .device-model {
    display: flex;
    align-items: center;
    gap: 10rpx;

    .model-label {
      font-size: 22rpx;
      color: rgba(255, 255, 255, 0.85);
    }
    .model-chip {
      font-size: 20rpx;
      color: rgba(255, 255, 255, 0.95);
      background: rgba(255, 255, 255, 0.2);
      padding: 2rpx 12rpx;
      border-radius: 8rpx;
      font-family: 'Menlo', 'Consolas', monospace;
      letter-spacing: 1rpx;
    }
  }

  /* 操作按钮 */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 8rpx;
    flex-shrink: 0;
  }

  .action-btn {
    width: 52rpx;
    height: 52rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    backdrop-filter: blur(4px);

    &:active { background: rgba(255, 255, 255, 0.45); transform: scale(0.9); }
    &.more { background: transparent; }
    &.more:active { background: rgba(255, 255, 255, 0.15); }
    &.disabled { opacity: 0.4; pointer-events: none; }
  }

  /* ========== 展开详情 ========== */
  .device-meta {
    margin-top: 24rpx;
    padding: 20rpx 24rpx;
    border-radius: 16rpx;
    background: rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 14rpx;
  }

  .meta-row {
    display: flex;
    align-items: center;
    font-size: 24rpx;
  }

  .meta-icon {
    width: 36rpx;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .meta-label {
    color: rgba(255, 255, 255, 0.6);
    width: 90rpx;
    flex-shrink: 0;
  }

  .meta-value {
    color: #fff;
    flex: 1;
    text-align: right;
    word-break: break-all;
    font-family: 'Menlo', 'Consolas', monospace;
    font-size: 22rpx;
  }

  /* 断开连接：底部危险操作 */
  .disconnect-row {
    margin-top: 4rpx;
    padding: 18rpx 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .disconnect-text {
      color: #ff7875;
      font-size: 26rpx;
      font-weight: 500;
    }

    &:active {
      .disconnect-text { opacity: 0.6; }
    }
  }
}

/* ========== 动画 ========== */
@keyframes iconPulse {
  0% { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(1.6); opacity: 0; }
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.85); }
}

/* 已连接视图包装器 */
.connected-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* monitor-data.vue style tab container */
.tab-container {
  flex-shrink: 0;
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.tab-scroll {
  white-space: nowrap;
}

.tab-list {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 14rpx 16rpx;
}

.tab-pill {
  display: flex;
  align-items: center;
  border-radius: 14rpx;
  padding: 6rpx;
  flex-shrink: 0;

  &.tab-pill-monitor {
    background: rgba(0, 122, 255, 0.08);
  }

  &.tab-pill-control {
    background: rgba(250, 140, 22, 0.08);
  }
}

.tab-item {
  padding: 12rpx 22rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
  font-size: 26rpx;
  color: #666;
  white-space: nowrap;
  transition: all 0.2s ease;
  position: relative;

  &:active {
    opacity: 0.7;
  }
}

/* 监测胶囊内激活态 */
.tab-pill-monitor .tab-item.active {
  background: #fff;
  color: #007aff;
  font-weight: bold;
  box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.18);
}

/* 控制胶囊内激活态 */
.tab-pill-control .tab-item {
  color: #7a6a55;

  &.active {
    background: #fff;
    color: #fa8c16;
    font-weight: bold;
    box-shadow: 0 2rpx 8rpx rgba(250, 140, 22, 0.2);
  }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 100rpx 40rpx;

  .empty-text {
    font-size: 30rpx;
    color: #666;
    margin-top: 12rpx;
  }

  .empty-sub {
    font-size: 24rpx;
    color: #999;
    text-align: center;
  }
}

/* 空数据提示 */
.empty-data {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80rpx 40rpx;
  color: #999;
  font-size: 26rpx;
}

/* swiper content area */
.content-swiper {
  flex: 1;
  min-height: 0;
  touch-action: pan-y;
  overflow: hidden;
}

/* swiper-item 默认需要撑满父高度 */
.content-swiper ::v-deep swiper-item {
  height: 100%;
}

.module-scroll {
  height: 100%;
  min-height: 0;
  touch-action: pan-y;
}

.content {
  padding: 16rpx;
}

.module {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
}

.module-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  padding-left: 16rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #f0f0f0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4rpx;
    bottom: 14rpx;
    width: 6rpx;
    border-radius: 3rpx;
    background: #007aff;
  }
}

.key-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin: 20rpx 0;
  padding: 16rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 16rpx;

  .key-card {
    flex: 1 1 calc(50% - 8rpx);
    background: #fff;
    border-radius: 12rpx;
    padding: 24rpx 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06), 0 1rpx 3rpx rgba(0, 0, 0, 0.04);

    .kpi-name {
      font-size: 24rpx;
      color: #8a8a8a;
      text-align: center;
      display: block;
      margin-bottom: 12rpx;
      font-weight: 400;
    }

    .kpi-value-row {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 6rpx;
    }

    .kpi-value {
      font-size: 40rpx;
      color: #1a1a1a;
      font-weight: 600;
      letter-spacing: 0.5rpx;
    }

    .kpi-unit {
      font-size: 22rpx;
      color: #999;
      font-weight: 400;
    }
  }
}

.swiper-item {
  height: 100%;
}

/* 数据分组 - 网格布局 */
.data-group {
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.group-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 4rpx 8rpx 16rpx;
  position: relative;
  margin-bottom: 4rpx;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6rpx;
    height: 24rpx;
    border-radius: 3rpx;
    background: #4488fb;
  }

  text {
    font-size: 28rpx;
    font-weight: bold;
    color: #555;
  }

  .group-count {
    font-size: 22rpx;
    color: #bbb;
  }
}

.data-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  padding: 12rpx;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  border-radius: 16rpx;
}

.grid-item {
  width: calc(33.333% - 8rpx);
  background: #fff;
  padding: 18rpx 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: none;

  &:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  }

  &.grid-item--wide {
    width: calc(50% - 6rpx);
  }
}

.item-label {
  font-size: 22rpx;
  color: #8a8a8a;
  display: block;
  margin-bottom: 6rpx;
  text-align: center;
  font-weight: 400;
}

.item-value-row {
  display: flex;
  align-items: baseline;
  gap: 4rpx;
  justify-content: center;
}

.item-value {
  font-size: 30rpx;
  color: #1a1a1a;
  font-weight: 600;
  text-align: center;
  letter-spacing: 0.5rpx;

  &.alarm {
    color: #e6434a;
  }
}

.item-unit {
  font-size: 20rpx;
  color: #999;
  font-weight: 400;
}

/* 状态/告警网格 */
.status-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.status-item {
  width: calc(33.333% - 8rpx);
  padding: 12rpx 2rpx;
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
  margin-bottom: 4rpx;
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
  width: calc(33.333% - 8rpx);
  padding: 12rpx 2rpx;
  border-radius: 8rpx;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fault-name {
  font-size: 22rpx;
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

/* 控制指令面板 */
.control-card {
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06), 0 1rpx 3rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;

  .control-row {
    padding: 24rpx 28rpx;
    border-bottom: 2rpx solid #f0f2f5;

    &:last-child { border-bottom: none; }

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
  }

  .control-info {
    display: flex;
    flex-direction: column;
    gap: 6rpx;
    flex: 1;
  }

  .control-name {
    font-size: 28rpx;
    color: #333;
  }

  .control-current {
    font-size: 22rpx;
    color: #999;
  }

  .control-btns {
    display: flex;
    gap: 8rpx;
    flex-shrink: 0;
  }

  .ctrl-btn {
    min-width: 88rpx;
    height: 56rpx;
    line-height: 56rpx;
    text-align: center;
    padding: 0 18rpx;
    font-size: 24rpx;
    color: #666;
    background: #f5f7fa;
    border-radius: 10rpx;

    &.btn-active {
      background: #007AFF;
      color: #fff;
    }

    &.btn-danger.btn-active {
      background: #e6434a;
    }

    &.btn-clicked {
      transform: scale(0.94);
    }
  }

  .btn-disabled .ctrl-btn {
    opacity: 0.5;
  }
}

/* 按钮 */
.btn {
  height: 76rpx;
  line-height: 76rpx;
  font-size: 28rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  margin: 0;
  border: none;
  padding: 0 32rpx;

  &::after { border: none; }

  &.primary {
    background: #007AFF;
    color: #fff;
  }

  &[disabled] {
    opacity: 0.5;
  }
}

/* 平台占位 */
.sub-page {
  .fixed-placeholder {
    height: calc(25px + 44px);
  }

  &.android-platform {
    .fixed-placeholder { height: calc(25px + 44px + 20px); }
  }

  &.ios-platform {
    .fixed-placeholder { height: calc(44px); background: #fff; }
  }
}

/* 系统架构图（参考 architecture-diagram.vue） */
.system-img {
  position: relative;
  flex-shrink: 0;
  height: 500rpx;
  margin: 16rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background: #fff;
}

.device-label,
.device-label-top-left,
.device-label-top-right {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
  background: rgba(255, 255, 255, 0.88);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.device-label-top-left {
  top: 7%;
  left: 34%;
}

.device-label-top-right {
  top: 19%;
  left: 1%;
}

.device-name {
  font-size: 22rpx;
  color: #555;
  margin-bottom: 2rpx;
  font-weight: 500;
}

.device-power {
  font-size: 26rpx;
  color: #4488fb;
  font-weight: bold;
}

.device-soc {
  font-size: 22rpx;
  color: #52c41a;
  margin-top: 2rpx;
  font-weight: bold;
}

.power-row {
  display: flex;
  align-items: baseline;
}

.power-unit {
  font-size: 18rpx;
  color: #999;
  margin-left: 2rpx;
}

/* 数据卡片（参考 architecture-diagram.vue） */
.card-section {
  flex-shrink: 0;
  margin: 16rpx;
}

.card-row {
  display: flex;
}

.card-divider {
  height: 1rpx;
  background-color: #eee;
  margin: 0 auto;
  width: 90%;
}

.card {
  flex: 1;
  background: #fff;
  padding: 24rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.card-top-left {
  border-radius: 12rpx 0 0 0;
}

.card-top-right {
  border-radius: 0 12rpx 0 0;
}

.card-bottom-left {
  border-radius: 0 0 0 12rpx;
}

.card-bottom-right {
  border-radius: 0 0 12rpx 0;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.card-horizontal-divider {
  width: 1rpx;
  height: 60%;
  background-color: #e8e8e8;
  margin: auto 0;
}

.card-title {
  font-size: 24rpx;
  color: #888;
}

.card-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #4488FB;
}

.card-unit {
  font-size: 22rpx;
  color: #999;
  margin-left: 2rpx;
}

/* ========== 储能SOC进度条模块（对齐 energy-storage.vue）========== */
.arch-status-container {
  background: linear-gradient(135deg, #ffffff 0%, #f7faff 100%);
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(68, 136, 251, 0.08);
}

.arch-status-content {
  width: 100%;
}

.arch-status-indicator {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.arch-battery-icon {
  width: 80rpx;
  height: 80rpx;
  flex-shrink: 0;
}

.arch-soc-container {
  flex: 1;
  min-width: 0;
}

.arch-soc-progress {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.arch-soc-icon {
  width: 40rpx;
  height: 40rpx;
  flex-shrink: 0;
}

.arch-progress-track {
  flex: 1;
  height: 32rpx;
  background-color: #f0f2f5;
  border-radius: 16rpx;
  overflow: hidden;
  position: relative;
}

.arch-progress-fill {
  height: 100%;
  border-radius: 16rpx;
  min-width: 0;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16rpx;
  box-sizing: border-box;
}

.arch-progress-text {
  font-size: 20rpx;
  color: #fff;
  font-weight: bold;
  white-space: nowrap;
}

.arch-status-text {
  font-size: 24rpx;
  flex-shrink: 0;
  font-weight: 500;
}

.arch-soc-remaining {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #555;
}

.arch-soc-hours {
  font-weight: bold;
  color: #333;
}

/* ========== 公共区块标题（对齐所有组件 section-header）========== */
.arch-section-title {
  margin-bottom: 12rpx;
  padding-bottom: 10rpx;
  padding-left: 16rpx;
  position: relative;
  border-bottom: 1rpx solid #e8e8e8;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 4rpx;
    bottom: 14rpx;
    width: 6rpx;
    border-radius: 3rpx;
    background: #007aff;
  }
}

.arch-title-text {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

/* ========== 电网统计 / 光伏统计 模块通用（对齐 grid-management.vue / pv-management.vue）========== */
.arch-stats-section,
.arch-device-stats {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.arch-stats-container,
.arch-stats-box {
  width: 100%;
}

.arch-stat-row {
  display: flex;
  align-items: stretch;
  min-height: 110rpx;
}

.arch-stat-divider {
  width: 1rpx;
  background-color: #e8e8e8;
  margin: 12rpx 0;
}

.arch-section-divider {
  height: 1rpx;
  background-color: #e8e8e8;
  margin: 0;
}

.arch-stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 12rpx 0;

  &.double {
    display: flex;
    flex-direction: row;
  }

  &.vertical {
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding: 16rpx 12rpx;
    gap: 12rpx;
  }

  &.arch-center {
    justify-content: center;
  }
}

.arch-stat-item.double .arch-stat-subitem {
  flex: 1;
  padding: 0 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.arch-stat-subitem {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10rpx;
}

.arch-stat-label {
  font-size: 24rpx;
  color: #888;
}

.arch-stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;

  &.small {
    font-size: 24rpx;
    font-weight: normal;
    color: #888;
  }
}

.arch-stat-unit {
  font-size: 22rpx;
  color: #999;
  font-weight: normal;
  margin-left: 6rpx;
}

/* ========== 负荷设备模块（对齐 load-management.vue）========== */
.arch-device-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.arch-device-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5faff 0%, #eef3fb 100%);
  border-radius: 12rpx;
  padding: 18rpx 8rpx;
  gap: 6rpx;
}

.arch-device-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #4488FB;
}

.arch-device-text {
  font-size: 24rpx;
  color: #666;
}

/* ========== 设置面板样式 ========== */
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.25);

  &.pv-theme {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    box-shadow: 0 8rpx 24rpx rgba(245, 87, 108, 0.25);
  }

  &.storage-theme {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    box-shadow: 0 8rpx 24rpx rgba(79, 172, 254, 0.25);
  }

  &.quick-theme {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    box-shadow: 0 8rpx 24rpx rgba(67, 233, 123, 0.25);
  }

  &.pcs-theme {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    box-shadow: 0 8rpx 24rpx rgba(250, 112, 154, 0.25);
  }

  &.bms-theme {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.25);
  }
}

.settings-title {
  font-size: 34rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.edit-toggle {
  padding: 12rpx 28rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
  font-size: 26rpx;
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &.active {
    background: rgba(255, 255, 255, 0.92);
    color: #333;
    font-weight: 600;
  }

  &:active {
    transform: scale(0.94);
  }
}

.settings-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 8rpx;
  padding: 16rpx 0 16rpx 20rpx;
  position: relative;
  border-bottom: 1rpx solid #f0f0f0;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 18rpx;
    bottom: 18rpx;
    width: 6rpx;
    border-radius: 3rpx;
    background: linear-gradient(180deg, #007aff, #00c6ff);
  }
}

.param-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #f5f6f8;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background: #fafbfc;
  }
}

.param-info {
  display: flex;
  // flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 4rpx;
}

.param-label {
  font-size: 28rpx;
  color: #1d2129;
  font-weight: 500;
  flex: 1;
}

.param-current {
  font-size: 24rpx;
  color: #86909c;
  flex: 1;
  text-align: center;
}

.param-btns {
  display: flex;
  gap: 12rpx;
  flex-shrink: 0;
}

.param-btn {
  padding: 10rpx 24rpx;
  border-radius: 28rpx;
  background: #f2f3f5;
  color: #4e5969;
  font-size: 24rpx;
  font-weight: 500;
  transition: all 0.15s ease;

  &.btn-active {
    background: linear-gradient(135deg, #007aff, #00a2ff);
    color: #fff;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
  }

  &.btn-danger {
    background: #fff;
    border: 1rpx solid #ff4d4f;
    color: #ff4d4f;

    &.btn-active {
      background: linear-gradient(135deg, #ff4d4f, #ff7875);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.3);
    }
  }

  &:active {
    transform: scale(0.92);
    opacity: 0.85;
  }
}

.param-edit {
  padding: 12rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12rpx;
  background: #f2f3f5;

  &:active {
    opacity: 0.6;
    transform: scale(0.92);
  }
}

/* ========== 确认弹窗 ========== */
.confirm-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.confirm-dialog {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}

.confirm-title {
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
}

.confirm-content {
  padding: 32rpx;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.confirm-btns {
  display: flex;
  border-top: 1rpx solid #f0f0f0;
}

.confirm-btn {
  flex: 1;
  padding: 28rpx;
  text-align: center;
  font-size: 30rpx;

  &.cancel {
    color: #999;
    border-right: 1rpx solid #f0f0f0;
  }

  &.ok {
    color: #1890ff;
    font-weight: bold;
  }

  &:active {
    background: #f5f5f5;
  }
}

/* ========== 操作反馈 Toast ========== */
.op-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24rpx 48rpx;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
  z-index: 998;
  pointer-events: none;

  &.success {
    background: rgba(82, 196, 26, 0.9);
  }
}
</style>
