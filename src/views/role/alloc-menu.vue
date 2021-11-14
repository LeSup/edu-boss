<template>
  <div class="alloc-menu">
    <el-card>
      <div slot="header">
        <span>分配菜单</span>
      </div>
      <el-tree
        ref="tree"
        :data="menus"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedKeys"
        :props="defaultProps"
        default-expand-all
      />
      <div style="margin-top: 10px; text-align: center">
        <el-button size="mini" @click="resetChecked" :disabled="loading">清空</el-button>
        <el-button size="mini" type="primary" @click="onSave" :disabled="loading">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tree } from 'element-ui'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default Vue.extend({
  name: 'AllocMenu',
  props: {
    roleId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      checkedKeys: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      loading: false
    }
  },

  created () {
    this.loadMenus()
    this.loadRoleMenus()
  },

  methods: {
    async loadMenus () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },

    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      const checkedKeys: number[] = []
      this.getCheckedKeys(data.data, checkedKeys)
      this.checkedKeys = checkedKeys as any
    },

    getCheckedKeys (menus: any, checkedKeys: number[]) {
      menus.forEach((menu: any) => {
        if (menu.selected) {
          checkedKeys.push(menu.id)
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList, checkedKeys)
        }
      })
    },

    async onSave () {
      this.loading = true
      const menuIdList = (this.$refs.tree as Tree).getCheckedKeys()
      await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      this.loading = false
      this.$message.success('操作成功')
      this.$router.back()
    },

    resetChecked () {
      (this.$refs.tree as Tree).setCheckedKeys([])
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
