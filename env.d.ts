// 声明文件中的依赖
/// <reference types="vite/client" />

// 接口合并，增加了VITE_API_BASEURL环境变量属性
interface ImportMetaEnv {
  VITE_API_BASEURL: string
}