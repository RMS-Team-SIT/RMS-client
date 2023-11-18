<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import ResidentCard from '@/components/resident-form/resident.card.vue';
import Nabvar from '@/components/common/navbar.vue';
import Button from '@/components/common/button.vue';
import Footer from '@/components/common/footer.vue';
import { onMounted, reactive } from 'vue';
import { fetchResident } from '@/services/residentServices';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';

const router = useRouter();
const route = useRoute();

const residentId = route.params.id;

const resident = reactive({
  data: null,
});

onMounted(async () => {
  resident.data = await fetchResident(residentId);
});
</script>

<template>
  <Nabvar :isLoggedIn="true" />
  <div class="card w-full glass" v-if="resident.data">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb :pathList="['Home', 'Dashboard', 'Resident', residentId]" />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <h1 class="text-2xl font-semibold">Dashboard</h1>
        </div>
        {{ resident.data  }}
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div class="bg-white p-4 shadow rounded-lg">
              <div class="mb-4">
                <Divider>Resident Infomation</Divider>
                <p><span class="font-bold">Resident ID</span> : {{ resident.data._id }}</p>
                <p><span class="font-bold">Resident Name</span> : {{ resident.data.name }}</p>
                <p><span class="font-bold">description</span> : {{ resident.data.description }}</p>
                <Divider>contact</Divider>
                <p v-for="(val, index) in resident.data.contact" :key="index">
                  <span class="font-bold">{{ index }}</span> : {{ val }}
                </p>
                <Divider>Other Setting</Divider>
                <p><span class="font-bold">Default Water Price Rate</span> : {{ resident.data.defaultWaterPriceRate }} Baht per unit</p>
                <p><span class="font-bold">Default Light Price Rate</span> : {{ resident.data.defaultLightPriceRate }} Baht per unit</p>
                
              </div>
            </div>
          </div>

          <div>
            <div class="bg-white p-4 shadow rounded-lg">
              <!-- Bar Chart Component -->
              <div class="mb-4">
                <!-- Add your bar chart component here -->
                <p>Bar Chart</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped></style>
