<script setup>
import { UserIcon, HomeIcon, CreditCardIcon } from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

const router = useRouter();
const { stats } = defineProps({
  stats: {
    type: Object,
    default: {},
  },
});
</script>

<template>
  <div
    class="stats shadow stats-vertical lg:stats-horizontal w-full lg:w-auto border border-gray-200"
  >
    <div
      class="stat hover:cursor-pointer"
      v-for="(stat, index) in stats"
      :key="index"
      @click="
        router.push({
          name: stat.route,
          params: { residenceId: stat.param.residenceId ?? null },
        })
      "
    >
      <div class="stat-figure text-primary">
        <component :is="stat.icon" class="h-8 w-8 inline-block" />
      </div>
      <div class="stat-title">{{ stat.title }}</div>
      <div class="stat-value text-primary">
        <CountUp :end-val="stat.val" />
      </div>
      <div class="stat-desc">{{ stat.desc }}</div>
    </div>
  </div>
</template>

<style scoped></style>
