<script lang='ts' setup>
  // 消息列表组件
	import { ref, onMounted } from 'vue'
	import breadCrumb from '@/components/bread_crumb.vue'
	import { getDepartment } from '@/api/setting'
	import { bus } from "@/utils/mitt.js"
  import { type IMessageInfoData } from '@/define/index'
	import createEditMessage from '../components/create_edit.vue'
	import deleteMessage from '../components/delete.vue'
  import { ElMessage } from 'element-plus'
  import { useMessageTable } from '@/hooks'
  import { FormatSecDateYMD } from '@/tool/index'
  import { CMessageDialog, MessageDialogOffType } from '@/define/index'
  const { 
    sReceptDepartment,
    sDepartment,
    sLevelRadio,
    paginationData,
    total,
    tableData,
    searchMsgByDepartment,
    searchMsgByReceptDepartment,
    searchMsgByLevel,
    clearInput,
    levelClearInput,
    initTable,
  } = useMessageTable()

  // 挂架完成就搞数据 
  onMounted(async () => {
    await initTable()
  })
	// 面包屑
	const breadcrumb = ref()
  // 面包屑参数
  const items = ref([
    { name: "消息管理" },
    { name: "消息列表" }
  ])
  // 部门数据
  const departmentData = ref<Array<string>>([])
  // 获取部门
  const getDepartmentData = async () => {
    const res = await getDepartment()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    departmentData.value = JSON.parse(res.data.data.department)
    departmentData.value.push("系统")
    departmentData.value.push("公告")
  }
  // 主动调用
  getDepartmentData()
	// 发布公告/编辑公告
	const createEditMessageRef = ref()
	const createEditMessageFunc = (tag:string, row?:IMessageInfoData) => {
		createEditMessageRef.value.open(tag, row)
	}
  // 删除消息
  const deleteMessageRef = ref()
  const deleteMessageFunc = (tag:string, row:IMessageInfoData) => {
    deleteMessageRef.value.open(tag, row)
  }
  // 发布/编辑回调
  const createEditMessageSuccsessCB = (tag:string) => {
    if (tag === 'pubish_message') {
      bus.emit(CMessageDialog, MessageDialogOffType.Create)
      return
    }
    if (tag === 'edit_message') {
      bus.emit(CMessageDialog, MessageDialogOffType.Edit)
      return
    }
  }
  // 删除回调
  const deleteMessageSuccsessCB = (tag:string) => {
    if (tag !== "firstDelete") return
    bus.emit(CMessageDialog, MessageDialogOffType.Delete)
  }
  // 消息列表监听换页
	const messageCurrentChange = async (value: number) => {
		paginationData.currentPage = value
	}
</script>

<template>
	<breadCrumb ref="breadcrumb" :items='items'></breadCrumb>
  <div class="table-wrapped">
    <div class="table-top">
      <div class="table-header">
        <div class="search-wrapped">
          <el-select v-model="sDepartment" placeholder="请选择发布部门" @change="searchMsgByDepartment()" clearable @clear="clearInput()" style="width: 160px;">
            <el-option v-for="item in departmentData" :label="item" :value="item" />
          </el-select>
          <el-select v-model="sReceptDepartment" placeholder="请选择接部门" @change="searchMsgByReceptDepartment" clearable @clear="clearInput()" style="width: 160px;margin-left: 20px;">
            <el-option v-for="item in departmentData" :label="item" :value="item" />
          </el-select>
          <el-radio-group v-model="sLevelRadio" class="ml-4" @change="searchMsgByLevel" style="flex-wrap: nowrap">
            <el-radio label="一般" value="一般">一般</el-radio>
            <el-radio label="重要" value="重要">重要</el-radio>
            <el-radio label="必要" value="必要">必要</el-radio>
          </el-radio-group>
          <el-button @click="levelClearInput()" :disabled="!sLevelRadio" style="margin-left: 20px;">清空筛选</el-button>
        </div>
        <div class="button-wrapped">
          <el-button type="primary" @click="createEditMessageFunc('pubish_message')">发布消息</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="title" label="公告主题" width="320" />
          <el-table-column prop="publish_department" label="发布部门" />
          <el-table-column prop="publish_name" label="发布人" />
          <el-table-column prop="recept_department" label="接收对象" />
          <el-table-column prop="level" label="公告等级" />
          <el-table-column label="发布时间" width="200">
            <template #default="{row}">
              <div>{{ FormatSecDateYMD(row.create_time) }}</div>
            </template>
          </el-table-column>
          <el-table-column label="最新编辑时间" width="200">
            <template #default="{row}">
              <div>{{ FormatSecDateYMD(row.update_time) }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="click_num" label="阅读人数" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{row}">
              <div>
                <el-button type="success" @click="createEditMessageFunc('edit_message', row)">编辑</el-button>
                <el-button type="danger" @click="deleteMessageFunc('firstDelete', row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <div class="table-footer">
            <el-pagination :page-size="1" :current-page="paginationData.currentPage"
              :pager-count="7" :total="total"
              :page-count="paginationData.pageCount"
              @current-change="messageCurrentChange" layout="prev, pager, next" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <createEditMessage ref="createEditMessageRef" @success='createEditMessageSuccsessCB'></createEditMessage>
  <deleteMessage ref="deleteMessageRef" @success='deleteMessageSuccsessCB'></deleteMessage>
</template>

<style lang="scss" scoped>
	.el-radio-group {
		margin-left: 20px;
	}

	:deep(.el-table .cell) {
		font-weight: 400;
	}
</style>
