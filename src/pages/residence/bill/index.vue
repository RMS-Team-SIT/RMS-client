<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import Loading from '@/components/common/loading.vue';
import Button from '@/components/common/button.vue';
import BillService from '@/services/BillService';
import BillListTable from '@/components/bill/bill.list.table.vue';
import dayjs from 'dayjs';
import Divider from '@/components/common/divider.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const residence = reactive({
  data: null,
});

const bills = ref([]);

const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('residence', result);
    residence.data = result;

    // sort meter record by record_date
    residence.data.meterRecord.sort((a, b) => {
      return new Date(b.record_date) - new Date(a.record_date);
    });
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

const fetchBills = async () => {
  const response = await BillService.findAllByResidenceId(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('bills', result);
    bills.value = result;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลบิลได้',
      type: 'error',
    });
  }
};

onMounted(async () => {
  await fetchResidence();
  await fetchBills();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-if="residence.data" class="bg-gray-50 min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: `${residence.data.name}`,
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'ระบบจัดการบิล' },
        ]"
      />
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'dashboard', params: { residenceId } })"
      >
        กลับหน้าแดชบอร์ด
      </Button>
      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg">
          <div class="flex justify-between">
            <h1 class="text-2xl font-semibold text-dark-blue-200">
              ระบบจัดการบิล
            </h1>
            <router-link
              :to="{
                name: 'create-bill',
                params: {
                  residenceId,
                },
              }"
            >
              <Button btnType="primary">สร้างบิลใหม่</Button>
            </router-link>
          </div>
          <p class="text-dark-blue-200 mt-5">บิลทั้งหมดในระบบ</p>
          <p class="mt-5" v-if="!bills.length">ไม่มีบิลในระบบ กรุณาสร้าง</p>
          <!-- Bill Collapse -->
          <div
            class="collapse collapse-arrow border border-base-300 shadow-sm m-2"
            v-for="(bill, index) in bills"
            :key="index"
          >
            <input type="checkbox" />
            <div class="collapse-title text-lg">
              <b>บิลรอบมิเตอร์: </b>
              {{ dayjs(bill.meterRecord.record_date).format('DD/MM/YYYY') }}
            </div>
            <div class="collapse-content">
              <!-- BillRoom -->
              <div
                class="collapse collapse-arrow border border-base-300 shadow-sm m-2"
                v-for="(meterRecordItem, index) in bill.meterRecord
                  .meterRecordItems"
                :key="index"
              >
                <input type="checkbox" />
                <div class="collapse-title text-lg font-medium">
                  ห้อง {{ meterRecordItem.room.name }}
                </div>
                <div class="collapse-content">
                  <p class="text-lg font-bold">ค่าน้ำ</p>
                  <p>
                    มิเตอร์น้ำครั้งก่อน:
                    {{ meterRecordItem.previousWaterMeter }}
                  </p>
                  <p>
                    มิเตอร์น้ำครั้งนี้: {{ meterRecordItem.currentWaterMeter }}
                  </p>
                  <p>
                    จำนวนหน่วย: {{ meterRecordItem.totalWaterMeterUsage }} หน่วย
                  </p>
                  <p>
                    อัตราค่าน้ำต่อหน่วย:
                    {{ meterRecordItem.room.waterPriceRate }} บาท
                  </p>
                  <p>
                    บิลค่าน้ำ :
                    <b
                      >{{
                        meterRecordItem.room.waterPriceRate *
                        meterRecordItem.totalWaterMeterUsage
                      }}
                      บาท</b
                    >
                  </p>
                  <Divider />
                  <p class="text-lg font-bold">ค่าไฟ</p>
                  <p>
                    มิเตอร์ไฟครั้งก่อน:
                    {{ meterRecordItem.previousElectricMeter }}
                  </p>
                  <p>
                    มิเตอร์ไฟครั้งนี้:
                    {{ meterRecordItem.currentElectricMeter }}
                  </p>
                  <p>
                    จำนวนหน่วย: {{ meterRecordItem.totalElectricMeterUsage }}
                  </p>
                  <p>
                    อัตราค่าไฟต่อหน่วย:
                    {{ meterRecordItem.room.lightPriceRate }}
                  </p>
                  <p>
                    บิลค่าไฟ :
                    <b
                      >{{
                        meterRecordItem.room.lightPriceRate *
                        meterRecordItem.totalElectricMeterUsage
                      }}
                      บาท</b
                    >
                  </p>
                  <Divider />
                  <p class="text-lg font-bold">ค่าเช่า</p>
                  <p>
                    ค่าเช่าห้อง:
                    <b>{{ meterRecordItem.room.roomRentalPrice }}</b> บาท
                  </p>
                  <Divider />
                  <p class="text-lg font-bold">
                    รวม:
                    {{
                      meterRecordItem.room.roomRentalPrice +
                      meterRecordItem.room.lightPriceRate *
                        meterRecordItem.totalElectricMeterUsage +
                      meterRecordItem.room.waterPriceRate *
                        meterRecordItem.totalWaterMeterUsage
                    }}
                    บาท
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p class="mt-5">หมายเหตุ: คลิกเพื่อดูรายละเอียดเพิ่มเติม</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
