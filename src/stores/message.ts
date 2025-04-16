import { defineStore } from 'pinia'
import { type IGetDepartmentMsgByIdsData, getUserDepartmentIds, getDepartmentMsgByIds } from '@/api/department_message'
import {ref} from "vue";
import { ElMessage } from 'element-plus'
import { type IMessageData } from '@/define/index'

export const useMessageStore = defineStore('messageinfor', () => {
  const read_list = ref<number[]>([])
  const msg_list =ref<IMessageData[]>([])

  // 获取要读取的消息
  const returnReadList = async() => {
    read_list.value = []
    const res = await getUserDepartmentIds()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    read_list.value = res.data.data.idArr
  }
  const getMessageList = async() => {
    msg_list.value = []
    if (read_list.value.length === 0) {
      return
    }
    let currentPage = 1
    const pageSize = 10
    for (;;) {
      const start = (currentPage - 1) * pageSize
      const end = currentPage * pageSize
      const idsToFetch = read_list.value.slice(start, end)
      if (idsToFetch.length === 0) {
        return
      }
      const data:IGetDepartmentMsgByIdsData = {
        ids: JSON.stringify(idsToFetch)
      }
      const res = await getDepartmentMsgByIds(data)
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      if (res.data.data.messageArr.length === 0) {
        return
      }
      msg_list.value.push(...res.data.data.messageArr)
      currentPage++
    }
  }
  return {
    read_list,
    msg_list,
    returnReadList,
    getMessageList,
  }
}, {
  persist: true,
})
