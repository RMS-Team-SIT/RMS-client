<script setup>
import { useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const props = defineProps({
  residence: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="bg-white p-4 shadow-md rounded">
    <div class="mb-4">
      <div class="flex justify-between items-center">
        <Divider>Residence Infomation</Divider>

        <PencilSquareIcon
          @click="
            () =>
              router.push({
                name: 'update-residence',
                params: { id: residence._id },
              })
          "
          class="text-dark-blue-200 w-5 h-5 flex justify-end cursor-pointer"
        />
      </div>
      <p>
        <span class="font-bold">Residence Name</span> :
        {{ residence.name }}
      </p>
      <p>
        <span class="font-bold">Description</span> :
        <span :class="{ 'text-gray-500': !residence.contact.description }">
          {{ residence.contact.description || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Address</span> :
        <span :class="{ 'text-gray-500': !residence.address }">
          {{ residence.address || 'No data' }}
        </span>
      </p>
      <Divider>Residence Contact</Divider>
      <p>
        <span class="font-bold">Email</span> :
        <span :class="{ 'text-gray-500': !residence.contact.email }">
          {{ residence.contact.email || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Phone</span> :
        <span :class="{ 'text-gray-500': !residence.contact.phone }">
          {{ residence.contact.phone || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Line</span> :
        <span :class="{ 'text-gray-500': !residence.contact.line }">
          {{ residence.contact.line || 'No data' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Facebook</span> :
        <span :class="{ 'text-gray-500': !residence.contact.facebook }">
          {{ residence.contact.facebook || 'No data' }}
        </span>
      </p>
      <Divider>Other Setting</Divider>
      <p>
        <span class="font-bold">Default Water Price Rate</span> :
        {{ residence.defaultWaterPriceRate }} Baht per unit
      </p>
      <p>
        <span class="font-bold">Default Light Price Rate</span> :
        {{ residence.defaultLightPriceRate }} Baht per unit
      </p>
    </div>
  </div>
</template>

<style scoped></style>
