<script lang="ts" setup>
  // 首页组件
  import { ref, useTemplateRef } from 'vue'
  import breadCrumb from '@/components/bread_crumb.vue'
  import introduce from './components/introduce.vue'
  import { getAllSwiper, getAllCompanyInfo } from '@/api/setting'
  import { type IBatchMessageListByReceptDepartment, batchMessageListByReceptDepartment } from '@/api/message'
  import { ElMessage } from 'element-plus'
  import { GetDownloadUrl, RemovePrefix, GetShowTitle, FormatSecDateYMD } from '@/tool/index'
  import bulletin from '@/components/common_msg.vue'
  import type { IMessageInfoData } from '@/define'

  // 面包屑参数
  const items = ref([
    { name: "首页" }
  ])
	// 公司公告
	const companyData = ref<IMessageInfoData[]>([])
	// 系统消息
	const systemData = ref<IMessageInfoData[]>([])
  // 获取消息
	const getMessageList = async () =>{
    let data:IBatchMessageListByReceptDepartment = {
      recept_department: '公告',
      offset: 0,
      limit: 5,
    }
    let res = await batchMessageListByReceptDepartment(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
    companyData.value = res.data.data.messageList

    data.recept_department = '系统'
    res = await batchMessageListByReceptDepartment(data)
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
      return
    }
		systemData.value = res.data.data.messageList
	}
	getMessageList()
	// 轮播图
	const imageUrl = ref<string[]>([])
	// 获取轮播图
	const allSwiper = async () => {
    const response =  await getAllSwiper()
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    (response.data.data.swiperArr as string[]).forEach((item: string) => {
      imageUrl.value.push(GetDownloadUrl(item))
    })
	}
  // 获取轮播图
  allSwiper()
  // 公司数据接口
  interface ICompanyDataType {
    key:string;
    set_name:string;
    set_text:string;
  }
	// 公司介绍
	const companyIntroduce= ref<ICompanyDataType[]>([])
	const allCompanyIntroduce = async () => {
		const response = await getAllCompanyInfo()
    if (response.data.status !== 0) {
      ElMessage.error(response.data.message)
      return
    }
    Object.keys(response.data.data.companyInfo).forEach(key => {
      companyIntroduce.value.push({
        key: key,
        set_name: RemovePrefix(GetShowTitle(key), "编辑"),
        set_text: response.data.data.companyInfo[key],
      })
    })
	}
  // 获取公司介绍
  allCompanyIntroduce()
	// 模板引用也可以被用在一个子组件上
  const introduceP = useTemplateRef('introduceP')
  // 打开对话框
	const openIntroduce = (tag:string) => {
    introduceP.value?.open(tag)
	}
	// 模板引用也可以被用在一个子组件上
  const bulletinP = useTemplateRef('bulletinP')
  // 双击公司公告行
	const dblOpenCompany = (row:any) =>{
		bulletinP.value?.open(row)
	}
  // 双击系统消息行
	const dblOpenSystem = (row:any) =>{
    bulletinP.value?.open(row)
	}
</script>

