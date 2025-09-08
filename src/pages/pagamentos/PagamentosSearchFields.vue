<template>
  <div class="flex flex-start row q-pt-md">

    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refSearchPagamentosMetodo"
        filled
        label="Método do pagamento"
        type="input"
        name="metodo"
        placeholder="Método do pagamento"
        hint="Informe o nome ou parte do nome do pagamento"
        v-model="componentSearchObject.nome"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-12 q-mb-md">
      <q-input
        autofocus
        ref="refSearchPagamentosSituacao"
        filled
        label="Situação do pagamento"
        type="input"
        name="situacao"
        placeholder="Situação do pagamento"
        hint="Informe a situação ou parte da situação do pagamento"
        v-model="componentSearchObject.situacao"
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
  name: 'PagamentosSearchFieldsComponent',

  emits: ['pagamentosSearchDataEvent'],

  setup (props, { emit }) {

    const refSearchPagamentosMetodo = ref(null);

    const componentSearchObject = ref({
      metodo: '',
      situacao: '',
    })

    const clean = () => {
      componentSearchObject.value.metodo = '';
      componentSearchObject.value.situacao = '';
      refSearchPagamentosMetodo.value.focus();
    }

    const search = () => {
      emit('pagamentosSearchDataEvent', componentSearchObject.value)
    }

    const onEnterKeyUp = (event) => {
      if (event.key === 'Enter') {
        search();
      }
    }

    return {
      clean,
      componentSearchObject,
      refSearchPagamentosMetodo,
      search,
      onEnterKeyUp
    }
  }
})
</script>
