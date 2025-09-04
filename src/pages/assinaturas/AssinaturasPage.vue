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
          <AssinaturasSearchFields @assinaturasSearchDataEvent="assinaturasSearchData" />
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: assinaturasViewButton, caption: 'Ver assinatura' },
                  // {label: 'Editar', icon: 'edit', color: 'positive', action: assinaturasEditButton, caption: 'Editar assinatura', showOnTrashMode: false },
                  {
                    label: props.row.assinaturas_situacao === 'Ativa' ? 'Inativar' : 'Ativar',
                    icon: props.row.assinaturas_situacao === 'Ativa' ? 'toggle_off' : 'toggle_on',
                    color: props.row.assinaturas_situacao === 'Ativa' ? 'negative' : 'positive',
                    action: assinaturasUpdateStatusButton,
                    caption: props.row.assinaturas_situacao === 'Ativa' ? 'Inativar assinatura' : 'Ativar assinatura',
                    showOnTrashMode: false
                  },
                  // {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: null, caption: 'Remover assinatura', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: null, caption: 'Restaurar assinatura', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: null, caption: 'Excluir definitivamente', showOnTrashMode: true },
                ]"
                :buttonsProps="props"
                v-model:trashMode="trashMode"
              />
            </span>
            <span v-else-if="col.name === 'assinaturas_prazo'">
              <q-badge :color="col.value < 1 ? 'grey' : col.value < 30 ? 'red' : col.value < 60 ? 'yellow-8' : 'green'" text-color="white">
                {{ col.value < 1 ? 'Expirada' : col.value + ' dias' }}
              </q-badge>
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

    <AssinaturaDialog :dialogProp="assinaturasDialog" :mainObjectProp="assinaturasMainObject" @assinaturaDialogReturnEvent="assinaturasFetch" />

  </q-page>
</template>

<script>
// Quasar imports
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, ref, watch } from 'vue'

// JS imports
import { notify } from 'src/imports/NotifyHandler'

// Models imports
import { assinaturasModel } from 'src/models/AssinaturasModel.js'

// Importação de componentes
import AssinaturaDialog from './AssinaturaDialog.vue'
import AssinaturasSearchFields from './AssinaturasSearchFields.vue'
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
    AssinaturaDialog,
    AssinaturasSearchFields,
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

    const assinaturasColumns = ref(assinaturasModel.getCommonColumns())
    const assinaturasFilterForRows = ref('')
    const assinaturasRows = ref([])
    const assinaturasDialog = ref({})
    const assinaturasMainObject = ref({})

    // Hooks
    onMounted(() => {
      assinaturasFetch()
    })

    watch(trashMode, (newValue) => {
      if (newValue) {
        assinaturasFetch()
        assinaturasColumns.value = assinaturasModel.getTrashColumns()
        assinaturasFilterForRows.value = ''
      } else {
        assinaturasFetch()
        assinaturasColumns.value = assinaturasModel.getCommonColumns()
      }
    }, { deep: true })

    watch(searchMode, (newValue) => {
      if (!newValue) {
        assinaturasFetch()
      }
    }, { deep: true })

    const assinaturasCreate = async (data) => {
      // Lógica para criar uma nova assinatura
      console.log(data)
    }

    const assinaturasEditButton = (props) => {
      assinaturasMainObject.value = Object.assign({}, props.row)
      assinaturasDialog.value.action = 'edit'
      assinaturasDialog.value.title = 'Editar'
      assinaturasDialog.value.hint = 'Editar registro de assinatura'
      assinaturasDialog.value.icon = 'edit'
      assinaturasDialog.value.iconColor = 'positive'
      assinaturasDialog.value.visible = true
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

    const assinaturasSearchData = async (searchParamsObject) => {


      // Validação: se nenhum parâmetro foi preenchido, notifica e retorna
      const hasValue = Object.values(searchParamsObject).some(
        (v) => v && v.toString().trim() !== '',
      )
      if (!hasValue) {
        notify.warning('Preencha pelo menos um campo de pesquisa.')
        return
      }
      // Monta a query string com os valores de searchParamsObject
      let queryString = ''
      Object.entries(searchParamsObject).forEach(([key, value]) => {
        if (key.includes('_fk_')) key = key.replace('_fk_', '_fk.')
        if (value) queryString += `${key}=${encodeURIComponent(value)}&`
      })
      // Remove o último '&' se existir
      if (queryString.endsWith('&')) queryString = queryString.slice(0, -1)
      // Roda a requisição
      try {
        const url = `/assinaturas/filter${trashMode.value ? 'Removed' : ''}?` + queryString
        const response = await api.get(url)
        assinaturasRows.value = response.data
      } catch (error) {
        notify.error('Erro ao pesquisar dados: ' + error.message)
      }
    }

    const assinaturasUpdateStatusButton = (props) => {
      assinaturasMainObject.value = Object.assign({}, props.row)
      assinaturasDialog.value.action = 'updateStatus'
      assinaturasDialog.value.title = 'Alterar situação'
      assinaturasDialog.value.hint = props.row.assinaturas_situacao === 'Ativa' ? 'Desativar a assinatura' : 'Ativar a assinatura?'
      assinaturasDialog.value.icon = props.row.assinaturas_situacao === 'Ativa' ? 'toggle_off' : 'toggle_on'
      assinaturasDialog.value.iconColor = props.row.assinaturas_situacao === 'Ativa' ? 'negative' : 'positive'
      assinaturasDialog.value.visible = true
    }

    const assinaturasViewButton = (props) => {
      assinaturasMainObject.value = Object.assign({}, props.row)
      assinaturasDialog.value.action = 'view'
      assinaturasDialog.value.title = 'Visualizar'
      assinaturasDialog.value.hint = 'Visualizar registro de assinatura'
      assinaturasDialog.value.icon = 'visibility'
      assinaturasDialog.value.iconColor = 'primary'
      assinaturasDialog.value.visible = true
    }

    return {
      printMode,
      searchMode,
      trashMode,
      assinaturasColumns,
      assinaturasCreate,
      assinaturasDialog,
      assinaturasEditButton,
      assinaturasFetch,
      assinaturasFilter,
      assinaturasFilterForRows,
      assinaturasMainObject,
      assinaturasRows,
      assinaturasSearchData,
      assinaturasUpdateStatusButton,
      assinaturasViewButton,
      print,
    }
  },
})
</script>
