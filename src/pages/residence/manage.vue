<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue';
import ResidenceCard from '@/components/residence/residence.card.vue';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import { PlusIcon } from '@heroicons/vue/24/outline';

const isLoading = ref(true);
const residences = reactive({
  data: null,
});

const searchApproved = ref('');
const approvedResidences = computed(() => {
  if (residences.data) {
    return residences.data.filter(
      (residence) =>
        residence.isApproved &&
        residence.name
          .toLowerCase()
          .includes(searchApproved.value.toLowerCase())
    );
  }
  return [];
});

const searchPending = ref('');
const pendingResidences = computed(() => {
  if (residences.data) {
    return residences.data.filter(
      (residence) =>
        !residence.isApproved &&
        residence.name.toLowerCase().includes(searchPending.value.toLowerCase())
    );
  }
  return [];
});

const { notify } = useNotification();

const fetch = async () => {
  const response = await ResidenceServices.fetchMyResidences();
  if (response.status === 200) {
    let result = await response.json();
    console.log('residences', result);
    residences.data = result;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch residences',
      type: 'error',
    });
  }
  isLoading.value = false;
};

onBeforeMount(async () => {
  await fetch();
});
</script>

<template>
  <div class="min-h-screen">
    <div class="py-10 px-20 md:px-40 w-full">
      <!-- <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
        ]"
      /> -->
      <!-- <div  v-if="!approvedResidences.length && !pendingResidences.length">
        ดูเหมือนว่าคุณยังไม่มีหอพักใดๆ ในระบบของเรา

        <router-link :to="{ name: 'create-residence' }">
          <Button btn-type="primary"> 
            <PlusIcon class="w-5 h-5" />
            สร้างหอพัก</Button>
        </router-link>
        
      </div> -->
      <div class="relative bg-white space-y-5 rounded">
        <div class="flex flex-row justify-between">
          <h1 class="text-3xl font-semibold text-dark-blue-200">หอพักของคุณ</h1>

          <router-link :to="{ name: 'create-residence' }">
            <Button btn-type="primary"> 
              <PlusIcon class="w-5 h-5" />
              สร้างหอพัก</Button>
          </router-link>
        </div>
        <!-- <p class="text-xs">หน้านี้จะแสดงหอพักทั้งหมดของคุณ</p> -->
        <Loading v-if="isLoading" />

        <div role="tablist" class="tabs tabs-lifted tabs-md">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab w-full"
            aria-label="หอพักที่อนุมัติแล้ว"
            checked
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <h1 class="text-xl font-semibold text-dark-blue-200">
              หอพักที่อนุมัติแล้ว
            </h1>
            <div class="w-full flex align-middle items-center justify-end">
              <label class="label">
                <span class="label-text">ค้นหา:</span>
              </label>
              <input
                type="text"
                placeholder="ค้นหา"
                class="input input-xs input-bordered bg-white rounded"
                v-model="searchApproved"
              />
            </div>
            <ResidenceCard
              v-for="(residence, index) in approvedResidences"
              :key="index"
              :residence="residence"
            />
            <p
              v-if="!approvedResidences.length"
              class="text-center text-sm p-10"
            >
              ดูเหมือนว่าคุณไม่มีหอพักที่ได้รับการอนุมัติในขณะนี้
            </p>
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            class="tab"
            aria-label="หอพักที่รอการอนุมัติ"
          />
          <div
            role="tabpanel"
            class="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <h1 class="text-xl font-semibold text-dark-blue-200">
              หอพักที่รอการอนุมัติ
            </h1>
            <div class="w-full flex align-middle items-center justify-end">
              <label class="label">
                <span class="label-text">ค้นหา:</span>
              </label>
              <input
                type="text"
                placeholder="ค้นหา"
                class="input input-xs input-bordered bg-white rounded"
                v-model="searchPending"
              />
            </div>
            <ResidenceCard
              v-for="(residence, index) in pendingResidences"
              :key="index"
              :residence="residence"
            />
            <p
              v-if="!pendingResidences.length"
              class="text-center text-sm p-10"
            >
              ดูเหมือนว่าคุณไม่มีหอพักที่รอการอนุมัติในขณะนี้
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
