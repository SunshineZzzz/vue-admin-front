<script lang="ts" setup>
  // 操作文件提示组件
	import { ref } from 'vue'
	import { deleteFile } from '@/api/file'
	import { ElMessage } from 'element-plus'
  import { type IFileInfoData } from '@/define/index'
  import { useUserInfoStore } from '@/stores/userinfo'

  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 对话框标题
	const title = ref<string>()
  // 文件Id
  const fileId = ref<number|null>(null)
	// 弹窗开关
	const dialogFormVisible = ref(false)
  // 操作
	const operationFiles = async () => {
		const res = await deleteFile({file_id:fileId.value!, user_id:userInfoStore.uId!, user_name:userInfoStore.name!})
    if (res.data.status !== 0) {
      dialogFormVisible.value = false
      ElMessage.error(res.data.message)
      return
    }
    dialogFormVisible.value = false
    ElMessage.success(res.data.message)
    emit('success')
	}
	// 打开
	const open = (titleStr:string, row:IFileInfoData) => {
		dialogFormVisible.value = true

    title.value = titleStr
    fileId.value = row.file_id
	}
  // 暴露open方法
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='title' width="30%" center>
		<span>请慎重操作！您确定要真正删除这个文件吗？</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="operationFiles">
					{{ title }}
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
</style>
