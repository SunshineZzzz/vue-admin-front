// 文件列表通用函数
import {
  fileListLength, batchGetFileList, searchFileByName,
} from '@/api/file'
import { ref, reactive, watch } from "vue";
import { bus } from '@/utils/mitt'
import { ElMessage } from 'element-plus'
import { type IFileInfoData, FileDialogOffType, CTablePagingSize, CFileDialogOff } from '@/define/index'

export const useFileTable = () => {
  // 分页数据
  const paginationData = reactive({
    // 总页数
    pageCount: 1,
    // 当前所处页数
    currentPage: 1,
  })
  // 数量
  const total = ref<number>(0)
  // 根据文件名，消息搜索框内容
  const sFileName = ref<string>('')
  // 表格内容
  const tableData = ref<Array<IFileInfoData[]>>([])
  // 返回列表长度
  const returnListLength = async () => {
    const res = await fileListLength()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    total.value = Number(res.data.data.count)
    paginationData.pageCount = Math.ceil(res.data.data.count/CTablePagingSize)
  }
  // 监听换页
  const currentChange = async (value:number) => {
    const res = await batchGetFileList({offset:(paginationData.currentPage-1), limit:CTablePagingSize})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.fileList
  }
  // 通过文件名搜索文件
  const searchFileByNameFunc = async () => {
    if (!sFileName.value) {
      // 当搜索内容清空后，返回当前页面的数据
      currentChange(paginationData.currentPage)
      return
    }
    const res = await searchFileByName({file_name:sFileName.value})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    tableData.value = res.data.data.fileList
  }
  // 当搜索内容清空后，返回当前页面的数据
  const clearInput = async () =>{
    await currentChange(paginationData.currentPage)
  }
  // 文件，外部操作用户后，需要根据操作更新表格
  bus.off(CFileDialogOff)
  bus.on(CFileDialogOff, async (id:number) => {
    // 当前页数
    const current = paginationData.currentPage
    // 创建
    if (id == FileDialogOffType.Create) {
      await returnListLength()
      paginationData.currentPage = 1
      if (current == paginationData.currentPage) {
        currentChange(paginationData.currentPage)
      }
      return
    }
    // 删除
    if (id == FileDialogOffType.Delete) {
      await returnListLength()
      paginationData.currentPage = 1
      if (current == paginationData.currentPage) {
        currentChange(paginationData.currentPage)
      }
      return
    }
  })
  // 初始化
  const initTable = async () => {
    await returnListLength()
    const current = paginationData.currentPage
    paginationData.currentPage = 1
    if (current == paginationData.currentPage) {
      currentChange(paginationData.currentPage)
    }
  }
  // 页码发生变化，触发
  watch (
    () => paginationData.currentPage,
    () => {
      currentChange(paginationData.currentPage)
    },
  )
  return {
    sFileName,
    paginationData,
    total,
    tableData,
    returnListLength,
    searchFileByNameFunc,
    clearInput,
    initTable,
  }
}
