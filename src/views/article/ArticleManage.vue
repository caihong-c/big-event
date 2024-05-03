<script setup>
import { getArticlesService, deleteArticleService } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/format'
import { ElMessage } from 'element-plus'

const articleList = ref([]) // 文章列表
const total = ref(0) // 文章总数
const loading = ref(false) // 加载状态
const drawerData = ref()

const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 每页条数
  cate_id: '', // 文章id
  state: '' // 文章状态（已发布/草稿）
})

// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await getArticlesService(params.value)
  // console.log(res)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

getArticleList()

// 处理分页
const handleSizeChange = (val) => {
  // console.log(`${val} items per page`)
  // 重新从第一页开始渲染
  params.value.pagenum = 1
  params.value.pagesize = val
  // 重新渲染文章列表
  getArticleList()
}
const handleCurrentChange = (val) => {
  // console.log(`current page: ${val}`)
  // 更新当前页
  params.value.pagenum = val
  // 重新渲染文章列表
  getArticleList()
}

// 处理搜索
const onSearch = () => {
  // 更新页码
  params.value.pagenum = 1
  getArticleList()
}

// 处理重置
const onReset = () => {
  // 更新页码
  params.value.pagenum = 1
  // 更新文章id和状态
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

// 发布文章
const addNewArticle = () => {
  drawerData.value.changeDrawer({})
}
// 编辑文章
const editArticle = (row) => {
  drawerData.value.changeDrawer(row)
  // console.log(row)
}

// 添加或编辑文章成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 渲染最后页面
    const lastpage = Math.ceil((total.value + 1) / params.value.pagesize)
    params.value.pagenum = lastpage
  } else {
    // 渲染当前页
  }
  getArticleList()
}

// 删除文章
const deleteArticle = (row) => {
  ElMessageBox.confirm('你确认要删除吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteArticleService(row.id)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getArticleList()
  })
}
</script>

<template>
  <PageContainer title="文章管理">
    <template #extra>
      <el-button type="primary" @click="addNewArticle">发布文章</el-button>
    </template>
    <!-- // 表单  inline在一行中展示-->
    <el-form inline>
      <el-form-item label="文章分类：">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select
          placeholder="请选择"
          style="width: 200px"
          v-model="params.state"
        >
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- // 表格 -->
    <el-table :data="articleList" v-loading="loading">
      <!-- <el-table-column type="index" label="序号" width="100"></el-table-column> -->
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类"></el-table-column>
      <el-table-column prop="pub_date" label="发布时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            type="primary"
            @click="editArticle(row)"
            :icon="Edit"
            plain
            circle
          ></el-button>
          <el-button
            type="danger"
            @click="deleteArticle(row)"
            :icon="Delete"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
      <!-- 表格为空时 -->
      <template #empty>
        <el-empty description="还没有发布文章哦！"></el-empty>
      </template>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[5, 10, 15, 20]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉 -->
    <ArticleDrawer ref="drawerData" @success="onSuccess"></ArticleDrawer>
  </PageContainer>
</template>

<style lang="scss" scoped></style>
