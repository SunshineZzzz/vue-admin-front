import instance from '@/http/index'

// 发布消息接口
export interface IPublishMessageData {
	title: string
	content: string
	recept_department: string
	level: string
  publish_department: string
	publish_name: string
}

// 编辑消息接口
export interface IEditMessageData {
  msgId: number
	title: string
	content: string
	level: string
	recept_department: string
}

// 根据发布部门进行搜索消息接口
export interface ISearchMessageByDepartment {
  publish_department: string
}

// 根据接收部门进行搜索消息接口
export interface ISearchMessageByReceptDepartment {
  recept_department: string
}

// 根据发布等级进行获取消息接口
export interface ISearchMessageByLevel {
  level: string
}

// 初次删除消息接口
export interface IFirstDeleteMessage {
  msgId: number  
}

// 更新消息点击率接口
export interface IUpdateMessageClick {
  msgId: number
  clickNum: number
}

// 消息还原操作接口
export interface IMessageRecover {
  msgId: number
}

// 消息删除操作接口
export interface IMessageDelete {
  msgId: number
}

// 分批获取回收站消息列表接口
export interface IBatchRecycleMessageList {
  offset: number
  limit: number
}

// 分批获取消息列表接口
export interface IBatchMessageList {
  offset: number
  limit: number
}

// 根据接收部门分批获取消息
export interface IBatchMessageListByReceptDepartment {
  recept_department: string
  offset: number
  limit: number
}

// 根据接收部门分批获取消息长度
export interface IGetMessageListLengthByReceptDepartment {
  recept_department: string
}

// 发布消息
export const publishMessage = (data:IPublishMessageData) => {
  return instance({
    url: '/message/publishMessage',
    method: 'POST',
    data
  })
}

// 编辑消息
export const editMessage = (data:IEditMessageData) => {
  return instance({
    url: '/message/editMessage',
    method: 'POST',
    data
  })
}

// 根据发布部门进行搜索消息
export const searchMessageByDepartment = (data:ISearchMessageByDepartment) => {
  return instance({
    url: '/message/searchMessageByDepartment',
    method: 'POST',
    data
  })
}

// 根据接收部门进行搜索消息
export const searchMessageByReceptDepartment = (data:ISearchMessageByReceptDepartment) => {
  return instance({
    url: '/message/searchMessageByReceptDepartment',
    method: 'POST',
    data
  })
}

// 根据发布等级进行获取消息
export const searchMessageByLevel = (data:ISearchMessageByLevel) => {
  return instance({
    url: '/message/searchMessageByLevel',
    method: 'POST',
    data
  })
}

// 初次删除消息
export const firstDeleteMessage = (data:IFirstDeleteMessage) => {
  return instance({
    url: '/message/firstDeleteMessage',
    method: 'POST',
    data
  })
}

// 更新消息点击率
export const updateMessageClick = (data:IUpdateMessageClick) => {
  return instance({
    url: '/message/updateMessageClick',
    method: 'POST',
    data
  })
}

// 消息还原操作
export const messageRecover = (data:IMessageRecover) => {
  return instance({
    url: '/message/messageRecover',
    method: 'POST',
    data
  })
}

// 消息删除操作
export const messageDelete = (data:IMessageDelete) => {
  return instance({
    url: '/message/messageDelete',
    method: 'POST',
    data
  })
}

// 获取回收站的列表长度
export const recycleMessageListLength = () => {
  return instance({
    url: '/message/recycleMessageListLength',
    method: 'POST'
  })
}

// 分批获取回收站消息列表
export const batchRecycleMessageList = (data:IBatchRecycleMessageList) => {
  return instance({
    url: '/message/batchRecycleMessageList',
    method: 'POST',
    data
  })
}

// 获取消息列表长度
export const getMessageListLength = () => {
  return instance({
    url: '/message/getMessageListLength',
    method: 'POST',
  })
}

// 分批获取消息
export const batchMessageList = (data:IBatchMessageList) => {
  return instance({
    url: '/message/batchMessageList',
    method: 'POST',
    data
  })
}

// 根据接收部门分批获取消息长度
export const getMessageListLengthByReceptDepartment = (data:IGetMessageListLengthByReceptDepartment) => {
  return instance({
    url: '/message/getMessageListByReceptDepartmentLength',
    method: 'POST',
    data
  })
}

// 根据接收部门分批获取消息
export const batchMessageListByReceptDepartment = (data:IBatchMessageListByReceptDepartment) => {
  return instance({
    url: '/message/batchMessageListByReceptDepartment',
    method: 'POST',
    data
  })
}