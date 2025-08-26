<template>
  <q-slide-transition>
    <div class="col-12" v-if="props.searchMode">
      <slot />
    </div>
  </q-slide-transition>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableHeaderSearchFieldsComponent',
  props: {
    searchMode: {
      type: Boolean,
      default: false
    },
  },
  setup (props) {
    return {
      props,
    }
  }
})
</script>
