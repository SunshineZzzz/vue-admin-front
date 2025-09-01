import instance from '@/http/index'

// 注册数据接口
export interface ILoginData {
  account: string
  password: string
}

// 登录数据接口
export interface IRegisterData extends ILoginData {
  rePassword?: string
}

// 菜单列表接口
// interface IMenuListParams {
//   id: number
// }

// 忘记密码验证接口
export interface IVerifyData {
  account: string
  email: string
}

// 密码重置接口
export interface IResetData {
  token: string
  newPassword: string
  password?: string
  rePassword?: string
}

// 注册
export const register = (data:IRegisterData) => {
	return instance({
		url: '/login/register',
		method: 'POST',
		data
	})
}

// 登录
export const login = (data:ILoginData) => {
	return instance({
		url: '/login/login',
		method: 'POST',
		data
	})
}

// 菜单列表
// export const returnMenuList = (id:number) =>{
//   return instance({
//     url: '/api/returnMenuList',
//     method: 'POST',
//     data: {
//       id
//     }
//   })
// }

// 忘记密码验证
export const verify = (data:IVerifyData) => {
	return instance({
		url: '/login/verifyAccountAndEmail',
		method: 'POST',
		data
	})
}

// 密码重置
export const reset = (data:IResetData) => {
	return instance({
		url: '/login/changePasswordInLogin',
		method: 'POST',
		data
	})
}
