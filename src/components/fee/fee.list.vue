<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import FeeService from '@/services/FeeService';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import BankIcon from '@/components/common/bank-icon.vue';
import { useRouter } from 'vue-router';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  fees: {
    type: Array,
    default: () => [],
  },
  residenceId: {
    type: String,
    default: '',
  },
});

const swal = inject('$swal');
const currentPage = ref(1);
const perPage = ref(10);
const showDeactive = ref(false);
const { notify } = useNotification();
const router = useRouter();
const search = ref('');

const computedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.fees
    .filter((f) => {
      return f.feename.toLowerCase().includes(search.value.toLowerCase());
    })
    .slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.fees.length / perPage.value);
});

const visiblePages = computed(() => {
  const range = 3;

  let start = Math.max(1, currentPage.value - range);
  let end = Math.min(totalPages.value, currentPage.value + range);

  if (currentPage.value <= range) {
    end = Math.min(range * 2 + 1, totalPages.value);
  }

  if (currentPage.value >= totalPages.value - range) {
    start = Math.max(totalPages.value - range * 2, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const editingFee = reactive({
  feePreviousName: '',
  feeId: '',
  feename: '',
  feeprice: '',
});

const setEditingFee = (feeId) => {
  const fee = props.fees.find((f) => f._id === feeId);
  editingFee.feeId = fee._id;
  editingFee.feename = fee.feename;
  editingFee.feePreviousName = fee.feename;
  editingFee.feeprice = +fee.feeprice;
};

const resetEditingFee = () => {
  editingFee.feeId = '';
  editingFee.feename = '';
  editingFee.feeprice = '';
};

const updateFee = async () => {
  const response = await FeeService.update(
    props.residenceId,
    editingFee.feeId,
    { feename: editingFee.feename, feeprice: editingFee.feeprice }
  );

  if (response.status !== 200) {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'แก้ไขข้อมูลไม่สำเร็จ',
      text: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล,' + data.message,
      type: 'error',
    });
  } else {
    notify({
      group: 'tr',
      title: 'แก้ไขข้อมูลสำเร็จ',
      text: 'ข้อมูลได้รับการแก้ไขเรียบร้อยแล้ว',
      type: 'success',
    });
    const index = props.fees.findIndex((f) => f._id === editingFee.feeId);
    props.fees[index].feename = editingFee.feename;
    props.fees[index].feeprice = editingFee.feeprice;
  }

  resetEditingFee();
  editFee.close();
};
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.fees.length">
      ไม่มีค่าบริการเพิ่มเติมในหอพัก กรุณาเพิ่มข้อมูลค่าบริการเพิ่มเติม
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        จำนวนค่าบริการเพิ่มเติมทั้งหมด:
        {{ props.fees.length }}
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหา:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหา"
          class="input input-xs input-bordered bg-white rounded"
          v-model="search"
        />
      </div>
      <table class="table table-xs">
        <!-- head -->
        <!-- show number of renter -->
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อค่าใช้จ่ายเพิ่มเติม</th>
            <th>ราคา</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fee, index) in computedRooms" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              {{ fee.feename }}
            </td>
            <td>{{ fee.feeprice }} บาท</td>
            <th>
              <Button
                btnType="ghost-pill"
                onclick="editFee.showModal()"
                @click="setEditingFee(fee._id)"
                >แก้ไข</Button
              >
              <!-- </router-link> -->
            </th>
          </tr>
        </tbody>
      </table>

      <!-- Modal -->
      <dialog :id="`editFee`" class="modal">
        <div class="modal-box space-y-2">
          <h3 class="font-bold text-lg">
            รายละเอียดค่าใช้จ่ายเพิ่มเติม : {{ editingFee.feePreviousName }}
          </h3>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label">
                <span class="text-base label-text">ชื่อห้อง </span>
              </label>
              <input
                type="text"
                placeholder="ชื่อห้อง"
                class="input input-bordered bg-white input-sm rounded-sm"
                v-model="editingFee.feename"
              />
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >ราคา <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="ราคา"
                class="input input-bordered bg-white input-sm rounded-sm"
                v-model="editingFee.feeprice"
              />
            </div>
          </div>

          <div class="modal-action flex">
            <form method="dialog">
              <button class="btn btn-sm mr-2" @click="resetEditingFee">ปิด</button>
              <button class="btn btn-sm btn-secondary" @click="updateFee">
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <div class="join">
        <button
          class="join-item btn btn-xs"
          :class="{ disabled: currentPage === 1 }"
          @click="changePage(currentPage - 1)"
        >
          &laquo;
        </button>

        <button
          class="join-item btn btn-xs"
          v-for="page in visiblePages"
          :key="page"
          :class="{ 'btn-active': page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button
          class="join-item btn btn-xs"
          :class="{ disabled: currentPage === totalPages }"
          @click="changePage(currentPage + 1)"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
