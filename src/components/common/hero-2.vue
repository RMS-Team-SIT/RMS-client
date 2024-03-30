<script setup>
import demo2 from '@/assets/img/demo2.webp';
</script>

<template>
  <main class="flex flex-col items-center justify-center">
    <!-- Hero -->
    <section
      class="flex flex-wrap items-center px-4 mx-auto w-full lg:max-w-screen-lg sm:max-w-screen-sm md:max-w-screen-md pb-20"
    >
      <!-- Column-2 -->
      <div class="px-3 mb-12 w-full lg:mb-0 lg:w-3/5">
        <!-- Illustrations Container -->
        <div class="flex justify-center items-center">
          <img
            class="w-full h-auto max-w-lg mx-auto"
            :src="demo2"
            alt="Illustration"
          />
        </div>
      </div>
      <!-- Column-1 -->
      <div class="px-3 w-full lg:w-2/5">
        <div
          class="mx-auto mb-8 max-w-lg text-center lg:mx-0 lg:max-w-md lg:text-left"
        >
          <h2 class="mb-4 text-3xl font-bold text-left lg:text-5xl">
            จัดการทุกอย่างในหอพักของคุณ

            <span class="text-5xl text-light-red leading-relaxeds"
              >อย่างง่ายดาย
            </span>
            <br>
            โดยใช้ระบบของเรา
          </h2>

          <p
            class="visible mx-0 mt-3 mb-0 text-sm leading-relaxed text-left text-slate-400"
          >
            ระบบการจัดการหอพักเป็นระบบที่ช่วยให้คุณจัดการที่อยู่อาศัยของคุณอย่างง่ายดาย
          </p>
        </div>
      </div>
    </section>

    <!-- Parallax Background -->
    <section
      class="flex flex-col w-full h-[500px] bg-cover bg-fixed bg-center justify-center items-center"
    >
      <h1 class="text-gray-700 text-5xl font-semibold mt-20 mb-10">
        ทำให้การจัดการหอพักของคุณง่ายขึ้น
      </h1>
    </section>
  </main>
</template>

<style scoped>
/* .bg-img {
  background-image: url('/8c.jpg');
  background-position: center;
} */
</style>
