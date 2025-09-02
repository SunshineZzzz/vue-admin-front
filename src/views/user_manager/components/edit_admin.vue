<script lang="ts" setup>
  // 编辑管理员组件
	import { reactive, ref } from 'vue'
	import { bus } from "@/utils/mitt"
	import { getUserInfo, editAdmin } from '@/api/userinfo'
	import { getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'
  import { CIdentityDialog, UserDialogOffType } from '@/define/index'

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

  // 表单数据接口
  interface FormData {
    id:number,
    account:string,
    name:string,
    sex:number,
    email:string,
    department:string,
  }
  // 表单数据
  const formDataInfo:FormData = reactive({
    id: 0,
    account: '',
    name: '',
    sex: 0,
    email: '',
    department: '',
    identity: '',
  })

  // 表单规则
	const rules = reactive({
		account: [
			{ required: true, message: '请输入管理员的注册账号', trigger: 'blur' },
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
  // 编辑用户
  const edit = async () => {
    const res = await editAdmin({
      id: formDataInfo.id,
      name: formDataInfo.name,
      sex: formDataInfo.sex,
      email: formDataInfo.email,
      department: formDataInfo.department
    })
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    dialogFormVisible.value = false
    bus.emit(CIdentityDialog, UserDialogOffType.Edit)
  }

	// 打开编辑管理员的弹窗
	const open = async (id: number) => {
    const res = await getUserInfo({id: id})
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }

    formDataInfo.id = res.data.data.id
		formDataInfo.account = res.data.data.account
		formDataInfo.name = res.data.data.name
		formDataInfo.sex = res.data.data.sex
		formDataInfo.email = res.data.data.email
		formDataInfo.department = res.data.data.department

		dialogFormVisible.value = true
	}

	defineExpose({
		open
	})
</script>

<template>
	<el-dialog v-model="dialogFormVisible" title='编辑管理员信息' width="600px" align-center draggable>
		<div class="dialog-content">
			<el-form ref="ruleFormRef" :model="formDataInfo" :rules="rules" label-width="100px">
				<el-form-item label="账号" prop="account">
					<el-input v-model="formDataInfo.account" disabled />
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
				<el-button type="primary" @click="edit">
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
