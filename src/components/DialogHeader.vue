<template>
  <q-card-section class="row items-center q-pb-sm">
    <div class="flex flex-start q-mr-md">
      <q-icon :name="dialogIcon" size="32px" :color="dialogIconColor" />
    </div>
    <div class="flex flex-start column">
      <div class="text-h6 text-grey-8">{{ dialogTitle }}</div>
      <div class="text-grey">{{ dialogHint }}</div>
    </div>
    <q-space />
    <q-btn icon="close" flat round dense v-close-popup />
  </q-card-section>
  <q-separator inset />
</template>

<script>
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  name: 'DialogHeaderComponent',
  props: {
    dialogIcon: {
      type: String,
      default: 'info',
    },
    dialogIconColor: {
      type: String,
      default: 'primary',
    },
    dialogTitle: {
      type: String,
      default: 'Titulo do Diálogo',
    },
    dialogHint: {
      type: String,
      default: 'Dica do Diálogo',
    },
  },

  setup(props) {

    onMounted(() => {
    });

    return {
      ...props,
    }
  }
})
</script>
