<template>
  <q-card-section>
    <div class="text-h6">{{ pageSubtitle }}</div>
    <div class="text-subtitle">{{ pageHint }}</div>
  </q-card-section>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageSubtitle',
  props: {
    pageSubtitle: {
      type: String,
      required: true
    },
    pageHint: {
      type: String,
      required: true
    },
  }
})
</script>
