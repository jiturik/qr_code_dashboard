<template>
  <div>
    <b-row>
      <b-col md="10" offset-md="1">
        <b-card
          border
          v-for="(item, index) in sectionArray"
          :key="index"
          bg-variant="border"
        >
          <b-form-group
            :label="item.label"
            label-for="nested-street"
            label-cols-sm="3"
            label-align-sm="left"
          >
            <b-form-input
              class="mb-1"
              placeholder="Enter Label Name"
              v-if="item.is_additional"
              v-model="item.label"
              id="nested-street"
            ></b-form-input>
            <b-form-input
              :placeholder="item.label"
              v-if="item.inputType == 'text'"
              v-model="item.vModelValue"
              id="nested-street"
            ></b-form-input>

            <v-select
              :placeholder="item.label"
              v-if="item.inputType == 'select'"
              v-model="item.vModelValue"
              :options="item.selectOptions"
              :clearable="false"
            />

            <flat-pickr
              v-if="item.inputType == 'date'"
              v-model="item.vModelValue"
              :placeholder="item.label"
              :config="{
                ...$flatPickrConfig,
              }"
              class="form-control"
            />

            <quill-editor
              v-if="item.inputType == 'quill'"
              v-model="item.vModelValue"
            >
            </quill-editor>
          </b-form-group>
        </b-card>

        <b-button size="sm" variant="warning " @click="onAddMoreFields">
          Add More Fields
        </b-button>

        <b-button
          block
          class="mt-3 mb-3"
          variant="primary "
          @click="onGenerateQrCode"
        >
          {{ unique_code_generate ? "Update Details" : " Generate QR Code" }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  GenerateQrCode,
  GetUserQrDetails,
} from "@/apiServices/DashboardServices";
import {
  BCard,
  BRow,
  BCol,
  BCardText,
  BButton,
  BFormGroup,
  BFormInput,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ToastificationContentVue from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BCardText,
    BButton,
    BFormGroup,
    BFormInput,
    vSelect,
    flatPickr,
    quillEditor,
    ToastificationContentVue,
  },
  data() {
    return {
      sectionArray: [],
      unique_code_generate: this.$route.query.qrId,
    };
  },

  directives: {
    Ripple,
  },

  beforeMount() {
    this.unique_code_generate = this.$route.query.qrId;
    this.onGetUserQRDetails();
  },

  methods: {
    async onGetUserQRDetails() {
      try {
        const response = await GetUserQrDetails({
          unique_code_generate: this.unique_code_generate,
        });
        if (response.data.status) {
          if (
            response.data.Records &&
            response.data.Records.data &&
            response.data.Records.data.length
          ) {
            this.sectionArray = response.data.Records.data[0].all_data;
          } else {
            this.sectionArray = response.data.defaultFieldsArray;
          }
        } else {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: response.data.message,
              icon: "EditIcon",
              variant: "danger",
            },
          });
        }
      } catch (err) {
        console.log("Error in GetUserQrDetails ", err);
      }
    },
    onAddMoreFields() {
      let fieldObj = {
        label: "",
        inputType: "quill",
        vModelValue: "",
        is_additional: true,
      };
      this.sectionArray.push(fieldObj);
    },

    async onGenerateQrCode() {
      try {
        const response = await GenerateQrCode({
          all_data: JSON.stringify(this.sectionArray),
          unique_code_generate: this.unique_code_generate,
        });

        if (response.data.status) {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: response.data.message,
              icon: "EditIcon",
              variant: "primary",
            },
          });

          this.$router.push({ name: "home" });
        } else {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: response.data.message,
              icon: "EditIcon",
              variant: "danger",
            },
          });
        }
      } catch (err) {
        console.log("Error in GenerateQrCode ", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@core/scss/vue/libs/vue-flatpicker.scss";
</style>
