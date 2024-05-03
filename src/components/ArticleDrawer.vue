<script setup>
import { ref, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  publishArticleService,
  getArticlingService,
  updateArticlingService
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
import axios from 'axios'

const drawer = ref(false) // 抽屉状态
const titles = ref('')
const imageUrl = ref('') // 图片上传得到的地址
const formRef = ref()
const emit = defineEmits(['success'])
const editorRef = ref()

// 准备数据
const formModel = ref({
  title: '', // 文章标题
  cate_id: '', // 分类id
  cover_img: '', // 文章封面
  state: '', // 发布状态
  content: '' // 文章内容
})

// 图片上传
const changeFile = (uploadFile) => {
  // console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw) // 预览图片
  // 选择图片后，清除图片校验
  if (imageUrl.value) {
    formRef.value.clearValidate('cover_img')
  }
  formModel.value.cover_img = uploadFile.raw // 存储图片对象，将来用于提交
}
// 校验规则
const valitorText = () => {
  formRef.value.validateField('content')
}
const rules = ref({
  title: [{ required: true, message: '文章标题不能为空' }],
  cate_id: [{ required: true, message: '文章分类不能为空' }],
  cover_img: [{ required: true, message: '请选择文章封面' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
})
// 处理发布
const onPublich = async (state) => {
  formModel.value.state = state // 存储文章状态
  // 转换成formData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }

  // 发请求
  if (formModel.value.id) {
    // 编辑操作
    await updateArticlingService(fd)
    ElMessage.success('修改成功')
    drawer.value = false
    // 通知父组件，修改成功
    emit('success', 'edit')
  } else {
    // formModel.value.cover_img = ''
    // formModel.value.content = ''
    // console.log(formModel.value)
    await formRef.value.validate()
    const res = await publishArticleService(fd)
    console.log(res)
    if (res.data.code === 0) {
      ElMessage.success('发布成功')
    }
    drawer.value = false
    // 通知父组件，添加成功
    emit('success', 'add')
  }
}

const changeDrawer = async (row) => {
  drawer.value = true
  if (row.id) {
    titles.value = '编辑文章'
    const res = await getArticlingService(row.id)
    // console.log(res)
    // 数据回显
    formModel.value = res.data.data
    imageUrl.value = baseURL + res.data.data.cover_img
    // 将网络图片转换为file类型
    const file = await imageUrlToFileObject(
      imageUrl.value,
      formModel.value.cover_img
    )
    formModel.value.cover_img = file
  } else {
    titles.value = '发布文章'
    // 重置数据
    imageUrl.value = ''
    nextTick(() => {
      editorRef.value.setHTML('')
    })
    formModel.value = {
      title: '', // 文章标题
      cate_id: '', // 分类id
      cover_img: '', // 文章封面
      state: '', // 发布状态
      content: '' // 文章内容
    }
  }
}

async function imageUrlToFileObject(imageUrl, filename) {
  try {
    // 使用 Axios 下载图片数据
    const response = await axios.get(imageUrl, { responseType: 'blob' })

    // 创建 File 对象
    const file = new File([response.data], filename, {
      type: response.headers['content-type']
    })

    return file
  } catch (error) {
    console.error('Error fetching image:', error)
    return null
  }
}

defineExpose({
  changeDrawer
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" :title="titles">
    <el-form :model="formModel" :rules="rules" ref="formRef">
      <el-form-item label="文章标题：" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="文章分类：" prop="cate_id">
        <ChannelSelect v-model="formModel.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面：" prop="cover_img">
        <!-- 此处只需做前端的本地预览图片即可，无需在提交前上传图片 -->
        <!-- 语法：URL.createObjectURL(...) 创建本地预览的地址 -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="changeFile"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容：" prop="content">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            contentType="html"
            @blur="valitorText"
          />
        </div>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-button @click="onPublich('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublich('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
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
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
