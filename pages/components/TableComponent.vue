<template>
    <view class="table-container">
        <!-- 横向滚动容器 -->
        <view class="table-scroll-container">
            <!-- 表格主体 -->
            <view class="table-header" :style="headerStyle">
                <view class="table-header-cell" v-for="(column, index) in columns" :key="index"
                    :style="[cellStyle, { width: columnWidths[index] }]">
                    {{ column.title }}
                </view>
            </view>
            <view class="table-body">
                <view class="table-row" v-for="(row, rowIndex) in currentData" :key="rowIndex"
                    :style="[rowStyle, rowIndex === currentData.length - 1 ? { 'borderBottom': 'none' } : {}]">
                    <view class="table-cell" v-for="(column, colIndex) in columns" :key="colIndex"
                        :style="[cellStyle, { width: columnWidths[rowIndex] }]">
                        {{ getFieldValue(row, column.key) }}
                    </view>
                </view>
            </view>
        </view>

        <!-- 分页控件 -->
        <view class="pagination" v-if="pagination">
            <view class="pagination-btn" :class="{ disabled: pagination.current === 1 }"
                @click="pagination.current > 1 && changePage(pagination.current - 1)">
                上一页
            </view>

            <view class="pagination-pages">
                <view class="pagination-page" v-for="page in getPageRange" :key="page"
                    :class="{ active: page === pagination.current }" @click="changePage(page)">
                    {{ page }}
                </view>
            </view>

            <view class="pagination-btn" :class="{ disabled: pagination.current === totalPages }"
                @click="pagination.current < totalPages && changePage(pagination.current + 1)">
                下一页
            </view>

            <view class="pagination-info">
                共 {{ pagination.total }} 条数据
            </view>

            <view class="pagination-size-changer">
                <picker mode="selector" :range="pagination.pageSizeOptions"
                    :value="pagination.pageSizeOptions.indexOf(pagination.pageSize)" @change="handlePageSizeChange">
                    <view class="pagination-size-option">
                        {{ pagination.pageSize }}条/页
                    </view>
                </picker>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        headerStyle: {
            type: Object,
            default: () => ({})
        },
        rowStyle: {
            type: Object,
            default: () => ({})
        },
        cellStyle: {
            type: Object,
            default: () => ({
                boxSizing: 'border-box',
                minWidth: '60px' // 减小最小列宽
            })
        },
        pagination: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        // 当前页数据
        currentData() {
            if (!this.pagination) return this.data

            const { current, pageSize } = this.pagination
            const start = (current - 1) * pageSize
            const end = start + pageSize
            return this.data.slice(start, end)
        },

        // 总页数
        totalPages() {
            if (!this.pagination) return 1
            return Math.ceil(this.pagination.total / this.pagination.pageSize)
        },

        // 分页范围（最多显示5个页码）
        getPageRange() {
            if (!this.pagination) return []

            const { current } = this.pagination
            const total = this.totalPages
            let start = Math.max(1, current - 2)
            let end = Math.min(total, start + 4)

            if (end - start < 4) {
                start = Math.max(1, end - 4)
            }

            return Array.from({ length: end - start + 1 }, (_, i) => start + i)
        },

        // 计算列宽
        columnWidths() {
            if (!this.columns || this.columns.length === 0) return []

            // 设置基础宽度，确保列不会太窄
            const minColumnWidth = 60 // 减小最小列宽
            const containerWidth = 375 // 假设容器宽度为375px（可根据实际情况调整）

            // 计算平均宽度
            const columnCount = this.columns.length
            const averageWidth = Math.max(minColumnWidth, containerWidth / columnCount)

            // 计算列宽数组（使用像素单位）
            return Array(columnCount).fill(`${averageWidth}px`)
        }
    },
    methods: {
        // 获取嵌套字段值
        getFieldValue(row, field) {
            if (!field) return ''
            return field.split('.').reduce((obj, key) => obj && obj[key], row)
        },

        // 切换页码
        changePage(page) {
            this.$emit('page-change', page)
        },

        // 改变每页显示数量
        handlePageSizeChange(e) {
            const newPageSize = this.pagination.pageSizeOptions[e.detail.value]
            this.$emit('page-size-change', newPageSize)
        }
    }
}
</script>

<style scoped>
.table-container {
    border: 1px solid #e6ebf5;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 15px;
}

/* 横向滚动容器 */
.table-scroll-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    /* 增强iOS滚动体验 */
}

.table-header {
    display: flex;
    font-weight: bold;
    background-color: #fafafa;
    min-width: 100%;
    /* 确保表格不会被压缩 */
}

.table-header-cell {
    flex: 0 0 auto;
    /* 禁用flex的自动伸缩 */
    text-align: left;
    padding: 10px 12px;
    font-size: 14px;
    box-sizing: border-box;
    min-width: 60px;
    /* 减小最小列宽 */
}

.table-body {
    display: flex;
    flex-direction: column;
}

.table-row {
    display: flex;
    border-bottom: 1px solid #e6ebf5;
    min-width: fit-content;
    /* 确保表格不会被压缩 */
}

.table-row:last-child {
    border-bottom: none;
}

.table-cell {
    flex: 0 0 auto;
    /* 禁用flex的自动伸缩 */
    text-align: left;
    padding: 10px 12px;
    font-size: 14px;
    word-break: break-all;
    box-sizing: border-box;
    min-width: 60px;
    /* 减小最小列宽 */
}

.pagination {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-top: 1px solid #e6ebf5;
    background-color: #fafafa;
    font-size: 14px;
}

.pagination-btn {
    padding: 6px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    color: #606266;
    user-select: none;
    font-size: 14px;
}

.pagination-btn.disabled {
    color: #c0c4cc;
    cursor: not-allowed;
}

.pagination-pages {
    display: flex;
    margin: 8px 0;
}

.pagination-page {
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #dcdfe6;
    margin: 0 2px;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    color: #606266;
    user-select: none;
    font-size: 14px;
}

.pagination-page.active {
    background-color: #409eff;
    color: #fff;
    border-color: #409eff;
}

.pagination-info {
    margin: 8px 0;
    color: #606266;
    font-size: 14px;
}

.pagination-size-changer {
    display: flex;
    align-items: center;
    margin: 8px 0;
    color: #606266;
    font-size: 14px;
}

.pagination-size-option {
    margin-left: 5px;
    padding: 6px 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    min-width: 60px;
    text-align: center;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {

    .table-header-cell,
    .table-cell {
        padding: 8px 10px;
        font-size: 13px;
    }

    .pagination {
        padding: 8px;
    }

    .pagination-btn {
        padding: 5px 8px;
        font-size: 13px;
    }

    .pagination-page {
        width: 26px;
        height: 26px;
        line-height: 26px;
        font-size: 13px;
    }

    .pagination-info,
    .pagination-size-changer {
        font-size: 13px;
    }

    .pagination-size-option {
        padding: 5px 8px;
    }
}
</style>