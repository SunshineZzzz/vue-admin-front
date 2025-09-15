import { defineStore } from 'pinia'
import router from '@/router'
import { ref } from "vue"
import { type IMenuInfoData } from '@/define/index'

// 在模块顶层预先获取所有Vue组件模块
const modules = import.meta.glob('@/views/**/*.vue')

export const useMenuStore = defineStore('menuInfo', () => {
  // 菜单数据
  const menuData = ref<IMenuInfoData>()
  
  // 设置路由
  const setRouter = (data: IMenuInfoData) => {
    menuData.value = data
    if (!data) {
      return
    }
    const addedRoutes = ref(new Set<string>())
    
    // compilerMenu 函数现在接受一个可选的父路由名称参数
    function compilerMenu (data: IMenuInfoData, parentName?: string) {
      if(!menuData.value){
        return
      }
      
      const component = modules[`/src/views/${data.component}.vue`];
      if (!component) {
        console.log('组件不存在', data.component)
        return
      }

      if (addedRoutes.value.has(data.path)) {
        console.log('路由已存在', data.path)
        return
      }

      // 动态创建路由对象
      const route= {
        path: data.path,
        name: data.component,
        component: component,
        meta: {
          title: data.meta.title,
        },
      }
      
      // 根据是否有父路由名称来调用 addRoute
      if (parentName) {
        router.addRoute(parentName, route)
      } else {
        router.addRoute(route)
      }
      
      addedRoutes.value.add(data.path)
      
      // 如果存在子路由，递归调用 compilerMenu，并传递当前路由的 name 作为父路由名称
      if (data.children && data.children.length > 0) {
        data.children.forEach((item: IMenuInfoData) => {
          compilerMenu(item, data.component)
        })
      }
    }
    
    // 编译路由，从根节点开始
    compilerMenu(data)
  }
  
  return {
    menuData,
    setRouter
  }
}, {
  persist: true
})