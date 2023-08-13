<template>
  <div>
    <form class="mt">
      <div class="mt-4" v-for="(item, index) in sectionArray" :key="index">
        <b-row>
          <b-col cols="12" md="6">
            <label for="input-live">Header Name</label>
            <input
              v-model="item.headerName"
              class="form-control no-border"
              placeholder="Header Name"
          /></b-col>
        </b-row>
        <b-row class="mt-3">
          <b-col cols="12" md="6">
            <label for="input-live">Description</label>

            <quill-editor v-model="item.description"> </quill-editor
          ></b-col>
        </b-row>
      </div>
      <b-row class="mt-4" align-h="center">
        <b-col cols="12" md="6">
          <b-button
            @click="addSections"
            type="submit"
            size="sm"
            class="auth-btn mb-3"
            variant="warning"
            >Add More Section</b-button
          >
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col cols="12" md="6">
          <b-button
            @click="generateQrCode"
            type="submit"
            size="sm"
            class="auth-btn mb-3"
            variant="primary"
            >Generate Qr-Code</b-button
          >
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

export default {
  data() {
    return {
      sectionArray: [],
      headerArray: [],
    };
  },

  name: "Typography",
  components: { quillEditor },

  methods: {
    addSections() {
      let sectionObj = {
        headerName: "",
        description: "",
      };
      this.sectionArray.push(sectionObj);
    },
    generateQrCode() {
      console.log(this.sectionArray, "this.sectionArray");
    },
  },
};
</script>
