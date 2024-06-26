import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const request = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 请求头中携带token
    const useUser = useUserStore()
    if (useUser.token) {
      config.headers.Authorization = useUser.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // console.log(response)
    // code = 0 时,处理业务成功
    if (response.data.code === 0) {
      return response
    }

    // 处理业务失败
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么

    // 401错误（权限不足，token过期） => 拦截到登陆
    if (error.response?.status === 401) {
      router.push('/login')
    }

    // 默认错误
    ElMessage.error(error.response.data.message || '服务异常')
    return Promise.reject(error)
  }
)

export default request
export { baseURL }
