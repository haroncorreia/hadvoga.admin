<template>
  <q-page class="flex flex-top column">

    <!-- Breadcrumbs -->
    <BreadcrumbsLinks
      :breadcrumbsArray="[
        { icon: 'home', label: 'Início', link: '/home' },
        { icon: 'fa-solid fa-circle-user', label: 'Assinaturas', link: '/assinaturas' },
      ]"
    />

    <q-separator />

    <PageHeader pageTitle="Assinaturas" pageHint="Utilize as opções abaixo para fazer a gestão dos dados das assinaturas." />

    <q-table
      class="q-pa-md"
      flat
      :filter="assinaturasFilterForRows"
      :rows="assinaturasRows"
      :columns="assinaturasColumns"
      row-key="assinaturas_id"
      :rows-per-page-options="[100]"
      :rows-per-page="100">

      <template v-slot:top>

        <TableHeaderActionButtons v-model:searchMode="searchMode" v-model:trashMode="trashMode" v-model:printMode="printMode" @createButtonEvent="assinaturasCreate" />

        <TableHeaderPrintButtons v-model:printMode="printMode" :columns="assinaturasColumns" :rows="assinaturasRows" :prefixFileName="'CLIENTES'" />

        <TableHeaderFastFilter v-model:searchMode="searchMode" @filterDataEvent="assinaturasFilter" />

        <TableHeaderSearchFields v-model:searchMode="searchMode">
          <!-- <ClientesSearchFields @assinaturasSearchDataEvent="assinaturasSearchData" /> -->
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: null, caption: 'Ver assinatura' },
                  {label: 'Editar', icon: 'edit', color: 'positive', action: null, caption: 'Editar assinatura', showOnTrashMode: false },
                  {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: null, caption: 'Remover assinatura', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: null, caption: 'Restaurar assinatura', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: null, caption: 'Excluir definitivamente', showOnTrashMode: true },
                ]"
                :buttonsProps="props"
                v-model:trashMode="trashMode"
              />
            </span>
            <span v-else-if="col.name === 'assinaturas_situacao'">
              <q-badge :color="col.value === 'Ativa' ? 'green' : col.value === 'Expirada' ? 'grey' : 'red'" text-color="white">
                {{ col.value }}
              </q-badge>
            </span>
            <span v-else :class="trashMode ? 'text-negative' : ''">{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

  </q-page>
</template>

<script>
// Quasar imports
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, ref } from 'vue'

// JS imports
import { notify } from 'src/imports/NotifyHandler'

// Models imports
import { assinaturasModel } from 'src/models/AssinaturasModel.js'

// Importação de componentes
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue'
import PageHeader from 'src/components/PageHeader.vue'
import TableHeaderActionButtons from 'src/components/TableHeaderActionButtons.vue'
import TableDropDownButton from 'src/components/TableDropDownButton.vue'
import TableHeaderFastFilter from 'src/components/TableHeaderFastFilter.vue'
import TableHeaderPrintButtons from 'src/components/TableHeaderPrintButtons.vue'
import TableHeaderSearchFields from 'src/components/TableHeaderSearchFields.vue'

export default defineComponent({
  name: 'AssinaturasPage',

  components: {
    BreadcrumbsLinks,
    PageHeader,
    TableHeaderActionButtons,
    TableDropDownButton,
    TableHeaderFastFilter,
    TableHeaderPrintButtons,
    TableHeaderSearchFields
  },

  setup() {

    const searchMode = ref(false)
    const trashMode = ref(false)
    const printMode = ref(false)

    const assinaturasFilterForRows = ref('')
    const assinaturasRows = ref([])
    const assinaturasColumns = ref(assinaturasModel.getCommonColumns())

    // Hooks
    onMounted(() => {
      assinaturasFetch()
    })

    const assinaturasCreate = async (data) => {
      // Lógica para criar uma nova assinatura
      console.log(data)
    }

    const assinaturasFetch = async () => {
      try {
        const r = await api.get(`/assinaturas/${trashMode.value ? 'removed' : ''}`)
        assinaturasRows.value = r.data
      } catch (error) {
        notify.error('Erro ao buscar dados dos assinaturas: ' + error.message)
      }
    }

    const assinaturasFilter = async (filter) => {
      assinaturasFilterForRows.value = filter
    }

    return {
      printMode,
      searchMode,
      trashMode,
      assinaturasColumns,
      assinaturasCreate,
      assinaturasFilter,
      assinaturasFilterForRows,
      assinaturasRows,
      print,
    }
  },
})
</script>
