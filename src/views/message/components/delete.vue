<script lang="ts" setup>
  // 删除/恢复消息组件
	import { ref } from 'vue'
	import { firstDeleteMessage, messageRecover, messageDelete } from '@/api/message'
	import { ElMessage } from 'element-plus'
  import { useMessageStore} from '@/stores/message'
  import { type IMessageInfoData } from '@/define/index'
  import { useUserInfoStore } from '@/stores/userinfo'

  // 用户消息存储对象
  const messageStore = useMessageStore()
  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 标题
	const title = ref<string>('')
  // 提示
	const tips = ref<string>('')
	// 消息id
	const messageId = ref<number|null>(null)
  // 接收部门
  const receptDepartment = ref<string>('')
	// 弹窗开关
	const dialogFormVisible = ref(false)
  // 操作
	const operationMessage = async () => {
		if (title.value == '删除信息') {
			const res = await firstDeleteMessage({msgId:messageId.value!})
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        dialogFormVisible.value = false
        return
      }
      ElMessage.success(res.data.message)
      emit('success', 'firstDelete')
      dialogFormVisible.value = false
		}
		if (title.value == '恢复消息') {
      const res = await messageRecover({msgId:messageId.value!})
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        dialogFormVisible.value = false
        return
      }
      ElMessage.success(res.data.message)
      emit('success', 'recover')
      dialogFormVisible.value = false
		}
		if (title.value == '真正删除信息') {
      const res = await messageDelete({msgId:messageId.value!})
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        dialogFormVisible.value = false
        return
      }
      ElMessage.success(res.data.message)
      emit('success', 'realDelete')
      dialogFormVisible.value = false
		}

    if (receptDepartment.value === "公告" || receptDepartment.value === "系统" || receptDepartment.value === userInfoStore.department) {
      await messageStore.returnReadList(receptDepartment.value)
    }
	}
	// 打开
	const open = (tag:string, row:IMessageInfoData) => {
    receptDepartment.value = row.recept_department
    messageId.value = row.msg_id

		dialogFormVisible.value = true
    if (tag === 'firstDelete') {
      title.value = '删除信息'
		  tips.value = '您确定要删除这个消息吗？'
    } else if (tag === 'recover') {
      title.value = '恢复消息'
      tips.value = '您确定要恢复这个消息吗？'
    } else if (tag === 'realDelete') {
      title.value = '真正删除信息'
      tips.value = '请慎重操作！您确定要真正删除这个消息吗？'
    }
	}
  // 暴露
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits<{
    success: [tag: string]
  }>();
</script>

<template>
	<el-dialog v-model="dialogFormVisible" :title='title' width="30%" center>
		<span v-if="title=='删除信息'" v-html="tips"></span>
		<span v-else-if="title=='恢复消息'" v-html="tips"></span>
		<span v-else v-html="tips"></span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="operationMessage">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
</style>
