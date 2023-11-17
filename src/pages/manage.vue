<script setup>
import Breadcrumb from '@/components/breadcrumb.vue';
import ResidentCard from '@/components/resident.card.vue';
import Nabvar from '@/components/navbar.vue';
import Button from '@/components/button.vue';
import Footer from '@/components/footer.vue';
import { onMounted, reactive } from 'vue';

const residents = reactive({});
onMounted(async () => {
  document.title = 'Manage Resident';
  residents = await fetchResidents();
});
</script>

<template>
  <Nabvar :isLoggedIn="true" />
  <div class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb :pathList="['Home', 'Manage', 'Resident']" />
        <Button>Create New Resident</Button>
      </div>
      {{ residents }}
      <ResidentCard />
    </div>
  </div>

  <Footer />
</template>

<style scoped></style>
