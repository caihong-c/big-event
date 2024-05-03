<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { updateUserAvatarService } from '@/api/user'
import { ElMessage } from 'element-plus'

const uploadRef = ref()
// 根据仓库信息初始化头像
const useUser = useUserStore()
const imageUrl = ref(useUser.userInfo.user_pic)

const changeFile = (uploadFile) => {
  // imageUrl.value = URL.createObjectURL(uploadFile.raw)
  // 基于FileReader读取图片做预览
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }
}

// 更新用户头像
const uploadImg = async () => {
  await updateUserAvatarService(imageUrl.value)
  ElMessage.success('上传成功')
  useUser.getUserInfo()
}
</script>

<template>
  <PageContainer title="更换头像">
    <template #default>
      <el-upload
        ref="uploadRef"
        class="avatar-uploader"
        :show-file-list="false"
        :auto-upload="false"
        style="margin: 20px"
        :on-change="changeFile"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <el-button
        @click="uploadRef.$el.querySelector('input').click()"
        type="primary"
        :icon="Plus"
        >选择图片</el-button
      >
      <el-button @click="uploadImg" type="success" :icon="Upload"
        >上传头像</el-button
      >
    </template>
  </PageContainer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
