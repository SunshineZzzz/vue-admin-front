import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig
} from 'axios'
import { ElMessage } from 'element-plus'

// 定义基础响应数据类型
export interface IBaseResponse<T = any> {
  status: number
  message: string
  data?: T
}

// 创建Axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
  // 设置超时
  timeout: 6000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// 添加请求拦截器
instance.interceptors.request.use(function(config: InternalAxiosRequestConfig) {
  // 在发送请求之前做些什么
  if (localStorage.getItem("token")) {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
}, function(error: AxiosError) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response: AxiosResponse<IBaseResponse>) {
  // 2xx 范围内的状态码都会触发该函数, 对响应数据做点什么
  if(response.data.status || response.data.message) {
    if (response.data.status === 0) {
    } else {
    }
  }
  return response;
}, function(error: AxiosError<IBaseResponse>) {
  // 超出 2xx 范围的状态码都会触发该函数, 对响应错误做点什么
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        ElMessage.error("请求错误")
        break
      case 401:
        ElMessage.error("未授权，请登录")
        break
      case 403:
        ElMessage.error("拒绝访问")
        break
      case 404:
        ElMessage.error(`请求地址出错: ${error.response.config.url}`)
        break
      case 408:
        ElMessage.error("请求超时")
        break
      case 500:
        ElMessage.error("服务器内部错误")
        break
      case 501:
        ElMessage.error("服务未实现")
        break
      case 502:
        ElMessage.error("网关错误")
        break
      case 503:
        ElMessage.error("服务不可用")
        break
      case 504:
        ElMessage.error("网关超时")
        break
      case 505:
        ElMessage.error("HTTP版本不受支持")
        break
      default:
    }
  } else {
    if (error.code == "ERR_NETWORK") {
      ElMessage.error("网络异常，请检查网络连接")
    }
  }
  return Promise.reject(error);
});

export default instance