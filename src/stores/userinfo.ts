import { defineStore } from 'pinia'
import { type IGetUserInfoData, getUserInfo } from '@/api/userinfo'
import {ref} from "vue";
import { ElMessage } from 'element-plus'
import { GetImageUrl } from '@/tool/index'

export const useUserInfoStore = defineStore('userinfo', () => {
  const uId = ref<number>()
  const name = ref<string>()
  const account = ref<string>()
  const email = ref<string>()
  const department = ref<string>()
  const imageUrl = ref<string>()
  const identity = ref<string>()
  const sex = ref<number>()
  const userInfo = async (id:number) => {
    const idData:IGetUserInfoData = {
      id: id
    }
    const res = await getUserInfo(idData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    uId.value = res.data.data.id
    name.value = res.data.data.name
    account.value = res.data.data.account
    email.value = res.data.data.email
    department.value = res.data.data.department
    imageUrl.value = GetImageUrl(res.data.data.image_url)
    identity.value = res.data.data.identity
    sex.value = res.data.data.sex
  }
  return {
    uId, name, account, email, department, imageUrl, userInfo, identity, sex
  }
}, {
  persist:true
})
