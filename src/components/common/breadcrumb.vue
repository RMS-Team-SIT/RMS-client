<script setup>
const props = defineProps({
  pathList: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li v-for="(val, index) in props.pathList" :key="index">
        <router-link
          :to="{ name: val.pathName, params: val.params }"
          v-if="val.pathName"
        >
          <p>{{ val.name }}</p>
        </router-link>
        <p v-else>{{ val.name }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
