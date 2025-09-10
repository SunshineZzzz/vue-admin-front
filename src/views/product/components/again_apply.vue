<script lang="ts" setup>
  // 再次申请产品出库组件
	import { ref, reactive } from 'vue'
	import { type IApplyOutProductData, applyOutProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'
  import { type IProductInfoData } from '@/define/index'

  // 申请出库
	const applyProduct = async () => {
    const res = await applyOutProduct(applyOutProductData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      dialogFormVisible.value = false
      return
    }
    ElMessage.success(res.data.message)
    emit('success')
    dialogFormVisible.value = false
	}

	// 弹窗开关
	const dialogFormVisible = ref(false)
  // 申请出库数据
	let applyOutProductData: IApplyOutProductData = reactive({
  	numberId: '',
	  quantity: 0,
    remark: '',
	})

	// 打开
	const open = (data:IProductInfoData) => {
		dialogFormVisible.value = true
    applyOutProductData.numberId = data.id
    applyOutProductData.quantity = data.out_quantity
    applyOutProductData.remark = data.remark
	}

  // 暴露open
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits<{
    (e: 'success'): void
  }>()
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='再次申请出库' width="30%" center>
		<span >请确认，此操作将再次申请产品出库</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="applyProduct">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
</style>
