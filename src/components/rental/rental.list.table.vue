<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, onMounted, reactive, ref } from 'vue';

const props = defineProps({
  rentals: {
    type: Array,
    default: () => [],
  },
});

const currentPage = ref(1);
const perPage = ref(5);

const computedRentals = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.rentals.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.rentals.length / perPage.value);
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
    <p class="text-base" v-if="!props.rentals.length">No rental</p>
    <div v-else>
      <!-- show number of rental -->
      <p class="text-xs text-gray-500">
        Total: {{ props.rentals.length }} rentals
      </p>

      <table class="table table-xs">
        <!-- head -->
        <!-- show number of rental -->
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Active</th>
            <th>Copy Of ID Card</th>
            <th>Rental contract</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(rental, index) in computedRentals" :key="index">
            <td>
              {{ rental.index + 1 }}
            </td>
            <td class="">
              <span> {{ rental.firstname }} {{ rental.lastname }}</span>
            </td>
            <td>
              {{ rental.email }}
            </td>
            <td>{{ rental.phone }}</td>
            <td>
              <Badge v-if="rental.isActive" type="success">Active</Badge>
              <Badge v-else type="error">Deactive</Badge>
            </td>
            <td>
              <div v-if="rental.copyOfIdCard" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: rental.copyOfIdCard,
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
              <div v-if="rental.rentalContract" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: rental.rentalContract,
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
            <td>{{ rental.created_at }}</td>
            <td>{{ rental.updated_at }}</td>
            <th>
              <router-link
                :to="{
                  name: 'update-rental',
                  params: {
                    rentalId: rental._id,
                  },
                }"
              >
                <Button btnType="ghost-pill">Edit</Button>
              </router-link>
            </th>
          </tr>
        </tbody>
      </table>
    </div>

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
</template>

<style scoped></style>
