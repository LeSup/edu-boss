<template>
  <div class="course-video">
    <el-card>
      <template slot="header">
        <span>上传视频</span>
      </template>
      <el-form label-position="right" label-width="80px">
        <el-form-item label="视频上传">
          <input ref="video" type="file">
        </el-form-item>
        <el-form-item label="图片上传">
          <input ref="image" type="file">
        </el-form-item>
        <el-form-item>
          <el-button @click="handleUpload">开始上传</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '@/services/aliyun-upload'

export default Vue.extend({
  name: 'CourseVideo',
  data () {
    return {
      uploader: null,
      imageUrl: '',
      videoId: null
    }
  },

  computed: {
    video () {
      return this.$refs.video
    },
    image () {
      return this.$refs.image
    }
  },

  created () {
    this.initUploder()
  },

  methods: {
    initUploder () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted', uploadInfo)

          let uploadAddressAndAuth
          // 通过后端获取文件上传凭证
          // 获取图片上传凭证
          if (uploadInfo.isImage) {
            const { data } = await aliyunImagUploadAddressAdnAuth()
            this.imageUrl = data.data.imageURL
            uploadAddressAndAuth = data.data
          // 获取视频上传凭证
          } else {
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageUrl
            })
            uploadAddressAndAuth = data.data
            this.videoId = uploadAddressAndAuth.videoId
          }

          // 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          (this.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 开始上传
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed', uploadInfo)
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed', uploadInfo, code, message)
        },
        // 文件上传进度，单位：字节
        onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {
          console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent)
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired', uploadInfo)
        },
        // 全部文件上传结束
        onUploadEnd: async (uploadInfo: any) => {
          console.log('onUploadEnd', uploadInfo)
          // 请求转码
          await aliyunTransCode({
            lessonId: this.$route.params.lessonId,
            fileId: this.videoId,
            fileName: (this.video as any).files[0].name,
            coverImageUrl: this.imageUrl
          })

          // 轮询转码进度
          const timer = window.setInterval(async () => {
            const { data } = await aliyunTransCodePercent({ lessonId: this.$route.params.lessonId })
            console.log(data.data)
            if (data.data === 100) {
              window.clearInterval(timer)
              console.log('转码成功')
            }
          }, 2000)
        }
      })
    },

    handleUpload () {
      // 获取需要上传的文件
      const videoFile = (this.video as any).files[0]
      const imageFile = (this.image as any).files[0]
      const uploader = this.uploader as any

      // 将用户所选的文件添加到上传列表中
      uploader.addFile(imageFile, null, null, null, '{"Vod":{}}')
      uploader.addFile(videoFile, null, null, null, '{"Vod":{}}')

      // 开始上传
      uploader.startUpload()
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
