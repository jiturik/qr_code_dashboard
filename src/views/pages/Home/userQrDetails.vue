<template>
  <div>
    <b-row>
      <b-col md="10" offset-md="1">
        <div>
          <div>
            <div class="panel panel-info">
              <div class="panel-heading m-2">
                <h3 class="panel-title text-center"><b>Profile</b></h3>
              </div>
              <div>
                <div>
                  <div>
                    <table class="table">
                      <tbody>
                        <tr
                          v-for="(item, index) in userDetailsArray"
                          :key="index"
                        >
                          <td>{{ item.label }} :</td>
                          <td>
                            <!-- <div
                              style="width: 20px !important; display: block"
                              v-if="
                                item.inputType == 'quill' &&
                                item.label == 'Profile'
                              "
                              v-html="item.vModelValue"
                            ></div> -->
                            <div
                              v-if="item.inputType == 'quill'"
                              v-html="item.vModelValue"
                            ></div>
                            <div v-else>{{ item.vModelValue }}</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton, BImg, BRow, BCol } from "bootstrap-vue";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import { GetUserQrDetails } from "@/apiServices/DashboardServices";
import ToastificationContentVue from "@core/components/toastification/ToastificationContent.vue";

export default {
  components: {
    VuexyLogo,
    BLink,
    BButton,
    BImg,
    BRow,
    BCol,
  },
  data() {
    return {
      unique_code_generate: this.$route.query.qrId,
      userDetailsArray: [],
    };
  },
  computed: {},

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
            this.userDetailsArray = response.data.Records.data[0].all_data;
          } else {
            //this.sectionArray = response.data.defaultFieldsArray;
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
  },
};
</script>

<style lang="scss" scoped>
@import "@core/scss/vue/pages/page-misc.scss";
.panel {
  border: 4px solid grey;
  border-radius: 15px;
}
.user-row {
  margin-bottom: 14px;
}

.user-row:last-child {
  margin-bottom: 0;
}

.dropdown-user {
  margin: 13px 0;
  padding: 5px;
  height: 100%;
}

.dropdown-user:hover {
  cursor: pointer;
}

.table-user-information > tbody > tr {
  border-top: 1px solid rgb(221, 221, 221);
}

.table-user-information > tbody > tr:first-child {
  border-top: 0;
}

.table-user-information > tbody > tr > td {
  border-top: 0;
}
.toppad {
  margin-top: 20px;
}
</style>
