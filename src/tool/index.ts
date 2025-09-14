import { bus } from "@/utils/mitt.js"
import { type ISimpleUserInfoData } from '@/define/index'

// 订阅changename
export function SubChangeName(callback: (name: string) => void) {
  bus.off('changename')
  bus.on('changename', callback)
}
// 推送changename
export function PubChangeName(name: string) {
  bus.emit('changename', name)
}

// 获取下载地址
export function GetDownloadUrl(url: string|undefined):string {
  if (url && url !== '') {
    return `${import.meta.env.VITE_API_BASEURL}/${url}`;
  }
  return url || '';
}

// 移除字符串前缀
export function RemovePrefix(str: string, prefix: string):string {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  }
  return str
}

// 获取显示标题
export function GetShowTitle(type:string) {
  switch (type) {
    case 'companyIntroduction':
      return '编辑公司介绍';
    case 'companyArchitecture':
      return '编辑公司架构';
    case 'companyStrategy':
      return '编辑公司战略';
    case 'companyLeaders':
      return '编辑公司高层';
    default:
      return '';
  }
}

// 秒时间戳转日期
export function FormatSecDateYMD(timestamp:number) {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

// 将字节数转换为KB
export function BytesToKB(bytes: number, useBinary: boolean = false, decimalPlaces: number = 2): string {
  if (bytes < 0) {
    throw new Error('字节数不能为负数');
  }
  
  const base = useBinary ? 1024 : 1000;
  const kbValue = bytes / base;
  
  return `${kbValue.toFixed(decimalPlaces)} ${useBinary ? 'KiB' : 'KB'}`;
}

// 性别格式化函数
export const SexFormatter = (data: ISimpleUserInfoData) => {
  if (data.sex === 1) {
    return '男'
  } else if (data.sex === 2) {
    return '女'
  } else {
    return ''
  }
}