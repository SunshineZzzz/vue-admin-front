<script lang="ts" setup>
  // 用户信息组件
  import { reactive, ref, useTemplateRef } from 'vue'
  import { type ISimpleUserInfoData } from '@/define/index'
  import promote from './promote.vue'
  import edit from './edit_user.vue'
  import remove from './delete_userOrDowngrade.vue'

  // 用户信息
  let userData = reactive<ISimpleUserInfoData>({
      id: 0,
      imageUrl: '',
      account: '',
      name: '',
      email: '',
      sex: 0,
      identity: '',
      department: '',
      status: 0,
  })
  // 暴露给子组件调用，关闭弹窗
  const offDialog = () => {
    dialogUserVisible.value = false
  }
  // 模板引用也可以被用在一个子组件上
  const promoteP = useTemplateRef('promoteP')
  // 赋权弹窗
  const openPromote = (id:number) => {
    promoteP.value?.open(id)
  }
  // 模板引用也可以被用在一个子组件上
  const edit_userP = useTemplateRef('edit_userP')
  // 编辑弹窗
  const openEdit = (id:number) => {
    edit_userP.value?.open(id)
  }
  // 删除或者降权
  const deleteOrDowngradeP = useTemplateRef('deleteOrDowngradeP')
  // 删除或者降权弹窗
  const openDeleteOrDowngrade = () => {
    deleteOrDowngradeP.value?.open(userData)
  }
  // 弹窗开关
  const dialogUserVisible = ref(false)
  // 打开编辑管理员的弹窗
  const open = (data:ISimpleUserInfoData) => {
    Object.assign(userData, data)
    dialogUserVisible.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialogUserVisible" title='用户信息' width="500px" center draggable>
    <el-container>
      <el-aside width="200px">
        <el-avatar shape="square" :size="120" :src="userData.imageUrl" />
      </el-aside>
      <el-main>
        <div>账号：{{userData.account}}</div>
        <div>姓名：{{userData.name}}</div>
        <div>性别：{{userData.sex}}</div>
        <div>部门：{{userData.department}}</div>
        <div>邮箱：{{userData.email}}</div>
        <div>状态：
          <span v-if="userData.status===0">正常</span>
          <span v-else :style="{color:'red'}">冻结</span>
        </div>
      </el-main>
    </el-container>
      <el-footer>
        <span @click="openEdit(userData.id)">编辑</span>
        <span @click="openPromote(userData.id)">赋权</span>
        <span @click="openDeleteOrDowngrade()">删除/降级用户</span>
      </el-footer>
  </el-dialog>
  <promote ref="promoteP" :offDialog="offDialog"></promote>
  <edit ref="edit_userP" :offDialog="offDialog"></edit>
  <remove ref="deleteOrDowngradeP" :offDialog="offDialog"></remove>
</template>

<style lang="scss" scoped>
  .el-main > div {
    margin-bottom: 8px;
  }

  .el-main {
    --el-main-padding: 0px;
  }

  .el-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    --el-footer-height: 40px;

    span {
      margin-left: 8px;
      color: #409eff;
      cursor: pointer;
    }
  }
</style>
