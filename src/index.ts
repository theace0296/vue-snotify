import Snotify from './components/Snotify.vue';

import {SnotifyDefaults} from './interfaces';
import {SnotifyService} from './SnotifyService';
import { App } from 'vue';

const PLUGIN = {
  install (app: App, options: SnotifyDefaults = {}) {
    const service =  new SnotifyService();
    service.setDefaults(options);
    app.config.globalProperties.$snotify = service;
    app.component('vue-snotify', Snotify);
  }
};

export default PLUGIN;
export {SnotifyDefaults} from './interfaces/SnotifyDefaults.interface';
export {SnotifyToastConfig} from './interfaces/SnotifyToastConfig.interface';
export {SnotifyStyles} from './interfaces/SnotifyStyles.interface';
export {SnotifyNotifications} from './interfaces/SnotifyNotifications.interface';
export {SnotifyGlobalConfig} from './interfaces/SnotifyGlobalConfig.interface';
export {SnotifyButton} from './interfaces/SnotifyButton.interface';
export {SnotifyAnimate} from './interfaces/SnotifyAnimate.interface';
export {Snotify} from './interfaces/Snotify.interface';
export {SnotifyPosition} from './enums/SnotifyPosition.enum';
export {SNOTIFY_STYLE as SnotifyStyle} from './enums/SnotifyStyle.enum';
export {SnotifyType} from './types/snotify.type';
export {SnotifyEvent} from './types/event.type';
export {SnotifyToast} from './components/toast.model';

