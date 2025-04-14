<script lang="ts" setup>
  import breadCrumb from '@/components/bread_crumb.vue'
  import {
    onMounted,
    reactive,
    ref,
    nextTick,
    toRaw,
    useTemplateRef
  } from 'vue'
  import { ElMessage, ElInput } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import type { UploadProps } from 'element-plus'
  import { useUserInfoStore } from '@/stores/userinfo'
  import { type IBaseResponse } from '@/http/index'
  import { GetImageUrl, PubChangeName } from '@/tool/index'
  import change from './components/change_password.vue'
  import editor from './components/editor.vue'
  import {
    type IChangeNameData,
    type IChangeSexData,
    type IChangeEmailData,
    changeName,
    changeSex,
    changeEmail,
  } from '@/api/userinfo'
  import {
    type IChangeCompanyNameData,
    type ISetDepartmentData,
    type ISetProductData,
    getAllSwiper,
    getCompanyName,
    changeCompanyName,
    getDepartment,
    setDepartment,
    getProduct,
    setProduct,
  } from '@/api/setting'

  // 账号详情
  // 模板引用也可以被用在一个子组件上
  const changeP = useTemplateRef('changeP')
  // 用户信息存储对象
  const userInfoStore = useUserInfoStore()
  // 用户数据接口
  interface IUserData {
    account: string,
    name: string,
    sex: number,
    identity: string,
    department: string,
    email: string
  }
  // 用户数据
  const userData: IUserData = reactive({
    account: '',
    name: '',
    sex: 0,
    identity: '',
    department: '',
    email: ''
  })
  // 挂载后需要做的事情
  onMounted(() => {
    userData.account = userInfoStore.account!
    userData.name = userInfoStore.name!
    userData.sex = userInfoStore.sex!
    userData.identity = userInfoStore.identity!
    userData.department = userInfoStore.department!
    userData.email = userInfoStore.email!
  })
  // 头像上传地址 
  const avatarUrl = ref(`${import.meta.env.VITE_API_BASEURL}/user/uploadAvatar`)
  // 面包屑参数
  const items = ref([
    { name: "系统设值" }
  ])
  // 默认打开的标签页
  const activeName = ref('first')
  // 上传头像的请求头
  const uploadHeaders = {
    Authorization: localStorage.getItem("token"),
  }
  // 头像上传成功
  const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response: IBaseResponse,
  ) => {
    if (response.status !== 0) {
      ElMessage.error(response.message)
      return
    }
    ElMessage.success(response.message)
    userInfoStore.$patch({
      imageUrl: GetImageUrl(response.data.image_url)
    })
  }
  // 头像上传之前
  const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('头像必须是jpg格式！!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('头像必须小于2MB!')
      return false
    }
    return true
  }
  // 打开密码弹窗
  const openChangePassword = () => {
    changeP.value?.open()
  }
  // 保存姓名
  const saveName = async () => {
    const data:IChangeNameData = {
      id: userInfoStore.uId!,
      name: userData.name,
    }
    const res = await changeName(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    userInfoStore.$patch({
      name: userData.name
    })
    PubChangeName(userData.name)
  }
  // 保存性别
  const saveSex = async () => {
    const data:IChangeSexData = {
      id: userInfoStore.uId!,
      sex: userData.sex
    }
    const res = await changeSex(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
    userInfoStore.$patch({
      sex: userData.sex
    })
  }
  // 保存邮箱
  const saveEmail = async () => {
    const data:IChangeEmailData = {
      id: userInfoStore.uId!,
      email: userData.email
    }
    const res = await changeEmail(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    }
    ElMessage.success(res.data.message)
    userInfoStore.$patch({
      email: userData.email
    })
  }

  // 首页管理
  // 转播图数组
  const swiperImageUrlArr = ref<string[]>([])
  // 获取轮播图
  const returnAllSwiper = async () => {
    const response = await getAllSwiper()
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    swiperImageUrlArr.value.length = 0
    response.data.data.swiperArr.forEach((item: string) => {
      swiperImageUrlArr.value.push(GetImageUrl(item))
    })
  }
  // 主动调用一次
  returnAllSwiper()
  // 轮播图数据
  const swiperData = [
    {
      swiperId: 1,
    }, 
    {
      swiperId: 2,
    }, 
    {
      swiperId: 3,
    }, 
  ]
  // 轮播图上传地址
  const swiperUrl = ref(`${import.meta.env.VITE_API_BASEURL}/set/uploadSwiper`)
  // 上传轮播图的请求头
  const swiperHeaders = {
    Authorization: localStorage.getItem("token"),
  }
  // 轮播图上传成功
  const wrapHandleSwiperSuccess:(index: number) => UploadProps['onSuccess'] = (index: number) => {
    const handleSwiperSuccess: UploadProps['onSuccess'] = (
      response: IBaseResponse,
    ) => {
      if (response.status !== 0) {
        ElMessage.error(response.message)
        return
      }
      ElMessage.success(response.message)
      swiperImageUrlArr.value[index] = GetImageUrl(response.data.image_url)
    }
    return handleSwiperSuccess
  }
  // 轮播图上传之前
  const beforeSwiperUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('头像必须是jpg格式！!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('头像必须小于2MB!')
      return false
    }
    return true
  }

  // 公司信息
  const companyName = ref<string>()
  // 获取公司名字
  const returnCompanyName = async () => {
    const response = await getCompanyName()
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    companyName.value = response.data.data.companyName
  }
  // 主动调用
  returnCompanyName()
  // 修改公司名字
  const resetCompanyName = async () => {
    const data: IChangeCompanyNameData = {
      name: companyName.value || ""
    }
    const res = await changeCompanyName(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    ElMessage.success(res.data.message)
  }
  // 模板引用也可以被用在一个子组件上
  const editorP = useTemplateRef('editorP')
  // 打开富文本
  const openEditor = (tag:string) => {
    editorP.value?.open(tag)
  }

  // 其他设置
  // 部门设置输入内容
  const departmentInputValue = ref('')
  // 部门数组
  const departmentDynamicTags = ref<Array<string>>([])
  // 部门显示输入框
  const departmentInputVisible = ref<boolean>(false)
  // 部门输入框模板引用
  const departmentInputRef = useTemplateRef('departmentInputRef')
  // 获取部门数据
  const getDepartmentData = async () => {
    const res = await getDepartment()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    departmentDynamicTags.value = JSON.parse(res.data.data.department)
  }
  // 主动获取
  getDepartmentData()
  // 编辑部门
  const departmentShowInput = () => {
    departmentInputVisible.value = true
    // 等待下一次 DOM 更新周期后执行回调函数
    nextTick(() => {
      departmentInputRef.value!.input!.focus()
    })
  }
  // 删除部门
  const departmentHandleClose = async (tag: string) => {
    departmentDynamicTags.value.splice(departmentDynamicTags.value.indexOf(tag), 1)
    const data:ISetDepartmentData = {
      department: JSON.stringify(toRaw(departmentDynamicTags.value))
    }
    const res = await setDepartment(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      ElMessage.success(res.data.message)
    }
  }
  // 增加部门
  const departmentHandleInputConfirm = async () => {
    if (departmentInputValue.value.trim() === '') {
      return
    }
    if (departmentDynamicTags.value.includes(departmentInputValue.value)) {
      ElMessage.error('部门已存在，请重新输入!')
      return
    }
    departmentDynamicTags.value.push(departmentInputValue.value)
    const data:ISetDepartmentData = {
      department: JSON.stringify(toRaw(departmentDynamicTags.value))
    }
    const res = await setDepartment(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      ElMessage.success(res.data.message)
    }
    departmentInputVisible.value = false
    departmentInputValue.value = ''
  }

  // 产品设置输入内容
  const productInputValue = ref('')
  // 产品数组
  const productDynamicTags = ref<Array<string>>([])
  // 产品显示输入框
  const productInputVisible = ref<boolean>(false)
  // 产品输入框模板引用
  const productInputRef = useTemplateRef('productInputRef')
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
  // 编辑产品
  const productShowInput = () => {
    productInputVisible.value = true
    // 等待下一次 DOM 更新周期后执行回调函数
    nextTick(() => {
      productInputRef.value!.input!.focus()
    })
  }
  // 删除产品
  const productHandleClose = async (tag: string) => {
    productDynamicTags.value.splice(productDynamicTags.value.indexOf(tag), 1)
    const data:ISetProductData = {
      product: JSON.stringify(toRaw(productDynamicTags.value))
    }
    const res = await setProduct(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      ElMessage.success(res.data.message)
    }
  }
  // 增加产品
  const productHandleInputConfirm = async () => {
    if (productInputValue.value.trim() === '') {
      return
    }
    if (productDynamicTags.value.includes(productInputValue.value)) {
      ElMessage.error('部门已存在，请重新输入!')
      return
    }
    productDynamicTags.value.push(productInputValue.value)
    const data:ISetProductData = {
      product: JSON.stringify(toRaw(productDynamicTags.value))
    }
    const res = await setProduct(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      ElMessage.success(res.data.message)
    }
    productInputVisible.value = false
    productInputValue.value = ''
  }
</script>

<template>
  <breadCrumb :items='items'></breadCrumb>
  <div class="common-wrapped">
    <div class="common-content">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="账号详情" name="first">
          <div class="account-info-wrapped">
            <span>用户头像: </span>
            <div class="account-info-content">
              <el-upload
                class="avatar-uploader" :action="avatarUrl"
                :show-file-list="false" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="uploadHeaders"
              >
                <img v-if="userInfoStore.imageUrl" :src="userInfoStore.imageUrl" class="avatar" alt="用户头像"/>
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户账号：</span>
            <div class="account-info-content">
              <el-input v-model="userData.account" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户密码：</span>
            <div class="account-info-content">
              <el-button type="primary" @click="openChangePassword">修改密码</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户姓名：</span>
            <div class="account-info-content">
              <el-input v-model="userData.name"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveName">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户性别：</span>
            <div class="account-info-content">
              <el-select v-model="userData.sex" class="m-2" style="width: 240px">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveSex">保存</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户身份：</span>
            <div class="account-info-content">
              <el-input v-model="userData.identity" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户部门：</span>
            <div class="account-info-content">
              <el-input v-model="userData.department" disabled></el-input>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>用户邮箱：</span>
            <div class="account-info-content">
              <el-input v-model="userData.email"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="saveEmail">保存</el-button>
            </div>
          </div>       
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second" v-if="userInfoStore.identity==='超级管理员'">
          <div class="account-info-wrapped">
            <span>公司名称</span>
            <div class="account-info-content">
              <el-input v-model="companyName"></el-input>
            </div>
            <div class="account-save-button">
              <el-button type="primary" @click="resetCompanyName">编辑公司名称</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司介绍</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor('companyIntroduction')">编辑公司介绍</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司架构</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor('companyArchitecture')">编辑公司架构</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司战略</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor('companyStrategy')">编辑公司战略</el-button>
            </div>
          </div>
          <div class="account-info-wrapped">
            <span>公司高层</span>
            <div class="account-info-content">
              <el-button type="success" @click="openEditor('companyLeaders')">编辑公司高层</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="首页管理" name="third" v-if="userInfoStore.identity==='超级管理员'">
          <div class="home-wrapped">
            <!-- 提示 -->
            <div class="tips">
              <span>
                提示: 点击图片框进行切换首页轮播图
              </span>
            </div>
            <!-- 轮播图 -->
            <div class="swiper-wrapped" v-for="(item,index) in swiperData" :key="index">
              <div class="swiper-name">轮播图{{index+1}}:&nbsp;&nbsp;</div>
              <el-upload class="avatar-uploader" :action="swiperUrl"
                :show-file-list="false" :on-success="wrapHandleSwiperSuccess(index)"
                :before-upload="beforeSwiperUpload" :headers="swiperHeaders" 
                :data='item'
              >
                <template #trigger>
                  <img v-if="swiperImageUrlArr[index]" :src="swiperImageUrlArr[index]" class="swiper" alt="轮播图"/>
                  <img src="@/assets/spirit.png" alt="" v-else>
                </template>
              </el-upload>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其他设置" name="fourth">
          <div class="other-set">
            <div class="department-set" v-if="userInfoStore.identity==='超级管理员'">
              <span>部门设置</span>
              <el-tag v-for="tag in departmentDynamicTags" :key="tag" class="mx-1" closable
                :disable-transitions="false" @close="departmentHandleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="departmentInputVisible" ref="departmentInputRef" v-model="departmentInputValue" class="ml-1 w-20"
                size="small" @keyup.enter="departmentHandleInputConfirm" @blur="departmentHandleInputConfirm" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="departmentShowInput">
                + 添加部门
              </el-button>
            </div>
            <div class="product-set" v-if="userInfoStore.identity=='超级管理员'||userInfoStore.identity=='产品管理员'">
              <span>产品设置</span>
              <el-tag v-for="tag in productDynamicTags" :key="tag" class="mx-1" closable
                :disable-transitions="false" @close="productHandleClose(tag)">
                {{ tag }}
              </el-tag>
              <el-input v-if="productInputVisible" ref="productInputRef" v-model="productInputValue"
                class="ml-1 w-20" size="small" @keyup.enter="productHandleInputConfirm"
                @blur="productHandleInputConfirm" />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="productShowInput">
                + 添加产品
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <change ref="changeP"></change>
  <editor ref="editorP"></editor>
</template>

<style lang="scss" scoped>
  // 通用包装
  .common-wrapped {
    padding: 8px;
    background: #f5f5f5;
    // 计算，减去了头部，面包屑，2X8边距
    height: calc(100vh - 101px);

    // 内容
    .common-content {
      padding: 0 10px;
      height: 100%;
      background: #fff;

      // 账号信息包装
      .account-info-wrapped {
        display: flex;
        align-items: center;
        padding-left: 50px;
        margin-bottom: 24px;
        font-size: 14px;

        // 账号信息内容
        .account-info-content {
          margin-left: 24px;
          margin-right: 16px;
        }

        // 按钮
        .account-save-button {
          margin-left: 16px;
        }
      }

      // 首页管理包装
      .home-wrapped {
        padding-left: 50px;
        display: flex;
        flex-direction: column;

        // 提示
        .tips {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          // 提示内容
          span {
            font-size: 14px;
            color: silver;
          }
        }

        // 轮播图
        .swiper-wrapped {
          display: flex;
          margin-bottom: 16px;

          // 轮播图名字
          .swiper-name {
            font-size: 14px;
            margin-bottom: 24px;
          }

          // 轮播图
          .swiper {
            width: 336px;
            height: 96px;
          }
        }
      }

      // 其他设置
      .other-set {
        padding-left: 50px;
        font-size: 14px;

        // 部门设置
        .department-set {
          margin-bottom: 24px;

          span {
            margin-right: 24px;
          }
        }

        // 产品设置
        .product-set {
          span {
            margin-right: 24px;
          }
        }
      }
    }
  }

  // 标签页直接子元素，内容
  .demo-tabs > ::v-deep(.el-tabs__content) {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }

  // 上传头像
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  // 输入框的长度
  :deep(.el-input) {
    width: 240px;
  }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>