<template>
  <breadCrumb :items='items'></breadCrumb>
  <!-- 首页包装 -->
  <div class="home-wrapped">
    <!-- 轮播图包装 -->
    <div class="swiper-wrapped">
			<el-carousel :interval="4000" indicator-position="outside" type="card" height="320px">
				<el-carousel-item v-for="(item,index) in imageUrl" :key="index">
					<img :src="item" class="swiper" alt=""/>
				</el-carousel-item>
			</el-carousel>
    </div>
    <!-- 栅格布局包装 -->
    <div class="layout-wrapped">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item,index) in companyIntroduce" :key='index' @click="openIntroduce(item.key)">
          <div class="company-message-area">
            <span>{{item.set_name}}</span>
            <div v-html='item.set_text' class="company-introduce"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格包装 -->
    <div class="two-table-wrapped">
      <!-- 公司公告 -->
      <div class="company-notice">
        <span class="title">公司公告</span>
        <el-table :data="companyData" style="width: 100%" :show-header='false' @row-dblclick="dblOpenCompany">
          <el-table-column prop="title" label="公告主题">
            <!-- 作用域插槽，获取到子组件数据 -->
            <template #default='{row}'>
              <div class="message_title">{{row.title}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="level" label="等级">
            <template #default='{row}'>
              <el-tag class="mx-1" round v-if="row.level==='一般'">{{row.level}}</el-tag>
              <el-tag type="warning" class="mx-1" round
                v-if="row.level==='重要'">{{row.level}}</el-tag>
              <el-tag type="danger" class="mx-1" round
                v-if="row.level==='必要'">{{row.level}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="publish_department" label="发布部门" />
          <el-table-column prop="recept_department" label="接收部门" />
          <el-table-column prop="create_time" label="发布时间" width="200">
            <template #default="{row}">
              <div>{{FormatSecDateYMD(row.create_time)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 系统消息 -->
      <div class="system-message">
        <span class="title">系统消息</span>
        <el-table :data="systemData" style="width: 100%" :show-header='false' @row-dblclick="dblOpenSystem">
          <el-table-column prop="title" label="公告主题"  />
          <el-table-column prop="level" label="等级">
            <template #default='{row}'>
              <el-tag class="mx-1" round v-if="row.level==='一般'">{{row.level}}</el-tag>
              <el-tag type="warning" class="mx-1" round
                v-if="row.level==='重要'">{{row.level}}</el-tag>
              <el-tag type="danger" class="mx-1" round
                v-if="row.level==='必要'">{{row.level}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="发布时间" width="200">
            <template #default="{row}">
              <div>{{FormatSecDateYMD(row.create_time)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div> 
  </div>
  <introduce ref="introduceP"></introduce>
  <bulletin ref="bulletinP"></bulletin>
</template>

<style lang="scss" scoped>
  // 复用样式
	@mixin table-class {
		height: 232px;
		width: 48%;
		display: flex;
		flex-direction: column;
	}

  // 首页包装
  .home-wrapped {
    padding: 8px;
    height: calc(100vh - 101px);
    background: #f5f5f5;
    display: flex;
    flex-direction: column;

    // 轮播图包装
    .swiper-wrapped {
      padding: 8px;
      margin-bottom: 8px;
      background: #fff;

      // 图片
      .swiper {
        width: 100%;
        height: 100%;
      }
    }

    // 栅格布局包装
    .layout-wrapped {
      padding: 8px;
      margin-bottom: 8px;
      background: #fff;

      // 公司信息区域
      .company-message-area {
        background: #f5f5f5;
        height: 200px;
        padding: 8px;
        cursor: pointer;
        // 关键：确保超出内容被裁剪
        overflow: hidden;
        box-sizing: border-box;

        // 公司信息区域标题
        span {
          border-bottom: 1px solid #409eff;
          font-size: 14px;
        }

        // 公司信息区域内容
				.company-introduce {
          // 让段落内的所有行内元素（如图片）居中
          text-align: center;
          text-indent: 24px;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          line-clamp: 2;
          -webkit-line-clamp: 3;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          
          :deep(img) {
            // 关键：限制图片最大宽度为父容器的100%，防止横向溢出
            max-width: 100%; 
            // 保持图片的宽高比
            height: auto;
            // 将图片作为块级元素处理，便于居中
            display: block;
            // 让块级图片水平居中
            margin: 0 auto; 
          }
				}
      }
      
      // 公司信息区域悬停
      .company-message-area:hover {
        cursor: pointer;
        background-color: #eef5ff;
      }
    }

    // 表格包装
    .two-table-wrapped {
      height: 232px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: #fff;

      // 公司公告
      .company-notice {
        @include table-class
      }

      // 系统消息
      .system-message {
        @include table-class
      }

      // 标题
      .title {
        font-size: 14px;
        margin-bottom: 5px;
        border-bottom: 1px solid #ea0709;
      }

      // 消息标题
      .message_title {
		    overflow: hidden;
		    white-space: nowrap;
		    text-overflow: ellipsis;
	    }
    }
  }

  // 轮播默认样式
  .demonstration {
    color: var(--el-text-color-secondary);
  }
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
</style>