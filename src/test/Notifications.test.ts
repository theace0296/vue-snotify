import { mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance } from 'vue';
import App from '../App.vue';
import VueSnotify, { Snotify, SnotifyStyle, SnotifyType } from '..';

const testCases: { style: SnotifyType; name: string }[] = Object.values(
  SnotifyStyle
).map((style) => ({
  style,
  name: `${style.charAt(0).toUpperCase()}${style.slice(1)}`,
}));

describe.each(testCases)('$name', ({ style }) => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  const asyncCallback = () =>
    new Promise<Snotify>((resolve) => {
      setTimeout(
        () =>
          resolve({
            title: 'Success!!!',
            body: 'We got an example success!',
            config: {
              closeOnClick: true,
            },
          }),
        2000
      );
    });
  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        plugins: [VueSnotify],
      },
    });
  });

  afterEach(() => {
    wrapper.vm.$snotify.clear();
  });

  it('should render toast', () => {
    if (style !== 'async') {
      wrapper.vm.$snotify[style]('test');
    } else {
      wrapper.vm.$snotify[style]('test', asyncCallback);
    }
    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style}`
          )
        ).toBeTruthy();
        res();
      });
    });
  });

  it('should render [body]', () => {
    if (style !== 'async') {
      wrapper.vm.$snotify[style]('test');
    } else {
      wrapper.vm.$snotify[style]('test', asyncCallback);
    }

    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style} .snotifyToast__body`
          ).textContent
        ).toEqual('test');
        res();
      });
    });
  });

  it('should render [body, title]', () => {
    if (style !== 'async') {
      wrapper.vm.$snotify[style]('test', 'test2');
    } else {
      wrapper.vm.$snotify[style]('test', 'test2', asyncCallback);
    }

    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style} .snotifyToast__body`
          ).textContent
        ).toEqual('test');
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style} .snotifyToast__title`
          ).textContent
        ).toEqual('test2');
        res();
      });
    });
  });

  it('should render [body, title, config]', () => {
    if (style !== 'async') {
      wrapper.vm.$snotify[style]('test', 'test2', {
        titleMaxLength: 1,
      });
    } else {
      wrapper.vm.$snotify[style]('test', 'test2', asyncCallback, {
        titleMaxLength: 1,
      });
    }

    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style} .snotifyToast__body`
          ).textContent
        ).toEqual('test');
        expect(
          wrapper.vm.$el.querySelector(
            `.snotify.snotify-rightBottom .snotifyToast.snotify-${style} .snotifyToast__title`
          ).textContent
        ).toEqual('t...');
        res();
      });
    });
  });

  if (style === 'confirm') {
    it('should render one button', () => {
      wrapper.vm.$snotify.confirm('test', 'test2', {
        titleMaxLength: 1,
        buttons: [{ text: 'Yes' }],
      });
      return new Promise<void>((res) => {
        wrapper.vm.$nextTick(() => {
          expect(
            wrapper.vm.$el.querySelectorAll(
              '.snotify.snotify-rightBottom .snotifyToast.snotify-confirm .snotifyToast__buttons button'
            ).length
          ).toBe(1);
          res();
        });
      });
    });

    it('should render four buttons', () => {
      wrapper.vm.$snotify.confirm('test', 'test2', {
        titleMaxLength: 1,
        buttons: [
          { text: 'Yes' },
          { text: 'Yes' },
          { text: 'Yes' },
          { text: 'Yes' },
        ],
      });
      return new Promise<void>((res) => {
        wrapper.vm.$nextTick(() => {
          expect(
            wrapper.vm.$el.querySelectorAll(
              '.snotify.snotify-rightBottom .snotifyToast.snotify-confirm .snotifyToast__buttons button'
            ).length
          ).toBe(4);
          res();
        });
      });
    });
  } else if (style === 'prompt') {
    it('button click should init action', () =>
      new Promise<void>((res) => {
        const toast = wrapper.vm.$snotify.prompt('test', 'test2', {
          titleMaxLength: 1,
          buttons: [
            {
              text: 'Yes',
              action: (t) => {
                expect(toast?.id).toBe(t.id);
                res();
              },
            },
          ],
        });
        wrapper.vm.$nextTick(() => {
          (
            wrapper.vm.$el.querySelector(
              '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt .snotifyToast__buttons button'
            ) as HTMLElement
          ).click();
        });
      }));

    it('should accept text', () =>
      new Promise<void>((res) => {
        const toast = wrapper.vm.$snotify.prompt('test', 'test2');
        wrapper.vm.$nextTick(() => {
          const node: HTMLInputElement = wrapper.vm.$el.querySelector(
            '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt input'
          );
          node.value = 'Hello';
          const event = new Event('input');
          node.dispatchEvent(event);
          wrapper.vm.$nextTick(() => {
            expect(toast?.value).toEqual('Hello');
            res();
          });
        });
      }));
  }
});

describe('HTML', () => {
  let wrapper: VueWrapper<ComponentPublicInstance>;
  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        plugins: [VueSnotify],
      },
    });
  });

  afterEach(() => {
    wrapper.vm.$snotify.clear();
  });

  it('should render toast', () => {
    wrapper.vm.$snotify.html('test');
    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            '.snotify.snotify-rightBottom .snotifyToast.snotify-simple'
          )
        ).toBeTruthy();
        res();
      });
    });
  });

  it('should render [HTML]', () => {
    wrapper.vm.$snotify.html('<b>html</b><u>test</u>');
    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            '.snotify.snotify-rightBottom .snotifyToast.snotify-simple .snotifyToast__inner'
          ).innerHTML
        ).toEqual('<b>html</b><u>test</u>');
        res();
      });
    });
  });

  it('should render [HTML] with config', () => {
    wrapper.vm.$snotify.simple('test', 'test2', {
      html: '<b>html</b><u>test</u>',
    });
    return new Promise<void>((res) => {
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.vm.$el.querySelector(
            '.snotify.snotify-rightBottom .snotifyToast.snotify-simple .snotifyToast__inner'
          ).innerHTML
        ).toEqual('<b>html</b><u>test</u>');
        res();
      });
    });
  });
});
