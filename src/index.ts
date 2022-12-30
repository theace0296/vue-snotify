import Snotify from './components/Snotify.vue';

import { SnotifyService } from './SnotifyService';
import { SnotifyDefaults } from './interfaces';
import { App } from 'vue';

export const SNotify = {
  install(app: App, options: SnotifyDefaults = {}) {
    const service = new SnotifyService();
    service.setDefaults(options);
    app.config.globalProperties.$snotify = service;
    // eslint-disable-next-line vue/component-definition-name-casing
    app.component('vue-snotify', Snotify);
  },
};

export default SNotify;
export * from './interfaces';
export * from './enums';
export * from './types';
export { SnotifyToast } from './components/toast.model';
