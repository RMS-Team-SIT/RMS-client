<script setup>
import CountUp from 'vue-countup-v3';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import Button from '@/components/common/button.vue';
import RoomListTable from '@/components/room/room.list.table.vue';
import {
  HomeIcon,
  HomeModernIcon,
  BoltIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/vue/24/outline';
import RoomTypeListTable from '@/components/room-type/room-type.list.table.vue';
import back from '@/components/common/back.vue';
import ResidenceSettingForm from '@/components/residence/form/residence.setting.form.vue';
import ResidenceFeeForm from '@/components/residence/form/residence.fee.form.vue';
import FeeList from '@/components/fee/fee.list.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});

const fetchData = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log(result);
    residence.data = result;
    // parse residenceImage by adding base url
    residence.data.images = residence.data.images.map((imageName) => {
      return FileService.getFile(imageName);
    });
    // sort room floor by ascending order then room name
    residence.data.rooms = residence.data.rooms.sort((a, b) => {
      if (a.floor === b.floor) {
        return a.name.localeCompare(b.name);
      }
      return a.floor - b.floor;
    });
  } else {
    notify({
      group: 'tr',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
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
          {
            name: 'จัดการราคาค่าใช้จ่ายในหอพัก',
            pathName: 'fee',
            params: { residenceId },
          },
        ]"
      />

      <back :to="{ name: 'dashboard', params: { residenceId } }" class="mt-5" />

      <div class="bg-white p-10 shadow rounded-lg border mt-2">
        <div class="flex justify-between">
          <h1
            class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
          >
            <BoltIcon class="w-8 h-8 text-dark-blue-200" />
            จัดการค่าสาธารณูปโภค
          </h1>
        </div>

        <div class="grid grid-cols-2 gap-2 col-span-2 mt-5 w-1/2">
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
        </div>
        <router-link
          :to="{
            name: 'update-utility',
            params: {
              residenceId,
            },
          }"
        >
          <Button class="mt-5">แก้ไขราคาค่าสาธารณูปโภค</Button>
        </router-link>
      </div>

      <div class="bg-white p-10 shadow rounded-lg border mt-5">
        <div class="flex justify-between mt-5">
          <h1
            class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
          >
            <AdjustmentsVerticalIcon class="w-8 h-8 text-dark-blue-200" />
            จัดการราคาค่าใช้จ่ายในหอพัก
          </h1>
          <div>
            <router-link
              :to="{
                name: 'create-fee',
                params: {
                  residenceId,
                },
              }"
            >
              <Button btnType="primary">เพิ่มค่าใช้จ่ายเพิ่มเติม</Button>
            </router-link>
          </div>
        </div>
        <FeeList
          class="mt-5"
          @update="fetchData"
          :fees="residence.data.fees"
          :residenceId="residenceId"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
