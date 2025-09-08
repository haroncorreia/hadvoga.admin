<template>
  <div class="flex flex-start row q-pt-md">

    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refSearchPlanosNome"
        filled
        label="Nome do plano"
        type="input"
        name="nome"
        placeholder="Nome do plano"
        hint="Informe o nome ou parte do nome do plano"
        v-model="componentSearchObject.nome"
        @keyup="onEnterKeyUp"
      />
    </div>
    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refSearchPlanosDescricao"
        filled
        label="Descrição do plano"
        type="input"
        name="descricao"
        placeholder="Descrição do plano"
        hint="Informe a descrição ou parte da descrição do plano"
        v-model="componentSearchObject.descricao"
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
  name: 'PlanosSearchFieldsComponent',

  emits: ['planosSearchDataEvent'],

  setup (props, { emit }) {

    const refSearchPlanosNome = ref(null);

    const componentSearchObject = ref({
      nome: '',
      descricao: '',
    })

    const clean = () => {
      componentSearchObject.value.nome = '';
      componentSearchObject.value.descricao = '';
      refSearchPlanosNome.value.focus();
    }

    const search = () => {
      emit('planosSearchDataEvent', componentSearchObject.value)
    }

    const onEnterKeyUp = (event) => {
      if (event.key === 'Enter') {
        search();
      }
    }

    return {
      clean,
      componentSearchObject,
      refSearchPlanosNome,
      search,
      onEnterKeyUp
    }
  }
})
</script>
