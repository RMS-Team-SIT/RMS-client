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
import VueSweetalert2 from 'vue-sweetalert2';
// import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/themes/material-ui/meterial-ui.scss';

const pinia = createPinia();
const app = createApp(App);

app.component('EasyDataTable', Vue3EasyDataTable);

app.use(Notifications);
app.use(VueSweetalert2);
app.use(pinia);
app.use(router);

app.mount('#app');

console.log(import.meta.env.MODE);
console.log(import.meta.env.VITE_MODE);
