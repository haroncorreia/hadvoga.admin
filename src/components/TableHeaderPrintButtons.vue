<template>
  <q-slide-transition>
    <div class="flex justify-end col-12" v-if="props.printMode">
      <q-btn style="width: 70px;" class="q-pa-md q-mt-md" flat color="black" icon="fa-solid fa-file-csv" stack label="CSV" @click="print('csv')" />
      <q-btn style="width: 70px;" class="q-pa-md q-mt-md" flat color="primary" icon="fa-solid fa-file-code" stack label="HTML" @click="print('html')" />
      <q-btn style="width: 70px;" class="q-pa-md q-mt-md" flat color="red" icon="fa-solid fa-file-pdf" stack label="PDF" @click="print('pdf')" />
    </div>
  </q-slide-transition>
</template>

<script>
import { defineComponent } from 'vue'
import { printCSV, printHTML, printPDF } from 'src/imports/PrintHandler';
import { notify } from 'src/imports/NotifyHandler';

export default defineComponent({
  name: 'TableHeaderPrintButtonsComponent',
  props: {
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    prefixFileName: {
      type: String,
      default: 'FILE'
    },
    printMode: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {

    function print(format) {
      switch (format) {
        case 'csv':
          printCSV(props.columns, props.rows, props.prefixFileName);
          break;
        case 'html':
          printHTML(props.columns, props.rows, props.prefixFileName);
          break;
        case 'pdf':
          printPDF(props.columns, props.rows, props.prefixFileName);
          break;
        default:
          notify.warning("Formato de exportação desconhecido.");
      }
    }

    return {
      print,
      props
    }
  }
})
</script>
