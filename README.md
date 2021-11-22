# 项目介绍

本项目作为视频网站后台管理系统，主要实现了两大功能：用户管理和课程管理。用户管理是管理后台登录用户的权限，即哪些页面可以访问、页面中有哪些功能可操作。课程管理是对前台视频系统课程信息以及视频内容的管理。

## 架构特色

### 1. 路由守卫

项目中部分页面需要登录后才能访问，对于没有登录的用户访问授权页面时，直接跳转到登录页，登录后会跳转到授权页面。

``` js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next() // 允许通过
  }
})
```

### 2. 请求拦截

**请求前**：将登录后获取到的 `access_token` 添加到请求头中，不再需要每个请求中单独配置。

**响应前**：对不同的响应码进行不同的处理，对 `401` 状态码（未授权）重新刷新 `token`，成功后重新发送挂起的请求，失败则返回登录页重新登录。

## 业务模块

### 1. 富文本编辑器

项目中使用了 wangeditor 富文本编辑器，并通过其文档实现了上传本地图片功能。

### 2. 视频点播

项目中使用了阿里云提供的视频点播功能，来实现课程视频的上传。文档地址：https://help.aliyun.com/product/29932.html

<!-- ## 接口及网站地址

- 前台接口地址：http://113.31.105.128/front/doc.html#/home
- 后台接口地址：http://eduboss.lagou.com/boss/doc.html#/home
- 前台地址：http://edufront.lagou.com/#/videoDetail
- 后台地址：http://eduboss.lagou.com/ -->
