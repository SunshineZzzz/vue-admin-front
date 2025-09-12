<script lang="ts" setup>
  // 登录页面组件
  import { ref, reactive, useTemplateRef } from 'vue'
  import forget from './components/forget_password.vue'
  import {
    type ILoginData, type IRegisterData, register, login
  } from '@/api/login'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useUserInfoStore } from '@/stores/userinfo'
  import { useMessageStore } from '@/stores/message'

  // 用户消息存储对象
  const messageStore = useMessageStore()
  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 路由实例
  const router = useRouter()
  // 登录注册切换
  const activeName = ref('first')
  // 登录表单数据
  const loginData :ILoginData = reactive<ILoginData>({
    account: '',
    password: '',
  })
  // 注册表单数据
  const registerData :IRegisterData = reactive<IRegisterData>({
    account: '',
    password: '',
    rePassword: '',
  })
  // 登录
  const Login = async () => {
    const res = await login(loginData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    const { id, department,token } = res.data.data
    localStorage.setItem("token", token)
    await userInfoStore.userInfo(id)

    messageStore.read_list = []
    messageStore.msg_list = []
    
    await messageStore.returnReadList(department)
    await messageStore.returnReadList('系统')
    await messageStore.returnReadList('公告')
    router.push('/menu')
  }
  // 注册
  const Register = async () => {
    if (registerData.password !== registerData.rePassword) {
      ElMessage.error("两次密码不一致")
      return
    }
    registerData.rePassword = undefined
    const res = await register(registerData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    activeName.value = 'first'
  }
  // 模板引用也可以被用在一个子组件上
  const forgetP = useTemplateRef('forgetP')
  // 打开忘记密码弹窗
  const openForget = () => {
    forgetP.value?.open()
  }
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header-wrapped">
        <div class="header-content">
          <h3>通用后台管理系统</h3>
          <span class="welcome">欢迎您的登录</span>
        </div>
      </el-header>
      <el-main class="main-wrapped">
        <div class="login-wrapped">
          <el-card class="box-card">
            <el-tabs v-model="activeName" :stretch="true">
              <el-tab-pane label="登录" name="first">
                <el-form v-if="activeName==='first'" class="login-form" label-width="auto">
                  <el-form-item label="账号">
                    <el-input v-model="loginData.account" placeholder="请输入账号" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="loginData.password" placeholder="请输入密码" show-password />
                  </el-form-item>
                  <div class="footer-wrapped">
                    <div class="forget-password">
                      <span class="forget-password-button" @click="openForget">忘记密码</span>
                    </div>
                    <div class="footer-button">
                      <el-button type="primary" @click="Login">登录</el-button>
                    </div>
                    <div class="footer-go-register">
                      还没有账号？<span class="go-register" @click="activeName = 'second'">马上注册</span>
                    </div>
                  </div>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="注册" name="second">
                <el-form v-if="activeName==='second'" class="login-form " label-width="auto">
                  <el-form-item label="账号">
                    <el-input v-model="registerData.account" placeholder="账号长度6-12位" />
                  </el-form-item>
                  <el-form-item label="密码">
                    <el-input v-model="registerData.password" placeholder="密码需长度6-12位含字母数字" show-password />
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input v-model="registerData.rePassword" placeholder="请再次输入密码" show-password />
                  </el-form-item>
                  <div class="footer-button">
                    <el-button type="primary" @click="Register">注册</el-button>
                  </div>                  
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </div>
      </el-main>
      <el-footer class="footer-wrapped">
        <div class="footer-content">
          <div class="title">
            <span>Copyright © 2025 通用后台管理系统</span> |
            <span>SunshineZ</span>
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
  <forget ref="forgetP"></forget>
</template>

<style lang="scss" scoped>
  // 头部包装
  .header-wrapped {
    // 头部内容
    .header-content {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      // 欢迎语
      .welcome {
        font-size: 13px;
      }
    }
  }

  // 主体包装
  .main-wrapped {
    background-image: url('@/assets/code.png');
    height: 600px;
    --el-main-padding: 0;
    
    // 登录包装
    .login-wrapped {
      width: 1200px;
      height: 600px;
      margin: 0 auto;

      // 卡片样式
      .box-card {
        width: 350px;
        height: 375px;
        float: right;
        position: relative;
        top: 14%;

        // 登录表单
        .login-form {
          // 登录表单底部
          .footer-wrapped {
            display: flex;
            flex-direction: column;

            // 忘记密码
            .forget-password {
              display: flex;
              justify-content: flex-end;
              margin: 10px 0;

              .forget-password-button {
                font-size: 12px;
                color: #409eff;
                cursor: pointer;
              }
            }

            // 快去注册
            .footer-go-register {
              font-size: 12px;
              margin: 12px 0;
              display: flex;
              justify-content: center;

              .go-register {
                font-size: 12px;
                color: #409eff;
                cursor: pointer;
              }
            }
          }

          // 底部按钮样式
          .footer-button{
              width: 100%;
              display: flex;
              justify-content: center;
            }
        }
      }
    }
  }

  // 底部包装
  .footer-wrapped {
    margin-top: 10px;

    // 底部内容
    .footer-content {
      width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      
      // 底部介绍
      .title {
        color: #666;
      }

      // 底部介绍内容
      span{
        color: #666;
        font-size: 12px;
      }
    }
  }

  // 表单边距
  .el-form {
    margin-top: 30px;
  }

  // 穿透，tabs标签
  :deep(.el-tabs__item) {
    color: #333;
    font-size: 18px;
  }

  // 穿透，输入框高度
  :deep(.el-input__inner) {
    height: 40px;
  }

  // 穿透，输入框标签字体高度
  :deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
  }

  // 穿透，按钮
  :deep(.el-button) {
    width: 300px;
    height: 45px;
    font-size: 16px;
  }
</style>
