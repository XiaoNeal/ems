



<template>
  <view class="content">
    <TableComponent :columns="columns" :data="monthReportData" :headerStyle="{ backgroundColor: '#eef1f6' }" :rowStyle="{
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
  name: "monthReport",
  data() {
    return {
       columns: [
        { title: "区域名称", key: "monthAreaName" },
        { title: "日期", key: "monthday" },
        {
          title: "发电量(kW·h)",
          key: "monthGeneratingElectrical",
        },
        {
          title: "储能充电量(kW·h)",
          key: "monthStorageCharging",
        },
        {
          title: "储能放电量(kW·h)",
          key: "monthStorageDischarging",
        },
        {
          title: "用电量(kW·h)",
          key: "monthElectricityConsumption",
        },
        {
          title: "供电量(kW·h)",
          key: "monthPowerGridPowerSupply",
        },
        {
          title: "馈电量(kW·h)",
          key: "monthPowerGridPowerFeed",
        },
        {
          title: "空调Q(kW·h)",
          key: "monthAirConditioner",
        },
        {
          title: "照明设备Q(kW·h)",
          key: "monthIllumination",
        },
        {
          title: "电脑Q(kW·h)",
          key: "monthComputer",
        },
        {
          title: "其他设备Q(kW·h)",
          key: "monthOthers",
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
  props: ['monthReportData', 'selectedName', 'ExportFlag', 'loading', 'tableStyle'],
  computed: {
  },
  watch: {
    monthReportData: {
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
    this.pagination.total = this.monthReportData?.length || 0

  },
  beforeDestroy() {

  },
}
</script>

<style scoped></style>
