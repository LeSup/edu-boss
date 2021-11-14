<template>
  <div class="menu-create">
    <create-or-update></create-or-update>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createOrUpdate from './components/CreateOrEdit.vue'

export default Vue.extend({
  name: 'MenuCreate',
  components: {
    createOrUpdate
  }
})
</script>

<style lang="scss" scoped></style>
