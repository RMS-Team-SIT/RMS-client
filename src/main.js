import { createApp } from 'vue';
import '@/assets/styles/fonts.css';
import '@/assets/styles/main.css';
import '@/assets/styles/tailwind.css';
import App from '@/app.vue';
import router from '@/routes.js';
import { createPinia } from 'pinia';
import Notifications from '@kyvg/vue3-notification';
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

const pinia = createPinia();
const app = createApp(App);

app.component('EasyDataTable', Vue3EasyDataTable);

app.use(Notifications);
app.use(pinia);
app.use(router);

app.mount('#app');
