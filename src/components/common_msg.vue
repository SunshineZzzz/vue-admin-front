<script lang='ts' setup>
  import { reactive, ref } from 'vue'
  import { FormatSecDateYMD } from '@/tool/index'
  import { type IMessageData } from '@/define/index'

  // 消息信息
  let messageInfo = reactive<IMessageData>({
    id: 0,
    msg_id: 0,
    title: '',
    content: '',
    department: '',
    category: '',
    level: '',
    name: '',
    create_time: 0
  })
  // 弹窗默认为false
  const dialog = ref(false)
  // 暴露open
  const open = async (raw:IMessageData) => {
    messageInfo = raw
    dialog.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialog" :title="messageInfo.category" width="800px" center>
    <el-container>
      <el-main>
        <!-- 主题 -->
        <div class="title">{{messageInfo.title}}</div>
        <!-- 内容 -->
        <div class="content" v-html="messageInfo.content"></div>
      </el-main>
      <el-aside width="200px">
        <div class="publish-msg" v-if="messageInfo.category==='公司公告'||messageInfo.category==='系统消息'">发布部门：{{messageInfo.department}}</div>
        <div class="publish-msg">发布人：{{messageInfo.name}}</div>
        <div class="publish-msg">类别：{{messageInfo.category}}</div>
        <div class="publish-msg" v-if="messageInfo.category=='公司公告'||messageInfo.category=='系统消息'">等级：
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
