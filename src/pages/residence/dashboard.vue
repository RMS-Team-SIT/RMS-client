<script setup>
import CountUp from 'vue-countup-v3';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Loading from '@/components/common/loading.vue';
import PaidChart from '@/components/residence/charts/paid.chart.vue';
import AvailableChart from '@/components/residence/charts/available.chart.vue';
import IncomeChart from '@/components/residence/charts/income.chart.vue';
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
import ResidenceStat from '@/components/residence/residence.stat.vue';
import temp from '@/components/residence/charts/temp.vue';
import RoomChart from '@/components/residence/charts/room.chart.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});
const stats = reactive({
  paymentCount: 0,
  renterCount: 0,
  roomCount: 0,
  roomTypeCount: 0,
  avaiableRoomCount: 10,
  notavaiableRoomCount: 30,
  paidRoomCount: 25,
  unpaidRoomCount: 5,
  income: 0,
});

const fetchData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log(result);
    residence.data = result;

    // Calculate stats
    stats.renterCount = result.renters.length;
    stats.roomCount = result.rooms.filter((room) => room.isActive).length;
    stats.avaiableRoomCount = result.rooms.filter(
      (room) => !room.currentRenter && room.isActive
    ).length;
    stats.notavaiableRoomCount = result.rooms.filter(
      (room) => room.currentRenter && room.isActive
    ).length;
    stats.paymentCount = result.payments.filter(
      (payment) => payment.isActive
    ).length;
    stats.renterCount = result.renters.filter(
      (renter) => renter.isActive
    ).length;
    stats.roomTypeCount = result.roomTypes.length;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-if="residence.data" class="min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: `${residence.data.name}`,
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'แดชบอร์ด' },
        ]"
      />

      <section>
        <h1
          class="text-xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <ChartPieIcon class="h-8 w-8 inline-block" /> ข้อมูลภาพรวม :
          {{ residence.data.name }}
        </h1>

        <!-- Stats -->
        <!-- <ResidenceStat
          :residenceId="residenceId"
          :stats="{
            renterCount: stats.renterCount,
            roomCount: stats.roomCount,
            paymentCount: stats.paymentCount,
            // roomTypeCount: stats.roomTypeCount,
          }"
        /> -->

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          <div class="grid grid-cols-2 gap-2">
            <div
              class="p-5 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h3 class="text-lg font-semibold mb-2">จำนวนห้อง</h3>
              <p class="flex gap-2 items-end">
                <CountUp
                  :end-val="stats.avaiableRoomCount"
                  class="text-6xl text-green-400"
                />
                ห้อง
              </p>
            </div>

            <div
              class="p-5 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h3 class="text-lg font-semibold mb-2">จำนวนผู้เช่า</h3>
              <p class="flex gap-2 items-end">
                <CountUp
                  :end-val="stats.renterCount"
                  class="text-6xl text-green-400"
                />
                คน
              </p>
            </div>

            <div
              class="p-5 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h3 class="text-lg font-semibold mb-2">ช่องทางการชำระเงิน</h3>
              <p class="flex gap-2 items-end">
                <CountUp
                  :end-val="stats.paymentCount"
                  class="text-6xl text-green-400"
                />
                ช่องทาง
              </p>
            </div>

            <div
              class="p-5 bg-white rounded-lg shadow-md border border-gray-200"
            >
              <h3 class="text-base font-semibold mb-2">จำนวนผู้เช่า</h3>
              <p v-if="!stats.renterCount">ไม่มีผู้เช่า</p>
              <p v-else class="flex gap-2">
                <CountUp :end-val="stats.renterCount" />
                คน
              </p>
            </div>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-xl font-semibold mb-2 p-5">สถานะห้อง</h3>
            <p v-if="!stats.avaiableRoomCount" class="p-5">ไม่มีห้องในระบบ</p>
            <RoomChart
              v-else
              class="h-52 mx-auto"
              :available="stats.avaiableRoomCount"
              :not-available="stats.notavaiableRoomCount"
            />
            <p class="p-5 text-xs" v-if="stats.avaiableRoomCount">
              ห้องว่าง: {{ stats.avaiableRoomCount }} ห้อง, ไม่ว่าง:
              {{ stats.notavaiableRoomCount }} ห้อง
            </p>
          </div>
          <!-- รายได้ของหอพักในปีนี้ -->
          <div
            class="p-5 bg-white rounded-lg shadow-md border border-gray-200 col-span-2"
          >
            <h3 class="text-xl font-semibold mb-2 p-5">
              รายได้ของหอพักในปีนี้
            </h3>
            <temp />
          </div>
          
        </div>
      </section>

      <!-- Quick link Section -->
      <section class="mt-5">
        <!-- <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <LinkIcon class="h-8 w-8 inline-block" /> Quick Links
        </h1> -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        >
          <QuickLinkCard
            :router-path="{ name: 'room', params: { residenceId } }"
            title="ระบบจัดการห้องและประเภทห้อง"
            text="เข้าสู่ระบบจัดการห้องและประเภทห้องในหอพักนี้"
            :icon="HomeIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'renter', params: { residenceId } }"
            title="ระบบจัดการผู้เช่า"
            text="เข้าสู่ระบบจัดการผู้เช่าในหอพักนี้"
            :icon="UserIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'info', params: { residenceId } }"
            title="จัดการข้อมูลทั่วไป"
            text="เข้าสู่หน้าการจัดการข้อมูลทั่วไป"
            :icon="LinkIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'payment', params: { residenceId } }"
            title="จัดการข้อมูลช่องทางการชำระเงิน"
            text="เข้าสู่หน้าจัดการข้อมูลช่องทางการชำระเงิน"
            :icon="CreditCardIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'meter-record', params: { residenceId } }"
            title="ระบบบันทึกค่าน้ำ ค่าไฟ"
            text="เข้าสู่หน้าระบบบันทึกค่าน้ำ ค่าไฟ"
            :icon="AdjustmentsHorizontalIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'bill', params: { residenceId } }"
            title="จัดการบิล"
            text="เข้าสู่หน้าจัดการบิล"
            :icon="BanknotesIcon"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
