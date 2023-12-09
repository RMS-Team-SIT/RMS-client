<script setup>
import { GlobeAltIcon } from '@heroicons/vue/24/outline';
import { ref } from 'vue';
const langs = ref([
  {
    name: 'English',
    key: 'en',
  },
  {
    name: 'ไทย',
    key: 'th',
  },
]);
</script>
<template>
  <div>
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button">
        <GlobeAltIcon class="h-5 w-5" />
      </div>
      <ul
        tabindex="0"
        class="dropdown-content z-[1] menu text-sm shadow bg-base-100 rounded-box w-52 gap-2"
      >
        <!-- {{
          $i18n.locale
        }} -->
        <li v-for="(lang, i) in langs" :key="i" :value="lang">
          <a
            :class="{ active: $i18n.locale == lang.key }"
            @click="$i18n.locale = lang.key"
          >
            <div
              class="badge badge-sm badge-outline !pl-1.5 !pr-1 pt-px !text-[.6rem] font-bold tracking-widest opacity-50"
            >
              {{ lang.key }}
            </div>
            <span>
              {{ lang.name }}
            </span></a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
