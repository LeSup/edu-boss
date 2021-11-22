<template>
  <div class="course-list">
    <el-card>
      <div slot="header">
        <span>数据筛选</span>
      </div>
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="课程名称">
          <el-input size="mini" v-model="searchForm.courseName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="mini" v-model="searchForm.status" clearable placeholder="请选择">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" :disabled="loading" @click="handleReset">重置</el-button>
          <el-button size="mini" type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header">
        <span>查询结果：</span>
        <el-button
          style="float: right; margin-top: -5px"
          type="primary"
          @click="$router.push({
            name: 'course-create'
          })"
        >添加课程</el-button>
      </div>
      <el-table
        :data="courses"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="课程ID"
          width="80px"
        />
        <el-table-column
          prop="courseName"
          label="课程名称"
        />
        <el-table-column
          prop="price"
          label="价格"
          :formatter="(row, column, cellValue, index) => cellValue != undefined ? '￥' + cellValue : ''"
        />
        <el-table-column
          prop="sortNum"
          label="排序"
        />
        <el-table-column
          prop="status"
          label="状态"
          width="100px"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="handleSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120px"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="$router.push({
                name: 'course-edit',
                params: { id: scope.row.id }
              })"
            >编辑</el-button>
            <el-button
              type="text"
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id
                }
              })"
            >内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="searchForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        :disabled="loading"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { getCourses, changeState } from '@/services/course'

export default Vue.extend({
  name: 'CourseList',
  data () {
    return {
      searchForm: {
        currentPage: 1,
        pageSize: 10,
        user: '',
        region: ''
      },
      courses: [],
      totalCount: 0,
      loading: false
    }
  },

  created () {
    this.loadCourses()
  },

  methods: {
    async loadCourses () {
      this.loading = true
      const { data } = await getCourses(this.searchForm)
      data.data.records.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.courses = data.data.records
      this.totalCount = data.data.total
      this.loading = false
    },

    handleReset () {
      (this.$refs.form as Form).resetFields()
      this.loadCourses()
    },

    handleSearch () {
      this.searchForm.currentPage = 1 // 每页大小改变重新查询第1页数据
      this.loadCourses()
    },

    handleSizeChange (val: number) {
      this.searchForm.pageSize = val
      this.searchForm.currentPage = 1 // 每页大小改变重新查询第1页数据
      this.loadCourses()
    },

    handleCurrentChange (val: number) {
      // 请求获取对应页码的数据
      this.searchForm.currentPage = val // 修改要查询的页码
      this.loadCourses()
    },

    async handleSwitchChange (course: any) {
      course.isStatusLoading = true
      await changeState({
        courseId: course.id,
        status: course.status
      })
      this.$message.success(`${course.status === 0 ? '下架' : '上架'}成功`)
      course.isStatusLoading = false
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
