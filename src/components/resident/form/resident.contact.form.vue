<script setup>
import LabelCheckbox from '@/components/common/label-checkbox.vue';
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  residentData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
  userPersonalData: {
    type: Object,
    default: () => ({
      email: 'test@test.com',
      phone: '0812345678',
    }),
    required: false,
  },
});

const residentContact = reactive({
  contact: {
    facebook: '',
    line: '',
    phone: '',
    email: '',
  },
});

const emitData = () => {
  emit('getData', residentContact);
};

const setDataFromProps = () => {
  for (const key in props.residentData) {
    if (key in residentContact) residentContact[key] = props.residentData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residentContact, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">Resident Contact</h1>
    <p class="text-xs">Please input resident contact information.</p>
    <div>
      <label class="label">
        <span class="text-base label-text">Facebook</span>
      </label>
      <input
        type="text"
        placeholder="Facebook"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residentContact.contact.facebook"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Line</span>
      </label>
      <input
        type="text"
        placeholder="Line"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residentContact.contact.line"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Phone</span>
      </label>
      <input
        type="text"
        placeholder="Phone"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residentContact.contact.phone"
        :disabled="viewOnly"
      />
      <p
        class="text-sm hover:underline text-dark-blue-100"
        @click="residentContact.contact.phone = userPersonalData.phone"
      >
        Fill with your phone number.
      </p>
      <!-- <LabelCheckbox label="Use same as your phone number" /> -->
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Email</span>
      </label>
      <input
        type="email"
        placeholder="Email Address"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residentContact.contact.email"
        :disabled="viewOnly"
      />
      <p
        class="text-sm hover:underline text-dark-blue-100"
        @click="residentContact.contact.email = userPersonalData.email"
      >
        Fill with your email.
      </p>
    </div>
  </div>
</template>

<style scoped></style>
