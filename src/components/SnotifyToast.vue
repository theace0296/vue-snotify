<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="snotifyToast animated"
    :class="[
      'snotify-' + toast.config?.type,
      state.animation,
      toast.valid === undefined
        ? ''
        : toast.valid
          ? 'snotifyToast--valid'
          : 'snotifyToast--invalid',
    ]"
    :style="{
      '-webkit-animation-duration': toast.config?.animation?.time + 'ms',
      'animation-duration': toast.config?.animation?.time + 'ms',
      '-webkit-transition': toast.config?.animation?.time + 'ms',
      transition: toast.config?.animation?.time + 'ms',
    }"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @animationend="onExitTransitionEnd"
  >
    <div
      v-if="
        toast.config?.showProgressBar &&
          toast.config?.timeout &&
          toast.config.timeout > 0
      "
      class="snotifyToast__progressBar"
    >
      <span
        class="snotifyToast__progressBar__percentage"
        :style="{ width: state.progress * 100 + '%' }"
      />
    </div>
    <div
      v-if="!toast.config?.html"
      class="snotifyToast__inner"
      :class="{ snotifyToast__noIcon: toast.config?.icon }"
    >
      <div
        v-if="toast.title"
        class="snotifyToast__title"
      >
        {{ truncate(toast.title, toast.config?.titleMaxLength) }}
      </div>
      <div
        v-if="toast.body"
        class="snotifyToast__body"
      >
        {{ truncate(toast.body, toast.config?.bodyMaxLength) }}
      </div>
      <snotify-prompt
        v-if="toast.config?.type === state.promptType"
        :toast="(toast as SnotifyToast)"
      />
      <div
        v-if="typeof toast.config?.icon === 'undefined'"
        :class="['snotify-icon', 'snotify-icon--' + toast.config?.type]"
      />
      <div v-else-if="toast.config?.icon">
        <img
          class="snotify-icon"
          :src="toast.config.icon"
        >
      </div>
    </div>
    <div
      v-else
      class="snotifyToast__inner"
      v-html="toast.config?.html"
    />
    <snotify-button
      v-if="toast.config?.buttons"
      :toast="(toast as SnotifyToast)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SnotifyPrompt from './SnotifyPrompt.vue';
import SnotifyButton from './SnotifyButton.vue';
import { SnotifyStyle } from '../enums';
import { SnotifyType } from '../types';
import { SnotifyToast } from './toast.model';

interface SnotifyToastData {
  toast: SnotifyToast
  animationFrame: number | null
  state: {
    paused: boolean
    progress: number
    animation: string
    isDestroying: boolean
    promptType: SnotifyType
  }
}

export default defineComponent({
  components: {
    SnotifyPrompt,
    SnotifyButton,
  },
  props: {
    toastData: {
      type: SnotifyToast,
      required: true
    }
  },
  emits: {
    'state-changed': null
  },
  data(): SnotifyToastData {
    return {
      toast: this.toastData,
      animationFrame: null,
      state: {
        paused: false,
        progress: 0,
        animation: '',
        isDestroying: false,
        promptType: SnotifyStyle.prompt,
      },
    };
  },
  created() {
    this.$snotify.emitter.on('toastChanged', this.onChanged);
    this.$snotify.emitter.on('remove', this.onRemove);
  },
  mounted() {
    this.$nextTick(() => {
      this.toast.eventEmitter.emit('mounted');
      this.state.animation = 'snotifyToast--in';
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('state-changed', 'beforeShow');
          this.toast.eventEmitter.emit('beforeShow');
          this.state.animation = this.toast.config?.animation?.enter ?? '';
        }, (this.toast.config?.animation?.time ?? 5) / 5); // time to show toast push animation (snotifyToast--in)
      });
    });
  },
  unmounted() {
    this.$snotify.emitter.off('toastChanged', this.onChanged);
    this.$snotify.emitter.off('remove', this.onRemove);
    cancelAnimationFrame(this.animationFrame ?? -1);
    this.toast.eventEmitter.emit('destroyed');
  },
  methods: {
    /**
     * Initialize base toast config
     */
    initToast() {
      if (this.toast.config?.timeout && this.toast.config.timeout > 0) {
        this.startTimeout();
      }
    },
    onClick() {
      this.toast.eventEmitter.emit('click');
      if (this.toast.config?.closeOnClick) {
        this.$snotify.remove(this.toast.id);
      }
    },
    onMouseEnter() {
      this.toast.eventEmitter.emit('mouseenter');
      if (this.toast.config?.pauseOnHover) {
        this.state.paused = true;
      }
    },
    onMouseLeave() {
      if (this.toast.config?.pauseOnHover && this.toast.config?.timeout) {
        this.state.paused = false;
        this.startTimeout(this.toast.config.timeout * this.state.progress);
      }
      this.toast.eventEmitter.emit('mouseleave');
    },
    /**
     * Remove toast completely after animation
     */
    onExitTransitionEnd() {
      if (this.state.isDestroying) {
        return;
      }
      this.initToast();
      this.toast.eventEmitter.emit('shown');
    },
    /**
     * Start progress bar
     */
    startTimeout(startTime = 0) {
      const start = performance.now();
      const calculate = () => {
        this.animationFrame = requestAnimationFrame((timestamp) => {
          const runtime = timestamp + startTime - start;
          const progress = Math.min(
            runtime / (this.toast.config?.timeout ?? 1),
            1
          );
          if (this.state.paused) {
            cancelAnimationFrame(this.animationFrame ?? -1);
          } else if (
            this.toast.config?.timeout &&
            runtime < this.toast.config.timeout
          ) {
            this.state.progress = progress;
            calculate();
          } else {
            this.state.progress = 1;
            cancelAnimationFrame(this.animationFrame ?? -1);
            this.$snotify.emitter.emit('remove', this.toast.id);
          }
        });
      };
      calculate();
    },
    /**
     * Trigger onChanged, updates toast
     */
    onChanged(toast: SnotifyToast) {
      if (this.toast.id === toast?.id) {
        this.$forceUpdate();
        this.initToast();
      }
    },
    /**
     * Trigger beforeDestroy lifecycle. Removes toast
     */
    onRemove(id: string | number) {
      if (this.toast.id !== id) {
        return;
      }
      this.state.isDestroying = true;
      this.$emit('state-changed', 'beforeHide');
      this.toast.eventEmitter.emit('beforeHide');
      this.state.animation = this.toast.config?.animation?.exit ?? '';
      setTimeout(() => {
        this.$emit('state-changed', 'hidden');
        this.state.animation = 'snotifyToast--out';
        this.toast.eventEmitter.emit('hidden');
        setTimeout(
          () => this.$snotify.remove(this.toast.id, true),
          (this.toast.config?.animation?.time ?? 2) / 2
        );
      }, (this.toast.config?.animation?.time ?? 2) / 2);
    },
    truncate(value: string, limit = 40, trail = '...') {
      return value.length > limit ? value.substring(0, limit) + trail : value;
    },
  },
});
</script>
