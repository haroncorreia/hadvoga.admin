<template>
  <div class="flex flex-start row">
    <div class="col-3 q-mb-md" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        v-if="componentDialog.action !== 'create'"
        ref="refUsuariosIdField"
        filled
        type="input"
        name="usuarios_id"
        label="ID"
        placeholder="ID"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'ID' : ''"
        readonly
        v-model="componentMainObject.usuarios_id"
        bg-color="white"
      />
    </div>

    <div class="col-12 q-mb-md" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        autofocus
        ref="refUsuariosNomeField"
        filled
        label="Nome completo"
        type="input"
        name="usuarios_nome"
        placeholder="Nome completo"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o nome completo' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_nome"
        :rules="[Rules.required, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        autofocus
        ref="refUsuariosApelidoField"
        filled
        label="Apelido"
        type="input"
        name="usuarios_apelido"
        placeholder="Apelido"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe um apelido' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_apelido"
        :rules="[Rules.required, Rules.maxLength255]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        ref="refUsuariosDataNascimentoField"
        filled
        label="Data de nascimento"
        type="date"
        name="usuarios_data_nascimento"
        placeholder="Data de nascimento"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe a data de nascimento' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_data_nascimento"
        :rules="[Rules.required]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        maxlength="10"
      />
    </div>

    <div class="col-6 q-mb-md q-pr-sm" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        ref="refUsuariosCpfField"
        filled
        label="CPF"
        type="text"
        name="usuarios_cpf"
        placeholder="CPF"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o CPF' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_cpf"
        :rules="[Rules.required, Rules.number]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        mask="###.###.###-##"
        unmasked-value
      />
    </div>

    <div class="col-6 q-mb-md" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        ref="refUsuariosCelularField"
        filled
        label="Celular"
        type="text"
        name="usuarios_celular"
        placeholder="Celular"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o celular' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_celular"
        :rules="[Rules.required, Rules.number]"
        :bg-color="getBgFieldColor(componentDialog.action)"
        mask="(##) #####-####"
        unmasked-value
      />
    </div>

    <div class="col-12 q-mb-md" v-show="componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-input
        ref="refUsuariosEmailField"
        filled
        label="E-mail"
        type="text"
        name="usuarios_email"
        placeholder="E-mail"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Informe o e-mail' : ''"
        :readonly="
          componentDialog.action === 'view' ||
          componentDialog.action === 'remove' ||
          componentDialog.action === 'restore' ||
          componentDialog.action === 'destroy'
        "
        v-model="componentMainObject.usuarios_email"
        :rules="[Rules.required, Rules.email]"
        :bg-color="getBgFieldColor(componentDialog.action)"
      />
    </div>

    <div :class="componentDialog.action === 'updateRole' ? 'col-12 q-mb-md' : 'col-6 q-mb-md q-pr-sm'" v-if="componentDialog.action !== 'create' && componentDialog.action !== 'updatePassword'">
      <q-select
        ref="refUsuariosPerfilField"
        filled
        name="usuarios_perfil"
        label="Perfil de usuário"
        placeholder="Perfil de usuário"
        :hint="(componentDialog.action === 'updateRole') ? 'Selecione o perfil de usuário' : ''"
        v-model="componentMainObject.usuarios_perfil"
        class="q-mb-sm"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        use-input
        hide-selected
        fill-input
        :readonly="componentDialog.action === 'updateRole' ? false : true"
        :options="usuariosPerfisOptions"
        @filter="usuariosPerfisFilter"
        :rules="[Rules.required]"
        :bg-color="componentDialog.action === 'updateRole' ? 'grey-3' : 'white'"
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

    <div class="col-6 q-mb-md" v-if="componentDialog.action !== 'create' && componentDialog.action !== 'updatePassword' && componentDialog.action !== 'updateRole'">
      <q-select
        ref="refUsuariosHabilitadoField"
        filled
        name="usuarios_habilitado"
        label="Habilitado"
        placeholder="Habilitado"
        :hint="(componentDialog.action === 'create' || componentDialog.action === 'edit') ? 'Usuário habilitado?' : ''"
        v-model="componentMainObject.usuarios_habilitado"
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

    <PasswordSecurityStandard v-if="componentDialog.action === 'create' || componentDialog.action === 'updatePassword'" :mainObjectProp="componentMainObject" />

  </div>
</template>

<script>
import { defineComponent, computed, onMounted, ref, onActivated } from 'vue'
import { filterSelect, getBgFieldColor } from 'src/imports/FunctionsHandler';
import { Rules } from 'src/imports/RulesHandler';
import PasswordSecurityStandard from 'src/components/PasswordSecurityStandard.vue';

export default defineComponent({
  name: 'UsuarioFormFieldsComponent',

  components: {
    PasswordSecurityStandard
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

    let usuariosPerfisOptions = ref(null);
    let usuariosPerfisOptionsFiltered = [];

    onMounted(() => {
      usuariosPerfisFetch();
    });

    onActivated(() => {
    })

    const usuariosPerfisFetch = async () => {
      usuariosPerfisOptionsFiltered = usuariosPerfisOptions.value = [
        { id: 'Owner', nome: 'Owner (SaaS proprietário)' },
        { id: 'Admin', nome: 'Admin (SaaS administrativo)' },
        { id: 'Subscriber', nome: 'Subscriber (assinante)' },
        { id: 'Operator', nome: 'Operator (operador)' },
      ];
    }

    const usuariosPerfisFilter = (val, update, abort) => {
      filterSelect(val, update, abort, usuariosPerfisOptions, usuariosPerfisOptionsFiltered);
    }

    return {
      getBgFieldColor,
      componentDialog,
      componentMainObject,
      usuariosPerfisOptions,
      usuariosPerfisFilter,
      Rules
    }
  }
})
</script>
