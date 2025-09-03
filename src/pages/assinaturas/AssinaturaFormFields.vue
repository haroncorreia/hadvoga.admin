<template>
  <div class="flex flex-start row">

    <div class="col-3 q-mb-md" v-show="componentDialog.action !== 'updateStatus'">
      <q-input
        v-if="componentDialog.action !== 'create'"
        ref="refAssinaturasIdField"
        filled
        type="input"
        name="assinaturas_id"
        label="ID da assinatura"
        placeholder="ID"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'ID' : ''"
        readonly
        v-model="componentMainObject.assinaturas_id"
        bg-color="white"
      />
    </div>

    <div class="col-12 q-mb-md" v-show="componentDialog.action !== 'updateStatus'">
      <q-select
        ref="refAssinaturasIdUsuarioField"
        filled
        name="assinaturas_id_usuario"
        label="Usuário assinante"
        placeholder="Usuário assinante"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Selecione o usuário' : ''"
        v-model="componentMainObject.assinaturas_id_usuario"
        class="q-mb-sm"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        readonly
        :options="usuariosOptions"
        @filter="usuariosFilter"
        :rules="[Rules.required]"
        bg-color="white"
        >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Não há resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-12 q-mb-md" v-show="componentDialog.action !== 'updateStatus'">
      <q-select
        ref="refAssinaturasIdPlanoField"
        filled
        name="assinaturas_id_plano"
        label="Plano"
        placeholder="Plano"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Selecione o plano' : ''"
        v-model="componentMainObject.assinaturas_id_plano"
        class="q-mb-sm"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        :options="planosOptions"
        @filter="planosFilter"
        :rules="[Rules.required]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              Não há resultados
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-6 q-mb-md q-pr-sm" v-show="componentDialog.action !== 'updateStatus'">
      <q-input
        ref="refAssinaturasDataInicioField"
        filled
        label="Início da assinatura"
        type="datetime-local"
        name="assinaturas_data_inicio"
        placeholder="Data de início"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe a data de início' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.assinaturas_data_inicio"
        :rules="[Rules.required]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        maxlength="10"
      />
    </div>

    <div class="col-6 q-mb-md" v-show="componentDialog.action !== 'updateStatus'">
      <q-input
        ref="refAssinaturasDataFimField"
        filled
        label="Fim da assinatura"
        type="datetime-local"
        name="assinaturas_data_fim"
        placeholder="Data de fim"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe a data de fim' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.assinaturas_data_fim"
        :rules="[Rules.required]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        maxlength="10"
      />
    </div>

    <div class="col-12 q-mb-md" v-show="componentDialog.action === 'updateStatus'">
      <q-input
        autofocus
        ref="refAddinaturasObservacoesField"
        filled
        label="Justificativa"
        type="textarea"
        name="assinaturas_observacoes"
        placeholder="Justificativa"
        :hint="(componentDialog.action === 'updateStatus') ? `Informe uma justificativa para a ${componentMainObject.assinaturas_situacao === 'Ativa' ? 'inativação' : 'ativação'} desta assinatura` : ''"
        v-model="componentMainObject.assinaturas_justificativa"
        :rules="[Rules.required, Rules.minLength3, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, onActivated } from 'vue'
import { filterSelect, getBgFieldColor, loadSelect } from 'src/imports/FunctionsHandler';
import { Rules } from 'src/imports/RulesHandler';

export default defineComponent({
  name: 'AssinaturaFormFieldsComponent',

  components: {
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

  setup(props) {

    // Necessário para manter o valor atualizado quando modificado no pai
    const componentDialog = computed(() => props.dialogProp);
    const componentMainObject = computed(() => props.mainObjectProp);

    let usuariosOptions = ref(null);
    let usuariosOptionsFiltered = [];
    let planosOptions = ref(null);
    let planosOptionsFiltered = [];

    onMounted(() => {
      usuariosFetch();
      planosFetch();
    });

    onActivated(() => {
    })

    const planosFetch = async () => {
      planosOptionsFiltered = planosOptions.value = await loadSelect('/planos', 'planos_id', 'planos_nome', 'planos_preco');
    }

    const planosFilter = (val, update, abort) => {
      filterSelect(val, update, abort, planosOptions, planosOptionsFiltered);
    }

    const usuariosFetch = async () => {
      usuariosOptionsFiltered = usuariosOptions.value = await loadSelect('/usuarios', 'usuarios_id', 'usuarios_nome', 'usuarios_cpf');
    }

    const usuariosFilter = (val, update, abort) => {
      filterSelect(val, update, abort, usuariosOptions, usuariosOptionsFiltered);
    }

    return {
      getBgFieldColor,
      componentDialog,
      componentMainObject,
      usuariosOptions,
      usuariosFilter,
      planosOptions,
      planosFilter,
      Rules
    }
  }
})
</script>
