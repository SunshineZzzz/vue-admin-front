<script lang="ts" setup>
  import { reactive, ref, } from 'vue'
  import { useMessageStore } from '@/stores/message'
  import { FormatSecDateYMD } from '@/tool/index'

  // 用户消息存储对象
  const messageStore = useMessageStore()
  // 当前需要读取的消息数组
  const readList = ref<number[]>(messageStore.read_list)
  // id是否在当前读取的消息数组
  const idInReadList = (id : number) => {
    return (readList.value.indexOf(id) !== -1)
  }
  // 当前点击的消息
  const messageInfo = reactive({
    title: '',
    content: '',
  })
  // 获取部门消息详情
  const getDetail = async (row : any) => {
    messageInfo.title = row.title
    messageInfo.content = row.content
  }
  // 弹窗默认为false
  const dialog = ref(false)
  // 暴露open
  const open = async () => {
    // 获取部门消息
    await messageStore.getMessageList()
    dialog.value = true
  }
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open
  })
</script>

<template>
  <el-dialog v-model="dialog" title="部门消息" width="912px" center destroy-on-close>
    <el-container>
      <el-aside width="416px">
        <div class="message-list-wrapped">
          <div class="list-table-content">
            <el-table :data="messageStore.msg_list" style="width: 100%;" highlight-current-row 
              @row-click="getDetail"
            >
              <el-table-column type="index" width="50" />
              <el-table-column width="5">
                <!-- 作用域插槽，获取到子组件数据 -->
                <template #default='{row}'>
                  <div :class="idInReadList(row.msg_id) ? 'readed' : 'noread'"></div>
                </template>
              </el-table-column>
              <el-table-column label="主题" prop="title">
                <template #default='{row}'>
                  <div class="title-wrapped">
                    <div class="title">{{row.title}}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="等级" prop="level">
                <template #default='{row}'>
                  <el-tag class="mx-1" round
                    v-if="row.level==='一般'">{{row.level}}</el-tag>
                  <el-tag type="warning" class="mx-1" round
                    v-if="row.level==='重要'">{{row.level}}</el-tag>
                  <el-tag type="danger" class="mx-1" round
                    v-if="row.level==='必要'">{{row.level}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="发布日期" prop="create_time">
                <template #default='{row}'>
                  <div>{{FormatSecDateYMD(row.create_time)}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-aside>
      <el-main>
        <div class="detail-wrapped" v-if="messageInfo.title!==''">
          <div>{{messageInfo.title}}</div>
          <div v-html="messageInfo.content"></div>
        </div>
        <div class="detail-wrapped" v-else>
          请点击列表中的消息进行查看
        </div>
      </el-main>
    </el-container>
  </el-dialog>
</template>

<style lang="scss" scoped>
  .el-aside {
    padding-left: 8px;
    min-height: 500px;
  }

  .el-main {
    min-height: 500px;
    --el-main-padding: 0px;
    border-left: 1px solid #eee;
  }

  .message-list-wrapped {
    height: 500px;
  }

  .list-table-content {
    min-height: 10px;
    padding: 8px;
  }

  .el-table {
    height: 100%;

    .title-wrapped {
      display: flex;
      align-items: center;
    }

    .title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .readed {
    display: block;
    width: 5px;
    padding: 1px;
    height: 5px;
    border-radius: 50%;
    background: #A9A9A9;
  }

  .noread {
    display: block;
    width: 5px;
    padding: 1px;
    height: 5px;
    border-radius: 50%;
    background: #FFA500;
  }

  .detail-wrapped {
    padding: 8px;
  }
</style>
