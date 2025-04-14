import instance from '@/http/index'

export interface IGetDayAndNumberData {
    day:number
}

// 获取产品类别和其总价
export const getCategoryAndTotalPrice = () => {
    return instance({
      url: '/overview/getCategoryAndTotalPrice',
      method: 'POST',
    })
}

// 获取不同身份和其数量
export const getIdentityAndNum = () => {
    return instance({
      url: '/overview/getIdentityAndNum',
      method: 'POST',
    })
}

// 

// 获取每天登录人数
export const getDayAndNumber = (data:IGetDayAndNumberData) => {
    return instance({
      url: '/overview/getDayAndNumber',
      method: 'POST',
      data
    })
}