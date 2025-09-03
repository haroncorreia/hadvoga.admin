<template>
  <!-- Main object dialog -->
  <q-dialog v-model="componentDialog.visible" persistent>
    <q-card class="q-pa-md" :style="componentDialog.action === 'updateStatus' ? 'min-width: 500px' : 'min-width: 800px'">

      <DialogHeader
       :dialogTitle="componentDialog.title"
       :dialogHint="componentDialog.hint"
       :dialogIcon="componentDialog.icon"
       :dialogIconColor="componentDialog.iconColor"
       />

      <q-card-section>
        <q-form ref="componentForm" @submit.prevent="actionConfirm">
          <keep-alive>
            <AssinaturaFormFields
             :dialogProp="componentDialog"
             :mainObjectProp="componentMainObject"
             />
          </keep-alive>
        </q-form>
      </q-card-section>

      <q-card-actions class="justify-end">
        <q-btn
          flat
          label="Salvar"
          icon="save"
          color="positive"
          @click="actionConfirm()"
          v-if="componentDialog.action === 'create' || componentDialog.action === 'edit' || componentDialog.action === 'updatePassword' || componentDialog.action === 'updateStatus'"
          />

        <q-btn
          flat
          label="Excluir"
          icon="delete"
          color="negative"
          @click="actionConfirm()"
          v-if="componentDialog.action === 'remove'"
          />

        <q-btn
          flat
          label="Destruir"
          icon="delete_forever"
          color="negative"
          @click="actionConfirm()"
          v-if="componentDialog.action === 'destroy'"
          />

        <q-btn
          flat
          label="Restaurar"
          icon="restore_from_trash"
          color="positive"
          @click="actionConfirm()"
          v-if="componentDialog.action === 'restore'"
          />

        <q-btn
          flat
          label="Fechar"
          icon="close"
          color="primary"
          @click="componentDialog.visible = false"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar'
import { defineComponent, computed, onMounted, ref } from 'vue'
import { notify } from 'src/imports/NotifyHandler';
import { ResponseHandler } from 'src/imports/ResponseHandler';

import DialogHeader from '../../components/DialogHeader.vue';
import OperationDialog from '../../components/OperationDialog.vue';
import AssinaturaFormFields from './AssinaturaFormFields.vue';

export default defineComponent({
  name: 'AssinaturaDialogComponent',

  components: {
    DialogHeader,
    AssinaturaFormFields
  },

  props: {
    dialogProp: {
      type: Object,
      required: true
    },
    mainObjectProp: {
      type: Object,
      required: true
    },
  },

  emits: ['assinaturaDialogReturnEvent'],

  setup(props, { emit }) {

    const $q = useQuasar()

    // Necessário para manter o valor atualizado quando modificado no pai
    const componentDialog = computed(() => props.dialogProp);
    const componentMainObject = computed(() => props.mainObjectProp);
    const componentForm = ref(null)

    onMounted(() => {
      // console.log(componentMainObject.value);
    });

    const actionConfirm = async () => {
      switch (componentDialog.value.action) {
        case 'create':
        case 'edit':
        case 'updateStatus':
          if (!(await componentForm.value.validate())) {
            notify.error('Por favor, preencha os campos obrigatórios.')
            return
          }
          $q.dialog({ component: OperationDialog }).onOk(() => actionExecute())
          break
        case 'remove':
        case 'restore':
        case 'destroy':
          $q.dialog({ component: OperationDialog }).onOk(() => actionExecute())
          break
        default:
          notify.warning('Confirmação não definida em actionConfirm().')
          break
      }
    }

    const actionExecute = async () => {

      let id = componentMainObject.value.assinaturas_id

      let sanitizedObject = {
        id_usuario: componentMainObject.value.assinaturas_id_usuario,
        id_plano: componentMainObject.value.assinaturas_id_plano,
        data_inicio: componentMainObject.value.assinaturas_data_inicio,
        data_fim: componentMainObject.value.assinaturas_data_fim,
        situacao: componentMainObject.value.assinaturas_situacao,
      }

      // Bloco de execução da ação
      try {
        let res = null
        switch (componentDialog.value.action) {
          case 'create':
            res = await api.post('/assinaturas', sanitizedObject)
            id = res.data.data[0];
            break
          case 'edit':
            res = await api.put(`/assinaturas/${id}`, sanitizedObject)
            break
          case 'remove':
            res = await api.patch(`/assinaturas/${id}/remove`)
            break
          case 'restore':
            res = await api.patch(`/assinaturas/${id}/restore`)
            break
          case 'destroy':
            res = await api.delete(`/assinaturas/${id}`)
            break
          case 'updateStatus':
            res = await api.patch(`/assinaturas/${id}/update-status`, {
              situacao: componentMainObject.value.assinaturas_situacao === 'Ativa' ? 'Inativa' : 'Ativa',
              observacoes: componentMainObject.value.assinaturas_justificativa
            })
            break
          default:
            notify.warning('Operação não definida em actionExecute().')
            return
        }
        if (res && res.status >= 200 && res.status < 300) {
          componentDialog.value.visible = false
          ResponseHandler(res)
          emit('assinaturaDialogReturnEvent', id)
        } else {
          notify.error('A operação foi concluída, mas o retorno foi inesperado: ' + res.statusText)
        }
      } catch (error) {
        ResponseHandler(error.response)
      }
    }

    return {
      componentForm,
      componentDialog,
      componentMainObject,
      actionConfirm
    }
  }
})
</script>
