<script setup>
import { projectName } from '@/constant';
import Button from './button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import Logo from './logo.vue';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();

const data = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
});

</script>

<template>
  <div
    class="relative flex flex-col justify-center h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-6 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10 mb-5">
        Start Signing Up <br />
        for Free
      </h1>
      <p class="text-sm px-10 mb-5">Create your account to get started.</p>
      <form class="space-y-4 px-10 mb-5">
        <div class="flex gap-2">
          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">Firstname</span>
            </label>
            <input
              type="text"
              placeholder="Firstname"
              class="w-full input-sm input input-bordered rounded-sm"
            />
          </div>
          <div class="w-full">
            <label class="label">
              <span class="text-base label-text">Lastname</span>
            </label>
            <input
              type="text"
              placeholder="Lastname"
              class="w-full input input-bordered input-sm rounded-sm"
            />
          </div>
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Phone Number</span>
          </label>
          <input
            type="text"
            placeholder="Phone number"
            class="w-full input input-bordered input-sm rounded-sm"
          />
        </div>
        <div>
          <label class="label">
            <span class="text-base label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
          />
          <p class="text-sm text-gray-500">
            * Please use a real email address for future correspondence
          </p>
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
          <label class="label">
            <span class="text-base label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            class="w-full input input-bordered input-sm rounded-sm"
          />
        </div>
        <div>
          <Button class="btn btn-block">
            <!-- <ArrowRightIcon class="w-5 h-5" /> -->
            Sign Up
          </Button>
        </div>
      </form>
      <span class="mt-10 p-10">
        Already have an account?
        <span
          class="text-blue-500 hover:underline"
          @click="router.push('signin')"
          >Sign in</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped></style>
