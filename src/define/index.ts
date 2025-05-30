// 消息数据接口
export interface IMessageData {
  id: number
  msg_id: number
  title: string
  content: string
  department: string
  category: string
  level: string
  name: string
  create_time: number
}

// 简单用户信息接口
export interface ISimpleUserInfoData {
  id: number
  imageUrl: string
  account: string
  name: string
  sex: number
  email: string
  identity: string
  department: string
  status: number
}

// 用户对话框类型
export enum UserDialogOffType {
  Create = 1,
  Edit,
  Promote,
  Downgrade,
  Delete,
}

// 表分页大小
export const CTablePagingSize = 1
// 身份对话框
export const CIdentityDialog = "identityDialogOff"