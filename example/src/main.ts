// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './polyfill';
import { createApp } from 'vue';
import {App} from './App';
import Snotify from 'vue-snotify';

/* eslint-disable no-new */
const app = createApp({
  el: '#app',
  template: '<App/>',
  components: { App }
});

app.use(Snotify);
