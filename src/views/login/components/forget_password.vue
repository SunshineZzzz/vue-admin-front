<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { FormProps } from 'element-plus'
  import { type IVerifyData, type IResetData, verify, reset } from '@/api/login'
  import { ElMessage } from 'element-plus'

  // 表单对齐方式
  const labelPosition = ref<FormProps['labelPosition']>('top')
  // 控制弹窗
  const state = reactive({
    forgetPasswordDialog: false,
    changePasswordDialog: false,
  })
  // 打开弹窗
  const open = () => {
    state.forgetPasswordDialog = true
  }
  // 重置密码表单数据
  const resetData :IResetData = reactive<IResetData>({
    token: '',
    newPassword: '',
    password: '',
    rePassword: '',
  })
  // 验证账号密码表单数据
  const verifyData :IVerifyData = reactive<IVerifyData>({
    account: '',
    email: '',
  })
  // 表单规则
  const rules = reactive({
    account: 
    [
      { required: true, message: '请输入您的注册账号', trigger: 'blur' },
    ],
    email: 
    [
      { required: true, message: '请输入您的注册邮箱', trigger: 'blur' },
    ],
    password: 
    [
      { required: true, message: '请输入您想修改的密码', trigger: 'blur' },
    ],
    nextPassword: 
    [
      { required: true, message: '请再次确认您的新密码', trigger: 'blur' },
    ],
  })
  // 打开验证邮箱和账号的弹窗
  const verifyAccount = async () => {
    const res = await verify(verifyData)
    if(res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }

    ElMessage.success(res.data.message)
    localStorage.setItem('tmpToken', res.data.data.token)
    state.forgetPasswordDialog = false
    state.changePasswordDialog = true
  }
  // 重置密码
  const resetPassword = async() => {
    if (resetData.password !== resetData.rePassword) {
      ElMessage.error("两次密码不一致")
      return
    }

    resetData.token = localStorage.getItem('tmpToken') as string
    resetData.newPassword = resetData.password as string
    resetData.password = undefined
    resetData.rePassword = undefined
    const res = await reset(resetData)
    if(res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }

    ElMessage.success(res.data.message)
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <!-- 忘记密码 -->
  <el-dialog v-model="state.forgetPasswordDialog" title="忘记密码" width="400px">
    <el-form v-if="state.forgetPasswordDialog" class="login-form" label-width="auto" :label-position="labelPosition" :rules="rules">
      <el-form-item label="输入您的注册账号" prop="account">
        <el-input v-model="verifyData.account" placeholder="输入您的注册账号" />
      </el-form-item>
      <el-form-item label="输入您的个人邮箱" prop="email">
        <el-input v-model="verifyData.email" placeholder="输入您的个人邮箱" />
      </el-form-item>
    </el-form>
    <!-- 底部内容 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.forgetPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="verifyAccount">
          下一步
        </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码 -->
  <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="400px">
    <el-form v-if ="state.changePasswordDialog" class="login-form" label-width="auto" :label-position="labelPosition" :rules="rules">
      <el-form-item label="输入您的新密码" prop="password">
        <el-input v-model="resetData.password" placeholder="输入您的新密码" show-password/>
      </el-form-item>
      <el-form-item label="再次确认您的新密码" prop="nextPassword">
        <el-input v-model="resetData.rePassword" placeholder="再次确认您的新密码" show-password/>
      </el-form-item>
    </el-form>
    <!-- 底部内容 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="state.changePasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="resetPassword">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>