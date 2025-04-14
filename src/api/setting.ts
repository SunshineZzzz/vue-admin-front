import instance from '@/http/index'

// 修改公司名称接口
export interface IChangeCompanyNameData {
  name: string
}

// 修改公司介绍接口
export interface IChangeCompanyIntroduceData {
  key: string
  introduce: string
}

// 获取公司介绍接口
export interface IGetCompanyIntroduceData {
  key: string
}

// 设置部门
export interface ISetDepartmentData {
  department: string
}

// 设置产品
export interface ISetProductData {
  product: string
}

// 获取所有轮播图
export const getAllSwiper = () => {
  return instance({
    url: '/set/getAllSwiper',
    method: 'POST',
  })
}

// 获取公司名称
export const getCompanyName = () => {
  return instance({
    url: '/set/getCompanyName',
    method: 'POST',
  })
}

// 修改公司名称
export const changeCompanyName = (data:IChangeCompanyNameData) => {
  return instance({
    url: '/set/changeCompanyName',
    method: 'POST',
    data
  })
}

// 编辑公司介绍
export const changeCompanyIntroduce = (data:IChangeCompanyIntroduceData) => {
  return instance({
    url: '/set/changeCompanyIntroduce',
    method: 'POST',
    data
  })
}

// 获取公司介绍
export const getCompanyIntroduce = (data:IGetCompanyIntroduceData) => {
  return instance({
    url: '/set/getCompanyIntroduce',
    method: 'POST',
    data
  })
}

// 获取所有公司信息
export const getAllCompanyInfo = () => {
  return instance({
    url: '/set/getAllCompanyInfo',
    method: 'POST',
  })
}

// 部门设置
export const setDepartment = (data:ISetDepartmentData) => {
  return instance({
    url: '/set/setDepartment',
    method: 'POST',
    data
  })
}

// 获取部门
export const getDepartment = () => {
  return instance({
    url: '/set/getDepartment',
    method: 'POST',
  })
}

// 产品设置
export const setProduct = (data:ISetProductData) => {
  return instance({
    url: '/set/setProduct',
    method: 'POST',
    data
  })
}

// 获取产品
export const getProduct = () => {
  return instance({
    url: '/set/getProduct',
    method: 'POST',
  })
}