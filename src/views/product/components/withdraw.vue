<script lang="ts" setup>
  // 撤回产品申请组件
	import { ref } from 'vue'
	import { type IWithdrawApplyProductData, withdrawApplyProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'

  // 撤回申请的id
	const withdrawId = ref('')
  // 弹窗开关
	const dialogFormVisible = ref(false)
  // 撤回申请
	const withdraw = async () => {
    const data: IWithdrawApplyProductData = {
      numberId: withdrawId.value
    }
	const res = await withdrawApplyProduct(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      dialogFormVisible.value = false
      return
    }
    ElMessage.success(res.data.message)
    emit('success')
    dialogFormVisible.value = false   
	}
	// 打开
	const open = (numberId: string) => {
		dialogFormVisible.value = true
    withdrawId.value = numberId
	}
  // 暴露open
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='撤回申请' width="30%" center>
		<span >确定取消此产品的出库申请吗？</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="withdraw">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
</style>
