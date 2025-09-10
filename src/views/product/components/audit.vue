<script lang="ts" setup>
  // 审核产品组件
	import { ref, reactive } from 'vue'
	import { type IAuditProductData, auditProduct } from '@/api/product'
	import { ElMessage } from 'element-plus'
  import { useUserInfoStore } from '@/stores/userinfo'

  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 审核表单数据
	const auditFormData: IAuditProductData = reactive({
    numberId: '',
    status: '拒绝',
    remark: '',
    name: userInfoStore.name!,
	})
  // 弹窗开关
	const dialogFormVisible = ref(false)
	
  // 审核
	const audit = async () => {
		const res = await auditProduct(auditFormData)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      dialogFormVisible.value = false
      return
    }
    ElMessage.success(res.data.message)
    emit('success')
    dialogFormVisible.value = false
	}
	// 打开编辑管理员的弹窗
	const open = (numberId: string) => {
		dialogFormVisible.value = true

    auditFormData.numberId = numberId
	}
  // 打开
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits(['success'])
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='审核产品' width="30%" center>
		<div class="describe">确定审核此产品的出库吗？</div>
		<el-radio-group v-model="auditFormData.status" class="ml-4">
			<el-radio label="同意" size="large">同意</el-radio>
			<el-radio label="拒绝" size="large">拒绝</el-radio>
		</el-radio-group>
		<el-input type="textarea" placeholder="请输入审核备注" v-model="auditFormData.remark" />
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="audit">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<style lang="scss" scoped>
	.describe {
		margin-bottom: 8px;
	}
</style>
