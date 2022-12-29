<template>
  <div class="snotifyToast animated" :class="[
  'snotify-' + toast.config?.type,
  state.animation,
  toast.valid === undefined
    ? ''
    : toast.valid
      ? 'snotifyToast--valid'
      : 'snotifyToast--invalid',
]" :style="{
      '-webkit-animation-duration': toast.config?.animation?.time + 'ms',
      'animation-duration': toast.config?.animation?.time + 'ms',
      '-webkit-transition': toast.config?.animation?.time + 'ms',
      transition: toast.config?.animation?.time + 'ms',
    }" @click="onClick" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave" @animationend="onExitTransitionEnd">
    <div class="snotifyToast__progressBar" v-if="toast.config?.showProgressBar && toast.config?.timeout && toast.config.timeout > 0">
      <span class="snotifyToast__progressBar__percentage" :style="{ width: state.progress * 100 + '%' }"></span>
    </div>
    <div class="snotifyToast__inner" v-if="!toast.config?.html"
      :class="{ snotifyToast__noIcon: toast.config?.icon }">
      <div class="snotifyToast__title" v-if="toast.title">
        {{ truncate(toast.title, toast.config?.titleMaxLength) }}
      </div>
      <div class="snotifyToast__body" v-if="toast.body">
        {{ truncate(toast.body, toast.config?.bodyMaxLength) }}
      </div>
      <snotify-prompt v-if="toast.config?.type === state.promptType" :toast="toast" />
      <div v-if="typeof toast.config?.icon === 'undefined'"
        :class="['snotify-icon', 'snotify-icon--' + toast.config?.type]"></div>
      <div v-else-if="toast.config?.icon">
        <img class="snotify-icon" :src="toast.config.icon" />
      </div>
    </div>
    <div class="snotifyToast__inner" v-html="toast.config?.html" v-else></div>
    <snotify-button v-if="toast.config?.buttons" :toast="toast" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SnotifyPrompt from "./SnotifyPrompt.vue";
import SnotifyButton from "./SnotifyButton.vue";
import { SnotifyStyle } from "../enums";
import { SnotifyType } from "../types";
import { SnotifyToast } from './toast.model';

export default defineComponent({
  props: ["toastData"],
  components: {
    SnotifyPrompt,
    SnotifyButton,
  },
  data (): {
    toast: SnotifyToast;
    animationFrame: number | null;
    state: {
      paused: boolean;
      progress: number;
      animation: string;
      isDestroying: boolean;
      promptType: SnotifyType;
    };
  } {
    return {
      toast: this.toastData,
      animationFrame: null,
      state: {
        paused: false,
        progress: 0,
        animation: "",
        isDestroying: false,
        promptType: SnotifyStyle.prompt,
      },
    };
  },
  methods: {
    /**
     * Initialize base toast config
     */
    initToast () {
      if (this.toast.config?.timeout && this.toast.config.timeout > 0) {
        this.startTimeout(0);
      }
    },
    onClick () {
      this.toast.eventEmitter.emit("click");
      if (this.toast.config?.closeOnClick) {
        this.$snotify.remove(this.toast.id);
      }
    },
    onMouseEnter () {
      this.toast.eventEmitter.emit("mouseenter");
      if (this.toast.config?.pauseOnHover) {
        this.state.paused = true;
      }
    },
    onMouseLeave () {
      if (this.toast.config?.pauseOnHover && this.toast.config?.timeout) {
        this.state.paused = false;
        this.startTimeout(this.toast.config.timeout * this.state.progress);
      }
      this.toast.eventEmitter.emit("mouseleave");
    },
    /**
     * Remove toast completely after animation
     */
    onExitTransitionEnd () {
      if (this.state.isDestroying) {
        return;
      }
      this.initToast();
      this.toast.eventEmitter.emit("shown");
    },
    /**
     * Start progress bar
     */
    startTimeout (startTime = 0) {
      const start = performance.now();
      const calculate = () => {
        this.animationFrame = requestAnimationFrame((timestamp) => {
          const runtime = timestamp + startTime - start;
          const progress = Math.min(runtime / (this.toast.config?.timeout ?? 1), 1);
          if (this.state.paused) {
            cancelAnimationFrame(this.animationFrame ?? -1);
          } else if (this.toast.config?.timeout && runtime < this.toast.config.timeout) {
            this.state.progress = progress;
            calculate();
          } else {
            this.state.progress = 1;
            cancelAnimationFrame(this.animationFrame ?? -1);
            this.$snotify.emitter.emit("remove", this.toast.id);
          }
        });
      };
      calculate();
    },
    /**
     * Trigger beforeDestroy lifecycle. Removes toast
     */
    onRemove () {
      this.state.isDestroying = true;
      this.$emit("stateChanged", "beforeHide");
      this.toast.eventEmitter.emit("beforeHide");
      this.state.animation = this.toast.config?.animation?.exit ?? '';
      setTimeout(() => {
        this.$emit("stateChanged", "hidden");
        this.state.animation = "snotifyToast--out";
        this.toast.eventEmitter.emit("hidden");
        setTimeout(
          () => this.$snotify.remove(this.toast.id, true),
          (this.toast.config?.animation?.time ?? 2) / 2
        );
      }, (this.toast.config?.animation?.time ?? 2) / 2);
    },
    truncate (value: string, limit = 40, trail = "...") {
      return value.length > limit ? value.substring(0, limit) + trail : value;
    },
  },

  created () {
    this.$snotify.emitter.on("toastChanged", (toast: any) => {
      if (this.toast.id === toast?.id) {
        this.initToast();
      }
    });
    this.$snotify.emitter.on("remove", (id) => {
      if (this.toast.id === id) {
        this.onRemove();
      }
    });
  },
  mounted () {
    this.$nextTick(() => {
      this.toast.eventEmitter.emit("mounted");
      this.state.animation = "snotifyToast--in";
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("stateChanged", "beforeShow");
          this.toast.eventEmitter.emit("beforeShow");
          this.state.animation = this.toast.config?.animation?.enter ?? '';
        }, (this.toast.config?.animation?.time ?? 5) / 5); // time to show toast push animation (snotifyToast--in)
      });
    });
  },
  destroyed () {
    cancelAnimationFrame(this.animationFrame ?? -1);
    this.toast.eventEmitter.emit("destroyed");
  },
});
</script>
