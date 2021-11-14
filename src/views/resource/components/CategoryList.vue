<template>
  <div class="category-list">
    <el-card>
      <div slot="header">
        <el-button size="mini" @click="handleAdd" :disabled="loading">添加</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="编号"
          min-width="80"
        />
        <el-table-column
          prop="name"
          label="名称"
          min-width="150"
        />
        <el-table-column
          prop="createdTime"
          label="创建时间"
          min-width="150"
        />
        <el-table-column
          prop="sort"
          label="排序"
          min-width="150"
        />
        <el-table-column
          label="操作"
          min-width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :title="status === 'add' ? '添加分类' : '编辑分类'"
      :visible="!!status"
      width="30%"
      @close="handleCancel"
    >
      <el-form
        :model="category"
        ref="form"
        label-width="100px"
      >
        <el-form-item label="名称">
          <el-input v-model="category.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="category.sort" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="handleCancel">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit" :disabled="dialogLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'
import { Form } from 'element-ui'
import { getResourceCategories, createOrUpdateCategory, deleteCategory } from '@/services/resource-category'

export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      categories: [], // 资源分类列表
      loading: true, // 资源分类列表加载状态
      dialogLoading: false, // 资源分类弹框加载状态
      status: '', // 资源分类弹框状态
      category: {
        name: '',
        sort: ''
      } // 正在操作的资源分类
    }
  },
  created () {
    this.loadCategories()
  },
  methods: {
    async loadCategories () {
      this.loading = true
      const { data } = await getResourceCategories()
      this.categories = data.data
      this.loading = false
    },

    handleAdd () {
      this.status = 'add'
    },

    handleEdit (row: any) {
      this.status = 'edit'
      this.category = row
    },

    async handleDelete (row: any) {
      try {
        await this.$confirm(`确认删除资源分类：${row.name}？`, '删除提示')
        await deleteCategory(row.id)
        this.$message.success('删除成功')
        this.loadCategories()
      } catch (err) {
        if ((err as AxiosError).response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    async handleSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()
        this.dialogLoading = true

        // 提交表单
        await createOrUpdateCategory(this.category)

        this.$message.success('操作成功')
        this.handleSuccess()
      } catch (error) {
        console.log(error)
      } finally {
        this.dialogLoading = false
      }
    },

    handleCancel () {
      (this.$refs.form as Form).resetFields()
      this.status = ''
    },

    handleSuccess () {
      (this.$refs.form as Form).resetFields()
      this.status = ''
      this.loadCategories()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
