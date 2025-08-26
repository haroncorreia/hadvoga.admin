// import { api } from 'boot/axios';
import { defineStore, acceptHMRUpdate } from 'pinia';

export const useMainStore = defineStore('MainStore', {
  state: () => ({
    data: {
      user: {
        id: null,
        nome: null,
        email: null,
        apelido: null,
        // perfil: null,
        // token: null,
      },
    },
  }),

  getters: {
    getUserId() {
      return this.data.user.id;
    },
    getUserName() {
      return this.data.user.nome;
    },
    getUserEmail() {
      return this.data.user.email;
    },
    getUserApelido() {
      return this.data.user.apelido;
    }
  },

  actions: {
    setUser(user) {
      this.data.user.id = user.id
      this.data.user.nome = user.nome
      this.data.user.email = user.email
      this.data.user.apelido = user.apelido
      // this.data.usuario.perfil = user.perfil
      // this.data.usuario.token = user.token
      // api.defaults.headers.common['x-access-token'] = user.token
    },

    unsetUser() {
      this.data.user.id = null;
      this.data.user.nome = null;
      this.data.user.email = null;
      this.data.user.apelido = null;
      // this.data.usuario.perfil = null;
      // this.data.usuario.token = null;
      // delete api.defaults.headers.common['x-access-token'];
      // localStorage.removeItem('__hadvogaLocalStorage');
    },
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
