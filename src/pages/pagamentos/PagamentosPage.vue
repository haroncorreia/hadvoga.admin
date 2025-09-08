<template>
  <q-page class="flex flex-top column">

    <!-- Breadcrumbs -->
    <BreadcrumbsLinks
      :breadcrumbsArray="[
        { icon: 'home', label: 'Início', link: '/home' },
        { icon: 'fa-solid fa-credit-card', label: 'Pagamentos', link: '/pagamentos' },
      ]"
    />

    <q-separator />

    <PageHeader pageTitle="Pagamentos" pageHint="Utilize as opções abaixo para fazer a gestão dos dados dos pagamentos." />

    <q-table
      class="q-pa-md"
      flat
      :filter="pagamentosFilterForRows"
      :rows="pagamentosRows"
      :columns="pagamentosColumns"
      row-key="pagamentos_id"
      :rows-per-page-options="[100]"
      :rows-per-page="100">

      <template v-slot:top>

        <TableHeaderActionButtons v-model:searchMode="searchMode" v-model:trashMode="trashMode" v-model:printMode="printMode" @createButtonEvent="pagamentosCreateButton" />

        <TableHeaderPrintButtons v-model:printMode="printMode" :columns="pagamentosColumns" :rows="pagamentosRows" :prefixFileName="'PLANOS'" />

        <TableHeaderFastFilter v-model:searchMode="searchMode" @filterDataEvent="pagamentosFilter" />

        <TableHeaderSearchFields v-model:searchMode="searchMode">
          <PagamentosSearchFields @pagamentosSearchDataEvent="pagamentosSearchData" />
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: pagamentosViewButton, caption: 'Ver plano' },
                  // {label: 'Editar', icon: 'edit', color: 'positive', action: pagamentosEditButton, caption: 'Editar plano', showOnTrashMode: false },
                  // {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: pagamentosRemoveButton, caption: 'Remover plano', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: pagamentosRestoreButton, caption: 'Restaurar plano', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: pagamentosDestroyButton, caption: 'Excluir definitivamente', showOnTrashMode: true },
                ]"
                :buttonsProps="props"
                v-model:trashMode="trashMode"
              />
            </span>
            <span v-else-if="col.name === 'pagamentos_situacao'">
              <q-badge :color="col.value === 'Confirmado' ? 'green' : col.value === 'Pendente' ? 'orange' : 'red'" text-color="white">
                {{ col.value }}
              </q-badge>
            </span>
            <span v-else :class="trashMode ? 'text-negative' : ''">{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <PagamentoDialog :dialogProp="pagamentosDialog" :mainObjectProp="pagamentosMainObject" @planoDialogReturnEvent="pagamentosFetch" />

  </q-page>
</template>

<script>
// Quasar imports
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, ref, watch } from 'vue'

// JS imports
import { notify } from 'src/imports/NotifyHandler'

// Models imports
import { pagamentosModel } from 'src/models/PagamentosModel.js'

// Importação de componentes
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue'
import PageHeader from 'src/components/PageHeader.vue'
import TableHeaderActionButtons from 'src/components/TableHeaderActionButtons.vue'
import TableDropDownButton from 'src/components/TableDropDownButton.vue'
import TableHeaderFastFilter from 'src/components/TableHeaderFastFilter.vue'
import TableHeaderPrintButtons from 'src/components/TableHeaderPrintButtons.vue'
import TableHeaderSearchFields from 'src/components/TableHeaderSearchFields.vue'
import PagamentoDialog from './PagamentoDialog.vue'
import PagamentosSearchFields from './PagamentosSearchFields.vue'

