<script setup>
import { GlobeAltIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
const langs = ref(['en', 'th']);
</script>
<template>
  <div class="flex items-center justify-end text-right bg-base-100">
    <GlobeAltIcon class="h-5 w-5" />
    <select v-model="$i18n.locale" class="border-0 p-2 focus:border-0 bg-base-100">
      <option v-for="(lang, i) in langs" :key="i" :value="lang">
        {{ lang }}
      </option>
    </select>
  </div>
</template>
