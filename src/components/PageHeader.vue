<template>
  <!-- Title -->
  <div class="q-pa-md text-h5">{{ pageTitle }}</div>
  <!-- Subtitle -->
  <div class="q-px-md text-subtitle">{{ pageHint }}</div>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PageHeaderComponent',
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    pageHint: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {
      ...props
    }
  }
})
</script>
