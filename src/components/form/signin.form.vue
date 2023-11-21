<script setup>
import Button from '../common/button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const emit = defineEmits(['submit-form']);

const formData = reactive({
  email: '',
  password: '',
});

const submitForm = async () => {
  emit('submit-form', formData);
};
</script>

<template>
  <div
    class="relative flex flex-col justify-center min-h-screen overflow-hidden bg-white"
  >
    <div class="w-full p-6 m-auto bg-white rounded-md lg:max-w-xl">
      <h1 class="text-3xl font-semibold text-dark-blue-200 px-10 mb-5">
        Welcome Back !<br />
      </h1>
      <p class="text-sm px-10 mb-5">
        Sign in and start managing your resident.
      </p>
      <form @submit.prevent="submitForm" class="space-y-4 px-10 mb-5">
        <div>
          <label class="label">
            <span class="text-base label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered input-sm rounded-sm"
            v-model="formData.email"
            required
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
            v-model="formData.password"
            required
          />
        </div>

        <div>
          <span
            class="text-dark-blue-200 hover:underline"
            @click="router.push('signup')"
            >Forget your password?</span
          >
        </div>
        <div>
          <Button class="btn btn-block" type="submit">
            <ArrowRightIcon class="w-5 h-5" />
            Sign In
          </Button>
        </div>
      </form>
      <span class="mt-10 p-10">
        No account yet?
        <span
          class="text-blue-500 hover:underline"
          @click="router.push('signup')"
          >Sign up now</span
        ></span
      >
    </div>
  </div>
</template>

<style scoped></style>
