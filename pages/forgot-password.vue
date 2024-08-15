<template>
    <div class="login">
      <!-- NOTIFICATIONS -->
      <template v-if="$store.state.notification.isShow">
        <bib-notification-persistent @dismiss="$store.dispatch('notification/set', [false, '', ''])" :label="$store.state.notification.text" :variant="$store.state.notification.variant"></bib-notification-persistent>
      </template>
      <Header />
      <HeaderLine :formType="formType" />
  
      <div v-if="failedText" class="font-w-600 text-danger bg-danger-sub3 text-center mt-2 mr-1 ml-1 p-1 shape-sharp">
        {{failedText}}
      </div>
  
      <div v-if="successText" class="font-w-600 text-success bg-success-sub3 text-center mt-2 mr-1 ml-1 p-1 shape-sharp">
        {{successText}}
      </div>
  
      <div v-if="!successText" class="login__container">
        <!-- FORM -->
        <form @submit.prevent="submit" class="login__container-content">
          <div class="p-2 pt-05 pb-05">
            <!-- Email -->
            <div v-if="formType == 'reset_password'" class="fieldset">
              <label>{{$t('loginView.emailAccessToAccount')}}<strong>*</strong></label>
              <bib-input
                type="email"
                v-model="email"
                name="email"
                variant="light"
                :placeholder="$t('common.emailAddress')"
                required
                test_id="input_email"
              />
            </div>
          </div>
  
          <div v-if="formType === 'reset_password_sent'" class="p-2 pt-05 pb-05 border-bottom-light text-center">
            <div class="font-w-700 font-md mb-1">{{ $t("loginView.pleaseCheckYourEmail") }}</div>
            <div class="font-w-500 font-md">{{ $t("loginView.instructionsToUpdatePass") }}</div>
          </div>
  
          <!-- Submit button -->
          <div v-if="formType !== 'reset_password_sent'" class="p-2 pt-1 pb-1 border-top-light border-bottom-light">
            <bib-button type="submit" size="lg" variant="primary-24" class="w-100 mt-025 mb-025" test_id="btn_submit">
              <template slot="button">
                <template v-if="formType == 'signin'">{{ $t("common.signIn") }}</template>
                <template v-if="formType == 'register'">{{ $t("common.createAccount") }}</template>
                <template v-if="formType == 'reset_password'">{{ $t("common.resetPassword") }}</template>
                <template v-if="formType == 'verify_email'">{{ $t("common.submit") }}</template>
              </template>
            </bib-button>
          </div>
  
          <!-- FOOTER  -->
          <div class="bottom-part p-2 pt-1 pb-1 mt-05 mb-05 text-center" :class="'justify-between'">
            <div v-if="formType == 'reset_password'" class="bottom-part__row">
              <span class="link" @click="setFormType('signin')">{{ $t("common.login") }}</span>
            </div>
            <div v-if="formType == 'reset_password'" class="bottom-part__row">
              <span class="link" @click="setFormType('register')">{{ $t("common.createAnAccount") }}</span>
            </div>
  
            <div v-if="formType == 'reset_password_sent'" class="bottom-part__row ml-auto mr-auto">
              <span class="link" @click="setFormType('signin')">{{ $t("common.clickHereToSignIn") }}</span>
            </div>
          </div>
        </form>
      </div>
  
      <div v-if="loadingSpinner" class="loading-mask">
        <div class="loading-wrapper">
          <bib-spinner variant="primary-24"></bib-spinner>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { getAllCookies } from "~/assets/utils/cookies";
  import { sendResetLink, verifyToken } from "~/model/user";
  import HeaderLine from '../components/HeaderLine.vue';
  const FORGOT_TITLE = "Retrieve Password | Business in a Box";
  const LANG_CODE = getAllCookies()[process.env.LANG_COOKIE_NAME] || 'en'
  export default {
    components: { HeaderLine },
    head() {
      return {
        title: this.headTitle
      }
    },
    data: () => ({
      headTitle: FORGOT_TITLE,
      formType: null,
      email: null,
      full_name: null,
      firstName: '',
      lastName: '',
      password: null,
      confirmPassword: null,
      keepIn: true,
      verify_email: null,
      verify_code: null,
      loadingSpinner: false,
      redirectURL: '',
      failedText: '',
      successText: ''
    }),
    computed: {
      isPasswordValidate () {
        return this.password ? this.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&^()_+=~]{8,}$/) : true;
      },
      isMatchingPassword () {
        return (this.password && this.confirmPassword) ? this.password === this.confirmPassword : true
      },
      termsOfUseLink() {
        if (LANG_CODE === 'en') {
          return "https://www.business-in-a-box.com/company/terms-of-use/"
        } else {
          return `https://www.business-in-a-box.com/${LANG_CODE}/company/terms-of-use/`
        }
      },
      privacyPolicyLink() {
        if (LANG_CODE === 'en') {
          return "https://www.business-in-a-box.com/company/privacy-policy/"
        } else {
          return `https://www.business-in-a-box.com/${LANG_CODE}/company/privacy-policy/`
        }
      },
    },
    async created() {
      this.redirectURL = this.$route.query.redirect
      const token = this.$store.state.token
      if (token) {
        this.loadingSpinner = true;
        this.checkTokenValidity(token);
      }
    },
    async mounted() {
      this.formType = this.$route.query.state?.toLowerCase() || "reset_password"
      await this.$store.dispatch('notification/set', [false, '', ''])
    },
    methods: {
      async checkTokenValidity(token) {
        const decodedToken = await verifyToken({ token: token });
        if (decodedToken.code === 'valid_token') {
          if (this.redirectURL) {
            window.location.href = this.redirectURL;
          } else {
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/my_profile");
          }
        } else {
          this.loadingSpinner = false;
        }
      },
      setFormType (type) {
        this.formType = type
        this.email = ''
        this.password = ''
        this.confirmPassword = ''
        this.firstName = ''
        this.lastName = ''
        this.failedText = ''
        this.successText = ''
        switch(type) {
          case 'register':
            this.$router.push('/create-account')
            break
          case 'signin':
            this.$router.push('/login')
            break
          case 'reset_password':
            this.headTitle = FORGOT_TITLE
            break
        }
      },
      
      submit() {
        this.failedText = ''
        this.loadingSpinner = true
        if (this.formType === "reset_password") {
          sendResetLink(this.email, { Language: LANG_CODE }).then((resp) => {
            this.loadingSpinner = false
            if (resp.err) {
              this.failedText = this.$t("loginView.invalidEmailContactAdministrator")
            } else {
              this.formType = 'reset_password_sent'
            }
          });
        }
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .login {
    height: 100vh;
    background: $background-dark;
  
    &__container {
      @include flex-align;
      flex-direction: column;
  
      &-content {
        margin: 2.2rem;
        width: 100%;
        max-width: 30rem;
        height: auto;
        // padding: 32px;
        // padding-bottom: 30px;
        background: $background;
        border-radius: 6px;
  
        .fieldset {
          margin: 0.6rem 0;
          label {
            font-size: $font-size-sm;
            color: $text-lighter;
            font-weight: 600;
            strong {
              color: $danger;
              margin-left: 3px;
            }
          }
        }
      }
  
      a.button {
        font-size: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
  
      &__footer {
        text-align: center;
        font-size: $font-size-xs;
        color: $text-lighter;
        line-height: 22px;
  
        .link {
          color: $text-lighter;
          cursor: pointer;
          border-bottom: 1px solid $text-lighter;
  
          &:hover {
            color: $text-light;
            border-bottom-color: $text-light;
          }
        }
      }
  
      .bottom-part {
        display: flex;
        font-size: $base-size;
        color: $text;
      }
  
      .bottom-part .link {
        color: $primary-24;
        cursor: pointer;
  
        &:hover {
          color: $primary-24-sub;
        }
      }
    }
  }
  </style>
  