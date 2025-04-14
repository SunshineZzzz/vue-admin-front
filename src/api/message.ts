import instance from '@/http/index'


// 分批获取消息接口
export interface IBatchMessageData {
	category: string
  offset: number
	limit: number
}

// 分批获取消息
export const batchMessageList = (data:IBatchMessageData) => {
  return instance({
    url: '/message/batchMessageList',
    method: 'POST',
    data
  })
}
