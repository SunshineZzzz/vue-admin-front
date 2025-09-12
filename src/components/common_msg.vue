<script lang='ts' setup>
  // 消息弹窗组件
  import { reactive, ref } from 'vue'
  import { FormatSecDateYMD } from '@/tool/index'
  import { type IMessageInfoData } from '@/define/index'

  // 消息信息
  let messageInfo = reactive<IMessageInfoData>({
	  msg_id: null,
    recept_department: '',
	  title: '',
    content: '',
    create_time: 0,
    update_time: 0,
    delete_time: 0,
    user_id: 0,
	  publish_department: '',
	  publish_name: '',
	  level: '',
    status: '',
    click_num: 0,
  })
  // 弹窗默认为false
  const dialog = ref(false)
  // 暴露open
  const open = async (raw:IMessageInfoData) => {
    Object.assign(messageInfo, raw)
    dialog.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialog" :title="messageInfo.title" width="800px" center>
    <el-container>
      <el-main>
        <!-- 主题 -->
        <div class="title">{{messageInfo.title}}</div>
        <!-- 内容 -->
        <div class="content" v-html="messageInfo.content"></div>
      </el-main>
      <el-aside width="200px">
        <div class="publish-msg">接收部门：{{messageInfo.recept_department}}</div>
        <div class="publish-msg">发布人：{{messageInfo.publish_name}}</div>
        <div class="publish-msg">等级：
          <el-tag class="mx-1" round v-if="messageInfo.level==='一般'">{{messageInfo.level}}</el-tag>
          <el-tag type="warning" class="mx-1" round
          v-if="messageInfo.level==='重要'">{{messageInfo.level}}</el-tag>
          <el-tag type="danger" class="mx-1" round
          v-if="messageInfo.level=='必要'">{{messageInfo.level}}</el-tag>
        </div>
        <div class="publish-msg">发布时间：{{FormatSecDateYMD(messageInfo.create_time)}}</div>
      </el-aside>
    </el-container>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-main {
    min-height: 500px;
    --el-main-padding: 0px;
    border-right: 1px solid #eee;
  }

  .el-aside {
    padding-right: 8px;
  }

  .title {
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    margin-bottom: 8px;
    margin-left: 8px;
    border-bottom: 1px solid #eee;
  }

  .content {
    text-align: center;
  }

  .publish-msg {
    height: 32px;
    line-height: 32px;
    font-size: 16px;
    margin-bottom: 8px;
    margin-left: 8px;
    border-bottom: 1px solid #eee;
  }
</style>
