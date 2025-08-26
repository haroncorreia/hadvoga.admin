import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { Loading, QSpinnerHourglass, Cookies, Notify } from 'quasar'

// default options
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
let numberOfRequestPending = 0
let numberOfRefreshTokenCallPending = 0

const api = axios.create({
  baseURL: 'http://localhost:3005',
  withCredentials: true, // This is important for CORS and to work with cookies
})

export default boot(({ app, router }) => {

  // Declaring the interceptors
  // Interceptors for request and response
  api.interceptors.request.use(
    function (config) {
      numberOfRequestPending++
      // console.log("Auth api ajax pending: ", numberOfRequestPending);
      // Do something before request is sent
      Loading.show({ spinner: QSpinnerHourglass })
      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    },
  );

  api.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      numberOfRequestPending--
      // console.log("Auth api ajax pending: ", numberOfRequestPending);
      if (numberOfRequestPending === 0) {
        Loading.hide()
      }
      return response
    },
    async function (error) {

      numberOfRequestPending--

      if (numberOfRequestPending == 0) {
        Loading.hide()
      }

      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      // Tratamento para renovação de token
      if (error.response && error.response.status === 401) {

        // Obtém o refresh token do cookie
        const refreshToken = Cookies.get('refreshToken');

        if (!refreshToken) {

          // Removido notify porque nesse caso o usuário não possui token de acesso, então não faz sentido mostrar uma notificação.
          // Notify.create({
          //   type: 'negative',
          //   timeout: 1000,
          //   position: 'top-right',
          //   message: 'Token de acesso expirado.',
          //   caption: 'Redirecionando para página de login...',
          //   icon: 'check_circle',
          // });
          // console.log('Refresh token não encontrado, redirecionando para login...')
          // Redirecionar para a página de login
          // window.location.href = '/login';
          router.push('/login');
          return Promise.reject(error);

        } else {

          numberOfRefreshTokenCallPending++;

          // Se o refresh token existir, faz a requisição para renovar o access token
          if (numberOfRefreshTokenCallPending < 3) {

            await api.post('/auth/refresh-token');
            // Não precisa setar o cookies, pois o axios já faz isso automaticamente
            // console.log('Token renovado com sucesso.');
            Notify.create({
              type: 'positive',
              timeout: 1000,
              position: 'top-right',
              message: 'Token de acesso renovado com sucesso.',
              caption: 'Aguarde o carregamento da página...',
              icon: 'check_circle',
            });

            // Retorna a requisição original com o novo token
            return api(error.config);

          // Se o refresh token não existir, redireciona para a página de login
          } else {

            Notify.create({
              type: 'negative',
              timeout: 1000,
              position: 'top-right',
              message: 'Token de acesso expirado.',
              caption: 'Redirecionando para página de login...',
              icon: 'check_circle',
            });
            // console.log('Refresh token não encontrado, redirecionando para login...')
            // Redirecionar para a página de login
            // window.location.href = '/login';
            router.push('/login');
            return Promise.reject(error);

          }
        }
      }

      return Promise.reject(error)
    },
  );

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
