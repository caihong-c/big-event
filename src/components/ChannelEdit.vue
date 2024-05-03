<script setup>
import { ref } from 'vue'
import { addArticleCatergory, updateArticleCategory } from '@/api/article'
import { ElMessage } from 'element-plus'
const dialogVisible = ref(false)
const formModule = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名称必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母或数字',
      trigger: 'blur'
    }
  ]
}

const props = defineProps({
  cate: String
})

// 区分添加还是编辑分类，调用后打开弹窗
//open({}) => 表单无需渲染，说明是添加
//open({id,cate_name,...}) => 表单需要渲染，说明是编辑
const open = (row) => {
  // console.log(row)
  dialogVisible.value = true
  formModule.value = { ...row }
}

const formRef = ref() // 表单元素
const emit = defineEmits(['success'])

// 提交新添加的分类
const submit = async () => {
  await formRef.value.validate()

  if (props.cate === '添加分类') {
    await addArticleCatergory(formModule.value)
    dialogVisible.value = false
    ElMessage.success('添加成功')
  } else {
    await updateArticleCategory(formModule.value)
    dialogVisible.value = false
    ElMessage.success('修改成功')
  }
  emit('success') // 子传父，刷新表单
}

defineExpose({
  formModule,
  open
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="cate" width="500">
    <el-form :modelValue="formModule" :rules="rules" ref="formRef">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          v-model="formModule.cate_name"
          placeholder="分类名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          v-model="formModule.cate_alias"
          placeholder="分类别名"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
