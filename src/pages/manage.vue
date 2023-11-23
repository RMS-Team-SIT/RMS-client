<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import { onBeforeMount, onMounted, reactive } from 'vue';
import { fetchMyResidents } from '@/services/residentServices';
import ResidentCard from '@/components/resident/resident.card.vue';
import { useUserStore } from '@/stores/user.store';

const userStore = useUserStore();
const residents = reactive({
  data: null,
});

const fetch = async () => {
  const response = await fetchMyResidents();
  if (response.status === 200) {
    let result = await response.json();
    residents.data = result;
  } else {
    alert('Failed to fetch residents');
  }
  console.log(residents.data);
};

onBeforeMount(async () => {
  await fetch();
});
</script>

<template>
  <div class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Manage', pathName: 'manage' },
          ]"
        />
        <router-link :to="{ name: 'create-resident' }">
          <Button>Create New Resident</Button>
        </router-link>
      </div>
      <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
        <h1 class="text-3xl font-semibold text-dark-blue-200">My Residents</h1>
        <p class="text-xs">This page will show all of your resident.</p>
        <ResidentCard
          v-for="(resident, index) in residents.data"
          :key="index"
          :resident="resident"
        />
        <p
          v-if="residents.data && residents.data.length == 0"
          class="text-center text-sm p-10"
        >
          No resident found. Please create new resident.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
