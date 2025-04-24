<template>
  <div>
    <b-row>
      <b-col md="10" offset-md="1" style="position:relative">
        <b-card border v-for="(item, index) in sectionArray" :key="index" bg-variant="border">
          <b-form-group :label="item.label" label-for="nested-street" label-cols-sm="3" label-align-sm="left" :class="errorCheckKeyValidation.filter((z) => z.key == item.key).length
            ? 'test'
            : ''
            ">
            <b-form-input class="mb-1" placeholder="Enter Label Name" v-if="item.is_additional" v-model="item.label"
              id="nested-street"></b-form-input>

            <b-form-input :placeholder="item.label" v-if="item.inputType == 'text'" v-model="item.vModelValue"
              id="nested-street"></b-form-input>

            <v-select :placeholder="item.label" v-if="item.inputType == 'select'" v-model="item.vModelValue"
              :options="item.selectOptions" :clearable="false" />
            <b-form-file @input="onFileUpload(item, index)" v-if="item.inputType == 'file'" v-model="item.vModelValue"
              placeholder="Choose a file or drop it here..." drop-placeholder="Drop file here..."></b-form-file>

            <flat-pickr v-if="item.inputType == 'date'" v-model="item.vModelValue" :placeholder="item.label" :config="{
              ...$flatPickrConfig,
            }" class="form-control" />

            <quill-editor v-if="item.inputType == 'quill'" v-model="item.vModelValue">
            </quill-editor>
          </b-form-group>
          <h6 class="error" v-if="
            isSubmitted &&
            !item.vModelValue &&
            errorCheckKeyValidation.filter((z) => z.key == item.key).length
          ">
            {{
              errorCheckKeyValidation.filter((z) => z.key == item.key)[0]
                .errorMessage
            }}
          </h6>
          <div v-if="DocumentArray && DocumentArray.length && item.key=='document'" >
              <div class="mt-1" v-for="(item2, index2) in DocumentArray" :key="index2">
                <div class="text-right" @click="removeImage(index2)"> <feather-icon
                        class="cursor-pointer"
                        icon="DeleteIcon"
                        size="20"
                      /></div>
               <div><b-form-input v-model="item2.name" placeholder="Image Title"></b-form-input></div>
             
               <div><img :src="BASE_URL + item2.path" /></div>
            </div>
          </div> 
        </b-card>
        
         
        <b-button size="sm" variant="warning " @click="onAddMoreFields">
          Add More Fields
        </b-button>
      <div  style="position:fixed;top:15%;left:95%;z-index: 9999999;" >
        <b-button
          v-b-tooltip.hover.v-primary.top="'Save Details'"
          variant="primary"
          class="btn-icon rounded-circle"
          @click="onGenerateQrCode" 
      >
      <feather-icon icon="SaveIcon" size="16" />
      </b-button>

      </div>
       


        <b-button block class="mt-3 mb-3" variant="primary "   @click="onGenerateQrCode" >
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
  BFormFile,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import flatPickr from "vue-flatpickr-component";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import ToastificationContentVue from "@core/components/toastification/ToastificationContent.vue";
import axios from "axios";

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
    BFormFile,
  },
  data() {
    return {
      sectionArray: [],
      unique_code_generate: this.$route.query.qrId,
      BASE_URL: process.env.VUE_APP_BASEURL,
      errorCheckKeyValidation: [],
      isSubmitted: false,
      errorMessage: false,
      DocumentArray:[]
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
    removeImage(index){
    this.DocumentArray.splice(index,1)
    },
    checkValidation() {
      let checkValidation = true;
      this.errorCheckKeyValidation.map((z) => {
        let findInd = this.sectionArray.findIndex((_s) => {
          return _s.key == z.key;
        });
        if (findInd >= 0) {
          if (!this.sectionArray[findInd].vModelValue) {
            checkValidation = false;
          }
        }
      });
      console.log(checkValidation, "checkValidation");
      return checkValidation;
    },
    async onFileUpload(item, index) {
      this.loading = true;
      try {
        const url = this.BASE_URL + "/admin/uploadimage";
        const formData = new FormData();
        formData.append("image", item.vModelValue);
        const config = {
          headers: {
            "content-type": "multipart/form-data",
            authorization: localStorage.getItem("access_token"),
            "x-access-token": localStorage.getItem("access_token"),
          },
        };
        const response = await axios.post(url, formData, config);
        if (response.data.message) {
          if (item.key == 'document') {
            console.log( this.sectionArray[index])
            this.DocumentArray.unshift({
              name: "",
              path: response.data.path,
              key:item.key
            });
          } else {
            this.sectionArray[index].vModelValue = response.data.path;

          }
        }
        this.loading = false;
      } catch (err) {
        this.loading = false;
        console.log("Error in UploadFile ", err);
      }
    },
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
            let checkDocumentKey=this.sectionArray.findIndex(z=>{
            return z.key=='document'
          })
            this.DocumentArray =  this.sectionArray[checkDocumentKey].vModelValue
          } else {
            this.sectionArray = response.data.defaultFieldsArray;
          }
          this.errorCheckKeyValidation =
            response.data.errorCheckKeyValidation || [];
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
        this.isSubmitted = true;
        if (this.checkValidation()) {
          let checkDocumentKey=this.sectionArray.findIndex(z=>{
            return z.key=='document'
          })
           
         this.sectionArray[checkDocumentKey].vModelValue = this.DocumentArray

          console.log({checkDocumentKey})
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
        } else {
          this.$toast({
            component: ToastificationContentVue,
            props: {
              title: "Please Fill the * details",
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

.error {
  color: red;
}

.test::before {
  content: "*";
  color: red;
}
</style>
