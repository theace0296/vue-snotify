import { mount, VueWrapper } from '@vue/test-utils';
import { ComponentPublicInstance } from 'vue';
import App from '../App.vue';
import VueSnotify from '..';

describe('Callbacks', () => {
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

  it('beforeShow toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('beforeShow', (toast) => {
        expect(toast.body).toEqual('test');
        res();
      });
    }));

  it('mounted toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('mounted', (toast) => {
        expect(toast.body).toEqual('test');
        res();
      });
    }));

  it('beforeHide toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify
        .prompt('test', {
          closeOnClick: true,
        })
        ?.on('beforeHide', (toast) => {
          expect(toast.body).toEqual('test');
          res();
        });

      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('click');
        node.dispatchEvent(event);
      });
    }));

  it('click toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('click', (toast) => {
        expect(toast.body).toEqual('test');
        res();
      });
      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('click');
        node.dispatchEvent(event);
      });
    }));

  it('destroyed toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify
        .prompt('test', {
          closeOnClick: true,
        })
        ?.on('destroyed', (toast) => {
          expect(toast.body).toEqual('test');
          res();
        });
      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('click');
        node.dispatchEvent(event);
      });
    }));

  it('hidden toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify
        .prompt('test', {
          closeOnClick: true,
        })
        ?.on('hidden', (toast) => {
          expect(toast.body).toEqual('test');
          res();
        });

      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('click');
        node.dispatchEvent(event);
      });
    }));

  it('input toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('input', (toast) => {
        expect(toast.value).toEqual('Hello');
        res();
      });
      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt input'
        );
        node.value = 'Hello';
        const event = new Event('input');
        node.dispatchEvent(event);
      });
    }));

  it('mouseenter toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('mouseenter', (toast) => {
        expect(toast.body).toEqual('test');
        res();
      });
      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('mouseenter');
        node.dispatchEvent(event);
      });
    }));

  it('mouseleave toast', () =>
    new Promise<void>((res) => {
      wrapper.vm.$snotify.prompt('test')?.on('mouseleave', (toast) => {
        expect(toast.body).toEqual('test');
        res();
      });
      wrapper.vm.$nextTick(() => {
        const node: HTMLInputElement = wrapper.vm.$el.querySelector(
          '.snotify.snotify-rightBottom .snotifyToast.snotify-prompt'
        );
        const event = new Event('mouseleave');
        node.dispatchEvent(event);
      });
    }));
});
