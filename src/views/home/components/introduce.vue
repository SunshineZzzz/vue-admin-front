<script lang="ts" setup>
  // 公司介绍组件
  import {
      ref, reactive, computed
  } from 'vue'
  import { type IGetCompanyIntroduceData, getCompanyIntroduce } from '@/api/setting'
  import { ElMessage } from 'element-plus'
  import { RemovePrefix, GetShowTitle } from '@/tool/index'

  // 对话框标题
  const title = ref<string>('')
  // 对话框内容
  const valueHtml = ref<string>('')
  // 控制弹窗
  const state = reactive({
      dialogFormVisible: false,
  });
  // 暴露open方法
  const open = async (tag:string) => {
    state.dialogFormVisible = true
    title.value = tag
    const data:IGetCompanyIntroduceData = {
      key:tag
    }
    const response = await getCompanyIntroduce(data)
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    valueHtml.value = response.data.data.companyIntroduce
    state.dialogFormVisible = true;
  };
  const displayTitle = computed(() => {
    return RemovePrefix(GetShowTitle(title.value||''), "编辑");
  });
  defineExpose({
      open,
  });
</script>

<template>
  <el-dialog v-model="state.dialogFormVisible" :title="displayTitle" width="800px" destroy-on-close center>
    <el-container>
      <el-main>
          <div class="content" v-html="valueHtml"></div>
      </el-main>
    </el-container>
  </el-dialog>
</template>


<style lang="scss" scoped>
  .content {
    text-align: center;
  }

  :deep(.el-main){
    min-height: 500px;
  }
</style>
