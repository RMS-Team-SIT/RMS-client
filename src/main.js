import { createApp } from 'vue';
import '@/assets/styles/fonts.css';
import '@/assets/styles/main.css';
import '@/assets/styles/tailwind.css';
import '@/assets/styles/bank-logo.css';
import App from '@/app.vue';
import router from '@/routes.js';
import { createPinia } from 'pinia';
import Notifications from '@kyvg/vue3-notification';
import VueSweetalert2 from 'vue-sweetalert2';
import '@sweetalert2/themes/material-ui/material-ui.min.css';
import { baseUrl, baseGetFileUrl } from './services/constants';
import i18n from './i18n';
import VueApexCharts from "vue3-apexcharts";

const pinia = createPinia();
const app = createApp(App);

app.use(Notifications);
app.use(VueSweetalert2);
app.use(VueApexCharts);
app.use(pinia);
app.use(router);
app.use(i18n);

app.mount('#app');
