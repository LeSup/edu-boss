/**
 * 用户相关请求模块
 */
import { AxiosPromise } from 'axios'
import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

// 用户登录
export const login = (data: User): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },

    // 如果 data 是普通对象，则 Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，则 Content-Type 会被设置为 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，则 Content-Type 是 multipart/form-data
    data: qs.stringify(data) // axios 默认发送的是 application/json 格式的数据
  })
}

// 获取用户信息
export const getUserInfo = (): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}

// 分页查询用户信息
export const getUserPages = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/user/getUserPages',
    data
  })
}

// 封禁用户
export const forbidUser = (userId: string | number): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/user/forbidUser',
    params: {
      userId
    }
  })
}
