import { createApp } from 'vue';
import '@/assets/styles/fonts.css';
import '@/assets/styles/main.css';
import '@/assets/styles/tailwind.css';
import App from '@/app.vue';
import router from '@/routes.js';
import { createPinia } from 'pinia';
import Notifications from '@kyvg/vue3-notification'

const pinia = createPinia();
const app = createApp(App);

app.use(Notifications);
app.use(pinia);
app.use(router);
app.mount('#app');
