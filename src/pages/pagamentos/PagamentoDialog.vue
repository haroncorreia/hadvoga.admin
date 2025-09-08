<template>
  <!-- Main object dialog -->
  <q-dialog v-model="componentDialog.visible" persistent>
    <q-card class="q-pa-md" style="min-width: 350px; max-width: 600px; width: 90vw;">

      <DialogHeader
       :dialogTitle="componentDialog.title"
       :dialogHint="componentDialog.hint"
       :dialogIcon="componentDialog.icon"
       :dialogIconColor="componentDialog.iconColor"
       />

      <q-card-section>
        <q-form ref="componentForm" @submit.prevent="actionConfirm">
          <keep-alive>
            <PagamentoFormFields
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
          v-if="componentDialog.action === 'create' || componentDialog.action === 'edit'"
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
import PagamentoFormFields from './PagamentoFormFields.vue';

export default defineComponent({
  name: 'PagamentoDialogComponent',

  components: {
    DialogHeader,
    PagamentoFormFields
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

  emits: ['pagamentoDialogReturnEvent'],

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

      let id = componentMainObject.value.pagamentos_id

      let sanitizedObject = {
        id_assinatura: componentMainObject.value.pagamentos_id_assinatura,
        valor: componentMainObject.value.pagamentos_valor,
        data_hora: componentMainObject.value.pagamentos_data_hora,
        metodo: componentMainObject.value.pagamentos_metodo,
        situacao: componentMainObject.value.pagamentos_situacao,
      }

      // Bloco de execução da ação
      try {
        let res = null
        switch (componentDialog.value.action) {
          case 'create':
            res = await api.post('/pagamentos', sanitizedObject)
            id = res.data.data[0];
            break
          case 'edit':
            res = await api.put(`/pagamentos/${id}`, sanitizedObject)
            break
          case 'remove':
            res = await api.patch(`/pagamentos/${id}/remove`)
            break
          case 'restore':
            res = await api.patch(`/pagamentos/${id}/restore`)
            break
          case 'destroy':
            res = await api.delete(`/pagamentos/${id}`)
            break
          default:
            notify.warning('Operação não definida em actionExecute().')
            return
        }
        if (res && res.status >= 200 && res.status < 300) {
          componentDialog.value.visible = false
          ResponseHandler(res)
          emit('pagamentoDialogReturnEvent', id)
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
