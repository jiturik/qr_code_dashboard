<template>
  <div class="wrapper">
    <div class="profile-card js-profile-card">
      <div class="profile-card__img">
        <img
          v-for="(imgItem, imgIndex) in userDetailsArray"
          :key="imgIndex"
          v-if="imgItem.key == 'photo' && imgItem.vModelValue"
          :src="BASE_URL + imgItem.vModelValue"
          alt="profile card"
        />
        <img :src="imgAvtar" alt="Image 1" v-else-if="imgItem.key == 'photo'" />
      </div>

      <div class="profile-card__cnt js-profile-cnt scrollDiv">
        <div v-for="(imgItem1, imgIndex1) in userDetailsArray" :key="imgIndex1">
          <div v-if="imgItem1.key == 'name'" class="profile-card__name">
            {{ imgItem1.vModelValue }}
          </div>

          <div class="profile-card-loc">
            <span v-if="imgItem1.key == 'dob'" class="profile-card-loc__txt">
              DOB : {{ moment(imgItem1.vModelValue).format("DD MMM YYYY") }}
            </span>
            <span v-if="imgItem1.key == 'gender'" class="profile-card-loc__txt">
              Gender : {{ imgItem1.vModelValue }}
            </span>
          </div>
        </div>
        <table class="table mt-1">
          <tbody>
            <tr
              v-for="(item, index) in userDetailsArray"
              :key="index"
              v-if="
                item.key != 'photo' &&
                item.key != 'name' &&
                item.key != 'dob' &&
                item.key != 'gender'
              "
            >
              <td
                align="left"
                style="text-align: left"
               v-if="!['photo', 'document'].includes(item.key)"
              >
                <b class="text-muted" style=""> {{ item.label }} </b><br />
                <div
                  style="text-align: left"
                  v-if="item.inputType == 'quill'"
                  v-html="item.vModelValue ? item.vModelValue : '-'"
                ></div>
                <div style="text-align: left" v-else>
                  {{ item.vModelValue || "-" }}
                </div>
              </td>
              <td v-else-if="['document'].includes(item.key)">
                            <b class="text-muted"> {{ item.label }}: </b><br />
                            <div v-if="item.vModelValue && item.vModelValue.length " class="image-group" v-viewer>
                              <div class="mt-1 " v-for="(item2, index2) in item.vModelValue" :key="index2"  >
                                <div v-if="item2.name" style="font-weight:bold">{{ item2.name }}</div>
                                <div class="mt=1"><img :src="BASE_URL + item2.path" /></div>
                              </div>
                            </div>

                          </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton, BImg, BRow, BCol } from "bootstrap-vue";
import VuexyLogo from "@core/layouts/components/Logo.vue";
import { GetUserQrDetails } from "@/apiServices/DashboardServices";
import ToastificationContentVue from "@core/components/toastification/ToastificationContent.vue";
import QrcodeVue from "qrcode.vue";
import moment from "moment";

