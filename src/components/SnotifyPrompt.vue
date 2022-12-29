<template>
<span class="snotifyToast__input" :class="{'snotifyToast__input--filled': isPromptFocused}">
    <input @input="valueChanged"
           class="snotifyToast__input__field" type="text"
           :id="toast.id"
           @focus="isPromptFocused = true"
           @blur="isPromptFocused = !!toast.value.length"/>
    <label class="snotifyToast__input__label" :for="toast.id">
      <span class="snotifyToast__input__labelContent">{{truncate(toast.config.placeholder)}}</span>
    </label>
  </span>

</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: ['toast'],
    data() {
      return {
        isPromptFocused: false,
      }
    },
    methods: {
      valueChanged (e) {
        this.toast.value = e.target.value;
        this.toast.eventEmitter.$emit('input');
      },
      truncate (value: string, limit = 40, trail = '...') {
        return value.length > limit ? value.substring(0, limit) + trail : value
      }
    }
  })

</script>
