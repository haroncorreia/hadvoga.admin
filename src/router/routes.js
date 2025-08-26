const routes = [
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
  },
  {
    path: '/logout',
    component: () => import('pages/auth/LogoutPage.vue'),
  },
  {
    path: '/', component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', component: () => import('pages/IndexPage.vue') },
        { path: '/home', component: () => import('pages/IndexPage.vue') },
        { path: '/assinantes', component: () => import('pages/assinantes/AssinantesPage.vue') },
      ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
