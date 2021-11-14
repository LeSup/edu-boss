<template>
  <div class="category">
    <category-list />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CategoryList from './components/CategoryList.vue'

export default Vue.extend({
  name: 'CategoryIndex',
  components: {
    CategoryList
  }
})
</script>

<style lang="scss" scoped></style>
