<script setup>
import img6 from '@/assets/img/6.jpg';
import Carousel from '@/components/common/carousel.vue';
import QuickLinkCard from '@/components/common/quick-link-card.vue';
import {
  BanknotesIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  UserIcon,
} from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="container mx-auto p-10">
    <!-- About Section -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <img :src="img6" class="w-full h-auto rounded-lg shadow-lg" />
      </div>
      <div>
        <h1 class="text-6xl font-semibold mb-4 text-dark-blue-200">
          จัดการ <span class="text-light-red">หอพักของคุณ</span>
        </h1>
        <p class="text-lg leading-relaxed">
          ระบบการจัดการหอพักเป็นระบบที่ช่วยให้คุณจัดการที่อยู่อาศัยของคุณอย่างง่ายดาย
        </p>
        <p class="mt-4 text-gray-700">
          <b>RMS</b> เป็น <b>Web Application</b>
          ที่ช่วยให้ผู้ประกอบการธุรกิจหอพักบริหารจัดการหอพักของตัวเองได้อย่างสะดวกสบาย
          ลดปัญหาจากการบริหารที่ผิดพลาดและระยะเวลาในการบริหารจัดการของผู้ประกอบการ
          เพื่ออำนวยความสะดวกในการจัดการหอพักของผู้ประกอบการ
          และให้ผู้เช่าได้รับความสะดวกสบายตลอดระยะเวลาที่พักอาศัย
        </p>
      </div>
    </section>

    <!-- Services Section -->
    <section class="mt-12 mb-12">
      <h2 class="text-3xl font-semibold mb-6">บริการของเรา</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <QuickLinkCard
          title="ระบบจัดการห้อง"
          text="เข้าสู่ระบบจัดการห้องในระบบ"
        />

        <QuickLinkCard
          title="ระบบจัดการผู้เช่า"
          text="เข้าสู่ระบบจัดการผู้เช่าในระบบ"
        />

        <QuickLinkCard title="จัดการบิล" text="เข้าสู่หน้าจัดการบิล" />
      </div>
    </section>

    <!-- <h2 class="text-3xl font-semibold mb-6">Show cases</h2>
    <Carousel class="mt-12" :images="['demo1.png', 'demo2.png', 'demo3.png']" /> -->
  </div>
</template>

<style></style>
