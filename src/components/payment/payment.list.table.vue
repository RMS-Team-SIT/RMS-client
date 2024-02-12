<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import BankIcon from '@/components/common/bank-icon.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  payments: {
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
const router = useRouter();

const computedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.payments
    .filter((payment) => payment.isActive !== showDeactive.value)
    .slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.payments.length / perPage.value);
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
    <p class="text-base mt-5" v-if="!props.payments.length">
      ไม่มีช่องทางการชำระเงิน
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        ช่องทางการชำระเงินทั้งหมด:
        {{ props.payments?.filter((r) => r.isActive).length }} (เปิดใช้งาน),
        {{ props.payments?.filter((r) => !r.isActive).length }} (ปิดใช้งาน)
      </p>
      <div class="flex flex-row justify-end">
        <div class="form-control w-56">
          <label class="cursor-pointer label">
            <span class="label-text">แสดงข้อมูลที่โดนปิดใช้งาน</span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              v-model="showDeactive"
            />
          </label>
        </div>
      </div>
      <table class="table table-xs">
        <!-- head -->
        <!-- show number of renter -->
        <thead>
          <tr>
            <th>#</th>
            <th>โลโก</th>
            <!-- <th>ประเภทการชำระเงิน</th> -->
            <th>ชื่อธนาคาร</th>
            <th>ชื่อบัญชี</th>
            <th>หมายเลขบัญชี</th>
            <th>สถานะ</th>
            <th>สร้างเมื่อ</th>
            <th>อัปเดตเมื่อ</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(payment, index) in computedPayments" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              <BankIcon :bank="payment.bank.bank" size="xxxl" />
            </td>
            <!-- <td class="">
              <span> {{ payment.type }}</span>
            </td> -->
            <td>
              {{ payment.bank.thai_name }}
            </td>
            <td>{{ payment.account_name }}</td>
            <td>{{ payment.account_number }}</td>
            <td>
              <Badge v-if="payment.isActive" badgeType="success">เปิดใช้งาน</Badge>
              <Badge v-else badgeType="error">ปิดใช้งาน</Badge>
            </td>
            <td>
              {{ dayjs(payment.created_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <td>
              {{ dayjs(payment.updated_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <th>
              <Button
                btnType="ghost-pill"
                @click="
                  router.push({
                    name: 'update-payment',
                    params: {
                      residenceId,
                      paymentId: payment._id,
                    },
                  })
                "
              >
                แก้ไข
              </Button>
            </th>
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
