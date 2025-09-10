import instance from '@/http/index'

// 创建产品接口
export interface ICreateProductData {
  numberId: string
	category: string
	name: string
	unit: string
	quantity: number
	price: number
  remark: string
}

// 删除产品接口
export interface IDeleteProductData {
  numberId: string
}

// 编辑产品接口
export interface IEditProductData {
  numberId: string
  category: string
  name: string
  unit: string
  quantity: number
  price: number
  remark: string
}

// 产品申请出库接口
export interface IApplyOutProductData {
	numberId: string
	quantity: number
  remark: string
}

// 对产品进行撤回申请接口
export interface IWithdrawApplyProductData {
  numberId: string
}

type statusNames = '同意' | '拒绝';
// 产品审核接口
export interface IAuditProductData {
  numberId: string
  status: statusNames
  remark: string
  name: string
}

// 通过入库编号对产品进行搜索接口
export interface ISearchProductForId {
  numberId: string
  sType: number
}

// 分批获取产品列表接口
export interface IBatchGetProductList {
  offset: number
  limit: number
}
// 分批获取申请出库产品列表接口
export interface IBatchGetApplyProductList extends IBatchGetProductList {} 
// 分批获取出库产品列表接口
export interface IBatchGetOutProductList extends IBatchGetProductList {}

// 创建产品
export const createProduct = (data:ICreateProductData) => {
	return instance({
		url: '/pro/createProduct',
		method: 'POST',
		data: data
	})
}

// 删除产品
export const deleteProduct = (data:IDeleteProductData) => {
	return instance({
		url: '/pro/deleteProduct',
		method: 'POST',
		data: data
	})
}

// 编辑产品信息
export const editProduct = (data:IEditProductData) => {
	return instance({
		url: '/pro/editProduct',
		method: 'POST',
		data: data
	})
}

// 产品申请出库
export const applyOutProduct = (data:IApplyOutProductData) => {
	return instance({
		url: '/pro/applyOutProduct',
		method: 'POST',
		data:data
	})
}

// 对产品进行撤回申请
export const withdrawApplyProduct = (data:IWithdrawApplyProductData) => {
	return instance({
		url: '/pro/withdrawApplyProduct',
		method: 'POST',
		data: data
	})
}

// 产品审核
export const auditProduct = (data:IAuditProductData) => {
	return instance({
		url: '/pro/auditProduct',
		method: 'POST',
		data: data
	})
}

// 通过入库编号对产品进行搜索
export const searchProductForId = (data:ISearchProductForId) => {
	return instance({
		url: '/pro/searchProductForId',
		method: 'POST',
		data: data
	})
}

// 获取产品总数
export const getProductLength = () => {
	return instance({
		url: '/pro/getProductLength',
		method: 'POST',
	})
}

// 获取申请出库产品总数
export const getApplyProductLength = () => {
	return instance({
		url: '/pro/getApplyProductLength',
		method: 'POST',
	})
}

// 获取出库产品总数
export const getOutProductLength = () => {
	return instance({
		url: '/pro/getOutProductLength',
		method: 'POST',
	})
}

// 分批获取产品列表
export const batchGetProductList = (data:IBatchGetProductList) => {
	return instance({
		url: '/pro/batchGetProductList',
		method: 'POST',
		data: data
	})
}

// 分批获取申请出库产品列表
export const batchGetApplyProductList = (data:IBatchGetApplyProductList) => {
  return instance({
    url: '/pro/batchGetApplyProductList',
    method: 'POST',
    data: data
  })
}

// 分批获取出库产品列表
export const batchGetOutProductList = (data:IBatchGetOutProductList) => {
  return instance({
    url: '/pro/batchGetOutProductList',
    method: 'POST',
    data: data
  })
}