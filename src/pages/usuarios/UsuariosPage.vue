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

        <TableHeaderActionButtons v-model:searchMode="searchMode" v-model:trashMode="trashMode" v-model:printMode="printMode" @createButtonEvent="usuariosCreate" />

        <TableHeaderPrintButtons v-model:printMode="printMode" :columns="usuariosColumns" :rows="usuariosRows" :prefixFileName="'USUARIOS'" />

        <TableHeaderFastFilter v-model:searchMode="searchMode" @filterDataEvent="usuariosFilter" />

        <TableHeaderSearchFields v-model:searchMode="searchMode">
          <!-- <ClientesSearchFields @usuariosSearchDataEvent="usuariosSearchData" /> -->
        </TableHeaderSearchFields>

      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name === 'actions'">
              <TableDropDownButton
                :buttons="[
                  {label: 'Visualizar', icon: 'visibility', color: 'primary', action: null, caption: 'Ver usuário' },
                  {label: 'Editar', icon: 'edit', color: 'positive', action: null, caption: 'Editar usuário', showOnTrashMode: false },
                  {label: 'Remover', icon: 'delete_sweep', color: 'negative', action: null, caption: 'Remover usuário', showOnTrashMode: false },
                  {label: 'Restaurar', icon: 'restore_from_trash', color: 'positive', action: null, caption: 'Restaurar usuário', showOnTrashMode: true },
                  {label: 'Destruir', icon: 'delete_forever', color: 'negative', action: null, caption: 'Excluir definitivamente', showOnTrashMode: true },
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

  </q-page>
</template>

<script>
// Quasar imports
import { api } from 'src/boot/axios'
import { defineComponent, onMounted, ref } from 'vue'

// JS imports
import { notify } from 'src/imports/NotifyHandler'

// Models imports
import { usuariosModel } from 'src/models/UsuariosModel.js'

// Importação de componentes
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue'
import PageHeader from 'src/components/PageHeader.vue'
import TableHeaderActionButtons from 'src/components/TableHeaderActionButtons.vue'
import TableDropDownButton from 'src/components/TableDropDownButton.vue'
import TableHeaderFastFilter from 'src/components/TableHeaderFastFilter.vue'
import TableHeaderPrintButtons from 'src/components/TableHeaderPrintButtons.vue'
import TableHeaderSearchFields from 'src/components/TableHeaderSearchFields.vue'

export default defineComponent({
  name: 'UsuariosPage',

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

    const usuariosFilterForRows = ref('')
    const usuariosRows = ref([])
    const usuariosColumns = ref(usuariosModel.getCommonColumns())

    // Hooks
    onMounted(() => {
      usuariosFetch()
    })

    const usuariosCreate = async (data) => {
      // Lógica para criar uma nova assinatura
      console.log(data)
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

    return {
      printMode,
      searchMode,
      trashMode,
      usuariosColumns,
      usuariosCreate,
      usuariosFilter,
      usuariosFilterForRows,
      usuariosRows,
      print,
    }
  },
})
</script>
