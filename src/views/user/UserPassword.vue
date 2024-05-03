<script setup>
import { ref } from 'vue'
import { updateUserPwdService } from '@/api/user'
import { ElMessage } from 'element-plus'

const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const pwdFormRef = ref()

const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateNotEqual, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateEqual, trigger: 'blur' }
  ]
}

function validateNotEqual(rule, value, callback) {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码不能和原密码一样'))
  } else {
    callback()
  }
}

function validateEqual(rule, value, callback) {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('两次输入的新密码不一致!'))
  } else {
    callback()
  }
}

async function submitForm() {
  pwdFormRef.value.validate()
  await updateUserPwdService(pwdForm.value)
  ElMessage.success('修改成功')
  pwdFormRef.value.resetFields()
}

function resetForm() {
  pwdFormRef.value.resetFields()
  // pwdForm.value = {
  //   old_pwd: '',
  //   new_pwd: '',
  //   re_pwd: ''
  // }
}
</script>

<template>
  <PageContainer title="重置密码">
    <template #default>
      <el-form
        :model="pwdForm"
        :rules="rules"
        ref="pwdFormRef"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="old_pwd">
          <el-input v-model="pwdForm.old_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input v-model="pwdForm.new_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="re_pwd">
          <el-input v-model="pwdForm.re_pwd" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">修改密码</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
  </PageContainer>
</template>
