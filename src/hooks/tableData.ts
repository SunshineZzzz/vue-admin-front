// 身份用户列表通用函数
import {
  searchUser, getIdentityNumber, 
  batchGetUser, searchDepartment,
} from '@/api/userinfo'
import { getDepartment } from '@/api/setting'
import { ref, reactive, watch } from "vue";
import { bus } from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { CTablePagingSize, CIdentityDialog } from '@/define/index'
import { type ISimpleUserInfoData, UserDialogOffType } from '@/define/index'

export const useTable = (identity:string) => {
  // 分页数据
  const paginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 身份人数
  const identifyTotal = ref<number>(0)
  // 账号搜索框内容
  const sAccount = ref<string>('')
  // 部门搜索框内容
  const sDepartment = ref<string>('')
  // 部门数据
  const departmentData = ref<Array<string>>([])
  // 表格内容
  const tableData = ref<Array<ISimpleUserInfoData[]>>([])
  // 获取所有部门
  const getAllDepartment = async () => {
    const res = await getDepartment()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    departmentData.value = JSON.parse(res.data.data.department)
  }
  // 返回身份列表长度
  const returnIndetityListLength = async () => {
    const res = await getIdentityNumber({identity:identity})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    identifyTotal.value = Number(res.data.data.count)
    paginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }
  // 获取第一页的数据
  const getFirstPageList = async () => {
    if (identifyTotal.value === 0) {
      tableData.value = []
      return
    }
    const res = await batchGetUser({identity:identity, offset:0, limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.userList
  }
  // 监听换页
  const currentChange = async (value:number) => {
    const res = await batchGetUser({identity:identity, offset:(paginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.userList
  }
  // 通过账号搜索用户
  const searchUserByAccount = async () => {
    if (!sAccount.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchUser({account:sAccount.value, identity:identity})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.userList
  }
  // 通过部门进行搜索
  const searchForDepartment = async () => {
    if (!sDepartment.value) {
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchDepartment({department:sDepartment.value, identity:identity})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.userList
  }
  // 当搜索内容清空后，返回当前页面的数据
  const clearInput = async () =>{
    await currentChange(paginationData.currentPage)
  }
  // 外部操作用户后，需要根据操作更新表格
  bus.on(CIdentityDialog, async (id:number) => {
    // 当前页数
    const current = paginationData.currentPage
    // 创建
    if (id == UserDialogOffType.Create) {
      await returnIndetityListLength()
      await getFirstPageList()
    }
    // 编辑
    if (id == UserDialogOffType.Edit) {
      await currentChange(current)
    }
    // 降职
    if (id == UserDialogOffType.Downgrade) {
      await returnIndetityListLength()
      await getFirstPageList()
    }
    // 删除
    if (id == UserDialogOffType.Delete) {
      await returnIndetityListLength()
      await getFirstPageList()
    }
    // 升职
    if (id == UserDialogOffType.Promote) {
      await returnIndetityListLength()
      await getFirstPageList()
    }
  })
  // 初始化
  const initTable = async () => {
    // 先返回身份列表长度
    await returnIndetityListLength()
    // 获取第一页
    await getFirstPageList()
    // 获取所有部门
    await getAllDepartment()
  }
  // 页码发生变化，触发
  watch (
    // 只监听paginationData对象中的currentPage字段
    () => paginationData.currentPage,
    // 变化后触发函数
    () => {
      currentChange(paginationData.currentPage)
    },
  )
  return {
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
    clearInput,
  }
}
