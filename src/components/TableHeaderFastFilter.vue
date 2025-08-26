<template>
  <q-slide-transition>
    <div class="col-12" v-if="!props.searchMode">
      <q-input clearable dense debounce="300" v-model="componentFilter" placeholder="Filtro rápido" class="col-6" @update:model-value="$emit('filterDataEvent', componentFilter)">
        <template v-slot:append>
          <q-icon name="filter_alt" />
        </template>
      </q-input>
    </div>
  </q-slide-transition>
</template>

<script>
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'TableHeaderFastFilterComponent',
  props: {
    searchMode: {
      type: Boolean,
      default: false
    },
  },
  setup (props) {

    // TODO fazer o computed desse cara.
    const componentFilter = ref('');

    return {
      componentFilter,
      props
    }
  }
})
</script>
