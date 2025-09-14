// 消息列表通用函数
import {
  searchMessageByDepartment, searchMessageByLevel,
  recycleMessageListLength, batchRecycleMessageList,
  getMessageListLength, batchMessageList, 
  searchMessageByReceptDepartment
} from '@/api/message'
import { ref, reactive, watch } from "vue";
import { bus } from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { CTablePagingSize, CMessageDialogOff, CRecycleDialogOff  } from '@/define/index'
import { type IMessageInfoData, MessageDialogOffType, RecycleDialogOffType } from '@/define/index'

export const useMessageTable = () => {
  // 分页数据
  const paginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 回收站分页数据
  const recyclePaginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })

  // 消息数量
  const total = ref<number>(0)
  // 回收站消息数量
  const recycleTotal = ref<number>(0)
  // 根据发布部门，消息搜索框内容
  const sDepartment = ref<string>('')
  // 根据接收部门，消息搜索框内容
  const sReceptDepartment = ref<string>('')
  // 根据级别，消息搜索框内容
  const sLevelRadio = ref<string>('')
  // 消息表格内容
  const tableData = ref<Array<IMessageInfoData[]>>([])
  // 回收站表格内容
  const recycleTableData = ref<Array<IMessageInfoData[]>>([])

  // 返回消息列表长度
  const returnListLength = async () => {
    const res = await getMessageListLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    total.value = Number(res.data.data.count)
    paginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }
  // 返回回收站消息列表长度
  const returnRecycleListLength = async () => {
    const res = await recycleMessageListLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    recycleTotal.value = Number(res.data.data.count)
    recyclePaginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)  
  }
  // 消息监听换页
  const currentChange = async (value:number) => {
    const res = await batchMessageList({offset:(paginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.messageList
  }
  // 回收站消息监听换页
  const recycleCurrentChange = async (value:number) => {
    const res = await batchRecycleMessageList({offset:(recyclePaginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    recycleTableData.value = res.data.data.messageList
  }
  // 通过部门搜索消息
  const searchMsgByDepartment = async () => {
    if (!sDepartment.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchMessageByDepartment({publish_department:sDepartment.value})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.messageList
  }
  // 通过接收部门搜索消息
  const searchMsgByReceptDepartment = async () => {
    if (!sReceptDepartment.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchMessageByReceptDepartment({recept_department:sReceptDepartment.value})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.messageList
  }
  // 通过级别搜索消息
  const searchMsgByLevel = async () => {
    if (!sLevelRadio.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchMessageByLevel({level: sLevelRadio.value})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.messageList
  }
  // 部门清空，当搜索内容清空后，返回当前页面的数据
  const clearInput = async () =>{
    await currentChange(paginationData.currentPage)
  }
  // 级别清空，当搜索内容清空后，返回当前页面的数据
  const levelClearInput = async () =>{
    sLevelRadio.value = ''
    await currentChange(paginationData.currentPage)
  }
  // 消息，外部操作用户后，需要根据操作更新表格
  bus.off(CMessageDialogOff)
  bus.on(CMessageDialogOff, async (id:number) => {
    // 当前页数
    const current = paginationData.currentPage
    // 创建
    if (id == MessageDialogOffType.Create) {
      await returnListLength()
      paginationData.currentPage = 1
      if (current == paginationData.currentPage) {
        currentChange(paginationData.currentPage)
      }
      return
    }
    // 编辑
    if (id == MessageDialogOffType.Edit) {
      await currentChange(current)
      return
    }
    // 删除
    if (id == MessageDialogOffType.Delete) {
      await returnListLength()
      paginationData.currentPage = 1
      if (current == paginationData.currentPage) {
        currentChange(paginationData.currentPage)
      }
      return
    }
  })
  // 回收站消息，外部操作用户后，需要根据操作更新表格
  bus.off(CRecycleDialogOff)
  bus.on(CRecycleDialogOff, async (id:number) => {
    // 当前页数
    const current = recyclePaginationData.currentPage
    // 恢复
    if (id == RecycleDialogOffType.Recover) {
      await returnRecycleListLength()
      recyclePaginationData.currentPage = 1
      if (current == recyclePaginationData.currentPage) {
        recycleCurrentChange(recyclePaginationData.currentPage)
      }
      return
    }
    // 删除
    if (id == RecycleDialogOffType.Delete) {
      await returnRecycleListLength()
      recyclePaginationData.currentPage = 1
      if (current == recyclePaginationData.currentPage) {
        recycleCurrentChange(recyclePaginationData.currentPage)
      }
      return
    }
  })

  // 消息初始化
  const initTable = async () => {
    await returnListLength()
    const current = paginationData.currentPage
    paginationData.currentPage = 1
    if (current == paginationData.currentPage) {
      currentChange(paginationData.currentPage)
    }
  }
  // 回收站消息初始化
  const recycleInitTable = async () => {
    await returnRecycleListLength()
    const current = recyclePaginationData.currentPage
    recyclePaginationData.currentPage = 1
    if (current == recyclePaginationData.currentPage) {
      recycleCurrentChange(recyclePaginationData.currentPage)
    }
  }
  // 页码发生变化，触发
  watch (
    () => paginationData.currentPage,
    () => {
      currentChange(paginationData.currentPage)
    },
  )
  watch (
    () => recyclePaginationData.currentPage,
    () => {
      recycleCurrentChange(recyclePaginationData.currentPage)
    },
  )
  return {
    sReceptDepartment,
    sDepartment,
    sLevelRadio,
    paginationData,
    recyclePaginationData,
    total,
    recycleTotal,
    tableData,
    recycleTableData,
    returnListLength,
    returnRecycleListLength,
    searchMsgByDepartment,
    searchMsgByReceptDepartment,
    searchMsgByLevel,
    clearInput,
    levelClearInput,
    initTable,
    recycleInitTable
  }
}
