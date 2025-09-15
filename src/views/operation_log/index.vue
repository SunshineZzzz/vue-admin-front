<script lang='ts' setup>
  // 操作日志组件
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useOLogTable } from '@/hooks'
  import { bus } from "@/utils/mitt"
  import { COLogDialogOff, OLogDialogOffType } from '@/define/index'
  import { FormatSecDateYMD } from '@/tool/index'
  import { clearOLogList } from '@/api/olog'
  const { 
    initTable,
    sCategory, 
    paginationData,
    total,
    categoryArr,
    tableData,
    searchOLogListByTypeFunc,
    clearInput,
  } = useOLogTable()

  // 挂在后需要做的事情
  onMounted(async () => {
    await initTable()
  })
  // 面包屑
	const breadcrumb = ref()
	// 面包屑参数
	const items = ref([
    { name: '操作日志',}
  ])
	// 监听换页
	const operationCurrentChange = async (value: number) => {
    paginationData.currentPage = value
	}
  // 操作等级
  const level2Class = (level:string|undefined) =>{
    if (!level) {
      return 'primary'
    }
		if(level=='高级') return 'danger'
		if(level=='中级') return 'warning'
		if(level=='低级') return 'primary'
	}
  // 更新下载次数
  const clearOLogListFunc = () => {
    ElMessageBox.confirm("您确定要清空操作日志吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
    .then(async () => {
      const res = await clearOLogList()
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      ElMessage.success(res.data.message)
      bus.emit(COLogDialogOff, OLogDialogOffType.DeleteAll)
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消清空",
      });
    });
  }
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<div class="table-wrapped">
		<div class="table-top">
			<div class="table-header">
        <div class="search-wrapped">
          <el-select v-model="sCategory" placeholder="请选择操作类型" @change="searchOLogListByTypeFunc()" clearable @clear="clearInput()" style="width: 160px;">
            <el-option v-for="item in categoryArr" :label="item" :value="item" />
          </el-select>
        </div>
				<div class="upload-wrapped">
					<el-button type="danger" @click="clearOLogListFunc">清空操作日志</el-button>
				</div>
			</div>
			<div class="table-content">
				<el-table :data='tableData' style="width: 100%;">
					<el-table-column label="操作者" >
						<template #default="{row}">
							<div :class="level2Class(row.level)">
								<span class="person">{{row.user_name}}</span>
							</div>
						</template>
					</el-table-column>
          <el-table-column prop="category" label="操作类型" />
					<el-table-column prop="content" label="操作内容" />
					<el-table-column label="操作等级">
						<template #default="{row}">
							<el-tag class="ml-2" :type="level2Class(row.level)">{{row.level}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column label="操作时间" width="200">
						<template #default="{row}">
							<div>{{FormatSecDateYMD(row.time)}}</div>
						</template>
					</el-table-column>
				</el-table>
        <div class="table-footer">
          <el-pagination :page-size="1" :current-page="paginationData.currentPage" :pager-count="7"
            :total="total" :page-count="paginationData.pageCount"
            @current-change="operationCurrentChange" layout="prev, pager, next" />
        </div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	:deep(.el-table .cell) {
		font-weight: 400;
	}

	a {
		color: #fff;
		display: block;
		text-decoration: none;
	}

	.person{
		margin-left: 8px;
	}

	.danger{
		border-left: 2px solid red;
	}

	.warning{
		border-left: 2px solid yellow;
	}

	.normal{
		border-left: 0;
	}
</style>
