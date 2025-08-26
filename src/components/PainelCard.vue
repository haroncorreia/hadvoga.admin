<template>
  <q-card class="flex column full-height justify-between">
    <q-card-section>
      <q-icon :name="iconName" size="3em" />
      <div class="text-h6">{{ cardTitle }}</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      {{ cardDescription }}
    </q-card-section>
    <q-card-actions>
      <q-btn class="q-ma-sm full-width" :label="cardTitle" color="primary" :to="cardLink" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PainelCard',
  props: {
    iconName: {
      type: String,
      required: true
    },
    cardTitle:{
      type: String,
      required: true
    },
    cardDescription:{
      type: String,
      required: true
    },
    cardLink:{
      type: String,
      required: true
    }
  },
  setup (props) {
    // console.log('PainelCard mounted');
    return {
      ...props,
    }
  }
})
</script>
