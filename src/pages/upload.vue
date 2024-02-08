<script setup>
// See https://vueuse.org/core/useFileDialog
import { useFileDialog } from '@vueuse/core';
import { ref as storageRef } from 'firebase/storage';
import { reactive, ref } from 'vue';
import { useFirebaseStorage, useStorageFile } from 'vuefire';

const storage = useFirebaseStorage();
const filename = ref('');
const { files, open, reset } = useFileDialog();
const uploadStatus = reactive({
  url: '',
  uploadProgress: 0,
  uploadError: null,
  uploadTask: null,
});

function uploadPicture() {
  const fileRef = storageRef(storage, files.value?.item(0).name);

  const {
    url,
    // gives you a percentage between 0 and 1 of the upload progress
    uploadProgress,
    uploadError,
    // firebase upload task
    uploadTask,
    upload,
  } = useStorageFile(fileRef);

  uploadStatus.uploadError = uploadError;
  uploadStatus.uploadProgress = uploadProgress;
  uploadStatus.uploadTask = uploadTask;
  uploadStatus.url = url;

  const data = files.value?.item(0);
  if (data) {
    upload(data);
  }
}
</script>

<template>
  <img v-if="uploadStatus.url" :src="uploadStatus.url" />
 {{ uploadStatus }}
  <form @submit.prevent="uploadPicture">
    <!-- disable the form while uploading -->
    <fieldset :disabled="!!uploadTask">
      <button
        type="button"
        @click="open({ accept: 'image/*', multiple: false })"
      >
        <template v-if="files?.length === 1">
          Selected file: {{ files.item(0).name }} (Click to select another)
        </template>
        <template v-else> Select one picture </template>
      </button>

      <br />

      <button>Upload</button>
    </fieldset>
  </form>
</template>
