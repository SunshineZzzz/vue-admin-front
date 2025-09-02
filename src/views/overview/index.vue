<script lang='ts' setup>
  // 系统概览组件
  import { onMounted, ref } from 'vue'
  import breadCrumb from '@/components/bread_crumb.vue'
  import SvgIcon from '@/components/svgicon.vue'
  import * as echarts from 'echarts';
  import { useRouter } from 'vue-router'
  import { useUserInfoStore } from '@/stores/userinfo'
  import {
    getCategoryAndTotalPrice,
    getIdentityAndNumber,
    getLevelAndNumber,
    getDayAndNumber
  } from '@/api/overview'
  import { ElMessage } from 'element-plus'
  
  // 挂在后需要做的事情
  onMounted(() => {
    manageUser()
    productCategoryBar()
    massageLevel()
    massageAllDay()
  })
  // 用户信息
  const userInfoStore = useUserInfoStore()
  // 面包屑参数
  const items = ref([
    { name: "系统概览" }
  ])
  // 路由
  const router = useRouter()
  // 跳转
  const routerTo = (x: string) => {
    router.push(`\/${x}`)
  }
  // 管理员与用户，饼图
  const manageUser = async () => {
    // 通过类名初始化echars
    const mu = echarts.init(document.querySelector('.manage-user') as HTMLElement)
    // 数据
    let data = []
    // 加载
    mu.showLoading()
    // 获取数据
    const res = await getIdentityAndNumber()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      // [{name: '超级管理员', value: '1'}, ...]
      data = res.data.data.rstArr
    }
    // 加载完毕
    mu.hideLoading()
    // 设置基本的参数
    mu.setOption({
      title: {
        text: '管理与用户对比图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        padding: [20, 20, 20, 20]
      },
      series: [{
        type: 'pie',
        radius: '65%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })
    // 用于echarts响应式，随着页面变化
    window.addEventListener('resize', function() {
      mu.resize()
    })
  }

  // 产品类别库存总价图
  const productCategoryBar = async () => {
    const pcb = echarts.init(document.querySelector('.product-category-bar') as HTMLElement)
    let data = {category:[],price:[]}
    pcb.showLoading()
    const res = await getCategoryAndTotalPrice()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      data = res.data.data.rstArr
    }
    pcb.hideLoading()
    pcb.setOption({
      title: {
        text: "产品类别库存总价图",
        top: "3%",
        textStyle: {
          fontSize: 16
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: data.category
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: data.price,
          type: 'bar',
          barWidth: 40,
          colorBy: "data"
        }
      ]
    })
    window.addEventListener('resize', function() {
      pcb.resize()
    })
  }

  // 公告等级分布图
  const massageLevel = async () => {
    const ml = echarts.init(document.querySelector('.massage-level') as HTMLElement)
    ml.showLoading()
    let data = []
    const res = await getLevelAndNumber()
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      data = res.data.data.rstArr
    }
    ml.hideLoading()
    ml.setOption({
      title: {
        text: "公告等级分布图",
        top: "3%",
        textStyle: {
          fontSize: 16
        },
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: data,
      }]
    })
    window.addEventListener('resize', function() {
      ml.resize()
    })
  }

  // 每日登录人数图
  const massageAllDay = async () => {
    const mad = echarts.init(document.querySelector('.login-week') as HTMLElement)
    mad.showLoading()
    let data = {week:[], number:[]}
    const res = await getDayAndNumber({
      rangeDay:7
    })
    if (res.data.status !== 0) {
      ElMessage.error(res.data.message)
    } else {
      // {week:['9', '18'], number:['2025-08-31', '2025-09-01']}
      data = res.data.data.rstArr
    }
    mad.hideLoading()
    mad.setOption({
      title: {
        text: "每日登录人数图",
        top: "3%",
        textStyle: {
          fontSize: 16
        },
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: data.week
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.number,
        type: 'line'
      }]
    })
    window.addEventListener('resize', function() {
      mad.resize()
    })
  }
</script>

