<template>
  <el-dialog
    :title="status === 'add' ? '添加角色' : '编辑角色'"
    :visible="true"
    width="30%"
    @close="$emit('cancel')"
  >
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
    >
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="资源路径" prop="url">
        <el-input v-model="form.url" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="资源分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源描述">
        <el-input type="textarea" :rows="3" v-model="form.description" placeholder="请填写"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button size="mini" @click="$emit('cancel')">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit" :disabled="loading">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getResourceById, createOrUpdateResource } from '@/services/resource'

export default Vue.extend({
  name: 'ResourceCreateOrEdit',
  props: {
    resourceId: {
      type: [String, Number]
    },
    status: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      form: {
        name: '',
        url: '',
        categoryId: null,
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入资源路径', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择资源分类', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.status === 'edit') {
      this.loadResource()
    }
  },
  methods: {
    async loadResource () {
      const { data } = await getResourceById(this.resourceId)
      this.form = data.data
    },

    async handleSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()
        this.loading = true

        // 提交表单
        await createOrUpdateResource(this.form)

        this.$message.success('操作成功')
        this.$emit('success')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
