<template>
  <div class="role-list">
    <el-card>
      <div slot="header">
        <el-form
          ref="form"
          :inline="true"
          :model="form"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input size="mini" v-model="form.name" placeholder="请输入" />
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              @click="onSubmit"
              :disabled="loading"
            >查询</el-button>
            <el-button size="mini" @click="onReset" :disabled="loading">重置</el-button>
            <el-button size="mini" @click="handleAdd" :disabled="loading">添加角色</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        v-loading="loading"
        :data="roles"
        style="width: 100%"
      >
        <el-table-column
          prop="id"
          label="编号"
        />
        <el-table-column
          prop="name"
          label="角色名称"
        />
        <el-table-column
          prop="description"
          label="描述"
        />
        <el-table-column
          prop="createdTime"
          label="添加时间"
        />
        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="$router.push({
                name: 'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })"
            >分配菜单</el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push({
                name: 'alloc-resource',
                params: {
                  roleId: scope.row.id
                }
              })"
            >分配资源</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="text"
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
    <role-create-or-edit
      v-if="dialogVisible"
      :role-id="roleId"
      :is-edit="isEdit"
      @success="onSuccess"
      @cancel="onCancel"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'
import { Form } from 'element-ui'
import { getRoles, deleteRole } from '@/services/role'
import RoleCreateOrEdit from './RoleCreateOrEdit.vue'

export default Vue.extend({
  name: 'RoleList',
  components: {
    RoleCreateOrEdit
  },
  data () {
    return {
      form: {
        name: '',
        current: 1, // 默认查询第1页数据
        size: 5 // 每页大小
      },
      roles: [], // 角色列表
      loading: true, // 加载状态
      totalCount: 0,
      dialogVisible: false, // 控制添加/编辑角色的对话框显示和隐藏
      roleId: null, // 编辑角色的 ID
      isEdit: false
    }
  },
  created () {
    this.loadRoles()
  },
  methods: {
    async loadRoles () {
      this.loading = true
      const { data } = await getRoles(this.form)
      if (data.code === '000000') {
        this.roles = data.data.records
        this.totalCount = data.data.total
      }
      this.loading = false
    },

    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadRoles()
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadRoles()
    },

    handleAdd () {
      this.dialogVisible = true
    },

    handleEdit (row: any) {
      this.roleId = row.id
      this.isEdit = true
      this.dialogVisible = true
    },

    async handleDelete (row: any) {
      try {
        await this.$confirm(`确认删除角色：${row.name}？`, '删除提示')
        await deleteRole(row.id)
        this.$message.success('删除成功')
        this.loadRoles()
      } catch (err) {
        if ((err as AxiosError).response) {
          this.$message.error('删除失败，请重试')
        } else {
          this.$message.info('取消删除')
        }
      }
    },

    onSuccess () {
      this.roleId = null
      this.isEdit = false
      this.dialogVisible = false
      this.loadRoles()
    },

    onCancel () {
      this.roleId = null
      this.isEdit = false
      this.dialogVisible = false
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadRoles()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadRoles()
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
