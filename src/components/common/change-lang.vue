<script setup>
import { languages } from '@/i18n';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';
import { inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const langs = ref(languages);

const changeLang = (value) => {
  locale.value = value;
  localStorage.setItem('lang', key);
};
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
        <li v-for="(lang, i) in langs" :key="i" :value="lang">
          <a
            :class="{ active: $i18n.locale == lang.value }"
            @click="changeLang(lang.value)"
          >
            <div
              class="badge badge-sm badge-outline !pl-1.5 !pr-1 pt-px !text-[.6rem] font-bold tracking-widest opacity-50"
            >
              {{ lang.value }}
            </div>
            <span>
              {{ lang.label }}
            </span></a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
