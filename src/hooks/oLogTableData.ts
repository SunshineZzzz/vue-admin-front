// 操作日志列表通用函数
import {
  searchOLogListByType, GetOLogListLength, BatchGetOLogList, GetOLogType
} from '@/api/olog'
import { ref, reactive, watch } from "vue";
import { bus } from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { CTablePagingSize, COLogDialogOff } from '@/define/index'
import { type IOLogInfoData, OLogDialogOffType } from '@/define/index'

export const useOLogTable = () => {
  // 分页数据
  const paginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 操作日志总数
  const total = ref<number>(0)
  // 操作日志搜索框内容
  const sCategory = ref<string>('')
  // 操作日志类别
  const categoryArr = ref<Array<string>>([])
  // 表格内容
  const tableData = ref<Array<IOLogInfoData[]>>([])
  // 获取操作日志类别
  const getAllCategory = async () => {
    const res = await GetOLogType()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    categoryArr.value = res.data.data.categoryArr
  }
  // 返回操作日志列表长度
  const returnOLogListLength = async () => {
    const res = await GetOLogListLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    total.value = Number(res.data.data.count)
    paginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }
  // 监听换页
  const currentChange = async (value:number) => {
    const res = await BatchGetOLogList({offset:(paginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.ologList
  }
  // 按类型搜索操作日志列表
  const searchOLogListByTypeFunc = async () => {
    if (!sCategory.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchOLogListByType({type:sCategory.value})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.ologList
  }
  // 当搜索内容清空后，返回当前页面的数据
  const clearInput = async () =>{
    await currentChange(paginationData.currentPage)
  }
  // 外部操作用户后，需要根据操作更新表格
  bus.off(COLogDialogOff)
  bus.on(COLogDialogOff, async (id:number) => {
    // 当前页数
    const current = paginationData.currentPage
    // 删除
    if (id == OLogDialogOffType.DeleteAll) {
      await returnOLogListLength()
      paginationData.currentPage = 1
      if (current == paginationData.currentPage) {
        currentChange(paginationData.currentPage)
      }
      return
    }
  })
  // 初始化
  const initTable = async () => {
    // 先返回操作日志列表长度
    await returnOLogListLength()
    // 获取所有类别
    await getAllCategory()
    // 当前页数
    const current = paginationData.currentPage
    paginationData.currentPage = 1
    if (current == paginationData.currentPage) {
      currentChange(paginationData.currentPage)
    }
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
    sCategory, 
    paginationData,
    total,
    categoryArr,
    tableData,
    currentChange,
    searchOLogListByTypeFunc,
    clearInput,
  }
}
