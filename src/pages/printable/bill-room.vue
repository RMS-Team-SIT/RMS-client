<script setup>
import BillService from '@/services/BillService';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';
import { set } from '@vueuse/core';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const billId = route.params.billId;
const billRoomId = route.params.billRoomId;
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const isPaid = ref(false);

const { notify } = useNotification();

const fetchBillRoom = async () => {
  // fetch bill room data
  const response = await BillService.findBillRoom(
    residenceId,
    billId,
    billRoomId
  );
  if (response.status === 200) {
    let result = await response.json();
    console.log('bill room', result);
    billRoom.data = result;
    billRoom.isLoaded = true;
    isPaid.value = result.status === 'PAID';
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลบิลได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence', result);
    residence.data = result;
    residence.isLoaded = true;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

const residence = reactive({
  data: {
    name: 'Residence Name',
    address: 'Residence Address',
    phone: 'Residence Phone',
    billDueDate: 'Bill Due Date',
    taxId: 'Residence Tax ID',
  },
  isLoaded: false,
});

const billRoom = reactive({
  data: {
    id: 'Bill Room ID',
    room: {
      name: 'Room Name',
    },
  },
  isLoaded: false,
});
// auto show print dialog
onMounted(async () => {
  await fetchResidence();
  await fetchBillRoom();
  isLoading.value = false;
  // setTimeout(() => {
  //   window.print();
  // }, 500);
});

watch(
  isLoading.value,
  (value) => {
    console.log('isLoading', value);
    if (!value) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="p-5" v-if="!isLoading">
    <div class="border border-black p-5">
      <h1 class="text-xl text-center" v-if="isPaid">
        ใบเสร็จรับเงิน / Receipt
      </h1>
      <h1 class="text-xl text-center" v-else>ใบแจ้งหนี้ / Invoice</h1>
      <div class="flex justify-between">
        <div>
          <p>หอพัก: {{ residence.data.name }}</p>
          <p>ที่อยู่: {{ residence.data.address }}</p>
          <p>เบอร์โทร: {{ residence.data.contact.phone }}</p>
          <p>เลขประจำตัวผู้เสียภาษี: {{ residence.data.taxId }}</p>
        </div>
        <div>
          <p>วันที่: {{ new Date().toLocaleDateString() }}</p>
          <p>เลขที่ใบแจ้งหนี้: {{ billRoom.data.billNo }}</p>
          <p>ห้อง : {{ billRoom.data.room.name }}</p>
          <p v-if="!isPaid">ชำระก่อน: วันที่ {{ residence.data.billDueDate }}</p>
        </div>
      </div>
      <!-- Items -->
      <table class="w-full mt-5">
        <thead>
          <tr>
            <th class="border border-black text-left" colspan="6">
              ชื่อผู้เช่า: {{ billRoom.data.renter.firstname }}
              {{ billRoom.data.renter?.lastname }}
            </th>
          </tr>
          <tr>
            <th class="border border-black">รายการ</th>
            <th class="border border-black">จดครั้งก่อน</th>
            <th class="border border-black">จดครั้งนี้</th>
            <th class="border border-black">จำนวน(หน่วย)</th>
            <th class="border border-black">ราคาต่อหน่วย</th>
            <th class="border border-black">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody>
          <!-- ค่าน้ำ ไฟ -->
          <tr>
            <td class="border border-black">ค่าไฟ</td>
            <td class="border border-black">
              {{ billRoom.data.previousElectricMeter.toLocaleString() }}
            </td>
            <td class="border border-black">
              {{ billRoom.data.currentElectricMeter.toLocaleString() }}
            </td>
            <td class="border border-black">
              {{ billRoom.data.totalElectricMeterUsage.toLocaleString() }} หน่วย
            </td>
            <td class="border border-black">
              {{ billRoom.data.electricPriceRate.toLocaleString() }} บาท
            </td>
            <td class="border border-black font-bold">
              {{ billRoom.data.electricTotalPrice.toLocaleString() }} บาท
            </td>
          </tr>
          <tr>
            <td class="border border-black">ค่าน้ำ</td>
            <td class="border border-black">
              {{ billRoom.data.previousWaterMeter.toLocaleString() }}
            </td>
            <td class="border border-black">
              {{ billRoom.data.currentWaterMeter.toLocaleString() }}
            </td>
            <td class="border border-black">
              {{ billRoom.data.totalWaterMeterUsage.toLocaleString() }} หน่วย
            </td>
            <td class="border border-black">
              {{ billRoom.data.waterPriceRate.toLocaleString() }} บาท
            </td>
            <td class="border border-black font-bold">
              {{ billRoom.data.waterTotalPrice.toLocaleString() }} บาท
            </td>
          </tr>
          <!-- ค่าเช่าห้อง -->
          <tr>
            <td class="border border-black">ค่าเช่าห้อง</td>
            <td class="border border-black" colspan="4"></td>
            <td class="border border-black font-bold">
              {{ billRoom.data.roomRentalPrice }} บาท
            </td>
          </tr>
          <!-- ค่า อื่น ๆ -->
          <tr v-for="(fee, index) in billRoom.data.feesCache" :key="index">
            <td class="border border-black">{{ fee.feename }}</td>
            <td class="border border-black" colspan="4"></td>
            <td class="border border-black font-bold">
              {{ fee.feeprice.toLocaleString() }} บาท
            </td>
          </tr>
          <!-- รวม -->
          <tr>
            <td class="border border-black font-bold" colspan="5">รวม</td>
            <td class="border border-black font-bold">
              {{ billRoom.data.totalPrice.toLocaleString() }} บาท
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Where to pay -->
      <div v-if="!isPaid">
        <div
          class="mt-5"
          v-for="(payment, index) in residence.data.payments.filter(
            (e) => e.isActive
          )"
          :key="index"
        >
          <p>ชำระเงินที่: {{ payment.bank.thai_name }}</p>
          <p>เลขบัญชี: {{ payment.account_number }}</p>
          <p>ชื่อบัญชี: {{ payment.account_name }}</p>
        </div>

        <!-- Note for payment -->
        <div class="mt-5">
          <p>หมายเหตุ: {{ residence.data.paymentNotes || 'ไม่มีข้อความ' }}</p>
        </div>
      </div>
      <div v-else class="flex justify-end">
        <div>
          <p class="mt-5">ลงชื่อ ________________ (ผู้รับเงิน)</p>
          <p class="mt-5 text-center">
            ({{ residence.data.owner.firstname }}
            {{ residence.data.owner.lastname }} )
          </p>
        </div>
      </div>
    </div>
    <p></p>
  </div>
</template>

<style scoped>
@page {
  margin: 0;
}
</style>
