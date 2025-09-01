<template>
  <div class="flex flex-start row q-pt-md">

    <div class="col-8 q-mb-md q-pr-sm">
      <q-input
        autofocus
        ref="refSearchUsuariosNome"
        filled
        label="Nome do usuário"
        type="input"
        name="nome"
        placeholder="Nome do usuário"
        hint="Informe o nome ou parte do nome do usuário"
        v-model="componentSearchObject.nome"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-4 q-mb-md">
      <q-input
        autofocus
        ref="refSearchUsuariosApelido"
        filled
        label="Apelido do usuário"
        type="input"
        name="apelido"
        placeholder="Apelido do usuário"
        hint="Informe o apelido ou parte do apelido do usuário"
        v-model="componentSearchObject.apelido"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-4 q-mb-md q-pr-sm">
      <q-input
        ref="refSearchUsuariosCpf"
        filled
        label="CPF do usuário"
        type="input"
        name="cpf"
        placeholder="CPF do usuário"
        hint="Informe o CPF ou parte do CPF do usuário"
        v-model="componentSearchObject.cpf"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-4 q-mb-md q-pr-sm">
      <q-input
        ref="refSearchUsuariosCelular"
        filled
        label="Celular do usuário"
        type="input"
        name="celular"
        placeholder="Celular do usuário"
        hint="Informe o celular ou parte do celular do usuário"
        v-model="componentSearchObject.celular"
        @keyup="onEnterKeyUp"
      />
    </div>

    <div class="col-4 q-mb-md">
      <q-input
        ref="refSearchUsuariosEmail"
        filled
        label="E-mail do usuário"
        type="input"
        name="email"
        placeholder="E-mail do usuário"
        hint="Informe o e-mail ou parte do e-mail do usuário"
        v-model="componentSearchObject.email"
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
  name: 'UsuariosSearchFieldsComponent',

  emits: ['usuariosSearchDataEvent'],

  setup (props, { emit }) {

    const refSearchUsuariosNome = ref(null);

    const componentSearchObject = ref({
      nome: '',
      apelido: '',
      cpf: '',
      celular: '',
      email: '',
    })

    const clean = () => {
      componentSearchObject.value.nome = '';
      componentSearchObject.value.apelido = '';
      componentSearchObject.value.cpf = '';
      componentSearchObject.value.celular = '';
      componentSearchObject.value.email = '';
      refSearchUsuariosNome.value.focus();
    }

    const search = () => {
      emit('usuariosSearchDataEvent', componentSearchObject.value)
    }

    const onEnterKeyUp = (event) => {
      if (event.key === 'Enter') {
        search();
      }
    }

    return {
      clean,
      componentSearchObject,
      refSearchUsuariosNome,
      search,
      onEnterKeyUp
    }
  }
})
</script>
