<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';

const props = defineProps({
  renters: {
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
const perPage = ref(5);
const { notify } = useNotification();

const computedrenters = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.renters.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.renters.length / perPage.value);
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
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base" v-if="!props.renters.length">No renter</p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        Total: {{ props.renters.length }} renters
      </p>

      <table class="table table-xs">
        <!-- head -->
        <!-- show number of renter -->
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Phone</th>
            <th>Active</th>
            <th>Current Room</th>
            <th>Copy Of ID Card</th>
            <th>Renter contract</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(renter, index) in computedrenters" :key="index">
            <td>
              {{ renter.index + 1 }}
            </td>
            <td class="">
              <span> {{ renter.firstname }} {{ renter.lastname }}</span>
            </td>
            <td>
              {{ renter.username }}
            </td>
            <td>{{ renter.phone }}</td>
            <td>
              <Badge v-if="renter.isActive" badgeType="success">Active</Badge>
              <Badge v-else badgeType="error">Deactive</Badge>
            </td>
            <td>
              <div v-if="renter.room" class="underline">
                <router-link
                  :to="{
                    name: 'update-room',
                    params: {
                      roomId: renter.room._id,
                      residenceId: residenceId,
                    },
                  }"
                >
                  {{ renter.room.name }}
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">No Room</span>
              </div>
            </td>
            <td>
              <div v-if="renter.copyOfIdCard" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.copyOfIdCard,
                    },
                  }"
                >
                  Preview
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">No file</span>
              </div>
            </td>
            <td>
              <div v-if="renter.renterContract" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.renterContract,
                    },
                  }"
                >
                  Preview
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">No file</span>
              </div>
            </td>
            <td>{{ renter.created_at }}</td>
            <td>{{ renter.updated_at }}</td>
            <th>
              <router-link
                :to="{
                  name: 'update-renter',
                  params: {
                    renterId: renter._id,
                  },
                }"
              >
                <Button btnType="ghost-pill">Edit</Button>
              </router-link>
            </th>
          </tr>
        </tbody>
      </table>

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