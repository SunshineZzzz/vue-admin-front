<script lang="ts" setup>
  // 赋权组件
  import { ref } from 'vue'
  import { type IChangeIdentify, changeIdentity } from '@/api/userinfo'
  import { ElMessage } from 'element-plus'
  import { UserDialogOffType } from '@/define/index'
  import { CIdentityDialog } from '@/define/index'
  import { bus } from '@/utils/mitt'

  // 接收父组件传递过来的数据
  const props = defineProps<{
    offDialog: () => void
  }>()
  // 用户Id
  const userId = ref<number>(0)
  // 赋权选项
  const radio = ref()
  // 弹窗开关
  const dialogPromoteVisible = ref(false)
  // 确定赋权
  const yes = async () => {
    const data:IChangeIdentify = {
      id: userId.value,
      identity: radio.value,
    }
    const res = await changeIdentity(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    dialogPromoteVisible.value = false
    props.offDialog()
    bus.emit(CIdentityDialog, UserDialogOffType.Promote)
  }
  // 打开编辑管理员的弹窗
  const open = (id:number) => {
    userId.value = id
    dialogPromoteVisible.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialogPromoteVisible" title="赋权操作" center width="30%">
    <el-radio-group v-model="radio" class="ml-4">
      <el-radio label="产品管理员" value="产品管理员" size="large">产品管理员</el-radio>
      <el-radio label="用户管理员" value="用户管理员" size="large">用户管理员</el-radio>
      <el-radio label="消息管理员" value="消息管理员" size="large">消息管理员</el-radio>
    </el-radio-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="yes">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-radio-group {
    display: flex;
    justify-content: center;
  }
</style>
