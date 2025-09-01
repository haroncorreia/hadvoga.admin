<template>
  <!-- Main object dialog -->
  <q-dialog v-model="componentDialog.visible" persistent>
    <q-card class="q-pa-md" style="min-width: 800px">

      <DialogHeader
       :dialogTitle="componentDialog.title"
       :dialogHint="componentDialog.hint"
       :dialogIcon="componentDialog.icon"
       :dialogIconColor="componentDialog.iconColor"
       />

      <q-card-section>
        <q-form ref="componentForm" @submit.prevent="actionConfirm">
          <keep-alive>
            <UsuarioFormFields
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
import UsuarioFormFields from './UsuarioFormFields.vue';

export default defineComponent({
  name: 'UsuarioDialogComponent',

  components: {
    DialogHeader,
    UsuarioFormFields
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

  emits: ['usuarioDialogReturnEvent'],

  setup(props, { emit }) {

    const $q = useQuasar()

    // Necessário para manter o valor atualizado quando modificado no pai
    const componentDialog = computed(() => props.dialogProp);
    const componentMainObject = computed(() => props.mainObjectProp);
    const componentIdCliente = computed(() => props.idClienteProp);
    const componentIdProcesso = computed(() => props.idProcessoProp);
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

      let id = componentMainObject.value.usuarios_id

      let sanitizedObject = {
        nome: componentMainObject.value.usuarios_nome,
        apelido: componentMainObject.value.usuarios_apelido,
        data_nascimento: componentMainObject.value.usuarios_data_nascimento,
        cpf: componentMainObject.value.usuarios_cpf,
        celular: componentMainObject.value.usuarios_celular,
        email: componentMainObject.value.usuarios_email,
      }

      // Bloco de execução da ação
      try {
        let res = null
        switch (componentDialog.value.action) {
          case 'create':
            sanitizedObject.senha = componentMainObject.value.usuarios_senha;
            sanitizedObject.confirmaSenha = componentMainObject.value.usuarios_confirmaSenha;
            res = await api.post('/usuarios', sanitizedObject)
            id = res.data.data[0];
            break
          case 'edit':
            res = await api.put(`/usuarios/${id}`, sanitizedObject)
            break
          case 'remove':
            res = await api.patch(`/usuarios/${id}/remove`)
            break
          case 'restore':
            res = await api.patch(`/usuarios/${id}/restore`)
            break
          case 'destroy':
            res = await api.delete(`/usuarios/${id}`)
            break
          default:
            notify.warning('Operação não definida em actionExecute().')
            break
        }
        if (res && res.status >= 200 && res.status < 300) {
          componentDialog.value.visible = false
          ResponseHandler(res)
          emit('usuarioDialogReturnEvent', id)
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
      componentIdCliente,
      componentIdProcesso,
      componentMainObject,
      actionConfirm
    }
  }
})
</script>
