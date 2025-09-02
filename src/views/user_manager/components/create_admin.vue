<script lang="ts" setup>
  // 创建管理员组件
	import { reactive, ref } from 'vue'
	import { type ICreateAdminData, createAdmin } from '@/api/userinfo'
	import { getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'
  import { CreateAdminType, CIdentityDialog, UserDialogOffType } from '@/define/index'
  import { bus } from '@/utils/mitt'

  // 对话框标题
	const title = ref()
  // 弹窗开关
	const dialogFormVisible = ref(false)
	// 部门数据
	const departmentData = ref<string[]>([])
  // 获取部门
	const getDepartmentData = async() => {
    const res = await getDepartment()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    departmentData.value = JSON.parse(res.data.data.department)
	}
	getDepartmentData()

  // 表单数据
	const formDataInfo : ICreateAdminData = reactive({
		account: '',
		password: '',
		name: '',
		sex: 1,
		email: '',
		department: '',
    identity: '',
	})
  // 表单规则
	const rules = reactive({
		account: [
			{ required: true, message: '请输入管理员的注册账号', trigger: 'blur' },
		],
		password: [
			{ required: true, message: '请输入管理员的注册密码', trigger: 'blur' },
		],
		name: [
			{ required: true, message: '请输入管理员的名字', trigger: 'blur' },
		],
		sex: [
			{ required: true, message: '请输入管理员的性别', trigger: 'blur' },
		],
		email: [
			{ required: true, message: '请输入管理员的邮箱', trigger: 'blur' },
		],
		department: [
			{ required: true, message: '请输入管理员的部门', trigger: 'blur' },
		],
	})

	// 创建管理员
	const addAdmin = async () => {
		const res = await createAdmin(formDataInfo)
    if (res.data.status !== 0) {
      dialogFormVisible.value = false
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
		bus.emit(CIdentityDialog, UserDialogOffType.Create)
		dialogFormVisible.value = false
	}

	// 打开创建管理员的弹窗
	const open = (id : CreateAdminType) => {
		if (id == CreateAdminType.createProductAdmin) {
			title.value = '新建产品管理员'
      formDataInfo.identity = '产品管理员'
		}
		else if (id == CreateAdminType.createUserAdmin) {
			title.value = '新建用户管理员'
      formDataInfo.identity = '用户管理员'
		}
		else if (id == CreateAdminType.createMessageAdmin) {
			title.value = '新建消息管理员'
      formDataInfo.identity = '消息管理员'
		}
    else {
      return
    }
		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})
</script>

<template>
	<el-dialog v-model="dialogFormVisible" :title='title' width="600px" align-center draggable>
		<div class="dialog-content">
			<el-form ref="ruleFormRef" :model="formDataInfo" :rules="rules" label-width="100px">
				<el-form-item label="账号" prop="account">
					<el-input v-model="formDataInfo.account" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="formDataInfo.password" show-password/>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="formDataInfo.name" />
				</el-form-item>
				<el-form-item label="性别" prop="sex">
					<el-select v-model="formDataInfo.sex" placeholder="请选择性别">
						<el-option label="男" :value="1" />
						<el-option label="女" :value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="formDataInfo.email" />
				</el-form-item>
				<el-form-item label="部门" prop="department">
					<el-select v-model="formDataInfo.department" placeholder="请选择部门">
						<el-option v-for="item in departmentData" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addAdmin">
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
