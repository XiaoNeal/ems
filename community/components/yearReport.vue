
<template>
  <view class="content">
    <TableComponent :columns="columns" :data="yearReportData" :headerStyle="{ backgroundColor: '#eef1f6' }" :rowStyle="{
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
  name: "yearReport",
  data() {
    return {
      columns: [
        { title: "区域名称", key: "yearAreaName" },
        { title: "月份", key: "yearMonth" },
        {
          title: "发电量(kW·h)",
          key: "yearGeneratingElectrical",
        },
        {
          title: "充电量(kW·h)",
          key: "yearStorageCharging",
        },
        {
          title: "放电量(kW·h)",
          key: "yearStorageDischarging",
        },
        {
          title: "用电量(kW·h)",
          key: "yearElectricityConsumption",
        },
        {
          title: "供电量(kW·h)",
          key: "yearPowerGridPowerSupply",
        },
        {
          title: "馈电量(kW·h)",
          key: "yearPowerGridPowerFeed",
        },
        {
          title: "空调Q(kW·h)",
          key: "yearAirConditioner",
        },
        {
          title: "照明设备Q(kW·h)",
          key: "yearIllumination",
        },
        {
          title: "电脑Q(kW·h)",
          key: "yearComputer",
        },
        {
          title: "其他设备Q(kW·h)",
          key: "yearOthers",
        },
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: [10, 15, 20]
      }
    }
  },
  props: ['yearReportData', 'selectedName', 'ExportFlag', 'loading', 'tableStyle'],
  computed: {
  },
  watch: {
    yearReportData: {
      handler(newVal) {
        this.pagination.total = newVal?.length || 0
      },
      immediate: true
    }
  },
  methods: {
    handlePageChange(newPage) {
      this.pagination.current = newPage
    },
    handlePageSizeChange(newSize) {
      this.pagination.pageSize = newSize
      this.pagination.current = 1 // 重置页码为1
    }
  },
  mounted() {
    this.pagination.total = this.yearReportData?.length || 0

  },
  beforeDestroy() {

  },
}
</script>

<style scoped></style>
