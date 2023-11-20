<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Nabvar from '@/components/common/navbar.vue';
import Button from '@/components/common/button.vue';
import Footer from '@/components/common/footer.vue';
import { onMounted, reactive } from 'vue';
import { fetchResident } from '@/services/residentServices';
import { useRoute, useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import Steps from '@/components/common/steps.vue';
import ResidentCreateForm from '@/components/resident/resident.create.form.vue';

const router = useRouter();
const route = useRoute();

const resident = reactive({
  data: null,
});

onMounted(async () => {});
</script>

<template>
  <Nabvar :isLoggedIn="true" />
  <div class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb :pathList="['Home', 'Manage', 'Create Resident']" />
      </div>
      <div>
        <div class="p-4 mb-4 card shadow-xl bg-white">
          <Steps
            :stepList="[
              'Resident Infomation',
              'Resident Contact',
              'Room',
              'Receive Product',
            ]"
            :currentStep="4"
          />
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <div class="bg-white shadow rounded-lg p-5">
              <ResidentCreateForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style scoped></style>
