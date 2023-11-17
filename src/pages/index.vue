<script setup>
import { onMounted } from 'vue';
import { currentTheme, initTheme, switchTheme } from '@/composables/theme.js';
import Button from '@/components/button.vue';
import SigninPopup from '@/components/button.vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/navbar.vue';
import { themeChange } from 'theme-change';

const router = useRouter();
const route = useRoute();

onMounted(() => {
  // initTheme();
  themeChange('light', 'dark');
});
</script>

<template>
  <Navbar/>
  <div class= "font-sans">
    <!-- Main Content -->
    <main class="container mx-auto mt-8">
      <!-- About Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <img
            :src="`https://source.unsplash.com/800x600/?${1}`"
            alt="Random Image"
            class="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 class="text-3xl font-semibold mb-4">About Us</h2>
          <p class="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p class="mt-4 text-gray-700">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </section>

      <!-- Services Section -->
      <section class="mt-12">
        <h2 class="text-3xl font-semibold mb-6">Our Services</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Service 1</h3>
            <p class="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>

          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Service 2</h3>
            <p class="text-gray-700">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          </div>

          <!-- Service Card -->
          <div class="p-6 bg-white rounded-lg shadow-md">
            <h3 class="text-xl font-semibold mb-2">Service 3</h3>
            <p class="text-gray-700">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-blue-600 text-white p-4 mt-8">
      <div class="container mx-auto text-center">
        <p class="text-sm">&copy; 2023 My Beautiful Website. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style></style>
