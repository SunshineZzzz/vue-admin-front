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

// 用户对话框关闭类型
export enum UserDialogOffType {
  Create = 1,
  Edit,
  Promote,
  Downgrade,
  Delete,
}

// 创建管理员类型
export enum CreateAdminType {
  // 创建产品管理员
  createProductAdmin = 1,
  // 创建用户管理员
  createUserAdmin,
  // 创建消息管理员
  createMessageAdmin,
}

// 产品信息接口
export interface IProductInfoData {
  id: string
  category: string
  name: string
  unit: string
  quantity: number
  out_quantity: number
  price: number
  remark: string
  create_time: number
  update_time: number
  apply_out_time: number
  out_time: number
	status: string
	user_name: string
  update_user_name: string
	out_user_name:string
}

// 产品对话框关闭类型
export enum ProductDialogOffType {
  Create = 1,
  Edit,
  Delete,
}

// 产品搜索类型
export enum SearchProductType {
  product = 1,
  applyProduct = 2,
  outProduct = 3,
}

// 消息信息接口
export interface IMessageInfoData {
	msg_id: number|null
  recept_department: string
	title: string
  content: string
  create_time: number
  update_time: number
  delete_time: number
  user_id: number
	publish_department: string
	publish_name: string
	level: string
  status: string
  click_num: number
}

// 消息对话框关闭类型
export enum MessageDialogOffType {
  Create = 1,
  Edit,
  Delete,
}

// 回收站消息对话框关闭类型
export enum RecycleDialogOffType {
  Recover = 1,
  Delete,
}

// 文件信息接口
export interface IFileInfoData {
	file_id: number|null,
	user_id: number,
  user_name: string,
	name: string,
	url: string,
	size: number,
	type: string,
	download_number: number,
	create_time: number,
}

// 文件对话框关闭类型
export enum FileDialogOffType {
  Create = 1,
  Delete = 2,
}

// 操作日志信息接口
export interface IOLogInfoData {
	id: number|null,
	user_id: number,
  user_name: string,
	category: string,
	content: string,
	time: number,
  level: string,
}

// 操作日志对话框关闭类型
export enum OLogDialogOffType {
  DeleteAll = 1,
}

// 菜单信息接口
export interface IMenuInfoData {
	name: string,
	path: string,
	meta: {
		title: string,
	},
	component: string,
	children?: IMenuInfoData[],
}

// 表分页大小
export const CTablePagingSize = 1
// 身份对话框关闭关键字
export const CIdentityDialogOff = "identityDialogOff"
// 产品对话框关闭关键字
export const CProductDialogOff = "productDialogOff"
// 申请出库产品对话框关闭关键字
export const CApplyOutProductDialogOff = "applyOutProductDialogOff"
// 消息对话框关闭关键字
export const CMessageDialogOff = "messageDialogOff"
// 回收站对话框关闭关键字
export const CRecycleDialogOff = "recycleDialogOff"
// 文件对话框关闭关键字
export const CFileDialogOff = "fileDialogOff"
// 操作日志对话框关闭关键字
export const COLogDialogOff = "oLogDialogOff"

