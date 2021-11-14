<template>
  <div class="menu">
    <el-card>
      <div slot="header">
        <el-button size="mini" @click="$router.push({ name: 'menu-create' })">新建菜单</el-button>
      </div>
      <el-table
        :data="menus"
        v-loading="loading"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="编号"
          min-width="80"
        />
        <el-table-column
          prop="name"
          label="菜单名称"
          min-width="150"
        />
        <el-table-column
          prop="level"
          label="菜单级数"
          min-width="150"
        />
        <el-table-column
          prop="icon"
          label="前端图标"
          min-width="150"
        />
        <el-table-column
          prop="orderNum"
          label="排序"
          min-width="150"
        />
        <el-table-column
          label="操作"
          min-width="150"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllMenus, deleteMenu } from '@/services/menu'

export default Vue.extend({
  name: 'MenuIndex',
  data () {
    return {
      menus: [],
      loading: false
    }
  },
  created () {
    this.loadAllMenus()
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    handleEdit (item: any) {
      this.$router.push({
        name: 'menu-edit',
        params: {
          id: item.id
        }
      })
    },
    handleDelete (item: any) {
      this.$confirm('确认删除吗？', '删除提示', {})
        .then(async () => {
          this.loading = true
          await deleteMenu(item.id)
          this.$message.success('删除成功')
          this.loadAllMenus() // 更新数据列表
        })
        .catch(err => { // 取消执行这里
          console.log(err)
          this.$message.info('已取消删除')
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
})
</script>

<style lang="scss" scoped></style>
