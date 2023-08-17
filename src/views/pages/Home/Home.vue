<template>
  <div>
    <!-- <div class="mb-1">
      <button class="AddNewButton" @click="$router.push({ name: 'createqr' })">
        Create New User QR
      </button>
    </div> -->
    <b-row>
      <b-col v-for="(item, index) in allUserList" :key="index" cols="12" md="3">
        <b-card no-body>
          <b-row
            v-for="(imgItem, imgIndex) in item.all_data"
            :key="imgIndex"
            v-if="imgItem.inputType == 'file'"
          >
            <b-col>
              <b-img
                v-if="imgItem.vModelValue"
                class="m-1"
                rounded="circle"
                fluid
                :src="BASE_URL + imgItem.vModelValue"
                alt="Image 1"
              ></b-img>
              <b-img
                v-else
                class="m-1"
                rounded="circle"
                fluid
                :src="imgAvtar"
                alt="Image 1"
              ></b-img>
            </b-col>
            <b-col>
              <qrcode-vue
                class="m-1"
                :size="qrSize"
                level="H"
                :value="qrValue + item.unique_code_generate"
              ></qrcode-vue>
            </b-col>
          </b-row>

          <b-list-group flush>
            <b-list-group-item
              v-for="(subItem, subIndex) in item.all_data"
              :key="subIndex"
              v-if="
                subItem.label == 'Full Name' ||
                subItem.label == 'Date of Birth' ||
                subItem.label == 'Gender'
              "
              >{{ subItem.label }} :
              {{ subItem.vModelValue }}</b-list-group-item
            >
          </b-list-group>

          <b-card-text> </b-card-text>
          <template #footer>
            <small
              @click="
                $router.push({
                  name: 'qrdetails',
                  query: { qrId: item.unique_code_generate },
                })
              "
              style="cursor: pointer"
              class="text-muted"
              >View Details</small
            >
            |
            <small
              style="cursor: pointer"
              class="text-muted"
              @click="onEdit(item.unique_code_generate)"
              >Edit</small
            >
          </template>
        </b-card>
      </b-col>
      <b-col cols="12" md="3">
        <button
          class="AddNewButton text-center"
          @click="$router.push({ name: 'createqr' })"
        >
          Create New User QR
        </button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BCardText,
  BButton,
  BCardFooter,
  BCardImg,
  BCardBody,
  BCardTitle,
  BCardSubTitle,
  BListGroup,
  BListGroupItem,
  BImg,
} from "bootstrap-vue";
import Ripple from "vue-ripple-directive";
import { GetAllUsers } from "@/apiServices/DashboardServices";
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BCardText,
    BButton,
    BCardFooter,
    BCardImg,
    BCardBody,
    BCardTitle,
    BCardSubTitle,
    BListGroup,
    BListGroupItem,
    BImg,
    QrcodeVue,
  },
  data() {
    return {
      allUserList: [],
      BASE_URL: process.env.VUE_APP_BASEURL,
      qrValue: null,
      qrSize: 100,
      imgAvtar: require("@/assets/images/avatars/user.png"),
    };
  },

  directives: {
    Ripple,
  },

  beforeMount() {
    this.qrValue = window.location.origin + "/";
    this.onGetAllUsers();
  },

  methods: {
    async onEdit(unique_code_generate) {
      this.$router.push({
        name: "createqr",
        query: { qrId: unique_code_generate },
      });
    },
    async onGetAllUsers() {
      this.allUserList = [];
      try {
        const response = await GetAllUsers({});

        if (response.data.status) {
          this.allUserList = response.data.Records.data;
        }
      } catch (err) {
        console.log("Error in GenerateQrCode ", err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.AddNewButton {
  display: inline-block;
  padding: 10px 15px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4caf50;
  border: none;
  border-radius: 15px;
}

.AddNewButton:hover {
  background-color: #3e8e41;
}

.AddNewButton:active {
  background-color: #3e8e41;
  // transform: translateY(4px);
}
</style>
