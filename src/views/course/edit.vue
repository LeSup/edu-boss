<template>
  <div class="course-edit">
    <create-or-update :course-id="id" is-edit />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateOrUpdate from './components/CreateOrUpdate.vue'

export default Vue.extend({
  name: 'CourseEdit',
  components: {
    CreateOrUpdate
  },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