export default {
  components: {
    VuexyLogo,
    BLink,
    BButton,
    BImg,
    BRow,
    BCol,
    QrcodeVue,
  },
  data() {
    return {
      unique_code_generate: this.$route.query.qrId,
      userDetailsArray: [],
      BASE_URL: process.env.VUE_APP_BASEURL,
      qrValue: null,
      qrSize: 100,
      imgAvtar: require("@/assets/images/avatars/user.png"),
    };
  },
  computed: {},

  beforeMount() {
    this.qrValue = window.location.origin + "/afterscan/";
    this.unique_code_generate = this.$route.query.qrId;
    this.onGetUserQRDetails();
  },
  methods: {
    moment,
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
            this.userDetailsArray.map(z=>{
              if(z.key=='document'){
                z["vModelValue"] = z.vModelValue.reverse()
              }
            })
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
@import url("https://fonts.googleapis.com/css?family=Quicksand:400,500,700&subset=latin-ext");

html {
  position: relative;
  overflow-x: hidden !important;
}

* {
  box-sizing: border-box;
}

body {
  font-family: "Quicksand", sans-serif;
  color: #324e63;
}

a,
a:hover {
  text-decoration: none;
}

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
}

.wrapper {
  width: 100%;
  width: 100%;
  height: auto;
  min-height: 100vh;
  padding: 50px 20px;
  padding-top: 100px;
  display: flex;
  background-image: linear-gradient(-20deg, #ff2846 0%, #6944ff 100%);

  display: flex;
  background-image: linear-gradient(-20deg, #ff2846 0%, #6944ff 100%);

  @media screen and (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding-top: 100px;
  }
}

.profile-card-loc[data-v-df818c68] {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px !important;
  font-weight: 400 !important;
}

.profile-card {
  width: 100%;
  min-height: 460px;
  margin: auto;
  box-shadow: 0px 8px 60px -10px rgba(13, 28, 39, 0.6);
  background: #fff;
  border-radius: 12px;
  max-width: 100%;
  position: relative;

  &.active {
    .profile-card__cnt {
      filter: blur(6px);
    }

    .profile-card-message,
    .profile-card__overlay {
      opacity: 1;
      pointer-events: auto;
      transition-delay: 0.1s;
    }

    .profile-card-form {
      transform: none;
      transition-delay: 0.1s;
    }
  }

  &__img {
    width: 150px;
    height: 150px;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(-50%);
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    z-index: 4;
    box-shadow: 0px 5px 50px 0px rgb(108, 68, 252),
      0px 0px 0px 7px rgba(107, 74, 255, 0.5);

    @media screen and (max-width: 576px) {
      width: 120px;
      height: 120px;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  &__cnt {
    margin-top: -35px;
    text-align: center;
    padding: 0 20px;
    padding-bottom: 40px;
    transition: all 0.3s;
  }

  &__name {
    font-weight: 700;
    font-size: 24px;
    color: #6944ff;
    margin-bottom: 15px;
  }

  &__txt {
    font-size: 18px;
    font-weight: 500;
    color: #324e63;
    margin-bottom: 15px;

    strong {
      //color: #ff2846;
      font-weight: 700;
    }
  }

  &-loc {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 600;

    &__icon {
      display: inline-flex;
      font-size: 27px;
      margin-right: 10px;
      //color: #6944ff;
    }
  }

  &-inf {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: 35px;

    &__item {
      padding: 10px 35px;
      min-width: 150px;

      @media screen and (max-width: 768px) {
        padding: 10px 20px;
        min-width: 120px;
      }
    }

    &__title {
      font-weight: 700;
      font-size: 27px;
      //color: #6944ff;
      color: #324e63;
    }

    &__txt {
      font-weight: 500;
      margin-top: 7px;
    }
  }

  &-social {
    margin-top: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    &__item {
      display: inline-flex;
      width: 55px;
      height: 55px;
      margin: 15px;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: #405de6;
      box-shadow: 0px 7px 30px rgba(43, 98, 169, 0.5);
      position: relative;
      font-size: 21px;
      flex-shrink: 0;
      transition: all 0.3s;

      @media screen and (max-width: 768px) {
        width: 50px;
        height: 50px;
        margin: 10px;
      }

      @media screen and (min-width: 768px) {
        &:hover {
          transform: scale(1.2);
        }
      }

      &.facebook {
        background: linear-gradient(45deg, #3b5998, #0078d7);
        box-shadow: 0px 4px 30px rgba(43, 98, 169, 0.5);
      }

      &.twitter {
        background: linear-gradient(45deg, #1da1f2, #0e71c8);
        box-shadow: 0px 4px 30px rgba(19, 127, 212, 0.7);
      }

      &.instagram {
        background: linear-gradient(
          45deg,
          #405de6,
          #5851db,
          #833ab4,
          #c13584,
          #e1306c,
          #fd1d1d
        );
        box-shadow: 0px 4px 30px rgba(120, 64, 190, 0.6);
      }

      &.behance {
        background: linear-gradient(45deg, #1769ff, #213fca);
        box-shadow: 0px 4px 30px rgba(27, 86, 231, 0.7);
      }

      &.github {
        background: linear-gradient(45deg, #333333, #626b73);
        box-shadow: 0px 4px 30px rgba(63, 65, 67, 0.6);
      }

      &.codepen {
        background: linear-gradient(45deg, #324e63, #414447);
        box-shadow: 0px 4px 30px rgba(55, 75, 90, 0.6);
      }

      &.link {
        background: linear-gradient(45deg, #d5135a, #f05924);
        box-shadow: 0px 4px 30px rgba(223, 45, 70, 0.6);
      }
    }

    .icon-font {
      display: inline-flex;
    }
  }

  &-ctr {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;

    @media screen and (max-width: 576px) {
      flex-wrap: wrap;
    }
  }

  &__button {
    background: none;
    border: none;
    font-family: "Quicksand", sans-serif;
    font-weight: 700;
    font-size: 19px;
    margin: 15px 35px;
    padding: 15px 40px;
    min-width: 201px;
    border-radius: 50px;
    min-height: 55px;
    color: #fff;
    cursor: pointer;
    backface-visibility: hidden;
    transition: all 0.3s;

    @media screen and (max-width: 768px) {
      min-width: 170px;
      margin: 15px 25px;
    }

    @media screen and (max-width: 576px) {
      min-width: inherit;
      margin: 0;
      margin-bottom: 16px;
      width: 100%;
      max-width: 300px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &:focus {
      outline: none !important;
    }

    @media screen and (min-width: 768px) {
      &:hover {
        transform: translateY(-5px);
      }
    }

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    &.button--blue {
      background: linear-gradient(45deg, #1da1f2, #0e71c8);
      box-shadow: 0px 4px 30px rgba(19, 127, 212, 0.4);

      &:hover {
        box-shadow: 0px 7px 30px rgba(19, 127, 212, 0.75);
      }
    }

    &.button--orange {
      background: linear-gradient(45deg, #d5135a, #f05924);
      box-shadow: 0px 4px 30px rgba(223, 45, 70, 0.35);

      &:hover {
        box-shadow: 0px 7px 30px rgba(223, 45, 70, 0.75);
      }
    }

    &.button--gray {
      box-shadow: none;
      background: #dcdcdc;
      color: #142029;
    }
  }

  &-message {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 130px;
    padding-bottom: 100px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
  }

  &-form {
    box-shadow: 0 4px 30px rgba(15, 22, 56, 0.35);
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    background: #fff;
    border-radius: 10px;
    padding: 35px;
    transform: scale(0.8);
    position: relative;
    z-index: 3;
    transition: all 0.3s;

    @media screen and (max-width: 768px) {
      max-width: 90%;
      height: auto;
    }

    @media screen and (max-width: 576px) {
      padding: 20px;
    }

    &__bottom {
      justify-content: space-between;
      display: flex;

      @media screen and (max-width: 576px) {
        flex-wrap: wrap;
      }
    }
  }

  textarea {
    width: 100%;
    resize: none;
    height: 210px;
    margin-bottom: 20px;
    border: 2px solid #dcdcdc;
    border-radius: 10px;
    padding: 15px 20px;
    color: #324e63;
    font-weight: 500;
    font-family: "Quicksand", sans-serif;
    outline: none;
    transition: all 0.3s;

    &:focus {
      outline: none;
      border-color: #8a979e;
    }
  }

  &__overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    background: rgba(22, 33, 72, 0.35);
    border-radius: 12px;
    transition: all 0.3s;
  }
}
</style>
