<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Nabvar from '@/components/common/navbar.vue';
import Footer from '@/components/common/footer.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Steps from '@/components/common/steps.vue';
import ImageUploadForm from '@/components/common/image.upload.form.vue';
import ResidentBasicInfoForm from '@/components/resident/form/resident.basic.info.form.vue';
import ResidentContactForm from '@/components/resident/form/resident.contact.form.vue';
import ResidentSettingForm from '@/components/resident/form/resident.setting.form.vue';
import ResidentImagesForm from '@/components/resident/form/resident.images.form.vue';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  residentData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
 <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">Review Resident Data</h1>
    <p class="text-xs">Please input resident settings.</p>
    {{ residentData }}
  </div>
</template>

<style scoped></style>
