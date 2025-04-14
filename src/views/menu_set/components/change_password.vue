<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { type IChangePasswordData, changePassword } from '@/api/userinfo.js'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import type { FormProps } from 'element-plus'
  import { useUserInfoStore } from '@/stores/userinfo'

  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 路由
  const router = useRouter()
  // 表单对齐方式
  const labelPosition = ref<FormProps['labelPosition']>('top')
  // 表单对象
  const passwordData : IChangePasswordData = reactive({
    id: userInfoStore.uId!,
    oldPassword: '',
    newPassword: '',
  })
  // 表单规则
  const rules = reactive({
    oldPassword: [
      { required: true, message: '请输入您的旧密码', trigger: 'blur' },
    ],
    newPassword: [
      { required: true, message: '请输入您的新密码', trigger: 'blur' },
    ],
  })
  // 控制弹窗
  const state = reactive({
    changePasswordDialog: false,
  })
  // 修改密码
  const changeUserPassword = async () => {
    if (passwordData.newPassword !== passwordData.newPassword) {
      ElMessage.error('两次密码不一致')
      return
    }
    const res = await changePassword(passwordData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    state.changePasswordDialog = false
    await router.push('/login')
  }
  // 打开修改密码的弹窗
  const open = () => {
    state.changePasswordDialog = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form class="login-form" :label-position="labelPosition" :rules="rules">
      <el-form-item label="请输入您的旧密码" prop="oldPassword">
        <el-input v-model="passwordData.oldPassword" placeholder="请输入您的旧密码" show-password />
      </el-form-item>
      <el-form-item label="请输入您的新密码" prop="newPassword">
        <el-input v-model="passwordData.newPassword" placeholder="请输入您的新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changeUserPassword">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>
