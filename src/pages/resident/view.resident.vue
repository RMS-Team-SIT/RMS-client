<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import ImagePreview from '@/components/common/image.preview.vue';
import RoomSection from '@/components/room/room.section.vue';
import RentalSection from '@/components/rental/rental.section.vue';
import Button from '@/components/common/button.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';

const router = useRouter();
const route = useRoute();
const residentId = route.params.residentId;
const { notify } = useNotification();
const isLoading = ref(true);

const resident = reactive({
  data: null,
});

const fetchData = async () => {
  const response = await ResidentServices.fetchResident(residentId);
  if (response.status === 200) {
    let result = await response.json();
    resident.data = result;
    // parse residentImage by adding base url
    resident.data.images = resident.data.images.map((imageName) => {
      return FileService.getFile(imageName);
    });
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch resident data',
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
  <div class="card w-full glass" v-if="resident.data">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'Resident' },
            { name: resident.data.name },
          ]"
        />
      </div>

      <div>
        <div class="p-4 card shadow-xs bg-white">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            {{ route.meta.title }}: {{ resident.data.name }}
          </h1>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-2 mt-2">
          <div class="bg-white p-4 shadow-md rounded">
            <div class="mb-4">
              <div class="flex justify-between items-center">
                <Divider>Resident Infomation</Divider>

                <PencilSquareIcon
                  id="edit-resident-link"
                  @click="
                    () =>
                      router.push({
                        name: 'update-resident',
                        params: { id: residentId },
                      })
                  "
                  class="text-dark-blue-200 w-5 h-5 flex justify-end"
                />
              </div>
              <p>
                <span class="font-bold">Resident Name</span> :
                {{ resident.data.name }}
              </p>
              <p>
                <span class="font-bold">Description</span> :
                {{ resident.data.description ?? 'No description' }}
              </p>
              <Divider>contact</Divider>
              <p v-for="(val, index) in resident.data.contact" :key="index">
                <span class="font-bold">{{ index }}</span> : {{ val || '-' }}
              </p>
              <Divider>Other Setting</Divider>
              <p>
                <span class="font-bold">Default Water Price Rate</span> :
                {{ resident.data.defaultWaterPriceRate }} Baht per unit
              </p>
              <p>
                <span class="font-bold">Default Light Price Rate</span> :
                {{ resident.data.defaultLightPriceRate }} Baht per unit
              </p>
            </div>
          </div>

          <div>
            <ImagePreview
              :imageUrls="resident.data.images"
              preview-from="url"
              class="min-h-full"
            />
          </div>
        </div>

        <div class="grid grid-cols-1">
          <RoomSection
            :rooms="resident.data.rooms"
            :defaultWaterPriceRate="resident.data.defaultWaterPriceRate"
            :defaultLightPriceRate="resident.data.defaultLightPriceRate"
          />
        </div>

        <div class="grid grid-cols-1">
          <RentalSection
            :residentId="residentId"
            :rentals="resident.data.rentals"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
