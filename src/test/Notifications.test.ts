import { mount } from '@vue/test-utils';
import App from '../App.vue';
import VueSnotify, { SnotifyStyle, SnotifyType } from '..';

const testCases: { style: SnotifyType; name: string }[] = Object.values(
  SnotifyStyle
).map((style) => ({
  style,
  name: `${style.charAt(0).toUpperCase()}${style.slice(1)}`,
}));

describe.each(testCases)('$name', ({ style }) => {
  test('should render toast', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [VueSnotify],
      },
    });

    if (style !== 'async') {
      wrapper.vm.$snotify[style]('test');
    } else {
      wrapper.vm.$snotify[style]('test', () => new Promise(resolve => {
        setTimeout(() => resolve({
          title: 'Success!!!',
          body: 'We got an example success!',
          config: {
            closeOnClick: true
          }
        }), 2000);
      }));
    }
    wrapper.vm.$nextTick(() => {
      expect(
        wrapper.vm.$el.querySelector(
          `.snotify.snotify-rightBottom .snotifyToast.snotify-${style}`
        )
      ).toBeTruthy();
    });
  });
});
