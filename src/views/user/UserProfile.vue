<script setup>
import { ref } from 'vue'
// import { ElInput, ElButton } from 'element-plus'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { updateUserInfoService } from '@/api/user'

const useUser = useUserStore()
console.log(useUser.userInfo)
const form = ref({
  id: useUser.userInfo.id,
  username: useUser.userInfo.username,
  nickname: useUser.userInfo.nickname,
  email: useUser.userInfo.email
})

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
}

const formRef = ref(null)

const submitForm = async () => {
  await formRef.value.validate()
  await updateUserInfoService(form.value)
  ElMessage.success('修改成功')
  useUser.getUserInfo()
}
</script>

<template>
  <PageContainer title="基本资料">
    <template #default>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="登录名称" prop="username">
          <el-input v-model="form.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
        </el-form-item>
      </el-form>
    </template>
  </PageContainer>
</template>
