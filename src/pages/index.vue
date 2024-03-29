<script setup></script>

<template>
  <!-- component -->
  <section>
    <div class="bg-dark-blue-200 text-white py-1">
      <div
        class="container mx-auto flex flex-col md:flex-row items-center my-12 md:my-24"
      >
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
        <div
          class="p-8 mt-12 mb-6 md:mb-0 md:mt-0 ml-0 md:ml-12 lg:w-2/3 justify-center"
        >
          <div class="h-28 flex flex-wrap content-center">
            <div>
              <img class="inline-block mt-28 xl:block" src="/demo1.webp" />
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
            src="/demo2.webp"
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
      class="flex flex-col w-full bg-cover bg-fixed bg-center h-[500px] justify-center items-center bg-img"
    >
      <h1 class="text-gray-700 text-5xl font-semibold mt-20 mb-10">
        ทำให้การจัดการหอพักของคุณง่ายขึ้น
      </h1>
    </section>
  </main>

  <!-- component -->
  <section class="py-20 bg-white" id="highlight" data-aos="fade-up">
    <div class="flex flex-col px-8 mx-auto space-y-12 max-w-7xl xl:px-12">
      <div class="relative">
        <h2
          class="w-full text-3xl font-bold text-center sm:text-4xl md:text-5xl"
        >
          จุดเด่นของระบบ
        </h2>
        <p
          class="w-full py-8 mx-auto -mt-2 text-lg text-center text-gray-700 intro sm:max-w-3xl"
        >
          ระบบของเราจะช่วยให้การบริหารจัดการหอพักเป็นเรื่องง่ายอีกทั้งยังช่วยลดระยะเวลาในการบริหารจัดการ
          <br />
          โดยมีจุดมุ่งหมายเพื่ออำนวยความสะดวกให้กับผู้ประกอบการ
          และให้ผู้เช่าได้รับความสะดวกสบายตลอดระยะเวลาที่พัก
        </p>
      </div>

      <div
        class="flex flex-col mb-8 animated fadeIn sm:flex-row"
        data-aos="fade-up"
      >
        <div class="flex items-center mb-8 sm:w-1/2 md:w-5/12 sm:order-last">
          <img class="rounded-lg" src="/demo2.webp" alt="demo2" />
        </div>
        <div
          class="flex flex-col justify-center mt-5 mb-8 md:mt-0 sm:w-1/2 md:w-7/12 sm:pr-16"
        >
          <p
            class="mb-2 text-sm font-semibold leading-none text-left text-indigo-600 uppercase"
          >
            ภาพรวมหอพัก: แดชบอร์ด
          </p>
          <h3 class="mt-2 text-2xl sm:text-left md:text-4xl">
            ภาพรวมหอพัก: แดชบอร์ด
          </h3>
          <p class="mt-5 text-lg text-gray-700 text md:text-left">
            ผู้ประกอบการสามารถดูภาพรวมของหอพักผ่านหน้าแดชบอร์ด เช่น
            รายได้ของหอพัก สถานะห้องว่าง สถานะการจ่ายบิล
          </p>
        </div>
      </div>

      <div
        class="flex flex-col mb-8 animated fadeIn sm:flex-row"
        data-aos="fade-up"
      >
        <div class="flex items-center mb-8 sm:w-1/2 md:w-5/12">
          <img class="rounded-lg" src="/demo5.webp" alt="" />
        </div>
        <div
          class="flex flex-col justify-center mt-5 mb-8 md:mt-0 sm:w-1/2 md:w-7/12 sm:pl-16"
        >
          <p
            class="mb-2 text-sm font-semibold leading-none text-left text-indigo-600 uppercase"
          >
            know your data
          </p>
          <h3 class="mt-2 text-2xl sm:text-left md:text-4xl">
            การจดมิเตอร์และจัดการค่าใช้จ่ายต่าง ๆ
          </h3>
          <p class="mt-5 text-lg text-gray-700 text md:text-left">
            ผู้ประกอบการสามารถบันทึกค่าสาธารณูปโภค ค่าใช้จ่ายเพิ่มเติม เช่น
            ค่าอินเทอร์เน็ต ค่าส่วนกลาง
            อีกทั้งยังสามารถบันทึกมิเตอร์การใช้งานสาธารณูปโภคของแต่ละห้องในแต่ละเดือนได้
          </p>
        </div>
      </div>

      <div
        class="flex flex-col mb-8 animated fadeIn sm:flex-row"
        data-aos="fade-up"
      >
        <div class="flex items-center mb-8 sm:w-1/2 md:w-5/12 sm:order-last">
          <img class="rounded-lg" src="/demo4.webp" alt="" />
        </div>
        <div
          class="flex flex-col justify-center mt-5 mb-8 md:mt-0 sm:w-1/2 md:w-7/12 sm:pr-16"
        >
          <p
            class="mb-2 text-sm font-semibold leading-none text-left text-indigo-600 uppercase"
          >
            Easy to customize
          </p>
          <h3 class="mt-2 text-2xl sm:text-left md:text-4xl">
            การจัดการบิล และแจ้งชำระออนไลน์
          </h3>
          <p class="mt-5 text-lg text-gray-700 text md:text-left">
            ผู้ประกอบการสามารถสร้างบิลที่ผู้เช่าจะต้องชำระในแต่ละเดือนได้
            ระบบจะคำนวณค่าใช้จากจากมิเตอร์และค่าใช้จ่ายที่ตั้งไว้
            อีกทั้งยังสามารถพิมพ์ใบแจ้งหนี้หรือใบเสร็จรับเงินได้ภายในระบบ
            ผู้เช่าจะได้รับการแจ้งเตือนบิลที่ต้องชำระผ่านอีเมล
            ผู้เช่าสามารถดูบิลที่ต้องชำระ, บิลค้างชำระ
            และสามารถแจ้งชำระออนไลน์ได้ภายในระบบ
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- member -->
  <div class="w-full" id="member">
    <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
      <div class="text-center pb-12">
        <h1 class="font-bold text-3xl md:text-4xl lg:text-5xl font-heading">
          ทีมของเรา
        </h1>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          class="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
        >
          <div class="mb-8">
            <img
              class="object-center object-cover rounded-full h-36 w-36"
              src="https://avatars.githubusercontent.com/u/51380509?v=4"
              alt="photo"
            />
          </div>
          <div class="text-center">
            <p class="text-xl text-white font-bold mb-2">สิริวัฒก์ ใจยั่งยืน</p>
            <!-- <p class="text-base text-gray-400 font-normal">
              Fullstack Developer
            </p> -->
          </div>
        </div>
        <div
          class="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
        >
          <div class="mb-8">
            <img
              class="object-center object-cover rounded-full h-36 w-36"
              src="/tan.jpg"
              alt="photo"
            />
          </div>
          <div class="text-center">
            <p class="text-xl text-white font-bold mb-2">รวิศ น้อยวงศ์</p>
            <!-- <p class="text-base text-gray-400 font-normal">UX UI Designer</p> -->
          </div>
        </div>
        <div
          class="w-full bg-gray-900 rounded-lg sahdow-lg p-12 flex flex-col justify-center items-center"
        >
          <div class="mb-8">
            <img
              class="object-center object-cover rounded-full h-36 w-36"
              src="/fern.jpg"
              alt="photo"
            />
          </div>
          <div class="text-center">
            <p class="text-xl text-white font-bold mb-2">มนัสสินี เวชวิฐาน</p>
            <!-- <p class="text-base text-gray-400 font-normal">BA, Tester</p> -->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-img {
  background-image: url('/8c-min.jpg');
  background-position: center;
}
</style>
