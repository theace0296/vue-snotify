import { ComponentCustomProperties as VueComponentCustomProperties } from 'vue';
import { SnotifyService } from './SnotifyService';
declare module '@vue/runtime-core' {
  // provide typings for `this.$snotify`
  interface ComponentCustomProperties extends VueComponentCustomProperties {
    $snotify: SnotifyService
  }
}

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
