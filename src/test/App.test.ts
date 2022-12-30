import { mount } from '@vue/test-utils';
import App from '../App.vue';
import VueSnotify from '..';

describe('App.vue', () => {
  test('mount component', () => {
    expect(App).toBeTruthy();
    const wrapper = mount(App, {
      global: {
        plugins: [VueSnotify]
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
