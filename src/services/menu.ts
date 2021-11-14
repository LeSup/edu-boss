/**
 * 菜单相关请求模块
 */
import { AxiosPromise } from 'axios'
import request from '@/utils/request'

interface Menu {
  parentId: number,
  name: string,
  href: string,
  description?: string,
  icon?: string,
  shown?: boolean,
  orderNum?: number
}

// 获取所有菜单
export const getAllMenus = (): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 添加菜单
export const createOrUpdateMenu = (data: Menu): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取编辑菜单页面信息
export const getEditMenuInfo = (id: string | number = -1): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id
    }
  })
}

// 删除菜单
export const deleteMenu = (id: number): AxiosPromise => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

// 获取所有菜单并按层级展示
export const getMenuNodeList = (): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 给角色分配菜单
export const allocateRoleMenus = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}

// 获取角色拥有的菜单列表
export const getRoleMenus = (roleId: string | number): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/menu/getRoleMenus',
    params: { // axios 会把 params 转换为 key=value&key=value 的数据格式放到 url 后面(以?分割)
      roleId
    }
  })
}