<template>
  <breadCrumb :items='items'></breadCrumb>
  <!-- 总览包装 -->
  <div class="overview-wrapped">
    <!-- 顶部内容包装 -->
    <div class="top-content-wrapped">
      <!-- 个人信息 -->
      <div class="person-info">
        <!-- 用户头像包装 -->
        <div class="person-avatar-wrapped">
          <el-avatar :size="100" :src="userInfoStore.imageUrl" />
          <span class="department">所属部门：{{userInfoStore.department}}</span>
          <div class="company">123</div>
        </div>
        <!-- 竖线 -->
        <div class="line-wrapped">
          <div class="line"></div>
        </div>
        <!-- 详细信息包装 -->
        <div class="detail-info-wrapped">
          <p>姓名：{{userInfoStore.name}}</p>
          <p>性别：{{userInfoStore.sex}}</p>
          <p>身份：{{userInfoStore.identity}}</p>
        </div>
      </div>
      <!-- 管理员与用户，饼图 -->
      <div class="manage-user pie"></div>
    </div>
    <!-- 中间内容包装 -->
    <div class="mid-content-wrapped">
      <!-- 产品类别库存总价图 -->
      <div class="product-category-bar mid-content-left"></div>
      <!-- 常用管理 -->
      <div class="mid-content-right">
        <div class="title">常用管理</div>
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="button-area" @click="routerTo('users_manage')">
              <SvgIcon icon-name="user" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">用户管理</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('product_manage_list')">
              <SvgIcon icon-name="product" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">产品管理</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('message_list')">
              <SvgIcon icon-name="notice" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">系统消息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon icon-name="me" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">个人信息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area">
              <SvgIcon icon-name="message" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">部门信息</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="button-area" @click="routerTo('set')">
              <SvgIcon icon-name="set" style="width: 24px;height: 24px;"></SvgIcon>
              <span class="button-name">系统设置</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 底部内容外壳 -->
    <div class="footer-content-wrapped">
      <!-- 公告登记分布图 -->
      <div class="massage-level footer-content-left"></div>
      <!-- 每日登录人数图 -->
      <div class="login-week footer-content-right"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  // 总览内容
  .overview-wrapped {
    padding: 8px;
    height: calc(100vh - 101px);
    background: #f8f8f8;

    // 上部分内容 个人资料 + 饼状图
    .top-content-wrapped {
      height: 30%;
      display: flex;

      // 个人信息
      .person-info {
        height: 100%;
        margin-right: 8px;
        width: calc(50% - 8px);
        display: flex;
        background: #fff;

        // 头像区域
        .person-avatar-wrapped {
          display: flex;
          width: 50%;
          height: 100%;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          // 公司
          .company {
            margin: 10px 0;
            font-size: 12px;
          }

          // 职务
          .department {
            margin-top: 8px;
            font-size: 12px;
          }

        }

        // 分割线
        .line-wrapped {
          height: 100%;
          display: flex;
          align-items: center;

          .line {
            height: 170px;
            border: 1px solid #D3D3D3;
          }
        }

        // 详细信息区域
        .detail-info-wrapped {
          height: 100%;
          width: calc(50% - 1px);
          margin-left: 50px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
      }

      // 饼状图
      .pie {
        width: calc(50%);
        height: 100%;
        background: #fff;
      }
    }

    // 中间部分内容 消息阅读量图 产品类别图
    .mid-content-wrapped {
      margin-top: 8px;
      height: calc(32% - 8px);
      display: flex;

      // 中间左部分
      .mid-content-left {
        margin-right: 8px;
        width: calc(60% - 8px);
        background: #fff;
      }

      // 中间右部分
      .mid-content-right {
        width: calc(40%);
        background: #fff;
        padding: 8px;

        // 标题
        .title {
          font-size: 14px;
          margin-bottom: 8px;
        }

        // 按钮区域
        .button-area {
          margin-bottom: 8px;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          background: #F5F5F5;

          // 按钮名字
          .button-name {
            margin-top: 10px;
          }
        }

        // 按钮变色
        .button-area:hover {
          background: #e4efff;
        }
      }
    }

    // 底部内容
    .footer-content-wrapped {
      margin-top: 8px;
      height: calc(38% - 8px);
      display: flex;

      // 底部左部分
      .footer-content-left {
        margin-right: 8px;
        height: 100%;
        width: calc(30% - 8px);
        background: #fff;
      }

      // 底部右部分
      .footer-content-right {
        height: 100%;
        width: calc(70%);
        background: #fff;
      }
    }
  }
</style>
