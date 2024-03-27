<script setup>
import { projectFullName } from '@/utils/constants';
</script>

<template>
  <div class="w-full">
    <div class="flex bg-white min-h-screen">
      <div
        class="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2"
      >
        <div class="p-20">
          <h2 class="text-3xl font-semibold text-gray-800 md:text-4xl">
            Residence <span class="text-light-red"> Management System</span>
          </h2>
          <p class="text-lg leading-relaxed">
            ระบบการจัดการหอพักเป็นระบบที่ช่วยให้คุณจัดการที่อยู่อาศัยของคุณอย่างง่ายดาย
          </p>
          <p class="mt-4 text-gray-700">
            <b>เว็บแอพพลิเคชั่น</b>
            ที่ช่วยให้ผู้ประกอบการธุรกิจหอพักบริหารจัดการหอพักของตัวเองได้อย่างสะดวกสบาย
            <br />
            ลดปัญหาจากการบริหารที่ผิดพลาดและระยะเวลาในการบริหารจัดการของผู้ประกอบการ
            <br />
            เพื่ออำนวยความสะดวกในการจัดการหอพักของผู้ประกอบการ <br />
            และให้ผู้เช่าได้รับความสะดวกสบายตลอดระยะเวลาที่พักอาศัย<br />
          </p>
          <div class="flex justify-center lg:justify-start mt-6">
            <router-link
              :to="{ name: 'signin' }"
              class="px-4 py-3 bg-light-red text-gray-200 text-xs font-semibold rounded hover:bg-red-700"
            >
              <a href="#">เข้าสู่ระบบ</a>
            </router-link>
            <router-link
              :to="{ name: 'signup' }"
              class="mx-4 px-4 py-3 bg-gray-300 text-gray-900 text-xs font-semibold rounded hover:bg-gray-400"
            >
              <a href="#">สมัครสมาชิก</a>
            </router-link>
          </div>
        </div>
      </div>
      <div
        class="hidden lg:block lg:w-1/2"
        style="clip-path: polygon(10% 0, 100% 0%, 100% 100%, 0 100%)"
      >
        <div class="h-full object-cover bg-cover">
          <div class="h-full bg-black opacity-25"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-image: url('/8c.jpg');
  background-position: center;
}
</style>
