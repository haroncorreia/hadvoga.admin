<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Hadvoga APP</q-toolbar-title>

        <q-btn
          flat
          color="white"
          :label="mainStore.getUserApelido ? mainStore.getUserApelido.split(' ')[0] : 'Usuário'"
          icon="account_circle"
          >

          <q-menu>
            <div class="row q-pa-sm">
              <div class="column" style="width: 250px;">


                <q-card flat class="q-pa-md" style="width: 250px;">
                  <q-icon name="person" size="100px" class="q-mb-sm" />
                  <q-card-section>
                    <div class="text-h6">{{ mainStore.getUserApelido }}</div>
                    <!-- <div class="text-grey-7">{{ mainStore.getUserName }}</div> -->
                    <div class="text-grey-7">{{ mainStore.getUserEmail }}</div>
                  </q-card-section>
                  <q-card-actions>
                    <q-btn class="q-ma-sm full-width" label="Sair" color="primary" to="/logout" />
                    <!-- <q-btn flat label="Sair" to="/logout"/> -->
                  </q-card-actions>
                </q-card>
                <!--
                <q-item clickable tag="div" to="/perfil">
                  <q-item-section avatar>
                    <q-icon name="account_circle" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Perfil</q-item-label>
                    <q-item-label caption>Configurações do seu perfil</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable tag="div" to="/logout">
                  <q-item-section avatar>
                    <q-icon name="logout" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Sair</q-item-label>
                    <q-item-label caption>Sair da aplicação</q-item-label>
                  </q-item-section>
                </q-item>
                -->
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>
        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useMainStore } from "src/stores/mainStore";

const linksList = [
  {
    title: 'Início',
    caption: 'Página inicial.',
    icon: 'home',
    link: '/home',
  },
  {
    title: 'Assinantes',
    caption: 'Gestão de assinantes.',
    icon: 'groups',
    link: '/assinantes',
  },
  {
    title: 'Pagamentos',
    caption: 'Gestão de pagamentos.',
    icon: 'payments',
    link: '/pagamentos',
  },
  {
    title: 'Planos',
    caption: 'Gestão de planos.',
    icon: 'category',
    link: '/planos',
  },
  {
    title: 'Sair',
    caption: 'Logout do sistema.',
    icon: 'logout',
    link: '/logout',
  },
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false)
    const mainStore = useMainStore();

    onMounted(() => {})

    return {
      linksList,
      leftDrawerOpen,
      mainStore,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
    }
  },
})
</script>
