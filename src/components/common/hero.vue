<script setup>
</script>

<template>
  <!-- component -->
  <section>
    <div class="bg-dark-blue-200 text-white p-20">
      <div class="container mx-auto flex flex-col md:flex-row items-center">
        <div
          class="flex flex-col w-full lg:w-1/3 justify-center items-start p-8"
        >
          <h1 class="text-3xl md:text-5xl font-bold">
            Residence Management System
          </h1>

          <!-- <p class="text-sm md:text-base text-gray-700 mb-4">
          ระบบการจัดการหอพักเป็นระบบที่ช่วยให้คุณจัดการที่อยู่อาศัยของคุณอย่างง่ายดาย
        </p> -->
          <p class="mt-10 text-gray-50">
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
              class="px-4 py-3 bg-light-red text-white text-xs hover:bg-red-700"
            >
              <a href="#">เข้าสู่ระบบ</a>
            </router-link>
            <router-link
              :to="{ name: 'signup' }"
              class="mx-4 px-4 py-3 bg-white text-gray-900 text-xs font-semibold hover:bg-gray-400"
            >
              <a href="#">สมัครสมาชิก</a>
            </router-link>
          </div>
        </div>
        <div class="p-8 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3 justify-center">
          <div class="h-28 flex flex-wrap content-center">
            <div>
              <img class="inline-block xl:block" src="/demo1.webp" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#002B5B"
        fill-opacity="1"
        d="M0,160L26.7,165.3C53.3,171,107,181,160,192C213.3,203,267,213,320,181.3C373.3,149,427,75,480,69.3C533.3,64,587,128,640,144C693.3,160,747,128,800,138.7C853.3,149,907,203,960,208C1013.3,213,1067,171,1120,144C1173.3,117,1227,107,1280,90.7C1333.3,75,1387,53,1413,42.7L1440,32L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"
      ></path>
    </svg>
  </div>
</template>

<style scoped></style>
