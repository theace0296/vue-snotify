import { createApp } from 'vue';
import App from './App.vue';
import SNotify from './index';

const app = createApp(App);
app.use(SNotify);
app.mount('#app');
