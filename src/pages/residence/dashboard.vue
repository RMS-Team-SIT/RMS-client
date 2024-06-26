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
import {
  BanknotesIcon,
  ChartPieIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  HomeModernIcon,
  ArrowRightCircleIcon,
} from '@heroicons/vue/24/outline';
import QuickLinkCard from '@/components/common/quick-link-card.vue';
import ResidenceStat from '@/components/residence/residence.stat.vue';
import IncomeChart from '@/components/residence/charts/income.vue';
import RoomChart from '@/components/residence/charts/room.chart.vue';
import divider from '@/components/common/divider.vue';
import BillStatusChart from '@/components/residence/charts/bill-status.chart.vue';

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
  avaiableRoomCount: 0,
  notavaiableRoomCount: 0,
  paidRoomCount: 0,
  unpaidRoomCount: 0,
  paidLastBillCount: 0,
  paidAllBillCount: 0,
  unpaidLastBillCount: 0,
  unpaidAllBillCount: 0,
  uploadedLastBillCount: 0,
  uploadedAllBillCount: 0,
  income: new Array(12).fill(0),
});

const fetchData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence.data', result);
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

    // Calculate income in currents year by filter bills
    const currentYear = new Date().getFullYear();
    const incomes = new Array(12).fill(0);
    result.bills
      .filter(
        (bill) =>
          new Date(bill.meterRecord.record_date).getFullYear() === currentYear
      )
      .forEach((bill) => {
        // calculate total bill amount
        const total = bill.billRooms
          .filter((billRoom) => billRoom.status === 'PAID')
          .reduce((acc, billRoom) => acc + billRoom.totalPrice, 0);

        // Fill into incomes by month
        let monthIndex = new Date(bill.meterRecord.record_date).getMonth();
        incomes[monthIndex] += total;
      });
    // Assign monthly totals to stats.income
    stats.income = incomes;

    // Calculate bill status
    if (result.bills.length > 0) {
      const lastIndex = result.bills.length - 1;
      stats.paidLastBillCount = result.bills[lastIndex].billRooms.filter(
        (bill) => bill.status === 'PAID'
      ).length;
      stats.unpaidLastBillCount = result.bills[lastIndex].billRooms.filter(
        (bill) => bill.status === 'UNPAID'
      ).length;
      stats.uploadedLastBillCount = result.bills[lastIndex].billRooms.filter(
        (bill) => bill.status === 'UPLOADED'
      ).length;

      stats.paidAllBillCount = result.bills.reduce((acc, bill) => {
        return (
          acc + bill.billRooms.filter((bill) => bill.status === 'PAID').length
        );
      }, 0);

      stats.unpaidAllBillCount = result.bills.reduce((acc, bill) => {
        return (
          acc + bill.billRooms.filter((bill) => bill.status === 'UNPAID').length
        );
      }, 0);

      stats.uploadedAllBillCount = result.bills.reduce((acc, bill) => {
        return (
          acc +
          bill.billRooms.filter((bill) => bill.status === 'UPLOADED').length
        );
      }, 0);
    }
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
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-else class="py-10 px-20 md:px-5 min-h-screen">
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

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        <!-- รายได้ของหอพักในปีนี้ -->
        <div
          class="p-10 bg-white rounded-lg shadow-md border border-gray-200 col-span-2"
        >
          <h3 class="text-xl font-semibold mb-2">รายได้ของหอพักในปีนี้</h3>
          <IncomeChart :data="stats.income" />
        </div>

        <!-- สถานะห้องว่าง -->
        <div
          class="p-6 bg-white rounded-lg shadow-md border border-gray-200 col-span-1"
        >
          <h3 class="text-xl font-semibold mb-2 p-5">สถานะห้องว่าง</h3>
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

        <!-- Other -->
        <div class="grid grid-cols-2 gap-2">
          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">จำนวนห้อง</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="stats.roomCount"
                class="text-6xl text-green-400"
              />
              ห้อง
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">จำนวนผู้เช่า</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="stats.renterCount"
                class="text-6xl text-green-400"
              />
              คน
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">จำนวนประเภทห้อง</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="residence.data.roomTypes.length"
                class="text-6xl text-green-400"
              />
              ประเภท
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">ช่องทางการชำระเงิน</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="stats.paymentCount"
                class="text-6xl text-green-400"
              />
              ช่องทาง
            </p>
          </div>
        </div>

        <div
          class="p-6 bg-white rounded-lg shadow-md border border-gray-200 col-span-1"
        >
          <h3 class="text-xl mb-2 p-5">
            สถานะการจ่ายบิลของรอบบิล<b>ล่าสุด</b>
          </h3>
          <p v-if="!residence.data.bills.length" class="p-5">ไม่พบบิลในระบบ</p>
          <div v-else>
            <BillStatusChart
              class="h-52 mx-auto"
              :paid="stats.paidLastBillCount"
              :uploaded="stats.uploadedLastBillCount"
              :unpaid="stats.unpaidLastBillCount"
            />
            <p class="p-5 text-xs">
              จ่ายแล้ว: {{ stats.paidLastBillCount }} บิล, ยังไม่จ่าย:
              {{ stats.unpaidLastBillCount }} บิล, อัพโหลดแล้ว:
              {{ stats.uploadedLastBillCount }} บิล
            </p>
          </div>
        </div>

        <div
          class="p-6 bg-white rounded-lg shadow-md border border-gray-200 col-span-1"
        >
          <h3 class="text-xl mb-2 p-5">
            สถานะการจ่ายบิลของรอบบิล<b>ทั้งหมด</b>
          </h3>
          <p v-if="!residence.data.bills.length" class="p-5">ไม่พบบิลในระบบ</p>
          <div v-else>
            <BillStatusChart
              class="h-52 mx-auto"
              :paid="stats.paidAllBillCount"
              :uploaded="stats.uploadedAllBillCount"
              :unpaid="stats.unpaidAllBillCount"
            />
            <p class="p-5 text-xs">
              จ่ายแล้ว: {{ stats.paidAllBillCount }} บิล, ยังไม่จ่าย:
              {{ stats.unpaidAllBillCount }} บิล, อัพโหลดแล้ว:
              {{ stats.uploadedAllBillCount }} บิล
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 col-span-2">
          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">ค่าน้ำต่อหน่วย</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="residence.data.defaultWaterPriceRate"
                class="text-6xl text-green-400"
              />
              บาท/หน่วย
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">ค่าไฟฟ้าต่อหน่วย</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="residence.data.defaultElectricPriceRate"
                class="text-6xl text-green-400"
              />
              บาท/หน่วย
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-lg font-semibold mb-2">สิ่งอำนวยความสะดวก</h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="residence.data.facilities.length"
                class="text-6xl text-green-400"
              />
              รายการ
            </p>
          </div>

          <div class="p-5 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 class="text-base font-semibold mb-2">
              รายการเก็บเงินเพิ่มเติม
            </h3>
            <p class="flex gap-2 items-end">
              <CountUp
                :end-val="residence.data.fees.length"
                class="text-6xl text-green-400"
              />
              รายการ
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
