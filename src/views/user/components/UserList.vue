<template>
  <div class="user-list">
    <el-card>
      <div slot="header">
        <el-form
          ref="form"
          :model="form"
          :inline="true"
        >
          <el-form-item label="手机号" prop="phone">
            <el-input size="mini" v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker
              size="mini"
              v-model="form.rangeDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              :disabled="loading"
              @click="handleReset"
            >重置</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="handleQuery"
              :disabled="loading"
            >查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="users"
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="id"
          label="用户ID"
          min-width="100"
        />
        <el-table-column
          label="头像"
          min-width="80"
        >
          <template slot-scope="scope">
            <img width="30px" :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="用户名"
          min-width="120"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="120"
        />
        <el-table-column
          prop="createTime"
          label="注册时间"
          min-width="120">
        </el-table-column>
        <!-- <el-table-column
          prop="name"
          label="状态"
          width="80">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="ENABLE"
              inactive-value="DISABLE"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleForbidUser(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column
          label="操作"
          width="80px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleSelectRole(scope.row)"
            >分配角色</el-button>
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
      <el-dialog
        title="分配角色"
        :visible="dialogVisible"
        @close="dialogVisible = false"
        width="30%"
      >
        <el-select
          multiple
          placeholder="请选择"
          v-model="roleIdList"
          style="width: 100%"
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleAllocRole"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages, forbidUser } from '@/services/user'
import { Form } from 'element-ui'
import {
  getAllRoles,
  allocateUserRoles,
  getUserRoles
} from '@/services/role'

export default Vue.extend({
  name: 'UserList',
  data () {
    return {
      users: [],
      form: {
        current: 1,
        size: 100,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeDate: []
      },
      totalCount: 0,
      loading: true,
      dialogVisible: false,
      roles: [],
      roleIdList: [],
      currentUser: null // 分配角色的当前用户
    }
  },

  created () {
    this.loadUsers()
  },

  methods: {
    async loadUsers () {
      this.loading = true
      const { rangeDate } = this.form
      if (rangeDate && rangeDate.length) {
        this.form.startCreateTime = rangeDate[0]
        this.form.endCreateTime = rangeDate[1]
      } else {
        this.form.startCreateTime = ''
        this.form.endCreateTime = ''
      }
      const { data } = await getUserPages(this.form)
      this.users = data.data.records
      this.totalCount = data.data.total
      this.loading = false
    },

    async handleForbidUser (user: any) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },

    handleQuery () {
      this.form.current = 1
      this.loadUsers()
    },

    handleReset () {
      (this.$refs.form as Form).resetFields()
      this.loadUsers()
    },

    handleSizeChange (val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadUsers()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.form.current = val // 修改要查询的页码
      this.loadUsers()
    },

    async handleSelectRole (role: any) {
      this.currentUser = role
      // 加载角色列表
      const { data } = await getAllRoles()
      this.roles = data.data

      const { data: { data: userRoles } } = await getUserRoles((this.currentUser as any).id)
      this.roleIdList = userRoles.map((item: any) => item.id)

      // 展示对话框
      this.dialogVisible = true
    },

    async handleAllocRole () {
      await allocateUserRoles({
        userId: (this.currentUser as any).id,
        roleIdList: this.roleIdList
      })
      this.$message.success('操作成功')
      this.dialogVisible = false
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
