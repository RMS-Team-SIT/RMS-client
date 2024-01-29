<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import BankService from '@/services/BankService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const banks = ref([]);

const data = reactive({
  bankId: '',
  account_number: '',
  account_name: '',
  type: 'bank_transfer',
});

const submitData = async () => {
  // Create renter
  const response = await ResidenceServices.createPayment(residenceId, {
    ...data,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'Success',
      text: 'Payment created successfully',
      type: 'success',
    });
    router.push({ name: 'payment', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to create payment: ' + data?.message,
      type: 'error',
    });
  }
};

const fetchData = async () => {
  const response = await BankService.fetchBanks();
  if (response.status === 200) {
    let result = await response.json();
    console.log(result);
    banks.value = result;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch banks data',
      type: 'error',
    });
  }
};
onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div class="card w-full">
    <div class="card-body px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'Home', pathName: 'home' },
          { name: 'Manage', pathName: 'manage' },
          {
            name: 'Residence',
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'Create Payment' },
        ]"
      />
      <div class="flex gap-4 shadow-md rounded">
        <div class="bg-white p-10 space-y-4">
          <h1 class="text-xl font-semibold text-dark-blue-200">
            Payment Information
          </h1>
          <p class="text-xs">Please input payment information.</p>

          <div class="flex flex-col lg:flex-row gap-5">
            <div>
              <label class="label">
                <span class="text-base label-text"
                  >Bank <span class="text-red-500">*</span>
                </span>
              </label>
              <select
                class="select select-bordered w-full max-w-xs"
                v-model="data.bankId"
              >
                <option value="">Select Bank</option>
                <option v-for="bank in banks" :key="bank._id" :value="bank._id">
                  {{ bank.thai_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >Account Name <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Account Name"
                class="w-full input input-bordered bg-white"
                v-model="data.account_name"
              />
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >Account Number <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Account Number"
                class="w-full input input-bordered bg-white"
                v-model="data.account_number"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- button control -->
      <div class="flex justify-end gap-2 mt-10">
        <Button
          btn-type="secondary"
          @click="router.push({ name: 'payment', params: { residenceId } })"
          class="rounded-badge"
        >
          Discard
        </Button>

        <Button @click="submitData" class="rounded-badge" btnType="primary">
          Create Payment
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
