<script lang="ts" setup>
  import '@wangeditor/editor/dist/css/style.css'
  import {
    onBeforeUnmount, ref, shallowRef,
    reactive, computed
  } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { ElMessage } from "element-plus"
  import { 
    type IChangeCompanyIntroduceData, 
    type IGetCompanyIntroduceData,
    changeCompanyIntroduce, 
    getCompanyIntroduce 
  } from '@/api/setting'
  import type { IBaseResponse } from '@/http'
  import { GetImageUrl, GetShowTitle } from '@/tool/index'

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
    ] as never[],
  }
  // 配置编辑器本身的行为和功能
  const editorConfig = {
    // 编辑器还没输入内容时的提示文字
    placeholder: '请输入内容...',
    // 配置编辑器中各个菜单项的行为
    MENU_CONF: {
      // 图片上传的菜单
      uploadImage: {
        // 上传接口地址
        server: `${import.meta.env.VITE_API_BASEURL}/set/uploadCompanyIntroducePicture`,
        // 在上传图片时，用哪个字段名传给后端上传文件名
        fieldName: 'file',
        // 请求方法
        methods: 'post',
        // 设置请求头
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        // 额外参数是否拼接到url上
        metaWithUrl: true,
        // 参数
        meta: {
          key: '',
        },
        // 单个文件上传成功之后
        onSuccess(file:any, response:IBaseResponse) {
        },
        // 自定义插入图片
        customInsert(response:IBaseResponse, insertFn:any) {
          if (response.status !== 0) {
            ElMessage.error(response.message)
            return
          }
          ElMessage.success(response.message)
          insertFn(GetImageUrl(response.data.image_url))
        },
      },
    }
  }
  // 点击确认，修改文案
  const yes = async () => {
    const data:IChangeCompanyIntroduceData = {
      key:title.value!,
      introduce:valueHtml.value!,
    }
    const response = await changeCompanyIntroduce(data)
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    ElMessage.success(response.data.message)
    state.dialogFormVisible = false
    valueHtml.value = ''
  }
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
    valueHtml.value = ''
  })
  // 编辑器创建
  const handleCreated = (editor : any) => {
    editorRef.value = editor
  }
  const handleClose = () => {
    valueHtml.value = ''
  }
  // 弹窗的开关
  const state = reactive({
    dialogFormVisible: false,
  });
  // 取消删除
  const cancel = () => {
    state.dialogFormVisible = false;
    valueHtml.value = ''
  };
  // 暴露open方法
  const open = async (tag:string) => {
    state.dialogFormVisible = true
    title.value = tag
    editorConfig.MENU_CONF.uploadImage.meta.key = tag
    const data:IGetCompanyIntroduceData = {
      key:tag
    }
    const response = await getCompanyIntroduce(data)
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    valueHtml.value = response.data.data.companyIntroduce
  }
  const displayTitle = computed(() => {
    return GetShowTitle(title.value||'');
  });
  // 暴露子组件的内部属性或方法给父组件
  defineExpose({
    open,
  })
</script>

<template>
  <el-dialog v-model="state.dialogFormVisible" :title="displayTitle" width="600px" destroy-on-close @close="handleClose">
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
        :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
        :mode="mode" @onCreated="handleCreated"/>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="yes">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
</style>
