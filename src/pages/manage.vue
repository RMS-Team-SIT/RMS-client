<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import ResidentCard from '@/components/resident-form/resident.card.vue';
import Nabvar from '@/components/common/navbar.vue';
import Button from '@/components/common/button.vue';
import Footer from '@/components/common/footer.vue';
import { onMounted, reactive } from 'vue';
import { fetchResidents } from '@/services/residentServices';

const residents = reactive({
  data: null,
});

onMounted(async () => {
  residents.data = await fetchResidents();
  console.log(residents.data);
});
</script>

<template>
  <Nabvar :isLoggedIn="true" />
  <div class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb :pathList="['Home', 'Manage', 'Resident']" />
        <router-link :to="{ name: 'create-resident' }">
          <Button>Create New Resident</Button>
        </router-link>
      </div>
      <ResidentCard
        v-for="(resident, index) in residents.data"
        :key="index"
        :resident="resident"
      />
    </div>
  </div>

  <Footer />
</template>

<style scoped></style>
