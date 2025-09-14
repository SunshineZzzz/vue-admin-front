<script lang="ts" setup>
  // 删除或者降级用户组件
  import { ref } from 'vue'
  import { changeIdentity, deleteUser } from '@/api/userinfo'
  import { ElMessage } from 'element-plus'
  import { type ISimpleUserInfoData, UserDialogOffType } from '@/define/index'
  import { CIdentityDialogOff } from '@/define/index'
  import { bus } from '@/utils/mitt'

  // 接收父组件传递过来的数据
  const props = defineProps<{
    offDialog: () => void
  }>()
  // 玩家检讨信息
  const simpleUserInfo = ref<ISimpleUserInfoData>()
  // 是否是用户
  const isUser = ref<boolean>(true)
  // 删除或者降级
  const deleteOrDowngrade = async () => {
    if (!isUser.value) {
      const res = await changeIdentity({id:simpleUserInfo.value!.id, identity:'用户'})
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      ElMessage.success(res.data.message)
      dialogFormVisible.value = false
      bus.emit(CIdentityDialogOff, UserDialogOffType.Downgrade)
      return
    }
    const res = await deleteUser({id:simpleUserInfo.value!.id})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    dialogFormVisible.value = false
    props.offDialog()
    bus.emit(CIdentityDialogOff, UserDialogOffType.Delete)
  }
  // 弹窗开关
  const dialogFormVisible = ref(false)
  // 打开编辑管理员的弹窗
  const open = (data:ISimpleUserInfoData) => {
    simpleUserInfo.value = data
    if (simpleUserInfo.value.identity === '超级管理员' || 
    simpleUserInfo.value.identity === '用户管理员' || 
    simpleUserInfo.value.identity === '产品管理员' || 
    simpleUserInfo.value.identity === '部门管理员' ||
    simpleUserInfo.value.identity === '消息管理员') {
      isUser.value = false
    }
    dialogFormVisible.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title='删除操作' width="30%" center>
    <span v-if="!isUser">是否去掉此用户的{{ simpleUserInfo!.identity }}？删除后此用户将重新展现在用户列表中</span>
    <span v-else>请慎重操作，删除后此用户将永久失去登录资格</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="deleteOrDowngrade">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>
