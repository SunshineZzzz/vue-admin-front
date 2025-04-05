<script lang="ts" setup>
  import { ref } from 'vue'
  import {
    Menu as IconMenu,
  } from '@element-plus/icons-vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-menu class="el-menu-vertical-demo" router>
          <div class="title">通用后台管理系统</div>
          <el-menu-item index="home">
            <el-icon>
              <House />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
          <!-- el-menu-item index="overview" v-if="userStore.identity=='超级管理员'" -->
          <el-menu-item index="overview">
            <el-icon>
              <Document />
            </el-icon>
            <span>系统概览</span>
          </el-menu-item>
          <!-- el-sub-menu index="3" v-if="userStore.identity=='超级管理员'||userStore.identity=='用户管理员'" -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <!-- el-menu-item-group title="管理员管理"  v-if="userStore.identity=='超级管理员'" -->
            <el-menu-item-group title="管理员管理">
              <el-menu-item index="product_manage" >产品管理员</el-menu-item>
              <el-menu-item index="users_manage" >用户管理员</el-menu-item>
              <el-menu-item index="message_manage" >消息管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="员工管理" >
              <el-menu-item index="user_list" >用户列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!-- el-sub-menu index="4" v-if="userStore.identity=='超级管理员'||userStore.identity=='产品管理员'||userStore.identity=='用户'" -->
          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <TakeawayBox />
              </el-icon>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="入库管理">
              <el-menu-item index="product_manage_list">产品列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="出库管理">
              <el-menu-item index="out_product_manage_list">出库列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!--el-sub-menu index="5" v-if="userStore.identity=='消息管理员'||userStore.identity=='超级管理员'"-->
          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <ChatSquare />
              </el-icon>
              <span>消息管理</span>
            </template>
            <el-menu-item-group title="消息管理">
              <el-menu-item index="message_list">消息列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="回收站">
              <el-menu-item index="recycle">回收站</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
          <!-- el-menu-item index="file" v-if="userStore.identity=='超级管理员'" -->
          <el-menu-item index="file">
            <el-icon><icon-menu /></el-icon>
            <span>合同管理</span>
          </el-menu-item>
          <!-- el-menu-item index="operation_log" v-if="userStore.identity=='超级管理员'" -->
          <el-menu-item index="operation_log">
            <el-icon><icon-menu /></el-icon>
            <span>操作日志</span>
          </el-menu-item>
          <!-- el-menu-item index="login_log" v-if="userStore.identity=='超级管理员'" -->
          <el-menu-item index="login_log">
            <el-icon><icon-menu /></el-icon>
            <span>登录日志</span>
          </el-menu-item>
          <el-menu-item index="set">
            <el-icon>
              <Tools />
            </el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>        
      </el-aside>
      <el-container>
        <el-header>
          <span class="header-left-content">尊敬的 {{name}} 欢迎您登录本系统</span>
          <div class="header-right-content">
            <el-badge :is-dot='msgStore.read_list.length> 0' class="item"
              @click="openDepartmentMessage">
              <el-icon :size="20" class="message">
                <Message />
              </el-icon>
            </el-badge>
            <el-avatar :size="24" :src="userStore.imageUrl" />
            <el-dropdown>
              <span class="el-dropdown-link">
                设置
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>设置账号</el-dropdown-item>
                  <el-dropdown-item>更改头像</el-dropdown-item>
                  <el-dropdown-item @click="goLogin">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
  // 侧边栏
  .el-aside {
    height: 100dvh;
    background: #2b303b;
    width: 210px;
    overflow-x: hidden;

    // 标题
    .title {
      padding: 20px;
      display: flex;
      justify-content: center;
      color: #fff;
      background: #2b303b;
    }

    // 菜单
    .el-menu {
      background: #2b303b;
      width: 210px;
      height: 100dvh;
      border-right: 0;
    }

    // 菜单字体颜色
    .el-menu-item {
      color: #fff;
    }
  }

  // 头部
  .el-header {
    display: flex;
    height: 55px;
    background: #262f3e;
    color: #c1c6c8;
    align-items: center;
    justify-content: space-between;

    // 头部左侧
    .header-left-content {
      font-size: 14px;
    }

    // 头部右侧
    .header-right-content {
      width: 160px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }

  // 徽章
  .item {
    cursor: pointer;
  }

  // 主体内容
  .el-main {
    --el-main-padding: 0;
    background-color: #f3f4fa;
  }

  // 无子菜单的
  .el-menu-item:hover {
    background: #006eff;
  }

  // 有子菜单的
  :deep(.el-sub-menu__title:hover) {
    background: #006eff;
  }

  // 有子菜单字体颜色
  :deep(.el-sub-menu__title) {
    color: #fff;
  }

  // 有子菜单背景颜色
  :deep(.el-menu--inline) {
    background: #2b303b;
  }
</style>