export default defineComponent({
  name: 'PagamentosPage',

  components: {
    BreadcrumbsLinks,
    PageHeader,
    TableHeaderActionButtons,
    TableDropDownButton,
    TableHeaderFastFilter,
    TableHeaderPrintButtons,
    TableHeaderSearchFields,
    PagamentoDialog,
    PagamentosSearchFields
  },

  setup() {

    const searchMode = ref(false)
    const trashMode = ref(false)
    const printMode = ref(false)

    const pagamentosColumns = ref(pagamentosModel.getCommonColumns())
    const pagamentosDialog = ref({})
    const pagamentosFilterForRows = ref('')
    const pagamentosMainObject = ref({})
    const pagamentosRows = ref([])

    // Hooks
    onMounted(() => {
      pagamentosFetch()
    })

    watch(trashMode, (newValue) => {
      if (newValue) {
        pagamentosFetch()
        pagamentosColumns.value = pagamentosModel.getTrashColumns()
        pagamentosFilterForRows.value = ''
      } else {
        pagamentosFetch()
        pagamentosColumns.value = pagamentosModel.getCommonColumns()
      }
    }, { deep: true })

    watch(searchMode, (newValue) => {
      if (!newValue) {
        pagamentosFetch()
      }
    }, { deep: true })

    const pagamentosCreateButton = () => {
      pagamentosMainObject.value = Object.assign({}, {})
      pagamentosDialog.value.action = 'create'
      pagamentosDialog.value.title = 'Criar'
      pagamentosDialog.value.hint = 'Criar novo plano'
      pagamentosDialog.value.icon = 'add'
      pagamentosDialog.value.iconColor = 'positive'
      pagamentosDialog.value.visible = true
    }

    const pagamentosDestroyButton = (props) => {
      pagamentosMainObject.value = Object.assign({}, props.row)
      pagamentosDialog.value.action = 'destroy'
      pagamentosDialog.value.title = 'Destruir'
      pagamentosDialog.value.hint = 'Excluir definitivamente registro de plano'
      pagamentosDialog.value.icon = 'delete_forever'
      pagamentosDialog.value.iconColor = 'negative'
      pagamentosDialog.value.visible = true
    }

    const pagamentosEditButton = (props) => {
      pagamentosMainObject.value = Object.assign({}, props.row)
      pagamentosDialog.value.action = 'edit'
      pagamentosDialog.value.title = 'Editar'
      pagamentosDialog.value.hint = 'Editar registro de plano'
      pagamentosDialog.value.icon = 'edit'
      pagamentosDialog.value.iconColor = 'positive'
      pagamentosDialog.value.visible = true
    }

    const pagamentosFetch = async () => {
      try {
        const r = await api.get(`/pagamentos/${trashMode.value ? 'removed' : ''}`)
        pagamentosRows.value = r.data
      } catch (error) {
        notify.error('Erro ao buscar dados dos pagamentos: ' + error.message)
      }
    }

    const pagamentosFilter = async (filter) => {
      pagamentosFilterForRows.value = filter
    }

    const pagamentosRemoveButton = (props) => {
      pagamentosMainObject.value = Object.assign({}, props.row)
      pagamentosDialog.value.action = 'remove'
      pagamentosDialog.value.title = 'Remover'
      pagamentosDialog.value.hint = 'Remover registro de plano'
      pagamentosDialog.value.icon = 'delete_sweep'
      pagamentosDialog.value.iconColor = 'negative'
      pagamentosDialog.value.visible = true
    }

    const pagamentosRestoreButton = (props) => {
      pagamentosMainObject.value = Object.assign({}, props.row)
      pagamentosDialog.value.action = 'restore'
      pagamentosDialog.value.title = 'Restaurar'
      pagamentosDialog.value.hint = 'Restaurar registro de plano'
      pagamentosDialog.value.icon = 'restore_from_trash'
      pagamentosDialog.value.iconColor = 'positive'
      pagamentosDialog.value.visible = true
    }

    const pagamentosSearchData = async (searchParamsObject) => {
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
        if (value) queryString += `pagamentos.${key}=${encodeURIComponent(value)}&`
      })
      // Remove o último '&' se existir
      if (queryString.endsWith('&')) queryString = queryString.slice(0, -1)
      // Roda a requisição
      try {
        console.log(queryString);
        const url = `/pagamentos/filter${trashMode.value ? 'Removed' : ''}?` + queryString
        const response = await api.get(url)
        pagamentosRows.value = response.data
      } catch (error) {
        notify.error('Erro ao pesquisar dados: ' + error.message)
      }
    }

    const pagamentosViewButton = (props) => {
      pagamentosMainObject.value = Object.assign({}, props.row)
      pagamentosDialog.value.action = 'view'
      pagamentosDialog.value.title = 'Visualizar'
      pagamentosDialog.value.hint = 'Visualizar registro de plano'
      pagamentosDialog.value.icon = 'visibility'
      pagamentosDialog.value.iconColor = 'primary'
      pagamentosDialog.value.visible = true
    }

    return {
      printMode,
      searchMode,
      trashMode,
      pagamentosColumns,
      pagamentosCreateButton,
      pagamentosDestroyButton,
      pagamentosDialog,
      pagamentosEditButton,
      pagamentosFetch,
      pagamentosFilter,
      pagamentosFilterForRows,
      pagamentosMainObject,
      pagamentosRemoveButton,
      pagamentosRestoreButton,
      pagamentosRows,
      pagamentosSearchData,
      pagamentosViewButton,
      print,
    }
  },
})
</script>
