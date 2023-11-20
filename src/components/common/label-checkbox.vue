<script setup>
import { ref } from 'vue';

const emits = defineEmits(['change']);

const props = defineProps({
  label: {
    type: String,
    default: 'Label',
  },
});

const checkboxChecked = ref(false);

const toggleCheckbox = () => {
  checkboxChecked.value = !checkboxChecked.value;
  emits('change', checkboxChecked.value);
};
</script>

<template>
  <div class="form-control">
    <div class="form-control">
  <label class="label cursor-pointer">
    <span class="label-text">Remember me</span> 
    <input type="checkbox" checked="checked" class="checkbox checkbox-primary" />
  </label>
</div>
    <label class="label cursor-pointer">
      <input
        type="checkbox"
        class="checkbox"
        v-model="checkboxChecked"
      />
      <span class="label-text">{{ label }}</span>
    </label>
  </div>
</template>

<style scoped></style>
