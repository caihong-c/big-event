import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUserInfoService } from '@/api/user'

// 用户模块 token
export const useUserStore = defineStore(
  'user-token',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const userInfo = ref({})
    const getUserInfo = async () => {
      const res = await useUserInfoService()
      userInfo.value = res.data.data
      // console.log(userInfo)
    }
    const setUserInfo = (obj) => {
      userInfo.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
