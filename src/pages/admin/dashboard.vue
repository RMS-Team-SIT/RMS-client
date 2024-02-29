<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Loading from '@/components/common/loading.vue';
import {
  BanknotesIcon,
  ChartPieIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/vue/24/outline';
import QuickLinkCard from '@/components/common/quick-link-card.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const stats = reactive({
  userCount: 0,
});

const fetchData = async () => {};

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="min-h-screen bg-gray-50">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการระบบ', pathName: 'manage' },
        ]"
      />
      <!-- Quick link Section -->
      <section class="mt-5">
        <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <LinkIcon class="h-8 w-8 inline-block" /> Quick Links
        </h1>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        >
          <QuickLinkCard
            :router-path="{ name: 'room', params: { residenceId } }"
            title="จัดการผู้ใช้งานทั้งหมด"
            text="เข้าสู่หน้าจัดการผู้ใช้งานทั้งหมด"
            :icon="UserIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'info', params: { residenceId } }"
            title="จัดการหอพักทั้งหมด"
            text="เข้าสู่หน้าจัดการหอพักทั้งหมด"
            :icon="HomeIcon"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
