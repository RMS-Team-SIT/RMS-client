<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { onBeforeMount, onMounted, reactive, ref } from 'vue';
import ResidentCard from '@/components/resident/resident.card.vue';
import { useUserStore } from '@/stores/user.store';
import Loading from '@/components/common/loading.vue';
import { useNotification } from '@kyvg/vue3-notification';
import ResidentServices from '@/services/ResidentServices';

const userStore = useUserStore();
const isLoading = ref(true);
const residents = reactive({
  data: null,
});
const { notify } = useNotification();

const fetch = async () => {
  const response = await ResidentServices.fetchMyResidents();
  if (response.status === 200) {
    let result = await response.json();
    residents.data = result;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch residents',
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
  <div class="card w-full min-h-screen ">
    <div class="card-body px-10 md:px-40 ">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
            { name: 'My Resident' },
          ]"
        />
        <router-link :to="{ name: 'create-resident' }">
          <Button>Create New Resident</Button>
        </router-link>
      </div>
      <div class="relative bg-white p-10 space-y-4 shadow-md rounded ">
        <h1 class="text-3xl font-semibold text-dark-blue-200">My Residents</h1>
        <p class="text-xs">This page will show all of your resident.</p>
        <Loading v-if="isLoading" />
        <ResidentCard
          v-for="(resident, index) in residents.data"
          :key="index"
          :resident="resident"
        />
        <p
          v-if="residents.data && residents.data.length == 0"
          class="text-center text-sm p-10"
        >
          No resident found. Please
          <span class="underline text-dark-blue-200 cursor-pointer">
            <router-link :to="{ name: 'create-resident' }">
              create new resident
            </router-link>
          </span>
          .
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
