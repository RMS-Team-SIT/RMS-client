<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import Button from '@/components/common/button.vue';
import RoomListTable from '@/components/room/room.list.table.vue';

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

onMounted(async () => {
  await fetchData();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-if="residence.data" class="bg-gray-50">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          { name: `${residence.data.name}` },
          { name: 'ห้องพัก' },
        ]"
      />
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'dashboard', params: { residenceId } })"
      >
        กลับหน้าแดชบอร์ด
      </Button>
      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg">
          <div class="flex justify-between">
            <h1 class="text-2xl font-semibold text-dark-blue-200">ห้องพักในระบบ</h1>
            <router-link
              :to="{
                name: 'create-room',
                params: {
                  residenceId,
                },
              }"
            >
              <Button btnType="primary">เพิ่มข้อมูลห้องพัก</Button>
            </router-link>
          </div>
          <RoomListTable
            :rooms="residence.data.rooms"
            :defaultLightPriceRate="residence.data.defaultLightPriceRate"
            :defaultWaterPriceRate="residence.data.defaultWaterPriceRate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
