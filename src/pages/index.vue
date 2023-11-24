<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { themeChange } from 'theme-change';
import { useUserStore } from '@/stores/user.store';
import img6 from '@/assets/img/6.jpg';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

onMounted(() => {
  themeChange('light', 'dark');
});
</script>

<template>
  <div>
    <!-- Main Content -->
    <main class="container mx-auto mt-8">
      <!-- About Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <img :src="img6" class="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 class="text-6xl font-semibold mb-4 text-dark-blue-200">
            Manage your <span class="text-light-red">resident</span>
          </h1>
          <p class="text-lg leading-relaxed">
            Resident Management System is a system that helps you to manage your
            resident.
          </p>
          <p class="mt-4 text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, diam id tincidunt dapibus, velit diam vulputate augue, eget
            lacinia ipsum nisi eget velit. Sed euismod, diam id tincidunt
            dapibus, velit diam vulputate augue, eget lacinia ipsum nisi eget
            velit.
          </p>
        </div>
      </section>

      <!-- Services Section -->
      <section class="mt-12">
        <h2 class="text-3xl font-semibold mb-6">Our Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Manage your resident</h3>
            <p class="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Service 2</h3>
            <p class="text-gray-700">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris.
            </p>
          </div>

          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Service 3</h3>
            <p class="text-gray-700">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style></style>
