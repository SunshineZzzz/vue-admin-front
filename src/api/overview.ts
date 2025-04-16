import instance from '@/http/index'

export interface IGetDayAndNumberData {
  rangeDay:number
}

// 获取产品类别和其总价
export const getCategoryAndTotalPrice = () => {
  return instance({
    url: '/overview/getCategoryAndTotalPrice',
    method: 'POST',
  })
}

// 获取不同身份和其数量
export const getIdentityAndNumber = () => {
    return instance({
      url: '/overview/getIdentityAndNumber',
      method: 'POST',
    })
}

// 获取不同消息等级与数量
export const getLevelAndNumber = () => {
  return instance({
    url: '/overview/getLevelAndNumber',
    method: 'POST',
  })
}

// 获取每天登录人数
export const getDayAndNumber = (data:IGetDayAndNumberData) => {
  return instance({
    url: '/overview/getDayAndNumber',
    method: 'POST',
    data
  })
}