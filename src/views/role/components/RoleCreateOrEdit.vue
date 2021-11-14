<template>
  <el-dialog
    :title="!isEdit ? '添加角色' : '编辑角色'"
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
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
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
import { getRoleById, createOrUpdate } from '@/services/role'

export default Vue.extend({
  name: 'CreateOrEdit',
  props: {
    roleId: {
      type: [String, Number]
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.isEdit) {
      this.loadRole()
    }
  },
  methods: {
    async loadRole () {
      const { data } = await getRoleById(this.roleId)
      this.form = data.data
    },

    async handleSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()
        this.loading = true

        // 提交表单
        const { data } = await createOrUpdate(this.form)

        if (data.code === '000000') {
          this.$message.success('操作成功')
          this.$emit('success')
        }
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
