<template>
  <div class="flex justify-end col-12">
    <q-space />
    <q-btn flat color="positive" icon="add" @click="$emit('createButtonEvent')" v-if="showCreateButton">
      <q-tooltip anchor="top middle" self="bottom middle">
        Adicionar
      </q-tooltip>
    </q-btn>
    <q-btn flat color="primary" icon="search" @click="$emit('update:searchMode', !searchMode)" :style="{ backgroundColor: searchMode ? 'lightblue' : '' }" v-if="showSearchButton">
      <q-tooltip anchor="top middle" self="bottom middle">
        Pesquisa refinada
      </q-tooltip>
    </q-btn>
    <q-btn flat color="negative" icon="delete" @click="$emit('update:trashMode', !trashMode)" :style="{ backgroundColor: trashMode ? '#FFBCBC' : '' }" v-if="showTrashButton">
      <q-tooltip anchor="top middle" self="bottom middle">
        Lixeira
      </q-tooltip>
    </q-btn>
    <q-btn flat color="black" icon="print" @click="$emit('update:printMode', !printMode)" :style="{ backgroundColor: printMode ? 'lightgray' : '' }" v-if="showPrintButton">
      <q-tooltip anchor="top middle" self="bottom middle">
        Imprimir
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TableHeaderActionButtonsComponent',
  props: {
    searchMode: {
      type: Boolean,
      default: false
    },
    trashMode: {
      type: Boolean,
      default: false
    },
    printMode: {
      type: Boolean,
      default: false
    },
    showButtons: {
      type: Object,
      default: () => ({
        create: true,
        search: true,
        trash: true,
        print: true
      })
    }
  },
  setup (props) {
    return {
      showCreateButton: props.showButtons.create,
      showSearchButton: props.showButtons.search,
      showTrashButton: props.showButtons.trash,
      showPrintButton: props.showButtons.print
    }
  }
})
</script>
