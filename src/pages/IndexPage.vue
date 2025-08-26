<template>
  <q-page class="flex flex-top column">

    <!-- Breadcrumbs -->
    <BreadcrumbsLinks
      :breadcrumbsArray="[
        { icon: 'home', label: 'Início', link: '/home' },
      ]"
      />

    <q-separator />

    <!-- Main card -->
    <q-card flat class="q-pa-md" style="width: 100%">

      <!-- Title -->
      <PageTitle
        :pageTitle="'Bem-vindo ao aplicativo Hadvoga!'"
        />

      <!-- Subtitle -->
      <PageSubtitle
        :pageSubtitle="'Acesso rápido'"
        :pageHint="'Selecione uma das opções abaixo:'"
        />

      <!-- Cards -->
      <q-card-section class="q-gutter-md q-mt-md">
        <div class="flex flex-start q-gutter-md row">
          <div v-for="card in cardsData" :key="card.link" class="col-3" style="max-width: 250px;">
            <PainelCard
              :iconName="card.iconName"
              :cardTitle="card.cardTitle"
              :cardDescription="card.cardDescription"
              :cardLink="card.cardLink"
              />
          </div>
        </div>
      </q-card-section>

    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import BreadcrumbsLinks from 'src/components/BreadcrumbsLinks.vue';
import PageTitle from 'components/PageTitle.vue';
import PageSubtitle from 'components/PageSubtitle.vue';
import PainelCard from 'components/PainelCard.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    BreadcrumbsLinks,
    PageTitle,
    PageSubtitle,
    PainelCard,
  },
  setup() {
    // Setup logic can be added here if needed
    const cardsData = [
      {
        cardTitle: 'Assinantes',
        cardDescription: 'Acesso rápido à gestão de assinantes.',
        cardLink: '/assinantes',
        iconName: 'groups',
      },
      {
        cardTitle: 'Pagamentos',
        cardDescription: 'Acesso rápido a lista de pagamentos.',
        cardLink: '/pagamentos',
        iconName: 'payments',
      },
      {
        iconName: 'category',
        cardTitle: 'Planos',
        cardDescription: 'Acesso rápido a sua lista de planos.',
        cardLink: '/planos',
      },
    ];
    // You can use the cardsData array to dynamically generate the cards if needed
    return {
      cardsData,
    };
  },
});
</script>


