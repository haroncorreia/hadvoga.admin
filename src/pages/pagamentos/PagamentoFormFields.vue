<template>
  <div class="flex flex-start row">
    <div class="col-3 q-mb-md">

      <q-input
        v-if="componentDialog.action !== 'create'"
        ref="refPagamentosIdField"
        filled
        type="input"
        name="pagamentos_id"
        label="ID do pagamento"
        placeholder="ID do pagamento"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'ID do pagamento' : ''"
        readonly
        v-model="componentMainObject.pagamentos_id"
        bg-color="white"
      />
    </div>


    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refPagamentosMetodoField"
        filled
        label="Método do pagamento"
        type="input"
        name="pagamentos_metodo"
        placeholder="Método do pagamento"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o método do pagamento' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.pagamentos_metodo"
        :rules="[Rules.required, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm">
      <q-input
        ref="refPagamentosValorField"
        filled
        label="Valor do pagamento"
        type="text"
        name="pagamentos_valor"
        placeholder="Valor do pagamento"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o valor do pagamento' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        mask="#.##"
        fill-mask="0"
        reverse-fill-mask
        v-model="componentMainObject.pagamentos_valor"
        :rules="[Rules.required, Rules.floatWithR]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        >
        <template v-slot:prepend>
          R$
        </template>
      </q-input>
    </div>


    <div class="col-6 q-mb-md">
      <q-select
        ref="refPagamentosSituacaoField"
        filled
        name="pagamentos_situacao"
        label="Situação do pagamento"
        placeholder="Situação do pagamento"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Situação do pagamento' : ''"
        v-model="componentMainObject.pagamentos_situacao"
        class="q-mb-sm"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        readonly
        :options="[
          { id: 'Pendente', nome: 'Pendente' },
          { id: 'Confirmado', nome: 'Confirmado' },
          { id: 'Falhou', nome: 'Falhou' },
        ]"
        :rules="[]"
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

  </div>
</template>

<script>
import { defineComponent, computed, onMounted, onActivated } from 'vue'
import { getBgFieldColor } from 'src/imports/FunctionsHandler';
import { Rules } from 'src/imports/RulesHandler';

export default defineComponent({
  name: 'UsuarioFormFieldsComponent',

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

    onMounted(() => {
    });

    onActivated(() => {
      // console.log(componentMainObject.value)
    })

    return {
      getBgFieldColor,
      componentDialog,
      componentMainObject,
      Rules
    }
  }
})
</script>
