<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';

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
const perPage = ref(5);
const showDeactive = ref(false);
const { notify } = useNotification();

const computedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.payments
    .filter((renter) => (showDeactive.value ? true : renter.isActive))
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
    <p class="text-base mt-5" v-if="!props.payments.length">No renter</p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        Total: {{ props.payments?.filter((r) => r.isActive).length }} Payment
        method
      </p>
      <div class="flex flex-row justify-end">
        <div class="form-control w-56">
          <label class="cursor-pointer label">
            <span class="label-text">Show deactived renter</span>
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
            <th>Payment Type</th>
            <th>Bank Name</th>
            <th>Account Number</th>
            <th>Account Name</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(payment, index) in computedPayments" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td class="">
              <span> {{ payment.type }}</span>
            </td>
            <td>
              {{ payment.bank.bank }}
            </td>
            <td>{{ payment.account_number }}</td>
            <td>{{ payment.account_name }}</td>
            <td>
              <Badge v-if="payment.isActive" badgeType="success">Active</Badge>
              <Badge v-else badgeType="error">Deactive</Badge>
            </td>
            <td>
              {{ dayjs(payment.created_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <td>
              {{ dayjs(payment.updated_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <th>
                <Button btnType="ghost-pill">Edit</Button>
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