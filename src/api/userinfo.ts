import instance from '@/http/index'

// 获取用户信息接口
export interface IGetUserInfoData {
  id: number
}

// 修改密码接口
export interface IChangePasswordData {
  id: number
  oldPassword: string
  newPassword: string
}

// 修改姓名接口
export interface IChangeNameData {
  id: number
  name: string
}

// 修改性别接口
export interface IChangeSexData {
  id: number
  sex: number
}

// 修改邮箱接口
export interface IChangeEmailData {
  id: number
  email: string
}

// 创建管理员接口
export interface ICreateAdminData {
  account: string
	password: string
	name: string
  sex: number
	department: string
	email: string
}

// 编辑管理员接口
export interface IEditAdmin {
  id: number
  name: string
  sex: number
  department: string
  email: string
}

// 对用户进行赋权接口
export interface IChangeIdentify {
  id: number
  identity: string
}

// 搜索用户接口
export interface ISearchUser {
  account: string
  identity: string
}

// 搜索部门接口
export interface ISearcDeartment {
  department: string
}

// 禁用用户接口
export interface IBanUser {
  id: number
}

// 解除禁用用户接口 
export interface IHotUser {
  id: number
} 

// 删除用户接口
export interface IDeleteUser {
  id: number
}

// 批量获取用户接口
export interface IBatchGetUser {
  identity: string
	offset: number
	limit: number
}

// 获取用户信息
export const getUserInfo = (data:IGetUserInfoData) => {
  return instance({
    url: '/user/getUserInfo',
    method: 'POST',
    data
  })
}

// 修改密码
export const changePassword = (data:IChangePasswordData) => {
  return instance({
    url: '/user/changePassword',
    method: 'POST',
    data
  })
}

// 修改姓名
export const changeName = (data:IChangeNameData) => {
  return instance({
    url: '/user/changeName',
    method: 'POST',
    data
  })
}

// 修改性别
export const changeSex = (data:IChangeSexData) => {
  return instance({
    url: '/user/changeSex',
    method: 'POST',
    data
  })
}

// 修改邮箱
export const changeEmail = (data:IChangeEmailData) => {
  return instance({
    url: '/user/changeEmail',
    method: 'POST',
    data
  })
}

// 以下是用户管理相关
// 添加管理员
export const createAdmin = (data:ICreateAdminData) => {
  return instance({
    url: '/user/createAdmin',
    method: 'POST',
    data
  })
}

// 获取管理员列表
export const getAdminList = () => {
  return instance({
    url: '/user/getAdminList',
    method: 'POST',
  })
}

// 编辑管理员账号信息
export const editAdmin = (data:IEditAdmin) => {
  return instance({
    url: '/user/editAdmin',
    method: 'POST',
    data
  })
}

// 对管理员取消赋权
export const changeIdentity = (data:IChangeIdentify) => {
  return instance({
    url: '/user/changeIdentity',
    method: 'POST',
    data
  })
}

// 通过账号对用户搜索
export const searchUser = (data:ISearchUser) => {
  return instance({
    url: '/user/searchUser',
    method: 'POST',
    data
  })
}

// 通过部门对用户搜索
export const searchDepartment = (data:ISearcDeartment) => {
  return instance({
    url: '/user/searchUserByDepartment',
    method: 'POST',
    data
  })
}


// 冻结用户
export const banUser = (data:IBanUser) => {
  return instance({
    url: '/user/banUser',
    method: 'POST',
    data
  })
}

// 解冻用户
export const hotUser = (data:IHotUser) => {
  return instance({
    url: '/user/hotUser',
    method: 'POST',
    data
  })
}

// 获取冻结用户列表
export const getBanList = () => {
  return instance({
    url: '/user/getBanList',
    method: 'POST',
  })
}

// 删除用户  deleteUser
export const deleteUser = (data:IDeleteUser) => {
  return instance({
    url: '/user/deleteUser',
    method: 'POST',
    data
  })
}

// 监听换页返回数据
export const batchGetUser = (data:IBatchGetUser) => {
  return instance({
    url: '/user/batchGetUser',
    method: 'POST',
    data
  })
}
