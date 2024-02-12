<script setup>
import { UserIcon, HomeIcon, CreditCardIcon } from '@heroicons/vue/24/outline';
import CountUp from 'vue-countup-v3';
import { useRouter } from 'vue-router';

const router = useRouter();
const { stats } = defineProps({
  residenceId: {
    type: String,
    required: true,
  },
  stats: {
    type: Object,
    default: {
      renterCount: 0,
      roomCount: 0,
      paymentCount: 0,
    },
  },
});
</script>

<template>
  <div class="stats shadow stats-vertical lg:stats-horizontal w-full lg:w-auto">
    <div
      class="stat hover:cursor-pointer"
      @click="router.push({ name: 'renter', params: { residenceId } })"
    >
      <div class="stat-figure text-primary">
        <UserIcon class="h-8 w-8 inline-block" />
      </div>
      <div class="stat-title">ผู้เช่าทั้งหมด</div>
      <div class="stat-value text-primary">
        <CountUp :end-val="stats.renterCount" />
      </div>
      <div class="stat-desc">จำนวนผู้เช่าทั้งหมดในระบบ</div>
    </div>

    <div
      class="stat hover:cursor-pointer"
      @click="router.push({ name: 'room', params: { residenceId } })"
    >
      <div class="stat-figure text-secondary">
        <HomeIcon class="h-8 w-8 inline-block" />
      </div>
      <div class="stat-title">จำนวนห้อง</div>
      <div class="stat-value text-secondary">
        <CountUp :end-val="stats.roomCount" />
      </div>
      <div class="stat-desc">จำนวนห้องทั้งหมดในระบบ</div>
    </div>

    <div
      class="stat hover:cursor-pointer"
      @click="router.push({ name: 'payment', params: { residenceId } })"
    >
      <div class="stat-figure text-secondary">
        <CreditCardIcon class="h-8 w-8 inline-block" />
      </div>
      <div class="stat-title">ช่องทางการชำระเงิน</div>
      <div class="stat-value text-secondary">
        <CountUp :end-val="stats.paymentCount" />
      </div>
      <div class="stat-desc">ช่องทางการชำระเงินทั้งหมดในระบบ</div>
    </div>
  </div>
</template>

<style scoped></style>
