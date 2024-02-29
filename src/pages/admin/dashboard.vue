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
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline';
import QuickLinkCard from '@/components/common/quick-link-card.vue';
import Stats from '@/components/common/stats.vue';
import UserServices from '@/services/UserServices';
import ResidenceServices from '@/services/ResidenceServices';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const stats = ref({
  totalPendingUsers: {
    title: 'จำนวนผู้ใช้งานที่ขอการอนุมัติ',
    val: 20,
    desc: 'จำนวนผู้ใช้งานที่รอการอนุมัติ',
    icon: ClockIcon,
    route: 'admin-manage-residence',
  },
  totalUsers: {
    title: 'จำนวนผู้ใช้งานทั้งหมด',
    val: 10,
    desc: 'จำนวนผู้ใช้งานทั้งหมด',
    icon: UserIcon,
    route: 'admin-manage-user',
  },
  totalAdmins: {
    title: 'จำนวนผู้ดูแลระบบทั้งหมด',
    val: 10,
    desc: 'จำนวนผู้ดูแลระบบทั้งหมด',
    icon: UserIcon,
    route: 'admin-manage-user',
  },
});

const mapStatsToArray = (stats) => {
  return Object.values(stats).map((stat) => ({
    title: stat.title,
    val: stat.val,
    desc: stat.desc,
    icon: stat.icon,
    route: stat.route,
  }));
};

const fetchStats = async () => {
  const userStats = await UserServices.overAllStats();
  const residenceStats = await ResidenceServices.overAllStats();
};

const mapStats = (stats) => {
  return stats.map((stat) => {
    return {
      title: stat.title,
      val: stat.val,
      desc: stat.desc,
      icon: stat.icon,
      route: stat.route,
      param: stat.param,
    };
  });
};

onMounted(async () => {
  await fetchStats();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการระบบ', pathName: 'manage' },
        ]"
      />
      <Stats :stats="mapStatsToArray(stats)" class="mt-5" />

      <div
        class="relative bg-white p-10 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          ผู้ใช้งานที่รอการอนุมัติ
          <UserIcon class="h-8 w-8 text-primary" />
          <ClockIcon class="h-8 w-8 text-primary" />
        </h1>
        <p class="text-xs">ผู้ใช้งานที่รอการอนุมัติทั้งหมด</p>
      </div>

      <div
        class="relative bg-white p-10 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          หอพักที่รอการอนุมัติ
          <HomeIcon class="h-8 w-8 text-primary" />
          <ClockIcon class="h-8 w-8 text-primary" />
        </h1>
        <p class="text-xs">หอพักที่รอการอนุมัติทั้งหมด</p>
      </div>

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
