<script setup>
import { useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const props = defineProps({
  resident: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="bg-white p-4 shadow-md rounded">
    <div class="mb-4">
      <div class="flex justify-between items-center">
        <Divider>Resident Infomation</Divider>

        <PencilSquareIcon
          id="edit-resident-link"
          @click="
            () =>
              router.push({
                name: 'update-resident',
                params: { id: resident._id },
              })
          "
          class="text-dark-blue-200 w-5 h-5 flex justify-end cursor-pointer"
        />
      </div>
      <p>
        <span class="font-bold">Resident Name</span> :
        {{ resident.name }}
      </p>
      <p>
        <span class="font-bold">Description</span> :
        <span :class="{ 'text-gray-500': !resident.contact.description }">
          {{ resident.contact.description || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Address</span> :
        <span :class="{ 'text-gray-500': !resident.address }">
          {{ resident.address || 'No data' }}
        </span>
      </p>
      <Divider>Resident Contact</Divider>
      <p>
        <span class="font-bold">Email</span> :
        <span :class="{ 'text-gray-500': !resident.contact.email }">
          {{ resident.contact.email || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Phone</span> :
        <span :class="{ 'text-gray-500': !resident.contact.phone }">
          {{ resident.contact.phone || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Line</span> :
        <span :class="{ 'text-gray-500': !resident.contact.line }">
          {{ resident.contact.line || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Facebook</span> :
        <span :class="{ 'text-gray-500': !resident.contact.facebook }">
          {{ resident.contact.facebook || 'No data' }}
        </span>
      </p>
      <Divider>Other Setting</Divider>
      <p>
        <span class="font-bold">Default Water Price Rate</span> :
        {{ resident.defaultWaterPriceRate }} Baht per unit
      </p>
      <p>
        <span class="font-bold">Default Light Price Rate</span> :
        {{ resident.defaultLightPriceRate }} Baht per unit
      </p>
    </div>
  </div>
</template>

<style scoped></style>
