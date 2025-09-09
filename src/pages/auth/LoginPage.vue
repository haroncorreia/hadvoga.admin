<template>
  <q-layout>
    <q-page-container>
      <q-page class="row justify-center items-center bg-grey-2">

        <div style="width: 90%; max-width: 350px;">
          <q-form @submit="onSubmit" @reset="onReset" ref="loginForm" >
            <q-card square bordered class="q-pa-md">

              <q-card-section>
                <div class="text-h5">Hadvoga</div>
                <div class="text-subtitle1">Acesso</div>
              </q-card-section>

              <q-card-section>

                <q-input
                  clearable
                  filled
                  v-model="loginObject.email"
                  label="E-mail"
                  :rules="fieldEmailRules"
                  placeholder="Informe seu e-mail de acesso"
                  type="email"
                  class="q-mb-md"
                  />

                <q-input
                  clearable
                  filled
                  v-model="loginObject.senha"
                  :type="isPwdVisible ? 'password' : 'text'"
                  label="Senha"
                  :rules="fieldSenhaRules"
                  placeholder="Informe sua senha de acesso"
                  >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwdVisible = !isPwdVisible"
                      />
                  </template>
                </q-input>

              </q-card-section>

              <q-card-actions class="q-px-md">
                <q-btn unelevated color="primary" size="lg" class="full-width" label="Login" type="Submit" />
              </q-card-actions>

              <!--
              <q-card-section class="text-center">
                <p class="text-grey-6">Não possui acesso? <a href="/register">Solicite</a>.</p>
              </q-card-section>
            -->
            </q-card>
          </q-form>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { api } from 'boot/axios';
import { defineComponent, reactive, ref } from 'vue';
import { ResponseHandler } from 'src/imports/ResponseHandler';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useMainStore } from 'src/stores/mainStore';

export default defineComponent({

  name: 'LoginPage',

  setup () {

    // Quasar
    const $q = useQuasar();
    const router = useRouter();

    // Pínia
    const mainStore = useMainStore();

    const loginForm = ref(null);
    const isPwdVisible = ref(true);
    const loginObject = reactive({ email: null, senha: null });

    const fieldEmailRules = ref([
      val => !!val || '* Campo obrigatório.',
      val => (val.length <= 255) || 'O campo email deve conter no máximo 255 caracteres.',
      val => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val) || 'O campo email informado é inválido.'
    ]);

    const fieldSenhaRules = ref([
      val => !!val || '* Campo obrigatório.',
    ])

    async function onSubmit () {

      if (await loginForm.value.validate() !== true) {
        $q.notify({ type: 'negative',
          timeout: 2500,
          position: 'top-right',
          icon: 'error',
          message: 'Formulário não validado. Corrija os campos inválidos para prosseguir.',
        });
      } else {

        api
          .post('auth/signin', loginObject)
          .then((res) => {
            if ( res.status === 200 ) {

              // Pínia
              mainStore.setUser(res.data)

              // Rota
              router.push({ path: '/' });

            } else {
              $q.notify({
                type: 'warning',
                timeout: 2500,
                position: 'top-right',
                icon: 'warning',
                message: 'HTTP StatusCode diferent then 200, see console for further information.'
              });

              console.log('Necessário tratamento de acesso com status !== 200.');
              console.log(res.status);
              console.log(res.statusText);
            }
          }).catch((e) => ResponseHandler(e.response));

      }
    }

      // Reset
    function onReset () {
      loginObject.email = null;
      loginObject.senha = null;
    }

    return {
      isPwdVisible,
      loginForm,
      loginObject,
      fieldEmailRules,
      fieldSenhaRules,
      onSubmit,
      onReset,
    }

  }
})
</script>
