<script setup>
import Button from '@/components/common/button.vue';
import dayjs from 'dayjs';
import Badge from '../common/badge.vue';
import {
  ArrowTopRightOnSquareIcon,
  PencilIcon,
} from '@heroicons/vue/24/outline';

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
      ไม่มีการจัดบันทึกในระบบ
      <b>การใช้งานครั้งแรก กรุณาสร้างใบบันทึกเลขมิเตอร์ปัจจุบัน</b>
    </p>
    <table class="table table-xs" v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>วันที่จด</th>
          <th>เพิ่มเติม</th>
          <th>สถานะการสร้างบิล</th>
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
            <Badge
              type="info"
              v-if="index == 0 && !meterRecord.isFirstInitRecord"
            >
              จดครั้งล่าสุด
            </Badge>
            <Badge badgeType="warning" v-if="meterRecord.isFirstInitRecord">
              จดครั้งแรก
            </Badge>
          </td>
          <td>
            <div v-if="!meterRecord.isFirstInitRecord">
              <Badge badgeType="warning" v-if="meterRecord.isFirstInitRecord">
                จดครั้งแรก
              </Badge>
              <router-link
                v-if="meterRecord.isBillGenerated"
                :to="{
                  name: 'bill',
                  params: {
                    residenceId: $route.params.residenceId,
                  },
                }"
                target="_blank"
              >
                <Badge badge-type="success">
                  สร้างบิลแล้ว <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </Badge>
              </router-link>

              <Badge badge-type="error" v-else> ยังไม่ได้สร้างบิล </Badge>
            </div>
            <Badge badgeType="warning" v-else> ไม่สามารถใช้สร้างบิล </Badge>
          </td>
          <td>
            <router-link
              v-if="!meterRecord.isLocked"
              :to="{
                name: 'update-meter-record',
                params: {
                  residenceId: $route.params.residenceId,
                  meterRecordId: meterRecord._id,
                },
              }"
            >
              <Button btnType="ghost-pill"
                >แก้ไขข้อมูล
                <ArrowTopRightOnSquareIcon class="h-4 w-4" />
              </Button>
            </router-link>
            <router-link
              v-else
              :to="{
                name: 'view-meter-record',
                params: {
                  residenceId: $route.params.residenceId,
                  meterRecordId: meterRecord._id,
                },
              }"
            >
              <Button btnType="ghost-pill">ดูข้อมูล
                <ArrowTopRightOnSquareIcon class="h-4 w-4" />
              </Button>
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
