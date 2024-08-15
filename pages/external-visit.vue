<template>

    <!-- VERFICATION -->
    <div style="display: flex; justify-content: center;">
      <div class="team-card">
        <div class="team-card__title">Send Verification Token</div>
        <div class="mt-2">
          <div class="justify-between align-center">
            <div v-show="!showVerifyMeButton" class="justify-between align-center pl-2 pr-2">
              <bib-button size="lg" :label="$t('profile.sendVerificationToken')" variant="primary-24--outline" pill  @click="triggerSendVerificationToken"></bib-button>
            </div>
          </div>
          <div v-show="showVerifyMeButton" class="align-center justify-between pt-1 pl-2 pr-2">
            <bib-input
              class="pr-2"
              type="text"
              v-model="verificationCode"
              required>
            </bib-input>
            <bib-button size="lg" :label="$t('profile.verifyMe')" variant="primary-24" pill @click="triggerRedirectBack"></bib-button>
          </div>
          <div class="separator mt-2"></div>
        </div>
      </div>
    </div>


</template>

<script>
import axios from "axios";
import { setCookiesFromObj } from "../assets/utils/cookies";

export default {
  layout: "default",
  props: ["global"],
  data () {
    return {
      showVerifyMeButton: false,
      verificationCode: "",
      ssojwt: ""
    }
  },
  methods: {
    async triggerSendVerificationToken() {
      await axios.post(`https://dev-api.business-in-a-box.com/auth/sendCode`, {
        Email: this.$route.query.email,
        Language: "en"
      })
        .then((res) => {
          this.showVerifyMeButton = true
        })
        .catch((err) => {
          console.error('Send Email failed: ', err.response && err.response.data || err)
        });
    },
    async triggerRedirectBack() {
      if (!this.verificationCode) {
        window.alert("Please input your verification number");
        return;
      }
      await axios.post(`https://dev-api.business-in-a-box.com/auth/authCode`, {
        Email: this.$route.query.email,
        Token: this.verificationCode
      })
        .then((res) => {
          this.ssojwt = res.data.ssojwt;
        })
        .catch((err) => {
          console.error('Verification Token doesn"t match: ', err.response && err.response.data || err)
          return;
        })
      
      if (this.ssojwt) {
        const request = axios.create({
          headers: {
            Authorization: `Bearer ${this.ssojwt}`
          }
        })
        await request.get(`https://dev-api.business-in-a-box.com/auth/authSSOToken`)
          .then((res) => {
            setCookiesFromObj({b_ssojwt_ext: this.ssojwt})
            window.open(`${this.$route.query.redirect}`, '_blank')
          })
          .catch((err) => {
            console.error('SSO token doesn"t match: ', err.response && err.response.data || err)
          })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.team-card {
  position: relative;
  @include flex-align;
  // @include flex-justify;
  margin-top: 10%;
  padding: 30px 0px;
  flex-direction: column;
  width: 30%;
  border: 1px solid black;
  height: var(--background-height);
  background: var(--background-color);
  border-radius: calc(var(--background-height) / 32);
  cursor: pointer;
  overflow: hidden;

  &-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 8px;

  }

  &__title {
    font-size: 15px;
    font-weight: bold;

    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtitle {
    font-size: 13px;
    text-align: center;
    width: calc(100% - 32px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:active {
   // transform: scale(0.98);
  }
}
</style>
