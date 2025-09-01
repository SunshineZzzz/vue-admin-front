// vite配置文件

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  // Vite 插件s
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',      
    })
  ],
  // 开发服务器
  server: {
	  // 默认启动时的端口号 
	  port: 8080,
	  // 自动打开默认浏览器
	  open: true,
	  // 允许跨域
	  cors: true,
  },
  // 模块的路径解析
  resolve: {
    alias: {
      // @ 被设置为 src 目录的别名
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
