<script lang="ts" setup>
  // 出库产品管理组件
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import { Search } from '@element-plus/icons-vue'
  import { useProductTable } from '@/hooks'
  import { FormatSecDateYMD } from '@/tool/index'
  const { 
    outProductInitTable,
    sOutProductNumberId,
    searchOutProductByNumberId,
    outProductClearInput,
    outProductTableData,
    outProductPaginationData,
    outProductTotal,
  } = useProductTable()

  // 挂架完成就搞数据 
  onMounted(async () => {
    await outProductInitTable()
  })
  // 面包屑
	const breadcrumb = ref()
	// 面包屑参数
  const items = ref([
    { name: "产品管理" },
    { name: "出库列表" }
  ])
	// 监听换页
	const currentChange = async (value : number) => {
    outProductPaginationData.currentPage = value
	}
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-header">
				<div class="search-wrapped">
					<el-input v-model="sOutProductNumberId" class="w-50 m-2" size="large" placeholder="输入出库编号进行搜索"
						 @change="searchOutProductByNumberId()" clearable @clear="outProductClearInput()" >
          <template #prefix>
            <Search />
          </template>
          </el-input>
				</div>
			</div>
			<div class="table-content">
				<el-table row-key="id" :data="outProductTableData" border style="width: 100%">
					<el-table-column type="index" width="50"></el-table-column>
					<el-table-column prop="id" label="出库编号" width="200" />
					<el-table-column prop="quantity" label="申请数量" />
					<el-table-column label="申请出库总价">
            <template #default="{row}">
              <div>{{ (row.quantity * row.price).toFixed(2) }}</div>
            </template>
          </el-table-column>
					<el-table-column prop="out_user_name" label="出库申请人" />
					<el-table-column label="申请出库时间" width="180">
						<template #default="{row}">
							<div>{{ FormatSecDateYMD(row.apply_out_time) }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="user_name" label="审核人" />
					<el-table-column label="审核时间" width="180">
						<template #default="{row}">
							<div>{{ FormatSecDateYMD(row.out_time) }}</div>
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="审核备注" width="200" />
				</el-table>
			</div>
      <div class="table-footer">
        <el-pagination :page-size="1" :current-page="outProductPaginationData.currentPage" :pager-count="7"
          :total="outProductTotal" :page-count="outProductPaginationData.pageCount" @current-change="currentChange"
          layout="prev, pager, next" />
      </div>
    </div>
	</div>
</template>

<style lang="scss" scoped>
	.table-wrapped {
		padding: 8px;
		height: calc(100vh - 101px);
		background: #f5f5f5;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.table-top {
			height: 100vh;
			display: flex;
			flex-direction: column;

			.table-header {
				padding: 0 24px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 48px;
				background: #fff;
			}

			.table-content {
				min-height: 10px;
				padding: 10px 20px 20px;
				
				background: #fff;
			}
		}

		.table-footer {
			display: flex;
			justify-content: flex-end;
			background: #fff;
      margin-top: 0px;
		}
	}

	:deep(.el-table .cell) {
		font-weight: 400;
	}
</style>
