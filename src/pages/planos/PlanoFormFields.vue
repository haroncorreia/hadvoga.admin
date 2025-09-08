<template>
  <div class="flex flex-start row">
    <div class="col-3 q-mb-md">

      <q-input
        v-if="componentDialog.action !== 'create'"
        ref="refPlanosIdField"
        filled
        type="input"
        name="planos_id"
        label="ID do plano"
        placeholder="ID do plano"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'ID do plano' : ''"
        readonly
        v-model="componentMainObject.planos_id"
        bg-color="white"
      />
    </div>

    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refPlanosNomeField"
        filled
        label="Nome do plano"
        type="input"
        name="planos_nome"
        placeholder="Nome do plano"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o nome do plano' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.planos_nome"
        :rules="[Rules.required, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm">
      <q-input
        autofocus
        ref="refPlanosDescricaoField"
        filled
        label="Descrição do plano"
        type="input"
        name="planos_descricao"
        placeholder="Descrição do plano"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe uma descrição do plano' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.planos_descricao"
        :rules="[Rules.required, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm">
      <q-input
        ref="refPlanosPrecoField"
        filled
        label="Preço do plano"
        type="number"
        name="planos_preco"
        placeholder="Preço do plano"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o preço do plano' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.planos_preco"
        :rules="[Rules.required, Rules.number]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md">
      <q-select
        ref="refPlanosAtivoField"
        filled
        name="planos_ativo"
        label="Ativo"
        placeholder="Ativo"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Plano ativo?' : ''"
        v-model="componentMainObject.planos_ativo"
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
          { id: 0, nome: 'Não' },
          { id: 1, nome: 'Sim' },
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
