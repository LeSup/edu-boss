/**
 * 课程管理相关请求模块
 */
import { AxiosPromise } from 'axios'
import request from '@/utils/request'

// 分页查询课程信息
export const getCourses = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data
  })
}

// 课程上下架
export const changeState = (params: any): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params
  })
}

// 保存或者更新课程信息
export const saveOrUpdateCourse = (data: any): AxiosPromise => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 上传图片
export const uploadCourseImage = (data: any, onUploadProgress?: (progressEvent: ProgressEvent) => void) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件：progress
    onUploadProgress
  })
}

// 通过课程Id获取课程信息
export const getCourseById = (courseId: string | number): AxiosPromise => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}
