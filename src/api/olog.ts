import instance from '@/http/index'

// 分批获取操作日志列表接口
export interface IBatchGetOLogList {
  offset: number
  limit: number
}

// 按类型搜索操作日志列表接口
export interface ISearchOLogListByType {
	type: string
}

// 获取操作日志类别
export const GetOLogType = () => {
	return instance({
		url: '/olog/getOLogType',
		method: 'POST',
	})
}

// 获取操作日志长度
export const GetOLogListLength = () => {
	return instance({
		url: '/olog/getOLogListLength',
		method: 'POST',
	})
}

// 分批获取操作日志列表
export const BatchGetOLogList = (data:IBatchGetOLogList) => {
	return instance({
		url: '/olog/batchGetOLogList',
		method: 'POST',
		data: data
	})
}

// 清空操作日志
export const clearOLogList = () => {
	return instance({
		url: '/olog/clearOLogList',
		method: 'POST',
	})
}

// 按类型获取操作日志
export const searchOLogListByType = (data:ISearchOLogListByType) => {
	return instance({
		url: '/olog/searchOLogListByType',
		method: 'POST',
		data: data
	})
}