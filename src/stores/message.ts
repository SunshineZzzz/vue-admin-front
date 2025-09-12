import { defineStore } from 'pinia'
import { type IGetDepartmentMsgByIdsData, getUserDepartmentIds, getDepartmentMsgByIds } from '@/api/department_message'
import {ref} from "vue";
import { ElMessage } from 'element-plus'
import { type IMessageInfoData } from '@/define/index'

export const useMessageStore = defineStore('messageinfor', () => {
  const read_list = ref<number[]>([])
  const msg_list =ref<IMessageInfoData[]>([])

  // 获取要读取的消息
  const returnReadList = async(department:string) => {
    const res = await getUserDepartmentIds({department:department})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    res.data.data.idArr.forEach((id: number) => {
      if (!read_list.value.includes(id)) {
        read_list.value.push(id)
      }
    })
  }
  const getMessageList = async() => {
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
        break
      }
      const data:IGetDepartmentMsgByIdsData = {
        ids: JSON.stringify(idsToFetch)
      }
      const res = await getDepartmentMsgByIds(data)
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        break
      }
      if (res.data.data.messageList.length === 0) {
        break
      }
      msg_list.value.push(...res.data.data.messageList)
      currentPage++
    }
    read_list.value = []
  }
  return {
    read_list,
    msg_list,
    returnReadList,
    getMessageList,
  }
}, {
  persist: false,
})
