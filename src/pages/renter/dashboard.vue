<script setup>
import Badge from '@/components/common/badge.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import RoomService from '@/services/RoomService';
import {
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const { notify } = useNotification();

onMounted(() => {
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div class="py-10 px-10 md:px-5 w-full min-h-screen">
    
  </div>
</template>

<style scoped></style>
