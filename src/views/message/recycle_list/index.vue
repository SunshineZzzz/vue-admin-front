<script lang='ts' setup>
  // 消息列表组件
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import { bus } from "@/utils/mitt.js"
  import { type IMessageInfoData } from '@/define/index'
	import deleteMessage from '../components/delete.vue'
  import { useMessageTable } from '@/hooks'
  import { FormatSecDateYMD } from '@/tool/index'
  import { CRecycleDialog, RecycleDialogOffType } from '@/define/index'
  const { 
    recyclePaginationData,
    recycleTotal,
    recycleTableData,
    recycleInitTable,
  } = useMessageTable()

  // 挂架完成就搞数据 
  onMounted(async () => {
    await recycleInitTable()
  })
	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
  const items = ref([
    { name: "消息管理" },
    { name: "回收站" }
  ])
	// 恢复消息
	const deleteMessageRef = ref()
	const renew = (row:IMessageInfoData) => {
		deleteMessageRef.value.open("recover", row)
	}
  // 真删除消息
	const realDelete = (row:IMessageInfoData) => {
		deleteMessageRef.value.open("realDelete", row)
	}
  // 删除成功
  const operationMessageSuccessCB = (tag:string) => {
    if (tag === "recover") {
      bus.emit(CRecycleDialog, RecycleDialogOffType.Recover)
      return
    }
    if (tag === "realDelete"){
      bus.emit(CRecycleDialog, RecycleDialogOffType.Delete)
      return
    }
  }
  // 消息列表监听换页
	const recycleMessageCurrentChange = async (value: number) => {
    recyclePaginationData.currentPage = value
	}
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-content">
				<el-table :data="recycleTableData" style="width: 100%;" border>
					<el-table-column type="index" width="50" />
					<el-table-column label="消息主题" prop="title" />
					<el-table-column label="发布部门" prop="publish_department" />
					<el-table-column label="接收对象" prop="recept_department" />
					<el-table-column label="删除日期">
						<template #default="{row}">
							<div>{{ FormatSecDateYMD(row.delete_time) }}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" fixed="right">
						<template #default="{row}">
							<div>
								<el-button type="success" @click="renew(row)">还原</el-button>
								<el-button type="danger" @click="realDelete(row)">删除</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
        <div class="table-footer">
          <el-pagination :page-size="1" :current-page="recyclePaginationData.currentPage" 
            :pager-count="7" :total="recycleTotal"
            :page-count="recyclePaginationData.pageCount"
            @current-change="recycleMessageCurrentChange" layout="prev, pager, next" />
        </div>
			</div>
		</div>
	</div>
	<deleteMessage ref="deleteMessageRef" @success='operationMessageSuccessCB'></deleteMessage>
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
			display: flex;
			flex-direction: column;

			.table-content {
				padding: 10px 20px 20px;
				margin-bottom: 8px;
				background: #fff;
			}
		}

		.table-footer {
			display: flex;
			justify-content: flex-end;
			background: #fff;
		}
	}

	:deep(.el-table .cell) {
		font-weight: 400;
	}

</style>
