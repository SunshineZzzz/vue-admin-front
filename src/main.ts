// Vue3核心
import { createApp } from 'vue'
// 状态管理
import pinia from './stores'
// 根组件
import App from './App.vue'
// 路由
import router from './router'
// 图标库
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// UI组件库 
import ElementPlus from 'element-plus'
// UI样式
import 'element-plus/dist/index.css'
// 中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// svg图标
import 'virtual:svg-icons-register'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale: zhCn })
app.mount('#app')
