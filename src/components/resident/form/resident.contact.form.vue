<script setup>
import { reactive } from 'vue';

const residentContact = reactive({
  facebook: '',
  line: '',
  phone: '',
  email: '',
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Resident Contact</h1>
    <p class="text-xs">Please input resident contact information.</p>
    {{ residentContact }}
    <div>
      <label class="label">
        <span class="text-base label-text">Facebook</span>
      </label>
      <input
        type="text"
        placeholder="Facebook"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.facebook"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Line</span>
      </label>
      <input
        type="text"
        placeholder="Line"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.line"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Phone</span>
      </label>
      <input
        type="text"
        placeholder="Phone"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.phone"
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
        v-model="residentContact.email"
      />
    </div>
  </div>
</template>

<style scoped></style>
