<script setup>
import { getArticleCategory, deleteArticleCategory } from '@/api/article'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from '../../components/ChannelEdit.vue'

const loading = ref(true) // 加载效果
const channelList = ref([]) // 文章分类
const dialog1 = ref() // 弹窗
const cate = ref() // 传递当前是处于添加分类还是编辑分类

// 获取文章分类
const articleChannel = async () => {
  loading.value = true
  const res = await getArticleCategory()
  channelList.value = res.data.data
  loading.value = false
}
articleChannel()
// console.log(channelList.value)

// 添加文章分类
const addChannel = async () => {
  dialog1.value.open({})
  cate.value = '添加分类'
}
// 编辑分类
const EditChannel = (row) => {
  dialog1.value.open(row)
  cate.value = '编辑分类'
}
// 删除分类
const DeleteChannel = (row) => {
  // console.log(row)
  ElMessageBox.confirm('你确认要删除么？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteArticleCategory(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    articleChannel()
  })
}
// 更新表单
const reLoad = () => {
  articleChannel()
}
</script>

<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button type="primary" @click="addChannel">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column type="index" label="序号" width="180"></el-table-column>
      <el-table-column prop="cate_name" label="分类名称"></el-table-column>
      <el-table-column prop="cate_alias" label="分类别名"> </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            @click="EditChannel(row)"
            plain
            circle
          ></el-button>
          <el-button
            type="danger"
            :icon="Delete"
            @click="DeleteChannel(row)"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
      <!-- 表格为空时 -->
      <template #empty>
        <el-empty description="还没有添加分类哦！"></el-empty>
      </template>
    </el-table>
  </PageContainer>
  <ChannelEdit ref="dialog1" :cate="cate" @success="reLoad"></ChannelEdit>
  <!-- <channel-edit ref="dialog1" :cate="cate"></channel-edit> -->
</template>

<style lang="scss" scoped></style>
