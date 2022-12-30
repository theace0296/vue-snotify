<template>
  <div class="snotifyToast__buttons">
    <button
      v-for="(button, index) in toast.config?.buttons"
      :key="index"
      type="button"
      :class="[
        { 'snotifyToast__buttons--bold': button.bold },
        button.className,
      ]"
      @click.prevent.stop="button.action ? button.action(toast) : remove()"
    >
      {{ button.text }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SnotifyToast } from './toast.model';

export default defineComponent({
  props: {
    toast: {
      type: SnotifyToast,
      required: true
    }
  },
  methods: {
    remove() {
      this.$snotify.remove(this.toast.id);
    },
  },
});
</script>

<style lang="scss"></style>
