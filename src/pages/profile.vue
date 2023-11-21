<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import UserDataForm from '@/components/form/user.data.form.vue';
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.store';
import { getDate } from '@/utils';

const route = useRoute();
const router = useRouter();

const formData = reactive({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
});

const userStore = useUserStore();

const submitForm = async () => {
  console.log(formData);
};
</script>

<template>
  <div class="card w-full glass">
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
              <img src="/blank-profile.webp" />
            </div>
          </div>
          <p>Member since : {{ getDate(userStore.user.created_at) }}</p>
        </div>
        <div class="bg-white basis-2/3 p-10 shadow-lg rounded-lg">
          <p class="font-bold text-2xl">Edit Profile</p>
          <UserDataForm :userData="userStore.user" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
