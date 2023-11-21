<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive } from 'vue';
import { fetchResident } from '@/services/residentServices';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import ImagePreview from '@/components/common/image.preview.vue';
import RoomSection from '@/components/room/room.section.vue';
import RentalSection from '@/components/rental/rental.section.vue';

const router = useRouter();
const route = useRoute();

const residentId = route.params.id;

const resident = reactive({
  data: null,
});

onMounted(async () => {
  const response = await fetchResident(residentId);
  console.log(response);
  if (response.status === 200) {
    let result = await response.json();
    resident.data = result;
  } else {
    alert('Failed to fetch residents');
  }
  console.log(resident.data);
});
</script>

<template>
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
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            {{ route.meta.title }} | {{ resident.data.name }}
          </h1>
        </div>
        <!-- {{ resident.data }} -->
        <div class="grid grid-cols-2 gap-4 mb-2">
          <div>
            <div class="bg-white p-4 shadow rounded-lg">
              <div class="mb-4">
                <Divider>Resident Infomation</Divider>
                <!-- <p>
                  <span class="font-bold">Resident ID</span> :
                  {{ resident.data._id }}
                </p> -->
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
          </div>

          <div>
            <ImagePreview :images="resident.data.images" class="min-h-full" />
          </div>
        </div>
        <div class="grid grid-cols-1">
          <RoomSection :rooms="resident.data.rooms" />
        </div>
        <div class="grid grid-cols-1">
          <RentalSection :rentals="resident.data.rentals" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
