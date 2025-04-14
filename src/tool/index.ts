import { bus } from "@/utils/mitt.js"

// 订阅changename
export function SubChangeName(callback: (name: string) => void) {
  bus.on('changename', callback)
}
// 推送changename
export function PubChangeName(name: string) {
  bus.emit('changename', name)
}

// 获取用户头像url
export function GetImageUrl(url: string|undefined):string {
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