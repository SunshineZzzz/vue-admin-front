<script lang="ts" setup>
  // 删除产品组件
	import { ref } from 'vue'
	import { type IDeleteProductData, deleteProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'

  // 弹窗开关
	const dialogFormVisible = ref(false)
  // 产品编号
	const productId = ref('')

  // 删除产品
	const remove = async () => {
    const data: IDeleteProductData = {
      numberId: productId.value
    }
		const res = await deleteProduct(data)
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
    productId.value = numberId
	}
  // 暴露open
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='删除产品' width="30%" center>
		<span >请慎重操作，删除后将失去此产品的记录</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="remove">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
</style>
