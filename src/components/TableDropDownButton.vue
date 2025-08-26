<template>
  <q-btn-dropdown flat color="grey" icon="more_vert">
    <q-list v-if="!componentTrashMode">
      <div v-for="(button, index) in componentButtons" :key="index">
        <q-separator v-if="button.showSeparator" />
        <q-item clickable @click="button.action(componentButtonsProps)" v-if="!button.showOnTrashMode">
          <q-item-section side>
            <q-icon :name="button.icon" :color="button.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ button.label }}</q-item-label>
            <q-item-label caption>{{ button.caption }}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="button.showSide">
            <q-icon name="play_arrow" color="primary" />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <q-list v-else>
      <div v-for="(button, index) in componentButtons" :key="index">
        <q-item clickable @click="button.action(componentButtonsProps)" v-if="button.showOnTrashMode === undefined || button.showOnTrashMode">
          <q-item-section side>
            <q-icon :name="button.icon" :color="button.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ button.label }}</q-item-label>
            <q-item-label caption>{{ button.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'TableDropDownButtonComponent',
  props: {
    buttons: {
      type: Object,
      required: true
    },
    buttonsProps: {
      type: Object,
      required: true
    },
    trashMode: {
      type: Boolean,
      required: true
    }
  },
  setup (props) {

    // Necessário para manter o valor atualizado quando modificado no pai
    const componentTrashMode = computed(() => props.trashMode);
    const componentButtons = computed(() => props.buttons);
    const componentButtonsProps = computed(() => props.buttonsProps);

    return {
      componentTrashMode,
      componentButtons,
      componentButtonsProps
    }
  }
})
</script>
