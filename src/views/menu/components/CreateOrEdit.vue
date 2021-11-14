<template>
  <el-card>
    <div slot="header">
      <span>{{ isEdit ? '编辑菜单' : '添加菜单' }}</span>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径" prop="href">
        <el-input v-model="form.href"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单">
        <el-select v-model="form.parentId" placeholder="请选择">
          <el-option label="无上级菜单" :value="-1"></el-option>
          <el-option
            v-for="item of parentMenuList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="前端图标">
        <el-input v-model="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.shown">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.orderNum" :min="1" :max="10" label="请输入"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" @click="onSubmit" :loading="loading">提交</el-button>
        <el-button size="mini" v-if="!isEdit" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Form } from 'element-ui'
import { createOrUpdateMenu, getEditMenuInfo } from '@/services/menu'

export default Vue.extend({
  name: 'MenuCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      parentMenuList: [],
      form: {
        parentId: -1, // -1 表示没有上级菜单
        name: '',
        href: '',
        description: '',
        icon: '',
        shown: false,
        orderNum: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        href: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async loadMenuInfo () {
      const { data } = await getEditMenuInfo(this.$route.params.id || -1)
      if (data.data.menuInfo) {
        this.form = data.data.menuInfo
      }
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
      }
    },

    async onSubmit () {
      try {
        // 表单验证
        await (this.$refs.form as Form).validate()

        this.loading = true

        // 提交表单
        const { data } = await createOrUpdateMenu(this.form)
        if (data.code === '000000') {
          this.$message.success('提交成功')
          this.$router.back()
        }
      } catch (error) {
        console.dir(error)
      } finally {
        this.loading = false
      }
    },

    onReset () {
      (this.$refs.form as Form).resetFields()
    }
  }
})
</script>

<style lang="scss" scoped></style>
