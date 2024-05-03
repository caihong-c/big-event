import request from '@/utils/request'

// 文章相关
//
//1.文章分类相关
//
// 增加文章分类
export const addArticleCatergory = ({ cate_name, cate_alias }) => {
  return request.post('/my/cate/add', {
    cate_name,
    cate_alias
  })
}
// 删除文章分类
export const deleteArticleCategory = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })
// 更新文章分类
export const updateArticleCategory = ({ id, cate_name, cate_alias }) =>
  request.put('/my/cate/info', {
    id,
    cate_name,
    cate_alias
  })
// 获取文章分类
export const getArticleCategory = () => request.get('/my/cate/list')
// 获取文章分类详情
export const getArticleCategorying = (id) =>
  request.get('/my/cate/info', {
    params: id
  })
//
//2.文章管理相关
//
// 发布文章
export const publishArticleService = (data) =>
  request.post('/my/article/add', data)
// 删除文章
export const deleteArticleService = (id) =>
  request.delete('/my/article/info', {
    params: { id }
  })
// 获取文章列表
export const getArticlesService = ({ pagenum, pagesize, cate_id, state }) =>
  request.get('/my/article/list', {
    params: {
      pagenum,
      pagesize,
      cate_id,
      state
    }
  })
// 获取文章详情
export const getArticlingService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })
// 更新文章详情
export const updateArticlingService = (data) =>
  request.put('/my/article/info', data)
