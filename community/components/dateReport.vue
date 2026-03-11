<template>
  <view class="content">
    <TableComponent :columns="columns" :data="dateReportData" :headerStyle="{ backgroundColor: '#eef1f6' }" :rowStyle="{
      borderBottom: '1px solid #e6ebf5',
      '&:hover': { backgroundColor: '#f5f7fa' }
    }" :cellStyle="{ padding: '8px 0px', 'text-align': 'center' }" :pagination="pagination"
      @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
  </view>
</template>

<script>
import TableComponent from './TableComponent.vue'
export default {
  components: {
    TableComponent
  },
  name: "dateReport",
  data() {
    return {
      columns: [
        { title: "区域名称", key: "dailyAreaName" },
        { title: "日期", key: "dailydate" },
        { title: "小时", key: "dailyHour" },

        {
          title: "发电量(kW·h)",
          key: "dailyGeneratingElectrical",

        },

        {
          title: "充电量(kW·h)",
          key: "dailyStorageCharging",
        },
        {
          title: "放电量(kW·h)",
          key: "dailyStorageDischarging",
        },

        {
          title: "用电量(kW·h)",
          key: "dailyElectricityConsumption",
        },
        {
          title: "供电量(kW·h)",
          key: "dailyPowerGridPowerSupply",
        },
        {
          title: "馈电量(kW·h)",
          key: "dailyPowerGridPowerFeed",
        },
        {
          title: "空调Q(kW·h)",
          key: "dailyAirConditioner",
        },
        {
          title: "照明设备Q(kW·h)",
          key: "dailyIllumination",
        },
        {
          title: "电脑Q(kW·h)",
          key: "dailyComputer",
        },
        {
          title: "其他设备Q(kW·h)",
          key: "dailyOthers",
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: [10, 15, 20]
      }
    }
  },
  props: ['dateReportData', 'selectedName', 'ExportFlag', 'loading', 'tableStyle'],
  computed: {
  },
  watch: {
    dateReportData: {
      handler(newVal) {
      
        this.pagination.total = newVal?.length || 0
      },
      immediate: true
    }
  },
  methods: {
    handlePageChange(newPage) {
      this.pagination.current = newPage
      // 这里可以添加实际的分页逻辑，如从服务器获取数据
    },
    handlePageSizeChange(newSize) {
      this.pagination.pageSize = newSize
      this.pagination.current = 1 // 重置页码为1
      // 这里可以添加实际的分页逻辑，如从服务器获取数据
    }
  },
  mounted() {
    this.pagination.total = this.dateReportData?.length || 0

  },
  beforeDestroy() {

  },
}
</script>

<style scoped></style>
