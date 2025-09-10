<script lang="ts" setup>
	// 创建产品组件
	import { reactive, ref } from 'vue'
	import { type ICreateProductData, createProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'
  import type { FormProps } from 'element-plus'
	import { getProduct } from '@/api/setting'

  // 表单对齐方式
	const labelPosition = ref<FormProps['labelPosition']>('left')
	// 弹窗开关
	const dialogFormVisible = ref(false)
  // 创建产品表单
  const createProductFormData: ICreateProductData = reactive({
    numberId: '',
	  category: '',
	  name: '',
	  unit: '',
	  quantity: 0,
	  price: 0,
    remark: '',
  })
  // 产品数组
  const productDynamicTags = ref<Array<string>>([])
  // 获取产品数据
  const getProductData = async () => {
    const res = await getProduct()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    productDynamicTags.value = JSON.parse(res.data.data.product)
  }
  // 主动获取
  getProductData()
  // 表单规则
	const rules = reactive({
		numberId: [
			{ required: true, message: '请输入入库编号', trigger: 'blur' },
		],
		name: [
			{ required: true, message: '请输入产品名称', trigger: 'blur' },
		],
		category: [
			{ required: true, message: '请选择产品类别', trigger: 'blur' },
		],
		unit: [
			{ required: true, message: '请选择产品单位', trigger: 'blur' },
		],
		quantity: [
			{ required: true, message: '请输入产品入库数量', trigger: 'blur' },
		],
		price: [
			{ required: true, message: '请输入产品入库单价', trigger: 'blur' },
		],
	})
	// 产品出库
	const add = async () => {
		const res = await createProduct(createProductFormData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      dialogFormVisible.value = false
      return
    }
    ElMessage.success(res.data.message)
    emit('success')
    dialogFormVisible.value = false    
	}
	// 打开创建管理员的弹窗
	const open = () => {
		dialogFormVisible.value = true
	}
  // 暴露open
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='添加产品入库' width="600px" align-center draggable>
		<div class="dialog-content">
			<el-form ref="ruleFormRef" :model="createProductFormData" :label-position="labelPosition" :rules="rules"
				label-width="120px">
				<el-form-item label="入库编号" prop="numberId">
					<el-input v-model="createProductFormData.numberId" />
				</el-form-item>
				<el-form-item label="产品名称" prop="name">
					<el-input v-model="createProductFormData.name" />
				</el-form-item>
				<el-form-item label="产品类别" prop="category">
					<el-select v-model="createProductFormData.category" placeholder="请选择产品类别">
						<el-option v-for="item in productDynamicTags" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
				<el-form-item label="产品单位" prop="unit">
					<el-select v-model="createProductFormData.unit" placeholder="请选择产品单位">
						<el-option label="个" value="个" />
						<el-option label="件" value="件" />
					</el-select>
				</el-form-item>
				<el-form-item label="产品入库数量" prop="quantity">
					<el-input v-model="createProductFormData.quantity" />
				</el-form-item>
				<el-form-item label="产品入库单价" prop="price">
					<el-input v-model="createProductFormData.price" />
				</el-form-item>
				<el-form-item label="入库备注" prop="remark">
					<el-input v-model="createProductFormData.remark" :rows="2" type="textarea" />
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="add">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
	.dialog-content {
		display: flex;
		padding: 20px 30px;
	}

	:deep(.el-form-item) {
		margin: 30px;
	}
</style>
