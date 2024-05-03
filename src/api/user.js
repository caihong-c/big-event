import request from '@/utils/request'

// 注册功能
export const useRegisterService = (username, password, repassword) => {
  return request.post('/api/reg', {
    username,
    password,
    repassword
  })
}
// 登陆功能
export const useLoginService = (username, password) => {
  return request.post('/api/login', {
    username,
    password
  })
}
// 获取用户基本信息
export const useUserInfoService = () => {
  return request.get('/my/userinfo')
}

// 更新用户基本资料
export const updateUserInfoService = (data) => request.put('/my/userinfo', data)

// 更新用户头像
export const updateUserAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新用户密码
export const updateUserPwdService = (data) =>
  request.patch('/my/updatepwd', data)
