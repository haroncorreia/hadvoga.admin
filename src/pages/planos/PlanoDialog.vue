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
            <PlanoFormFields
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
import PlanoFormFields from './PlanoFormFields.vue';

export default defineComponent({
  name: 'PlanoDialogComponent',

  components: {
    DialogHeader,
    PlanoFormFields
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

  emits: ['planoDialogReturnEvent'],

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

      let id = componentMainObject.value.planos_id

      let sanitizedObject = {
        nome: componentMainObject.value.planos_nome,
        descricao: componentMainObject.value.planos_descricao,
        preco: componentMainObject.value.planos_preco,
        ativo: componentMainObject.value.planos_ativo,
      }

      // Bloco de execução da ação
      try {
        let res = null
        switch (componentDialog.value.action) {
          case 'create':
            res = await api.post('/planos', sanitizedObject)
            id = res.data.data[0];
            break
          case 'edit':
            res = await api.put(`/planos/${id}`, sanitizedObject)
            break
          case 'remove':
            res = await api.patch(`/planos/${id}/remove`)
            break
          case 'restore':
            res = await api.patch(`/planos/${id}/restore`)
            break
          case 'destroy':
            res = await api.delete(`/planos/${id}`)
            break
          default:
            notify.warning('Operação não definida em actionExecute().')
            return
        }
        if (res && res.status >= 200 && res.status < 300) {
          componentDialog.value.visible = false
          ResponseHandler(res)
          emit('planoDialogReturnEvent', id)
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
