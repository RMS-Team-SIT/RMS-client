<script setup>
import { onMounted } from 'vue';

const fetchBillRoom = async () => {
  // fetch bill room data
};
const fetchResidence = async () => {
  // fetch residence data
};
const residence = {
  data: {
    name: 'Residence Name',
    address: 'Residence Address',
    phone: 'Residence Phone',
    billDueDate: 'Bill Due Date',
    taxId: 'Residence Tax ID',
  },
};
const billRoom = {
  data: {
    id: 'Bill Room ID',
    room: {
      name: 'Room Name',
    },
  },
};
// auto show print dialog
onMounted(() => {
  window.print();
});
</script>

<template>
  <div class="p-5">
    <div class="border border-black p-5">
      <h1 class="text-xl text-center">ใบแจ้งหนี้ / Invoice</h1>
      <div class="flex justify-between">
        <div>
          <p>หอพัก: {{ residence.data.name }}</p>
          <p>ที่อยู่: {{ residence.data.address }}</p>
          <p>เบอร์โทร: {{ residence.data.phone }}</p>
          <p>เลขประจำตัวผู้เสียภาษี: {{ residence.data.taxId }}</p>
        </div>
        <div>
          <p>วันที่: {{ new Date().toLocaleDateString() }}</p>
          <p>เลขที่ใบแจ้งหนี้: {{ billRoom.data.id }}</p>
          <p>ห้อง : {{ billRoom.data.room.name }}</p>
          <p>ชำระก่อน: {{ residence.data.billDueDate }}</p>
        </div>
      </div>
      <!-- Items -->
      <table class="w-full mt-5">
        <thead>
          <tr>
            <th class="border border-black">รายการ</th>
            <th class="border border-black">จำนวน</th>
            <th class="border border-black">ราคา</th>
            <th class="border border-black">รวม</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-black">ค่าห้อง</td>
            <td class="border border-black">1</td>
            <td class="border border-black">1000</td>
            <td class="border border-black">1000</td>
          </tr>
          <tr>
            <td class="border border-black">ค่าน้ำ</td>
            <td class="border border-black">1</td>
            <td class="border border-black">100</td>
            <td class="border border-black">100</td>
          </tr>
          <tr>
            <td class="border border-black">ค่าไฟ</td>
            <td class="border border-black">1</td>
            <td class="border border-black">100</td>
            <td class="border border-black">100</td>
          </tr>
          <tr>
            <td class="border border-black">ค่าอินเทอร์เน็ต</td>
            <td class="border border-black">1</td>
            <td class="border border-black">100</td>
            <td class="border border-black">100</td>
          </tr>
          <tr>
            <td class="border border-black">ค่าส่วนกลาง</td>
            <td class="border border-black">1</td>
            <td class="border border-black">100</td>
            <td class="border border-black">100</td>
          </tr>
          <tr>
            <td class="border border-black">ค่าบริการอื่นๆ</td>
            <td class="border border-black">1</td>
            <td class="border border-black">100</td>
            <td class="border border-black">100</td>
          </tr>
          <tr>
            <td class="border border-black"></td>
            <td class="border border-black"></td>
            <td class="border border-black">รวม</td>
            <td class="border border-black">1000</td>
          </tr>
        </tbody>
      </table>

      <!-- Where to pay -->
      <div class="mt-5">
        <p>ชำระเงินที่: ธนาคารไทยพาณิชย์</p>
        <p>เลขบัญชี: 123-4-56789-0</p>
        <p>ชื่อบัญชี: บริษัท หอพัก จำกัด</p>
      </div>
    </div>
    <p></p>
  </div>
</template>

<style scoped>
@page { margin: 0; }

</style>
