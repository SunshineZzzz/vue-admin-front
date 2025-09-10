<script lang="ts" setup>
  // 申请出库组件
	import { ref ,reactive } from 'vue'
	import { type IApplyOutProductData, applyOutProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'
  import type { FormProps } from 'element-plus'
  import { useUserInfoStore } from '@/stores/userinfo'
  import { type IProductInfoData } from '@/define/index'

  // 弹窗开关
	const dialogFormVisible = ref(false)
  // 产品名称
  const product_name = ref('')
  // 产品数量
  const product_in_warehouse_number = ref(0)
  // 产品单价
  const product_price = ref(0)
  // 表单对齐方式
	const labelPosition = ref<FormProps['labelPosition']>('left')
  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()

  // 申请出库数据
	let applyOutProductData: IApplyOutProductData = reactive({
  	numberId: '',
	  quantity: 0,
    remark: '',  
	})

  // 表单规则
	const rules = reactive({
		numberId: [
			{ required: true, message: '请输入申请出库编号', trigger: 'blur' },
		],
		quantity: [
			{ required: true, message: '请输入申请出库数量', trigger: 'blur' },
		],
	})
	
  // 申请出库数据
	const applyProduct = async () => {
		const res = await applyOutProduct(applyOutProductData) as any
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
	const open = (data:IProductInfoData) => {
		dialogFormVisible.value = true
    applyOutProductData.numberId = data.id

    product_name.value = data.name
    product_in_warehouse_number.value = data.quantity
    product_price.value = data.price
	}

  // 暴露open
	defineExpose({
		open
	})
  
  // 子组件向父组件通信
	const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='申请出库' width="600px" align-center draggable>
			<div class="product-name">您申请出库的产品是:&nbsp;&nbsp;{{product_name}}</div>
			<div class="product-name">该产品的库存还有:&nbsp;&nbsp;{{ product_in_warehouse_number }}</div>
			<div class="dialog-content">
				<el-form ref="ruleFormRef" :model="applyOutProductData" :label-position="labelPosition" :rules="rules"
					label-width="120px">
					<el-form-item label="申请出库编号" prop="numberId">
						<el-input v-model="applyOutProductData.numberId" disabled/>
					</el-form-item>
					<el-form-item label="出库数量" prop="quantity">
						<el-input v-model="applyOutProductData.quantity" />
					</el-form-item>
          <el-form-item label="出库申请人">
            <el-input v-model="userInfoStore.name" disabled/>
          </el-form-item>
					<el-form-item label="产品单价" prop="product_single_price">
						<el-input v-model="product_price" disabled/>
					</el-form-item>
					<el-form-item label="申请出库备注" prop="apply_memo">
						<el-input v-model="applyOutProductData.remark" :rows="2" type="textarea" />
					</el-form-item>
				</el-form>
			</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="applyProduct" :disabled='product_in_warehouse_number<applyOutProductData.quantity||applyOutProductData.quantity===0'>
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>


<style lang="scss" scoped>
	.dialog-content {
		display: flex;
		padding: 0 30px 20px 30px;
	}

	.product-name {
		display: flex;
		justify-content: center;
		font-size: 16px;
		margin: 10px;
		color: #333;
	}

	:deep(.el-form-item) {
		margin: 30px;
	}
</style>
