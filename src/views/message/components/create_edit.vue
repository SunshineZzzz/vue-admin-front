<script lang="ts" setup>
  // 创建/编辑消息组件
	import { onBeforeUnmount, reactive, ref, shallowRef } from 'vue'
	import '@wangeditor/editor/dist/css/style.css'
	import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import type { FormProps } from 'element-plus'
	import { type IPublishMessageData, type IEditMessageData, publishMessage, editMessage } from '@/api/message'
	import { getDepartment } from '@/api/setting'
	import { ElMessage } from 'element-plus'
	import { useMessageStore} from '@/stores/message'
  import { type IMessageInfoData } from '@/define/index'
  import { useUserInfoStore } from '@/stores/userinfo'

  // 用户消息存储对象
  const messageStore = useMessageStore()
  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 表单对齐方式
	const labelPosition = ref<FormProps['labelPosition']>('left')
	// 弹窗开关
	const dialogFormVisible = ref(false)
	// 表单数据
	let formData: IMessageInfoData= reactive({
	  msg_id: null,
    recept_department: "",
	  title: "",
    content: "",
    create_time: 0,
    update_time: 0,
    delete_time: 0,
    user_id: 0,
	  publish_department: "",
	  publish_name: "",
	  level: "",
    status: "",
    click_num: 0,
	})
  // 部门数据
  const departmentData = ref<Array<string>>([])
  // 获取部门
  const getDepartmentData = async () => {
    const res = await getDepartment()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    departmentData.value = JSON.parse(res.data.data.department)
    departmentData.value.push("系统")
    departmentData.value.push("公告")
  }
  // 主动调用
  getDepartmentData()
  // 表单规则
	const rules = reactive({
		title: [
			{ required: true, message: '请输入公告标题', trigger: 'blur' },
		],
		publish_department: [
			{ required: true, message: '请选择发布部门', trigger: 'blur' },
		],
    publish_name: [
      { required: true, message: '请输入发布人', trigger: 'blur' },
    ],
		recept_department: [
			{ required: true, message: '请选择的接收部门', trigger: 'blur' },
		],
		level: [
			{ required: true, message: '请选择公告等级', trigger: 'blur' },
		],
		content: [
			{ required: true, message: '请输入公告内容', trigger: 'blur' },
		],
	})
  // 富文本标题
  const title = ref<string>("")
  // 编辑器实例，必须用shallowRef
  const editorRef = shallowRef()
  // wangEditor的mode类型，default默认编辑模式
  const mode = ref('default')
  // 内容HTML
  const valueHtml = ref<string>('')
  // 自定义wangEditor的工具栏
  const toolbarConfig = {
    // 指定要从工具栏中排除哪些功能按钮
    excludeKeys: [
      'blockquote',
      'bgColor',
      'color',
      'group-more-style',
      'fontFamily',
      'bulletedList',
      'numberedList',
      'lineHeight',
      'todo',
      'emotion',
      'insertLink',
      'group-video',
      'insertTable',
      'codeBlock',
      'divider',
      'fullScreen',
      'group-image',
    ] as never[],
  }
  // 配置编辑器本身的行为和功能
  const editorConfig = {
    // 编辑器还没输入内容时的提示文字
		placeholder: '',
    // 配置编辑器中各个菜单项的行为
		MENU_CONF: {}
  }
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (!editor) return
    editor.destroy()
    valueHtml.value = ''
  })
  // 编辑器创建
  const handleCreated = (editor : any) => {
    editorRef.value = editor
  }
	// 打开
	const open = (tag:string, row?: IMessageInfoData) => {
		dialogFormVisible.value = true

    if (tag === "pubish_message") {
      title.value = "发布消息"
      valueHtml.value = ""

		  formData.msg_id = null
      formData.recept_department = ""
      formData.title = ""
      formData.content = ""
      formData.create_time = 0
      formData.update_time = 0
      formData.delete_time = 0
      formData.user_id= userInfoStore.uId!
      formData.publish_department = userInfoStore.department!
      formData.publish_name = userInfoStore.name!
      formData.level = ""
      formData.status = ""
      formData.click_num = 0
      return
    }

    if (tag === "edit_message") {
      title.value = "编辑消息"
      valueHtml.value = row!.content

      formData = row!
      return
    }
	}
  // 暴露方法
	defineExpose({
		open
	})
  // 子组件向父组件通信
  const emit = defineEmits<{
    success: [tag: string]
  }>();
  // 点击确认，修改文案
	const yes = async () => {
    formData.content = valueHtml.value

    if (title.value === "发布消息") {
      const data: IPublishMessageData = {
        title: formData.title,
        content: formData.content,
        recept_department: formData.recept_department,
        level: formData.level,
        publish_department: formData.publish_department,
        publish_name: formData.publish_name
      }
      const res = await publishMessage(data)
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      ElMessage.success(res.data.message)
      dialogFormVisible.value = false

      if (formData.recept_department === "公告" || formData.recept_department === "系统" || formData.recept_department === userInfoStore.department) {
        await messageStore.returnReadList(formData.recept_department)
      }
      emit('success', "pubish_message")
      return
    }

    if (title.value === "编辑消息") {
      const data: IEditMessageData = {
        msgId: formData.msg_id!,
        title: formData.title,
        content: formData.content,
        recept_department: formData.recept_department,
        level: formData.level,
      }
      const res = await editMessage(data)
      if (res.data.status !== 0) {
        ElMessage.error(res.data.message)
        return
      }
      ElMessage.success(res.data.message)
      dialogFormVisible.value = false
      emit('success', "edit_message")
      return
    }
	}
</script>

<template>
	<el-dialog v-model="dialogFormVisible" :title='title' width="50%" align-center append-to-body
		:destroy-on-close='true'>
		<div class="dialog-content">
			<el-form :model="formData" label-width="120px" style="max-width: 600px;" :rules="rules"
				:label-position="labelPosition">
				<el-form-item label="主题" prop='message_title'>
					<el-input v-model="formData.title" />
				</el-form-item>
				<el-form-item label="发布部门" prop='publish_department'>
          <el-input v-model="formData.publish_department" disabled />
				</el-form-item>
				<el-form-item label="发布人" prop='publish_name'>
					<el-input v-model="formData.publish_name" disabled />
				</el-form-item>
				<el-form-item label="接收部门" prop='recept_department'>
					<el-select v-model="formData.recept_department" placeholder="请选择接收部门">
						<el-option v-for=" item in departmentData" :label="item" :value="item" />
					</el-select>
				</el-form-item>
				<el-form-item label="公告等级" prop='level'>
					<el-select v-model="formData.level" placeholder="选择公告等级">
						<el-option label="一般" value="一般" />
						<el-option label="重要" value="重要" />
						<el-option label="必要" value="必要" />
					</el-select>
				</el-form-item>
				<el-form-item label="内容" prop='content'>
					<div style="border: 1px solid #ccc">
						<!-- wangEditor结构 -->
						<Toolbar style="border-bottom: 1px solid #ccc;width: 600px;" :editor="editorRef"
							:defaultConfig="toolbarConfig" :mode="mode" />
						<Editor style="height: 300px; overflow-y: hidden;width: 600px;" v-model="valueHtml"
							:defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
					</div>
				</el-form-item>

			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="yes">
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
		flex: 1;
		max-height: 800px;
		overflow: auto;
	}

	.el-dialog__body {
		padding: 0;
	}

	.el-input {
		width: 240px;
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
	}

	.el-form-item {
		margin: 16px;
	}

	:deep(.w-e-text-container p) {
		margin: 0;
	}
</style>
