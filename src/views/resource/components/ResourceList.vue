<template>
  <div class="resource-list">
    <el-card>
      <div slot="header">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
        >
          <el-form-item label="资源名称" prop="name">
            <el-input size="mini" v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="资源路径" prop="url">
            <el-input size="mini" v-model="form.url" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="资源分类" prop="categoryId">
            <el-select size="mini" v-model="form.categoryId" placeholder="请输入">
              <el-option
                v-for="item of resourceCategories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              @click="onSubmit"
              :disabled="loading"
            >查询</el-button>
            <el-button size="mini" @click="onReset" :disabled="loading">重置</el-button>
            <el-button size="mini" @click="handleAdd" :disabled="loading">添加</el-button>
            <el-button size="mini" @click="toResourceCategory" :disabled="loading">资源分类</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        :data="resources"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="编号"
          min-width="80"
        />
        <el-table-column
          prop="name"
          label="资源名称"
          min-width="150"
        />
        <el-table-column
          prop="url"
          label="资源路径"
          min-width="150"
        />
        <el-table-column
          prop="description"
          label="描述"
          min-width="150"
        />
        <el-table-column
          prop="createdTime"
          label="添加时间"
          min-width="120"
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.current"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="loading"
      />
    </el-card>
    <resource-create-or-edit
      v-if="dialogStatus"
      :status="dialogStatus"
      :resource-id="resourceId"
      :categories="resourceCategories"
      @cancel="handleCancel"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { AxiosError } from 'axios'
import { getResourcePages, deleteResource } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import ResourceCreateOrEdit from './ResourceCreateOrEdit.vue'

export default Vue.extend({
  name: 'ResourceList',
  components: {
    ResourceCreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 5, // 每页大小
        categoryId: '' // 资源分类
      },
      resources: [], // 资源列表
      resourceCategories: [], // 资源分类列表
      loading: true, // 加载状态
      totalCount: 0,
      dialogStatus: '', // 资源状态
      resourceId: '' // 正在编辑的资源ID
    }
  },
  created () {
    this.loadResourcesCategories()
    this.loadResources()
  },
  methods: {
    async loadResourcesCategories () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },

    async loadResources () {
      this.loading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resources = data.data.records
        this.totalCount = data.data.total
      }
      this.loading = false
    },

    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadResources()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadResources()
    },

    handleAdd () {
      this.dialogStatus = 'add'
    },

    handleEdit (row: any) {
      this.dialogStatus = 'edit'
      this.resourceId = row.id
    },

    async handleDelete (row: any) {
      try {
        await this.$confirm(`确认删除资源：${row.name}？`, '删除提示')
        await deleteResource(row.id)
        this.$message.success('删除成功')
        this.loadResources()
      } catch (err) {
        if ((err as AxiosError).response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    toResourceCategory () {
      this.$router.push({ name: 'resource-category' })
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadResources()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    },

    handleCancel () {
      this.dialogStatus = ''
      this.resourceId = ''
    },

    handleSuccess () {
      this.dialogStatus = ''
      this.resourceId = ''
      this.loadResources()
    }
  }
})
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 10px;
  text-align: right;
}
</style>
