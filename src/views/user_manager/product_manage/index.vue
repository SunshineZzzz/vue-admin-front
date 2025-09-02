<script lang="ts" setup>
  // 产品管理员组件
	import { ref, useTemplateRef, onMounted } from 'vue'
	import { Search } from '@element-plus/icons-vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import createA from '../components/create_admin.vue'
	import editA from '../components/edit_admin.vue'
	import deleteOrDowngradeA from '../components/delete_userOrDowngrade.vue'
  import { type ISimpleUserInfoData, CreateAdminType } from '@/define/index'
  import { SexFormatter } from '@/tool/index'
  import { useTable } from '@/hooks'
    const { 
    initTable,
    sAccount,
    paginationData,
    identifyTotal,
    tableData,
    searchUserByAccount,
    clearInput
  } = useTable('产品管理员')

  // 挂架完成就搞数据 
  onMounted(async () => {
    await initTable()
  })

	// 面包屑
	const breadcrumb = ref()
	// 面包屑参数
  // 面包屑参数
  const items = ref([
    { name: '用户管理'},
    { name: '产品管理员'},
  ])

	// 创建管理员
	const create_admin = useTemplateRef('create_admin')
	const openCreate = (id: CreateAdminType) => {
    create_admin.value?.open(id)
	}

	// 编辑管理员
	const edit_admin = useTemplateRef('edit_admin')
	const openEdit = (id : number) => {
    edit_admin.value?.open(id)
	}

	// 降级管理员
  // 删除or降级
	const deleteOrDowngrade_admin = useTemplateRef('deleteOrDowngrade_admin')
	const openDelete = (raw: ISimpleUserInfoData) => {
    deleteOrDowngrade_admin.value?.open(raw)
	}

  // 分页
  function pageCurrentChange(page: number) {
    paginationData.currentPage = page
  }
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
	<div class="table-wrapped">
		<!-- 顶部 -->
		<div class="table-top">
			<!-- 表格顶部 -->
			<div class="table-header">
				<!-- 搜索框 -->
				<div class="search-wrapped">
					<el-input v-model="sAccount" class="w-50 m-2" size="large" placeholder="输入账号进行搜索"
					 @change='searchUserByAccount()' clearable @clear="clearInput()">
          <template #prefix>
            <Search />
          </template>
          </el-input>
				</div>
				<div class="button-wrapped">
					<el-button type="primary" @click="openCreate(CreateAdminType.createProductAdmin)">添加产品管理员</el-button>
				</div>
			</div>
			<!-- 表格内容 -->
			<div class="table-content">
				<el-table :data="tableData" style="width: 100%" border>
					<el-table-column type="index" width="50" />
					<el-table-column prop="account" label="账号" />
					<el-table-column prop="name" label="姓名" />
					<el-table-column prop="sex" label="性别" :formatter="SexFormatter" />
					<el-table-column prop="department" label="部门" />
					<el-table-column prop="email" label="邮箱" />
					<el-table-column prop="update_time" label="更新时间" >
						<template #default="{row}">
							<div>{{row.update_time?.slice(0,10)}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template #default="{row}">
							<div>
								<el-button type="success" @click="openEdit(row.id)">编辑</el-button>
								<el-button type="danger" @click="openDelete(row)">删除/降级用户</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
      <!-- 底部 -->
      <div class="table-footer">
        <el-pagination :page-size="1" :current-page="paginationData.currentPage" :pager-count="7"
          :total="identifyTotal" :page-count="paginationData.pageCount" @current-change="pageCurrentChange"
          layout="prev, pager, next" />
      </div>
		</div>
	</div>
  <createA ref="create_admin"></createA>
  <editA ref='edit_admin'></editA>
  <deleteOrDowngradeA ref="deleteOrDowngrade_admin" :offDialog="() => {}"></deleteOrDowngradeA>
</template>

<style lang='scss' scoped>
</style>
