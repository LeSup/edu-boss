<template>
  <div class="menu-create">
    <create-or-update :isEdit="true"></create-or-update>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrUpdate from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'MenuEdit',
  components: {
    createOrUpdate
  }
})
</script>

<style lang="scss" scoped></style>
