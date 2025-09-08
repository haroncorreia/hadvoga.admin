<template>
  <q-page class="flex flex-top column">

    <!-- Breadcrumbs -->
    <BreadcrumbsLinks
      :breadcrumbsArray="[
        { icon: 'home', label: 'Início', link: '/home' },
        { icon: 'fa-solid fa-users', label: 'Planos', link: '/planos' },
      ]"
    />

    <q-separator />

    <PageHeader pageTitle="Usuários" pageHint="Utilize as opções abaixo para fazer a gestão dos dados dos planos." />

    <q-table
      class="q-pa-md"
      flat
      :filter="planosFilterForRows"
      :rows="planosRows"
      :columns="planosColumns"
      row-key="planos_id"
      :rows-per-page-options="[100]"
      :rows-per-page="100">

      <template v-slot:top>

        <TableHeaderActionButtons v-model:searchMode="searchMode" v-model:trashMode="trashMode" v-model:printMode="printMode" @createButtonEvent="planosCreateButton" />

        <TableHeaderPrintButtons v-model:printMode="printMode" :columns="planosColumns" :rows="planosRows" :prefixFileName="'PLANOS'" />

        <TableHeaderFastFilter v-model:searchMode="searchMode" @filterDataEvent="planosFilter" />

        <TableHeaderSearchFields v-model:searchMode="searchMode">
          <PlanosSearchFields @planosSearchDataEvent="planosSearchData" />
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: planosViewButton, caption: 'Ver plano' },
                  {label: 'Editar', icon: 'edit', color: 'positive', action: planosEditButton, caption: 'Editar plano', showOnTrashMode: false },
                  {
                    label: props.row.planos_ativo ? 'Desativar' : 'Ativar',
                    icon: props.row.planos_ativo ? 'toggle_off' : 'toggle_on',
                    color: props.row.planos_ativo ? 'negative' : 'positive',
                    action: planosEnableDisableButton,
                    caption: props.row.planos_ativo ? 'Desativar plano' : 'Ativar plano',
                    showOnTrashMode: false
                  },
                  {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: planosRemoveButton, caption: 'Remover plano', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: planosRestoreButton, caption: 'Restaurar plano', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: planosDestroyButton, caption: 'Excluir definitivamente', showOnTrashMode: true },
                ]"
                :buttonsProps="props"
                v-model:trashMode="trashMode"
              />
            </span>
            <span v-else-if="col.name === 'planos_ativo'">
              <q-badge :color="col.value === 1 ? 'green' : 'red'" text-color="white">
                {{ col.value === 1 ? 'Sim' : 'Não' }}
              </q-badge>
            </span>
            <span v-else :class="trashMode ? 'text-negative' : ''">{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <PlanoDialog :dialogProp="planosDialog" :mainObjectProp="planosMainObject" @planoDialogReturnEvent="planosFetch" />

  </q-page>
</template>

<script>
// Quasar imports
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'

// JS imports
import { notify } from 'src/imports/NotifyHandler'

// Models imports
import { planosModel } from 'src/models/PlanosModel.js'

// Importação de componentes
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue'
import OperationDialog from 'src/components/OperationDialog.vue'
import PageHeader from 'src/components/PageHeader.vue'
import TableHeaderActionButtons from 'src/components/TableHeaderActionButtons.vue'
import TableDropDownButton from 'src/components/TableDropDownButton.vue'
import TableHeaderFastFilter from 'src/components/TableHeaderFastFilter.vue'
import TableHeaderPrintButtons from 'src/components/TableHeaderPrintButtons.vue'
import TableHeaderSearchFields from 'src/components/TableHeaderSearchFields.vue'
import PlanoDialog from './PlanoDialog.vue'
import PlanosSearchFields from './PlanosSearchFields.vue'
import { ResponseHandler } from 'src/imports/ResponseHandler'

export default defineComponent({
  name: 'PlanosPage',

  components: {
    BreadcrumbsLinks,
    PageHeader,
    TableHeaderActionButtons,
    TableDropDownButton,
    TableHeaderFastFilter,
    TableHeaderPrintButtons,
    TableHeaderSearchFields,
    PlanoDialog,
    PlanosSearchFields
  },

  setup() {

    const $q = useQuasar()

    const searchMode = ref(false)
    const trashMode = ref(false)
    const printMode = ref(false)

    const planosColumns = ref(planosModel.getCommonColumns())
    const planosDialog = ref({})
    const planosFilterForRows = ref('')
    const planosMainObject = ref({})
    const planosRows = ref([])

    // Hooks
    onMounted(() => {
      planosFetch()
    })

    watch(trashMode, (newValue) => {
      if (newValue) {
        planosFetch()
        planosColumns.value = planosModel.getTrashColumns()
        planosFilterForRows.value = ''
      } else {
        planosFetch()
        planosColumns.value = planosModel.getCommonColumns()
      }
    }, { deep: true })

    watch(searchMode, (newValue) => {
      if (!newValue) {
        planosFetch()
      }
    }, { deep: true })

    const planosCreateButton = () => {
      planosMainObject.value = Object.assign({}, {})
      planosDialog.value.action = 'create'
      planosDialog.value.title = 'Criar'
      planosDialog.value.hint = 'Criar novo plano'
      planosDialog.value.icon = 'add'
      planosDialog.value.iconColor = 'positive'
      planosDialog.value.visible = true
    }

    const planosDestroyButton = (props) => {
      planosMainObject.value = Object.assign({}, props.row)
      planosDialog.value.action = 'destroy'
      planosDialog.value.title = 'Destruir'
      planosDialog.value.hint = 'Excluir definitivamente registro de plano'
      planosDialog.value.icon = 'delete_forever'
      planosDialog.value.iconColor = 'negative'
      planosDialog.value.visible = true
    }

    const planosEditButton = (props) => {
      planosMainObject.value = Object.assign({}, props.row)
      planosDialog.value.action = 'edit'
      planosDialog.value.title = 'Editar'
      planosDialog.value.hint = 'Editar registro de plano'
      planosDialog.value.icon = 'edit'
      planosDialog.value.iconColor = 'positive'
      planosDialog.value.visible = true
    }

    const planosEnableDisableButton = (props) => {
      $q.dialog({
        component: OperationDialog,
        componentProps: {
          dialogMessage: props.row.planos_ativo ? 'Tem certeza que deseja desativar este plano?' : 'Tem certeza que deseja ativar este plano?',
          dialogIcon: props.row.planos_ativo ? 'toggle_off' : 'toggle_on',
          dialogIconColor: props.row.planos_ativo ? 'negative' : 'positive',
          persistent: true,
        },
      }).onOk(async () => {
        try {
          const res = await api.patch(`/planos/${props.row.planos_id}/update-status`, { ativo: !props.row.planos_ativo })
          ResponseHandler(res)
          planosFetch()
        } catch (error) {
          ResponseHandler(error.response);
        }
      })
    }

    const planosFetch = async () => {
      try {
        const r = await api.get(`/planos/${trashMode.value ? 'removed' : ''}`)
        planosRows.value = r.data
      } catch (error) {
        notify.error('Erro ao buscar dados dos planos: ' + error.message)
      }
    }

    const planosFilter = async (filter) => {
      planosFilterForRows.value = filter
    }

    const planosRemoveButton = (props) => {
      planosMainObject.value = Object.assign({}, props.row)
      planosDialog.value.action = 'remove'
      planosDialog.value.title = 'Remover'
      planosDialog.value.hint = 'Remover registro de plano'
      planosDialog.value.icon = 'delete_sweep'
      planosDialog.value.iconColor = 'negative'
      planosDialog.value.visible = true
    }

    const planosRestoreButton = (props) => {
      planosMainObject.value = Object.assign({}, props.row)
      planosDialog.value.action = 'restore'
      planosDialog.value.title = 'Restaurar'
      planosDialog.value.hint = 'Restaurar registro de plano'
      planosDialog.value.icon = 'restore_from_trash'
      planosDialog.value.iconColor = 'positive'
      planosDialog.value.visible = true
    }

    const planosSearchData = async (searchParamsObject) => {
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
        if (value) queryString += `planos.${key}=${encodeURIComponent(value)}&`
      })
      // Remove o último '&' se existir
      if (queryString.endsWith('&')) queryString = queryString.slice(0, -1)
      // Roda a requisição
      try {
        console.log(queryString);
        const url = `/planos/filter${trashMode.value ? 'Removed' : ''}?` + queryString
        const response = await api.get(url)
        planosRows.value = response.data
      } catch (error) {
        notify.error('Erro ao pesquisar dados: ' + error.message)
      }
    }

    const planosViewButton = (props) => {
      planosMainObject.value = Object.assign({}, props.row)
      planosDialog.value.action = 'view'
      planosDialog.value.title = 'Visualizar'
      planosDialog.value.hint = 'Visualizar registro de plano'
      planosDialog.value.icon = 'visibility'
      planosDialog.value.iconColor = 'primary'
      planosDialog.value.visible = true
    }

    return {
      printMode,
      searchMode,
      trashMode,
      planosColumns,
      planosCreateButton,
      planosDestroyButton,
      planosDialog,
      planosEditButton,
      planosEnableDisableButton,
      planosFetch,
      planosFilter,
      planosFilterForRows,
      planosMainObject,
      planosRemoveButton,
      planosRestoreButton,
      planosRows,
      planosSearchData,
      planosViewButton,
      print,
    }
  },
})
</script>
