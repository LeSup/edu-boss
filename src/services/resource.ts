/**
 * 资源相关请求模块
 */
import { AxiosPromise } from 'axios'
import request from '@/utils/request'

// 按条件分页查询资源
export const getResourcePages = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

// 保存或者更新资源
export const createOrUpdateResource = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

// 删除资源
export const deleteResource = (id: string | number): AxiosPromise => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 获取资源
export const getResourceById = (id: string | number): AxiosPromise => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 获取所有资源
export const getAllResources = (): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}

// 给角色分配资源
export const allocateRoleResources = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}

// 获取角色拥有的资源列表
export const getRoleResources = (roleId: string | number): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
