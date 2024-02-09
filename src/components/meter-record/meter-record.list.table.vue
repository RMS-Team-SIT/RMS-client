<script setup>
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import dayjs from 'dayjs';
import Badge from '../common/badge.vue';

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

    <table class="table table-xs" v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>วันที่จด</th>
          <th>เพิ่มเติม</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(meterRecord, index) in meterRecords" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ dayjs(meterRecord.record_date).format('DD-MM-YYYY') }}
          </td>
          <td>
            <Badge :type="info" v-if="index == 0"> จดล่าสุด </Badge>
          </td>
          <td>
            <router-link
              :to="{
                name: 'view-meter-record',
                params: {
                  residenceId: $route.params.residenceId,
                  meterRecordId: meterRecord._id,
                },
              }"
            >
              <Button btnType="ghost-pill">ดูข้อมูล</Button>
            </router-link>
          </td>
          <td>
            <router-link
              v-if="index == 0"
              :to="{
                name: 'update-meter-record',
                params: {
                  residenceId: $route.params.residenceId,
                  meterRecordId: meterRecord._id,
                },
              }"
            >
              <Button btnType="ghost-pill">แก้ไข</Button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
