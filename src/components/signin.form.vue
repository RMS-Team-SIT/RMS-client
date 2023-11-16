<script setup>
import { projectName } from '@/constant';
import Button from './button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import Logo from './logo.vue';
</script>

<template>
  <div
    class="relative flex flex-col justify-center h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-6 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10 mb-5">
        Welcome Back !<br />
      </h1>
      <p class="text-sm px-10 mb-5"></p>
      <form class="space-y-4 px-10 mb-5">
        <div>
          <label class="label">
            <span class="text-base label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            class="w-full input input-bordered input-sm rounded-sm"
          />
        </div>
        <div>
          <Button class="btn btn-block">
            <ArrowRightIcon class="w-5 h-5" />
            Sign In
          </Button>
        </div>
      </form>
      <span class="mt-10 p-10">
        No account yet?
        <a href="#" class="text-blue-500 hover:underline">Sign up</a></span
      >
    </div>
  </div>
</template>

<style scoped></style>
