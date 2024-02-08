<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import dayjs from 'dayjs';

const props = defineProps({
  meterRecords: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!meterRecords.length">
      การใช้งานครั้งแรก กรุณาสร้างใบบันทึกเลขมิเตอร์ปัจจุบัน
    </p>

    <table class="table table-xs " v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อ</th>
          <th>วันที่จด</th>
          <th>บันทึกค่าน้ำ/ไฟบิลนี้</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(meterRecord, index) in meterRecords" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ meterRecord.meterRecordName }}
          </td>
          <td>
            {{ dayjs(meterRecord.record_date).format('DD/MM/YYYY') }}
          </td>
          <th>
            <!-- <router-link
              :to="{
                name: 'update-room',
                params: {
                  residenceId: $route.params.residenceId,
                  roomId: room._id,
                },
              }"
            >
            </router-link> -->
            <Button btnType="ghost-pill">แก้ไข</Button>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
