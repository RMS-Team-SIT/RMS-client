<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';

const props = defineProps({
  bills: {
    type: Array,
    default: () => [],
  },
  residenceId: {
    type: String,
    default: '',
  },
});

const swal = inject('$swal');
const currentPage = ref(1);
const perPage = ref(10);
const showDeactive = ref(false);
const { notify } = useNotification();
const selectedDateMeterRecord = ref('');
const selectedStatus = ref('');

const currentBillRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  const currentBill = props.bills.filter((bill) =>
    selectedDateMeterRecord
      ? bill.meterRecord.record_date === selectedDateMeterRecord.value
      : true
  );
  const billRooms = currentBill[0]?.billRooms || [];
  const showed = billRooms
    .filter((billRoom) =>
      selectedStatus
        ? billRoom.isPaid === (selectedStatus.value === 'paid')
        : true
    )
    .slice(start, end);
  return showed;
});

const recordDates = computed(() => {
  return Array.from(
    new Set(props.bills.map((bill) => bill.meterRecord.record_date))
  );
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.bills.length / perPage.value);
});

const visiblePages = computed(() => {
  const range = 3;

  let start = Math.max(1, currentPage.value - range);
  let end = Math.min(totalPages.value, currentPage.value + range);

  if (currentPage.value <= range) {
    end = Math.min(range * 2 + 1, totalPages.value);
  }

  if (currentPage.value >= totalPages.value - range) {
    start = Math.max(totalPages.value - range * 2, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

watch(
  () => props.bills,
  (newVal) => {
    if (newVal.length) {
      selectedDateMeterRecord.value = recordDates.value[0];
    }
  }
);
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.bills.length">
      ไม่พบบิลในระบบ กรุณาสร้าง
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        มีบิลในระบบทั้งหมด:
        {{ props.bills.length }} ข้อมูล
      </p>

      <div class="w-full flex align-middle items-center justify-start mt-5">
        <label class="label">
          <span class="label-text">บิลของรอบมิเตอร์​:</span>
        </label>
        <select
          class="select select-bordered select-xs bg-white rounded"
          v-model="selectedDateMeterRecord"
        >
          <option value="" selected>กรุณาเลือก</option>
          <option
            v-for="(date, index) in recordDates"
            :key="index"
            :value="date"
          >
            {{ dayjs(date).format('DD/MM/YYYY') }}
          </option>
        </select>

        <label class="label ml-2">
          <span class="label-text">สถานะบิล:</span>
        </label>
        <select
          class="select select-bordered select-xs bg-white rounded"
          v-model="selectedStatus"
        >
          <option value="" selected>ทั้งหมด</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="unpaid">ยังไม่ชำระ</option>
        </select>
      </div>
      <div v-if="currentBillRooms.length">
        <table class="table table-xs">
          <!-- head -->
          <thead>
            <tr>
              <th>#</th>
              <th>ห้อง</th>
              <th>ค่าน้ำ</th>
              <th>ค่าไฟ</th>
              <th>ค่าเช่า</th>
              <th>ค่าอื่นๆ</th>
              <th>รวม</th>
              <th>สถานะ</th>
              <th>ดูข้อมูล</th>
              <th>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(billRoom, index) in currentBillRooms" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ billRoom.room.name }}
              </td>
              <td>{{ billRoom.waterTotalPrice }} บาท</td>
              <td>{{ billRoom.electricTotalPrice }} บาท</td>
              <td>{{ billRoom.roomRentalPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.totalFeesPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.totalPrice.toLocaleString() }} บาท</td>
              <td>
                <Badge :badgeType="billRoom.isPaid ? 'success' : 'error'">
                  {{ billRoom.isPaid ? 'ชำระแล้ว' : 'ยังไม่ชำระ' }}
                </Badge>
              </td>
              <td>
                <Button btnType="ghost-pill">ดูข้อมูล</Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="join">
          <button
            class="join-item btn btn-xs"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            &laquo;
          </button>

          <button
            class="join-item btn btn-xs"
            v-for="page in visiblePages"
            :key="page"
            :class="{ 'btn-active': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>

          <button
            class="join-item btn btn-xs"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            &raquo;
          </button>
        </div>
      </div>
      <p v-else class="mt-5">ไม่พบข้อมูล</p>
    </div>
  </div>
</template>

<style scoped></style>
