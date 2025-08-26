<template>
  <router-view v-if="f5" />
  <div class="q-pa-sm" v-if="!f5">Verificando token de autenticação, aguarde...</div>
</template>

<script>
import { api } from 'boot/axios';
import { defineComponent, onBeforeMount, onMounted, ref } from 'vue';
import { ResponseHandler } from 'src/imports/ResponseHandler';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMainStore } from './stores/mainStore';

export default defineComponent({
  name: 'App',

  setup () {

    // Quasar imports
    const $q = useQuasar();
    const router = useRouter();
    const rota = window.location.href.split('/').pop();

    // Variaveis
    const f5 = ref(false);

    // Plinia
    const mainStore = useMainStore();

    // Lifecycle hooks
    onBeforeMount(async () => {
      if (rota != 'login' && rota != 'register') {
        // Consulta validade do token (passado pelo header atribuído no pínia)
        await api
          .post('/auth/validate')
          .then(async () => {

            $q.notify({
              color: 'positive',
              timeout: 1000,
              position: 'top-right',
              message: 'Token autenticado.',
              caption: 'Aguarde o carregamento da página...',
              icon: 'check_circle',
            });

            // Verifica se o usuário está registrado no store
            // Se não estiver, busca as informações do usuário usando o refresh token
            // e atualiza o store com os dados do usuário.
            if(!mainStore.getUserId) {
              const refreshToken = $q.cookies.get('refreshToken');
              if (refreshToken) {
                await api.post('/auth/refresh-token')
                  .then((response) => {
                    mainStore.setUser(response.data);
                  })
                  .catch((error) => {
                    ResponseHandler(error);
                    mainStore.unsetUser();
                    router.push('/login');
                  });
              } else {
                mainStore.unsetUser();
                router.push('/login');
              }
            }

          })
          .catch((error) => {
            ResponseHandler(error);
            mainStore.unsetUser();
            router.push('/login');
            return;
          });

      }
    });

    onMounted(() => {
      if (rota != 'login' && rota != 'register') {
        setTimeout(turnRouterViewVisible, 5000)
      } else {
        f5.value = true;
      }
    })

    function turnRouterViewVisible() {
      f5.value = true;
    }

    return {
      f5,
    }

  }
});
</script>
