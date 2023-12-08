<script setup>
import Button from '../common/button.vue';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

const router = useRouter();
const emit = defineEmits(['submit-form']);

const formData = reactive({
  email: '',
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
        Forget Password<br />
      </h1>
      <p class="text-sm px-10 mb-5">
        Enter your email address to reset your password.
      </p>
      <form @submit.prevent="submitForm" class="space-y-4 px-10">
        <div>
          <label class="label">
            <span class="text-base label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email Address"
            class="w-full input input-bordered bg-white  input-sm rounded-sm"
            v-model="formData.email"
            required
          />
        </div>
        <div>
          <Button class="btn btn-block" type="submit">
            <ArrowRightIcon class="w-5 h-5" />
            <p>Sent</p>
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
