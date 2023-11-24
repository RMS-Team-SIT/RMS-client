<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import UserDataForm from '@/components/form/user.data.form.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { getDate } from '@/utils';
import { me } from '@/services/userServices';
import Loading from '@/components/common/loading.vue';
import blankprofileImg from '@/assets/img/blank-profile.webp';
import { useNotification } from '@kyvg/vue3-notification';

const route = useRoute();
const router = useRouter();
const isLoading = ref(true);
const { notify } = useNotification();

const formData = reactive({
  data: {
    firstname: '',
    lastname: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    phone: '',
  },
});

const submitForm = async () => {
  console.log(formData);
};

onMounted(async () => {
  const response = await me();
  if (response.status === 200) {
    let user = await response.json();
    formData.data = user;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch user data',
      type: 'error',
    });
  }
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Profile', pathName: 'profile' },
          ]"
        />
      </div>

      <div class="flex gap-4 mb-2">
        <div class="bg-white basis-1/3 p-10 shadow-lg rounded-lg">
          <p class="text-center font-bold text-lg">Siriwat Jaiyungyuen</p>
          <div class="avatar">
            <div class="w-[50%] rounded-full">
              <img :src="blankprofileImg" />
            </div>
          </div>
          <!-- <p>Member since : {{ getDate(formData.data.) }}</p> -->
        </div>
        <div class="bg-white basis-2/3 p-10 shadow-lg rounded-lg">
          <p class="font-bold text-2xl">Edit Profile</p>
          <UserDataForm :userData="formData.data" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
