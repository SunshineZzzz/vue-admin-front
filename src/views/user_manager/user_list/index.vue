<script lang="ts" setup>
  // 用户列表组件
  import { ref, useTemplateRef, onMounted } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import breadCrumb from '@/components/bread_crumb.vue'
  import userinfo from '../components/user_info.vue'
  import { type ISimpleUserInfoData } from '@/define/index'
  import { FormatSecDateYMD, SexFormatter } from '@/tool/index'
  import { useTable } from '@/hooks'
  const {
    initTable,
    sAccount,
    sDepartment,
    paginationData,
    identifyTotal,
    tableData,
    departmentData,
    currentChange,
    searchUserByAccount,
    searchForDepartment,
    clearInput
  } = useTable('用户')
  import { getBanList, banUser, hotUser } from '@/api/userinfo'
  import { ElMessage } from 'element-plus'

  // 挂架完成就搞数据 
  onMounted(async () => {
    await initTable()
  })
  // 面包屑
  const breadcrumb = ref()
  // 面包屑参数
  const items = ref([
    { name: '用户管理'},
    { name: '用户列表'},
  ])
  // 筛选冻结用户
  const banUserList = async () => {
    const res = await getBanList()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.userList
  }
  // 冻结用户
  const banUserById = async (id:number) => {
    const res = await banUser({id})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    await currentChange(paginationData.currentPage)    
  }
  // 解冻用户
  const hotUserById = async (id : number) => {
    const res = await hotUser({id})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    await currentChange(paginationData.currentPage) 
  }
  // 分页
  function pageCurrentChange(page: number) {
    paginationData.currentPage = page
  }
	// 模板引用也可以被用在一个子组件上
  const userinfoP = useTemplateRef('userinfoP')
  // 打开用户信息弹窗
  const openUser = (row:ISimpleUserInfoData) => {
    userinfoP.value?.open(row)
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
        <div class="left-wrapped">
          <div class="search-wrapped">
            <el-input v-model="sAccount" class="w-50 m-2" size="large" placeholder="输入账号进行搜索"
               @change='searchUserByAccount()' clearable @clear='clearInput()'
            >
              <template #prefix>
                <Search />
              </template>
            </el-input>
          </div>
          <div class="select-wrapped">
            <el-select v-model="sDepartment" placeholder="请选择部门" style="width: 200px"
              @change="searchForDepartment()" clearable @clear="clearInput()"
            >
              <el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
            </el-select>
          </div>
        </div>
        <div class="button-wrapped">
          <el-button plain type="primary" @click="banUserList">筛选冻结用户</el-button>
          <el-button plain type="primary" @click="paginationData.currentPage=1">显示全部用户</el-button>
        </div>
      </div>
      <!-- 表格内容 -->
      <div class="table-content">
        <el-table :data="tableData" style="width: 100%" border @row-dblclick='openUser'>
          <el-table-column type="index" width="50" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="sex" label="性别" :formatter="SexFormatter" />
          <el-table-column prop="department" label="部门" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="status" label="状态">
            <!-- 作用域插槽，获取到子组件数据 -->
            <template #default="{row}">
              <div>
                <el-tag v-if="row.status===1" type="danger" class="ml-2">冻结</el-tag>
                <el-tag class="ml-2" type="success" v-else>正常</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
            <template #default="{row}">
              <div>{{FormatSecDateYMD(row.create_time)}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="update_time" label="更新时间">
            <template #default="{row}">
              <div>{{FormatSecDateYMD(row.update_time)}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{row}">
              <div>
                <el-button type="primary" @click="banUserById(row.id)"
                  :disabled='row.status==1'>冻结</el-button>
                <el-button type="success" @click="hotUserById(row.id)"
                  :disabled='row.status==0'>解冻</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 底部 -->
        <div class="table-footer">
          <el-pagination :page-size="1" :current-page="paginationData.currentPage" :pager-count="7"
            :total="identifyTotal" :page-count="paginationData.pageCount" @current-change="pageCurrentChange"
            layout="prev, pager, next" />
        </div>
      </div>
    </div>
  </div>
  <userinfo ref="userinfoP"></userinfo>
</template>

<style lang='scss' scoped>
</style>
