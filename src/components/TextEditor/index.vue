<template>
  <div class="text-editor" ref="editor" />
</template>

<script lang="ts">
import Vue from 'vue'
import E from 'wangeditor'
import { uploadCourseImage } from '@/services/course'

export default Vue.extend({
  name: 'TextEditor',
  props: {
    value: {
      type: String,
      default: ''
    }
  },

  mounted () {
    console.log('mounted', this.value)
    this.initEditor()
  },

  updated () {
    console.log('updated', this.value)
  },

  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor as any)

      // 注意：事件监听必须在 create 之前
      editor.config.onchange = (newHtml: any) => {
        this.$emit('input', newHtml)
      }

      editor.config.customUploadImg = async function (resultFiles: any, insertImgFn: any) {
        const fd = new FormData()
        fd.append('file', resultFiles[0])
        const { data } = await uploadCourseImage(fd)
        insertImgFn(data.data.name)
      }

      editor.create()

      // 注意：设置初始化必须在 create 之后
      editor.txt.html(this.value)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
