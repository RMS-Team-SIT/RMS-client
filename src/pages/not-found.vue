<script setup>
import {
  InformationCircleIcon,
  PaperAirplaneIcon,
} from '@heroicons/vue/24/outline';
</script>
<template>
  <header class="flex h-screen items-center justify-center">
    <div class="text-center">
      <h1 class="text-9xl font-bold leading-tight text-light-red">404</h1>
      <p class="mt-5">Oops! Looks like you're lost.</p>
      <PaperAirplaneIcon
        class="w-20 h-20 mt-5 text-light-red -rotate-90 animate-pulse mx-auto"
      />
      <p class="mt-5">
        Let's get you back.
        <router-link :to="{ name: 'home' }" class="text-light-red hover:underline">home</router-link>
      </p>
    </div>
  </header>
</template>
