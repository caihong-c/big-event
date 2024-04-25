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
