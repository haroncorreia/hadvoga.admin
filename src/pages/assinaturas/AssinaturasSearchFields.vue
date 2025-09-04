<template>
  <div class="flex flex-start row q-pt-md">

    <div class="col-6 q-mb-md q-pr-sm">
      <q-input
        autofocus
        ref="refSearchAssinaturasUsuarioNome"
        filled
        label="Nome do usuário"
        type="input"
        name="usuarios_nome"
        placeholder="Nome do usuário"
        hint="Informe o nome ou parte do nome do usuário"
        v-model="componentSearchObject.usuarios_fk_nome"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-6 q-mb-md">
      <q-input
        autofocus
        ref="refSearchAssinaturasPlanoNome"
        filled
        label="Nome do plano"
        type="input"
        name="planos_nome"
        placeholder="Nome do plano"
        hint="Informe o nome ou parte do nome do plano"
        v-model="componentSearchObject.planos_fk_nome"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-6 q-mb-md">
      <q-input
        autofocus
        ref="refSearchAssinaturasPlanoNome"
        filled
        label="Nome do plano"
        type="input"
        name="planos_nome"
        placeholder="Nome do plano"
        hint="Informe o nome ou parte do nome do plano"
        v-model="componentSearchObject.planos_fk_nome"
        @keyup="onEnterKeyUp"
      />
    </div>
        
  </div>
  <q-btn flat color="primary" icon="search" label="Pesquisar" @click="search" />
  <q-btn flat color="primary" icon="cleaning_services" label="Limpar" @click="clean" />
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AssinaturasSearchFieldsComponent',

  emits: ['assinaturasSearchDataEvent'],

  setup (props, { emit }) {

    const refSearchAssinaturasUsuarioNome = ref(null);

    const componentSearchObject = ref({
      usuarios_fk_nome: '',
      planos_fk_nome: ''
    })

    const clean = () => {
      componentSearchObject.value.usuarios_fk_nome = '';
      componentSearchObject.value.planos_fk_nome = '';
      refSearchAssinaturasUsuarioNome.value.focus();
    }

    const search = () => {
      emit('assinaturasSearchDataEvent', componentSearchObject.value)
    }

    const onEnterKeyUp = (event) => {
      if (event.key === 'Enter') {
        search();
      }
    }

    return {
      clean,
      componentSearchObject,
      refSearchAssinaturasUsuarioNome,
      search,
      onEnterKeyUp
    }
  }
})
</script>
