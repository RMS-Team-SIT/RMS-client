<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
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
const search = ref('');

const computedBills = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.bills.filter((i) => true).slice(start, end);
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
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.bills.length">
      ไม่พบบิลในระบบ กรุณาสร้างบิลใหม่
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        มีบิลในระบบทั้งหมด:
        {{ props.bills.length }} ข้อมูล
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหาบิล:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหาบิล"
          class="input input-xs input-bordered bg-white rounded"
          v-model="search"
        />
      </div>
      <table class="table table-xs">
        <!-- head -->
        <thead>
          <tr>
            <th>#</th>
            <th>วันที่สร้าง</th>
            <th>ใบมิเตอร์</th>
            <th>ดูข้อมูล</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(bill, index) in computedBills" :key="index">
            <!-- <td>
              {{ index + 1 }}
            </td>
            <td>
              <span> {{ dayjs(bill.record_date).format('DD/MM/YYYY') }}</span>
            </td>
            <td>
              <span>
                {{
                  dayjs(bill.meterRecord.record_date).format('DD/MM/YYYY')
                }}</span
              >
            </td> -->
           
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
  </div>
</template>

<style scoped></style>
