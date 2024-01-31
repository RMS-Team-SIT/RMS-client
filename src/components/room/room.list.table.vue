<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/bp.webp';

const props = defineProps({
  defaultWaterPriceRate: {
    type: Number,
    default: 0,
  },
  defaultLightPriceRate: {
    type: Number,
    default: 0,
  },
  rooms: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base" v-if="!props.rooms.length">No room</p>
    <table class="table table-xs" v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>ชื่อ</th>
          <th>คำอธิบาย</th>
          <th>ผู้เช่า</th>
          <th>ชั้น</th>
          <th>อัตราค่าน้ำ</th>
          <th>อัตราค่าไฟ</th>
          <th>สถานะ</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(room, index) in rooms" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ room.name }}
          </td>
          <td>
            <span :class="{ 'text-gray-500': !room.description }">
              {{ room.description || 'ไม่มีข้อมูล' }}
            </span>
          </td>
          <td>
            <router-link
              v-if="room.currentRenter"
              class="text-dark-blue-200 underline"
              :to="{
                name: 'update-renter',
                params: {
                  residenceId: $route.params.residenceId,
                  renterId: room.currentRenter._id,
                },
              }"
            >
              {{ room.currentRenter.firstname }}
              {{ room.currentRenter.lastname }}
            </router-link>
            <span v-else class="text-red-500"> ไม่มีผู้เช่า </span>
          </td>
          <td>{{ room.floor }}</td>
          <td>
            {{
              room.isUseDefaultWaterPriceRate
                ? defaultWaterPriceRate
                : room.waterPriceRate
            }}
            <Badge badgeType="ghost" v-if="room.isUseDefaultWaterPriceRate"
              >ค่าเริ่มต้น</Badge
            >
            <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
          </td>
          <td>
            {{
              room.isUseDefaultLightPriceRate
                ? defaultLightPriceRate
                : room.lightPriceRate
            }}
            <Badge badgeType="ghost" v-if="room.isUseDefaultLightPriceRate"
              >ค่าเริ่มต้น</Badge
            >
            <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
          </td>
          <td>
            <Badge badgeType="success" v-if="!room.currentRenter"
              >ว่าง</Badge
            >
            <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
          </td>
          <!-- <td>
            <Badge badgeType="success">Paid</Badge>
            <Badge badgeType="error">Not Paid</Badge>
          </td> -->
          <th>
            <router-link
              :to="{
                name: 'update-room',
                params: {
                  residenceId: $route.params.residenceId,
                  roomId: room._id,
                },
              }"
            >
              <Button btnType="ghost-pill">แก้ไข</Button>
            </router-link>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
