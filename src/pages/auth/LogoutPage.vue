<template>
  <div></div>
</template>

<script>
import { api } from 'src/boot/axios';
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from 'src/stores/mainStore';
import { notify } from 'src/imports/NotifyHandler';

export default defineComponent({
  name: 'LogoutPage',
  setup() {

    // Constants
    const router = useRouter()
    const mainStore = useMainStore()

    // Logout
    onMounted(async () => {
      await api.post('/auth/logout')
        .then((res) => {
          notify.success(res.data.message);
          mainStore.unsetUser();
        }).catch((err) => {
          notify.error('Erro ao realizar logout: ' + err);
        }).finally(() => {
          router.push('/login');
        });
    })

    return {}
  }
})
</script>
