<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import ResidenceCard from '@/components/residence/residence.card.vue';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';


const isLoading = ref(true);
const residences = reactive({
  data: null,
});
const { notify } = useNotification();

const fetch = async () => {
  const response = await ResidenceServices.fetchMyResidences();
  if (response.status === 200) {
    let result = await response.json();
    residences.data = result;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
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
  <div class="card w-full min-h-screen">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'My Residences' },
          ]"
        />
        <router-link :to="{ name: 'create-residence' }">
          <Button>Create New Residence</Button>
        </router-link>
      </div>
      <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
        <h1 class="text-3xl font-semibold text-dark-blue-200">My Residences</h1>
        <p class="text-xs">This page will show all of your residence.</p>
        <Loading v-if="isLoading" />
        <ResidenceCard
          v-for="(residence, index) in residences.data"
          :key="index"
          :residence="residence"
        />
        <p
          v-if="residences.data && residences.data.length == 0"
          class="text-center text-sm p-10"
        >
          No residence found. Please
          <span class="underline text-dark-blue-200 cursor-pointer">
            <router-link :to="{ name: 'create-residence' }">
              create new residence
            </router-link>
          </span>
          .
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>