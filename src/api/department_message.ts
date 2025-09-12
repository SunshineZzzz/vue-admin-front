import instance from '@/http/index'

// 获取用户部门消息ids接口
export interface IGetUserDepartmentIdsData  {
  department: string
}

// 根据ids获取部门消息接口
export interface IGetDepartmentMsgByIdsData  {
  ids: string
}

// 获取用户部门消息ids
export const getUserDepartmentIds = (data:IGetUserDepartmentIdsData) => {
  return instance({
    url: '/dm/getUserDepartmentIds',
    method: 'POST',
    data,
  })
}

// 根据ids获取部门消息
export const getDepartmentMsgByIds = (data:IGetDepartmentMsgByIdsData) => {
  return instance({
    url: '/dm/getDepartmentMsgByIds',
    method: 'POST',
    data
  })
}