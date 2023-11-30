<script setup>
import FileService from '@/services/FileService';
import { isImage } from '@/utils';
import { reactive, ref } from 'vue';

const fileInputTemp = ref(null);
const images = ref([]);
const outputfilename = ref(null);

const handleFileChange = () => {
  const fileTemp = fileInputTemp.value;
  const files = fileTemp.files;
  if (files.length > 0) {
    saveFileToState(files);
  }
};

const saveFileToState = (files) => {
  Array.from(files).forEach((file) => {
    if (isImage(file)) {
      images.value.push(file);
    }
  });
};

const submit = async () => {
  console.log(images.value);
  if (images.value.length > 0) {
    const response = await FileService.uploadImage(images.value[0]);
    console.log(response);
    const data = await response.json();
    console.log(data);
    outputfilename.value = data.filename;
  }
};
const getFile = async (filename) => {
  return FileService.getFile(filename);
};
</script>

<template>
  <form @submit.prevent="submit" method="post">
    {{ images }}
    <input type="file" ref="fileInputTemp" @change="handleFileChange" id="" />
    <button type="submit">submit</button>
  </form>
  <img src="http://localhost:3000/upload/image-1701246401740-906541029.png" />
</template>

<style scoped></style>
