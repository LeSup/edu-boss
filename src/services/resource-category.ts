/**
 * 资源分类相关请求模块
 */
import { AxiosPromise } from 'axios'
import request from '@/utils/request'

// 查询资源分类列表
export const getResourceCategories = (): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 保存或更新资源分类
export const createOrUpdateCategory = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}

// 删除资源分类，如果资源分类下有资源，不允许删除
export const deleteCategory = (id: string | number): AxiosPromise => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}
