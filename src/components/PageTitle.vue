<template>
  <q-card-section>
    <div class="text-h4">{{ pageTitle }}</div>
  </q-card-section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageTitle',
  props: {
    pageTitle: {
      type: String,
      required: true
    },
  }
})
</script>
