<template>
  <div class="q-pa-md">
    <q-breadcrumbs>
      <template v-slot:separator>
        <q-icon size="1.5em" name="chevron_right" color="primary" />
      </template>
      <q-breadcrumbs-el
        v-for="item in breadcrumbsArray"
        :key="item.link"
        :label="item.label"
        :icon="item.icon"
        :to="item.link"
      />
    </q-breadcrumbs>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BreadcrumbLinks',
  props: {
    breadcrumbsArray: {
      type: Array,
      required: true
    },
  }
})
</script>
