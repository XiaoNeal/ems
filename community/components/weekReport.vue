<template>
  <view class="content">
    <TableComponent :columns="columns" :data="weekReportData" :headerStyle="{ backgroundColor: '#eef1f6' }" :rowStyle="{
      borderBottom: '1px solid #e6ebf5',
      '&:hover': { backgroundColor: '#f5f7fa' }
    }" :cellStyle="{ padding: '8px 2px', 'text-align': 'center' }" :pagination="pagination"
      @page-change="handlePageChange" @page-size-change="handlePageSizeChange" />
  </view>
</template>

<script>
import TableComponent from './TableComponent.vue'
export default {
  components: {
    TableComponent
  },
  name: "weekReport",
  data() {
    return {
      columns: [
        { title: "区域名称", key: "weekAreaName" },
        {
          title: "周一·光伏发电",
          key: "GeneratingElectrical1",
        },
        {
          title: "周一·储能充电",
          key: "StorageCharging1",
        },
        {
          title: "周一·储能放电",
          key: "StorageDischarging1",
        },
        {
          title: "周一·用电量",
          key: "ElectricityConsumption1",
        },
        {
          title: "周一·电网供电",
          key: "PowerGridPowerSupply1",
        },
        {
          title: "周一·电网馈电",
          key: "PowerGridPowerFeed1",
        },
        {
          title: "周二光伏发电",
          key: "GeneratingElectrical2",
        },
        {
          title: "周二储能充电",
          key: "StorageCharging2",
        },
        {
          title: "周二储能放电",
          key: "StorageDischarging2",
        },
        {
          title: "周二用电量",
          key: "ElectricityConsumption2",
        },
        {
          title: "周二电网供电",
          key: "PowerGridPowerSupply2",
        },
        {
          title: "周二电网馈电",
          key: "PowerGridPowerFeed2",
        },
        {
          title: "周三·光伏发电",
          key: "GeneratingElectrical3",
        },
        {
          title: "周三·储能充电",
          key: "StorageCharging3",
        },
        {
          title: "周三·储能放电",
          key: "StorageDischarging3",
        },
        {
          title: "周三·用电量",
          key: "ElectricityConsumption3",
        },
        {
          title: "周三·电网供电",
          key: "PowerGridPowerSupply3",
        },
        {
          title: "周三·电网馈电",
          key: "PowerGridPowerFeed3",
        },
        {
          title: "周四·光伏发电",
          key: "GeneratingElectrical4",
        },
        {
          title: "周四·储能充电",
          key: "StorageCharging4",
        },
        {
          title: "周四·储能放电",
          key: "StorageDischarging4",
        },
        {
          title: "周四·用电量",
          key: "ElectricityConsumption4",
        },
        {
          title: "周四·电网供电",
          key: "PowerGridPowerSupply4",
        },
        {
          title: "周四·电网馈电",
          key: "PowerGridPowerFeed4",
        },
        {
          title: "周五·光伏发电",
          key: "GeneratingElectrical5",
        },
        {
          title: "周五·储能充电",
          key: "StorageCharging5",
        },
        {
          title: "周五·储能放电",
          key: "StorageDischarging5",
        },
        {
          title: "周五·用电量",
          key: "ElectricityConsumption5",
        },
        {
          title: "周五·电网供电",
          key: "PowerGridPowerSupply5",
        },
        {
          title: "周五·电网馈电",
          key: "PowerGridPowerFeed5",
        },
        {
          title: "周六·光伏发电",
          key: "GeneratingElectrical6",
        },
        {
          title: "周六·储能充电",
          key: "StorageCharging6",
        },
        {
          title: "周六·储能放电",
          key: "StorageDischarging6",
        },
        {
          title: "周六·用电量",
          key: "ElectricityConsumption6",
        },
        {
          title: "周六·电网供电",
          key: "PowerGridPowerSupply6",
        },
        {
          title: "周六·电网馈电",
          key: "PowerGridPowerFeed6",
        },
        {
          title: "周日·光伏发电",
          key: "GeneratingElectrical7",
        },
        {
          title: "周日·储能充电",
          key: "StorageCharging7",
        },
        {
          title: "周日·储能放电",
          key: "StorageDischarging7",
        },
        {
          title: "周日·用电量",
          key: "ElectricityConsumption7",
        },
        {
          title: "周日·电网供电",
          key: "PowerGridPowerSupply7",
        },
        {
          title: "周日·电网馈电",
          key: "PowerGridPowerFeed7",
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
  props: ['weekReportData', 'selectedName', 'ExportFlag', 'loading', 'tableStyle'],
  computed: {
  },
  watch: {
    weekReportData: {
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
    this.pagination.total = this.weekReportData?.length || 0

  },
  beforeDestroy() {

  },
}
</script>

<style scoped></style>
