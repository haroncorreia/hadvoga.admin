<template>
  <q-page class="flex flex-top column">

    <!-- Breadcrumbs -->
    <BreadcrumbsLinks
      :breadcrumbsArray="[
        { icon: 'home', label: 'Início', link: '/home' },
        { icon: 'fa-solid fa-users', label: 'Usuarios', link: '/usuarios' },
      ]"
    />

    <q-separator />

    <PageHeader pageTitle="Usuários" pageHint="Utilize as opções abaixo para fazer a gestão dos dados dos usuários." />

    <q-table
      class="q-pa-md"
      flat
      :filter="usuariosFilterForRows"
      :rows="usuariosRows"
      :columns="usuariosColumns"
      row-key="usuarios_id"
      :rows-per-page-options="[100]"
      :rows-per-page="100">

      <template v-slot:top>

        <TableHeaderActionButtons v-model:searchMode="searchMode" v-model:trashMode="trashMode" v-model:printMode="printMode" @createButtonEvent="usuariosCreateButton" />

        <TableHeaderPrintButtons v-model:printMode="printMode" :columns="usuariosColumns" :rows="usuariosRows" :prefixFileName="'USUARIOS'" />

        <TableHeaderFastFilter v-model:searchMode="searchMode" @filterDataEvent="usuariosFilter" />

        <TableHeaderSearchFields v-model:searchMode="searchMode">
          <UsuariosSearchFields @usuariosSearchDataEvent="usuariosSearchData" />
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: usuariosViewButton, caption: 'Ver usuário' },
                  {label: 'Editar', icon: 'edit', color: 'positive', action: usuariosEditButton, caption: 'Editar usuário', showOnTrashMode: false },
                  {
                    label: props.row.usuarios_habilitado ? 'Desabilitar' : 'Habilitar',
                    icon: props.row.usuarios_habilitado ? 'sym_o_person_off' : 'sym_o_person_check',
                    color: props.row.usuarios_habilitado ? 'negative' : 'positive',
                    action: usuariosEnableDisableButton,
                    caption: props.row.usuarios_habilitado ? 'Desabilitar usuário' : 'Habilitar usuário',
                    showOnTrashMode: false
                  },
                  {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: usuariosRemoveButton, caption: 'Remover usuário', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: usuariosRestoreButton, caption: 'Restaurar usuário', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: usuariosDestroyButton, caption: 'Excluir definitivamente', showOnTrashMode: true },
                ]"
                :buttonsProps="props"
                v-model:trashMode="trashMode"
              />
            </span>
            <span v-else-if="col.name === 'usuarios_habilitado'">
              <q-badge :color="col.value === 'Sim' ? 'green' : 'red'" text-color="white">
                {{ col.value }}
              </q-badge>
            </span>
            <span v-else :class="trashMode ? 'text-negative' : ''">{{ col.value }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <UsuarioDialog :dialogProp="usuariosDialog" :mainObjectProp="usuariosMainObject" @usuarioDialogReturnEvent="usuariosFetch" />
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
import { usuariosModel } from 'src/models/UsuariosModel.js'

// Importação de componentes
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue'
import OperationDialog from 'src/components/OperationDialog.vue'
import PageHeader from 'src/components/PageHeader.vue'
import TableHeaderActionButtons from 'src/components/TableHeaderActionButtons.vue'
import TableDropDownButton from 'src/components/TableDropDownButton.vue'
import TableHeaderFastFilter from 'src/components/TableHeaderFastFilter.vue'
import TableHeaderPrintButtons from 'src/components/TableHeaderPrintButtons.vue'
import TableHeaderSearchFields from 'src/components/TableHeaderSearchFields.vue'
import UsuarioDialog from './UsuarioDialog.vue'
import UsuariosSearchFields from './UsuariosSearchFields.vue'
import { ResponseHandler } from 'src/imports/ResponseHandler'

export default defineComponent({
  name: 'UsuariosPage',

  components: {
    BreadcrumbsLinks,
    PageHeader,
    TableHeaderActionButtons,
    TableDropDownButton,
    TableHeaderFastFilter,
    TableHeaderPrintButtons,
    TableHeaderSearchFields,
    UsuarioDialog,
    UsuariosSearchFields
  },

  setup() {

    const $q = useQuasar()

    const searchMode = ref(false)
    const trashMode = ref(false)
    const printMode = ref(false)

    const usuariosColumns = ref(usuariosModel.getCommonColumns())
    const usuariosDialog = ref({})
    const usuariosFilterForRows = ref('')
    const usuariosMainObject = ref({})
    const usuariosRows = ref([])

    // Hooks
    onMounted(() => {
      usuariosFetch()
    })

    watch(trashMode, (newValue) => {
      if (newValue) {
        usuariosFetch()
        usuariosColumns.value = usuariosModel.getTrashColumns()
        usuariosFilterForRows.value = ''
      } else {
        usuariosFetch()
        usuariosColumns.value = usuariosModel.getCommonColumns()
      }
    }, { deep: true })

    watch(searchMode, (newValue) => {
      if (!newValue) {
        usuariosFetch()
      }
    }, { deep: true })

    const usuariosCreateButton = () => {
      usuariosMainObject.value = Object.assign({}, {})
      usuariosDialog.value.action = 'create'
      usuariosDialog.value.title = 'Criar'
      usuariosDialog.value.hint = 'Criar novo usuário'
      usuariosDialog.value.icon = 'add'
      usuariosDialog.value.iconColor = 'positive'
      usuariosDialog.value.visible = true
    }

    const usuariosDestroyButton = (props) => {
      usuariosMainObject.value = Object.assign({}, props.row)
      usuariosDialog.value.action = 'destroy'
      usuariosDialog.value.title = 'Destruir'
      usuariosDialog.value.hint = 'Excluir definitivamente registro de usuário'
      usuariosDialog.value.icon = 'delete_forever'
      usuariosDialog.value.iconColor = 'negative'
      usuariosDialog.value.visible = true
    }

    const usuariosEditButton = (props) => {
      usuariosMainObject.value = Object.assign({}, props.row)
      usuariosDialog.value.action = 'edit'
      usuariosDialog.value.title = 'Editar'
      usuariosDialog.value.hint = 'Editar registro de usuário'
      usuariosDialog.value.icon = 'edit'
      usuariosDialog.value.iconColor = 'positive'
      usuariosDialog.value.visible = true
    }

    const usuariosEnableDisableButton = (props) => {
      $q.dialog({
        component: OperationDialog,
        componentProps: {
          dialogMessage: props.row.usuarios_habilitado ? 'Tem certeza que deseja desabilitar este usuário?' : 'Tem certeza que deseja habilitar este usuário?',
          dialogIcon: props.row.usuarios_habilitado ? 'sym_o_person_off' : 'sym_o_person_check',
          dialogIconColor: props.row.usuarios_habilitado ? 'negative' : 'positive',
          persistent: true,
        },
      }).onOk(async () => {
        try {
          const res = await api.patch(`/usuarios/${props.row.usuarios_id}/toggleUserEnableDisable`, { habilitado: !props.row.usuarios_habilitado })
          ResponseHandler(res)
          usuariosFetch()
        } catch (error) {
          ResponseHandler(error.response);
        }
      })
    }

    const usuariosFetch = async () => {
      try {
        const r = await api.get(`/usuarios/${trashMode.value ? 'removed' : ''}`)
        usuariosRows.value = r.data
      } catch (error) {
        notify.error('Erro ao buscar dados dos usuarios: ' + error.message)
      }
    }

    const usuariosFilter = async (filter) => {
      usuariosFilterForRows.value = filter
    }

    const usuariosRemoveButton = (props) => {
      usuariosMainObject.value = Object.assign({}, props.row)
      usuariosDialog.value.action = 'remove'
      usuariosDialog.value.title = 'Remover'
      usuariosDialog.value.hint = 'Remover registro de usuário'
      usuariosDialog.value.icon = 'delete_sweep'
      usuariosDialog.value.iconColor = 'negative'
      usuariosDialog.value.visible = true
    }

    const usuariosRestoreButton = (props) => {
      usuariosMainObject.value = Object.assign({}, props.row)
      usuariosDialog.value.action = 'restore'
      usuariosDialog.value.title = 'Restaurar'
      usuariosDialog.value.hint = 'Restaurar registro de usuário'
      usuariosDialog.value.icon = 'restore_from_trash'
      usuariosDialog.value.iconColor = 'positive'
      usuariosDialog.value.visible = true
    }

    const usuariosSearchData = async (searchParamsObject) => {
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
        if (value) queryString += `usuarios.${key}=${encodeURIComponent(value)}&`
      })
      // Remove o último '&' se existir
      if (queryString.endsWith('&')) queryString = queryString.slice(0, -1)
      // Roda a requisição
      try {
        const url = `/usuarios/filter${trashMode.value ? 'Removed' : ''}?` + queryString
        const response = await api.get(url)
        usuariosRows.value = response.data
      } catch (error) {
        notify.error('Erro ao pesquisar dados: ' + error.message)
      }
    }

    const usuariosViewButton = (props) => {
      usuariosMainObject.value = Object.assign({}, props.row)
      usuariosDialog.value.action = 'view'
      usuariosDialog.value.title = 'Visualizar'
      usuariosDialog.value.hint = 'Visualizar registro de usuário'
      usuariosDialog.value.icon = 'visibility'
      usuariosDialog.value.iconColor = 'primary'
      usuariosDialog.value.visible = true
    }

    return {
      printMode,
      searchMode,
      trashMode,
      usuariosColumns,
      usuariosCreateButton,
      usuariosDestroyButton,
      usuariosDialog,
      usuariosEditButton,
      usuariosEnableDisableButton,
      usuariosFetch,
      usuariosFilter,
      usuariosFilterForRows,
      usuariosMainObject,
      usuariosRemoveButton,
      usuariosRestoreButton,
      usuariosRows,
      usuariosSearchData,
      usuariosViewButton,
      print,
    }
  },
})
</script>
