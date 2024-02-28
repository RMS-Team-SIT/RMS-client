<script setup>
import Button from './button.vue';
import { BellIcon } from '@heroicons/vue/24/outline';
import Divider from './divider.vue';
import Badge from './badge.vue';
import dayjs from 'dayjs';

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <BellIcon class="w-6 h-6" />
        <span class="badge badge-sm indicator-item">{{
          notifications.length
        }}</span>
      </div>
    </div>
    <div
      tabindex="0"
      class="mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-100 shadow max-h-[500px] overflow-y-auto"
    >
      <div class="card-body">
        <span class="font-bold text-lg"
          >{{ notifications.length }} การแจ้งเตือน</span
        >
        <div v-for="(notification, index) in notifications" :key="index">
          <div
            class="border-2 border-neutral rounded hover:bg-slate-200 p-5 pt-0"
          >
            <Divider class="text-xs"
              >[{{
                dayjs(notification.created_at).format('DD-MM-YYYY HH:mm:ss')
              }}]</Divider
            >
            <div class="text-left font-bold">{{ notification.title }}</div>
            <div class="text-left">{{ notification.content }}</div>
            <!-- <div class="text-left">
              <Badge badgeType="neutral">The Residence</Badge>
              <Badge badgeType="primary">Room 101</Badge>
            </div> -->
          </div>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary btn-block">View All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
