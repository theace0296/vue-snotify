import { mount } from '@vue/test-utils';
import App from '../App.vue';
import VueSnotify from '..';

describe('App.vue', () => {
  it('should mount component', () => {
    expect(App).toBeTruthy();
    const wrapper = mount(App, {
      global: {
        plugins: [VueSnotify],
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
  it('should set default options app', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [VueSnotify],
      },
    });
    wrapper.vm.$snotify.setDefaults({
      toast: {
        timeout: 5000,
      },
    });
    expect(wrapper.vm.$snotify.config.toast?.timeout).toBe(5000);
  });
});
