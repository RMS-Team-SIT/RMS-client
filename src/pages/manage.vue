<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Nabvar from '@/components/common/navbar.vue';
import Button from '@/components/common/button.vue';
import Footer from '@/components/common/footer.vue';
import { onMounted, reactive } from 'vue';
import { fetchMyResidents } from '@/services/residentServices';
import ResidentCard from '@/components/resident/resident.card.vue';

const residents = reactive({
  data: null,
});

onMounted(async () => {
  const response = await fetchMyResidents();
  if (response.status === 200) {
    let result = await response.json();
    console.log(result);
    residents.data = result;
  } else {
    alert('Failed to fetch residents');
  }
  console.log(residents.data);
});
</script>

<template>
  <Nabvar :isLoggedIn="true" />
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
          class="text-center"
        >
          You don't have any resident yet. Please create one.
        </p>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped></style>
