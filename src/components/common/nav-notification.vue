<script setup>
import Button from './button.vue';
import { BellIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline';
import Divider from './divider.vue';
import Badge from './badge.vue';
import dayjs from 'dayjs';
import { computed } from 'vue';

const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
});

const markAsRead = (notificationId) => {
  console.log('mark as read', notificationId);
  props.notifications.forEach((notification) => {
    if (notification._id === notificationId) {
      notification.isRead = true;
    }
  });
};

const showNotification = computed(() => {
  return props.notifications.filter((notification) => !notification.isRead);
});
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
      <div class="indicator">
        <BellIcon class="w-6 h-6" />
        <span class="badge badge-sm indicator-item">{{
          showNotification.length
        }}</span>
      </div>
    </div>
    <div
      tabindex="0"
      class="mt-3 z-[10] card card-compact dropdown-content w-96 bg-base-100 shadow max-h-[500px] overflow-y-auto"
    >
      <div class="card-body">
        <span class="font-bold text-lg"
          >{{ showNotification.length }} การแจ้งเตือน</span
        >
        <div v-if="!showNotification.length" class="text-center mt-5">
          <span class="text-neutral">ไม่มีการแจ้งเตือน</span>
        </div>
        <div v-for="(notification, index) in showNotification" :key="index">
          <div
            class="border-2 border-neutral rounded hover:bg-slate-200 p-5 pt-0"
          >
            <Divider class="text-xs"
              >[{{
                dayjs(notification.created_at).format('DD-MM-YYYY HH:mm:ss')
              }}]</Divider
            >
            <div class="grid grid-cols-12">
              <!-- content -->
              <div class="col-span-10">
                <div class="text-left font-bold">{{ notification.title }}</div>
                <div class="text-left">{{ notification.content }}</div>
              </div>
              <!-- mark as read -->
              <div
                class="col-span-2 flex items-center justify-center cursor-pointer"
              >
                <TrashIcon
                  class="w-4 h-4"
                  @click="markAsRead(notification._id)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="card-actions" v-if="showNotification.length">
          <button class="btn btn-primary btn-block btn-sm">ดูทั้งหมด</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
