<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 500px; max-width: 60vw;">

      <!-- Title -->
      <q-card-section class="row items-center q-pb-sm">
        <div class="flex flex-start q-mr-md">
          <q-icon :name="dialogIcon" size="32px" :color="dialogIconColor" />
        </div>
        <div class="flex flex-start column">
          <div class="text-h6 text-grey-8">{{ dialogTitle }}</div>
          <!-- <div class="text-subtitle">{{ subtitle }}</div> -->
          <div class="text-grey">{{ dialogHint }}</div>
        </div>
        <q-space />
        <!-- <q-btn icon="close" flat round dense v-close-popup /> -->
      </q-card-section>
      <q-separator inset />

      <q-card-section>
        <div class="row q-pt-md q-pb-md">
          {{ props.dialogMessage }}
        </div>
      </q-card-section>

      <q-separator inset />

      <!-- buttons example -->
      <q-card-actions class="justify-center q-pt-md q-pb-md">
        <div class="row q-gutter-sm justify-center">
          <q-btn
            flat
            :color="props.btnLeftColor"
            :label="props.btnLeftText"
            @click="onOKClick"
            :icon="props.btnLeftIcon"
            style="width: 120px"
            />
          <q-btn
            flat
            :color="props.btnRightColor"
            :label="props.btnRightText"
            @click="onCancelClick"
            :icon="props.btnRightIcon"
            style="width: 120px"
            />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

import { defineComponent } from 'vue'
import { useDialogPluginComponent } from 'quasar';
// import DialogHeader from 'src/components/DialogHeader.vue'

export default defineComponent({

  name: 'OperationDialogComponent',

  components: {
    // DialogHeader
  },

  props: {
    dialogMessage: {
      type: String,
      required: false,
      default: 'Deseja confirmar a operação?'
    },
    dialogIcon: {
      type: String,
      required: false,
      default: 'warning'
    },
    dialogIconColor: {
      type: String,
      required: false,
      default: 'warning'
    },
    dialogTitle: {
      type: String,
      required: false,
      default: 'Atenção'
    },
    dialogHint: {
      type: String,
      required: false,
      default: 'Confirme a operação'
    },
    btnLeftColor: {
      type: String,
      default: 'positive'
    },
    btnRightColor: {
      type: String,
      default: 'negative'
    },
    btnLeftText: {
      type: String,
      required: false,
      default: 'Sim'
    },
    btnRightText: {
      type: String,
      required: false,
      default: 'Não'
    },
    btnLeftIcon: {
      type: String,
      required: false,
      default: 'check'
    },
    btnRightIcon: {
      type: String,
      required: false,
      default: 'close'
    },
  },

  emits: [
    ...useDialogPluginComponent.emits
  ],

  setup(props) {

    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

    return {
      props,
      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK()
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel
    }

  }

})
</script>
