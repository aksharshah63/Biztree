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
          <div v-if="formType == 'signin' || formType == 'register' || formType == 'reset_password'" class="fieldset">
            <label>{{ formType !== 'reset_password' ? $t('common.emailAddress') : $t('loginView.emailAccessToAccount')}}<strong>*</strong></label>
            <bib-input
              type="email"
              v-model="email"
              name="email"
              :placeholder="$t('common.emailAddress')"
              variant="light"
              required
              test_id="input_email"
            />
          </div>

          <!-- First name -->
          <div v-if="formType == 'register'" class="fieldset">
            <label>{{$t('common.firstName')}}<strong>*</strong></label>
            <bib-input type="text" v-model="firstName" variant="light" :placeholder="$t('common.firstName')" required test_id="input_first_name"/>
          </div>

          <!-- Last name -->
          <div v-if="formType == 'register'" class="fieldset">
            <label>{{$t('common.lastName')}}<strong>*</strong></label>
            <bib-input type="text" v-model="lastName" variant="light" :placeholder="$t('common.lastName')" required test_id="input_last_name"/>
          </div>

          <!-- Password -->
          <div v-if="formType == 'signin' || formType ==='register'" class="fieldset" :class="{'grid-2 grid-gap-2 grid-break-900': formType ==='register'}">
            <div class="grid-col-1">
              <label>{{$t('common.password')}}<strong>*</strong></label>
              <bib-input
                type="password"
                v-model="password"
                name="password"
                :placeholder="$t('common.password')"
                :variant="formType ==='register' && !isPasswordValidate ? 'light alert': 'light'"
                required
                test_id="input_password"
              />
              <div v-if="formType ==='register' && !isPasswordValidate" class="text-danger font-sm">
                ({{ $t("common.passwordConfirmValidationText") }})
              </div>
            </div>
            <div class="grid-col-1" v-if="formType ==='register'">
              <label>{{$t('common.repeatPassword')}}<strong>*</strong></label>
              <bib-input
                type="password"
                v-model="confirmPassword"
                name="confirm-password"
                required
                :placeholder="$t('common.confirmPassword')"
                :variant="isMatchingPassword ? 'light': 'light alert'"
                test_id="input_confirm_password"
              ></bib-input>
              <div v-if="!isMatchingPassword" class="text-danger font-sm">
                  ({{ $t('common.notMatched') }})
              </div>
            </div>
          </div>

          <!-- Keep me logged in -->
          <div v-if="formType == 'signin'" class="fieldset">
            <bib-checkbox :label="$t('loginView.keepMeLogin')" variant="primary" name="KeepIn" :checked="keepIn" @change="changeKeepIn"></bib-checkbox>
          </div>

          <!-- verification -->
          <bib-input
            v-if="formType === 'verify_email'"
            v-model="verify_code"
            class="fieldset"
            type="text"
            :label="$t('common.verificationCode')"
            variant="light"
            placeholder=""
            required
            test_id="input_verify_email"
          />
        </div>

        <div v-if="formType === 'reset_password_sent'" class="p-2 border-bottom-light text-center">
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

        <!-- (agree to terms of use & privary policy) -->
        <div v-if="formType == 'register'" class="p-2 pt-1 pb-1 border-bottom-light text-center font-md text-secondary">
          {{ $t("loginView.youAgreeTo") }}
          <br/>
          <bib-link
            :label="$t('loginView.termsOfUse')"
            :href="termsOfUseLink"
            target="_blank"
            class="text-secondary border-bottom-secondary"
          ></bib-link>
          &
          <bib-link
            :label="$t('loginView.privacyPolicy')"
            :href="privacyPolicyLink"
            target="_blank"
            class="text-secondary border-bottom-secondary"
          ></bib-link>
        </div>

        <!-- FOOTER  -->
        <div class="bottom-part p-2 pt-1 pb-1 mt-05 mb-05 text-center" :class="formType == 'register' ? 'justify-center' : 'justify-between'">
          <div v-if="formType == 'signin'" class="bottom-part__row">
            <span class="link" @click="setFormType('reset_password')">{{ $t("common.forgotPassword") }}</span>
          </div>
          <div v-if="formType == 'signin'" class="bottom-part__row">
            <span class="link" @click="setFormType('register')">{{ $t("common.createAnAccount") }}</span>
          </div>

          <div v-else-if="formType == 'register'" class="bottom-part__row">
            {{ $t("loginView.haveAnAccount") }}
            <span class="link" @click="setFormType('signin')">{{ $t("common.signIn") }}</span>
          </div>

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
import { verifyToken, login, sendResetLink, validateRequest, create, changePasswordWithToken } from "~/model/user";
import { verifyReferral ,newReferral} from "~/model/referrals";
import HeaderLine from '../components/HeaderLine.vue';
const LOGIN_TITLE = "Login | Business in a Box";
const REGISTER_TITLE = "Create Account | Business in a Box";
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
    headTitle: LOGIN_TITLE,
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
    if(this.$route?.query?.RefId) newReferral({RefId: this.$route?.query?.RefId})
    this.redirectURL = this.$route.query.redirect
    const token = this.$store.state.token
    if (token) {
      this.loadingSpinner = true;
      this.checkTokenValidity(token);
    }
  },
  async mounted() {
    this.formType = this.$route.query.state?.toLowerCase() || "signin"
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
          this.$router.push("/");
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
          this.headTitle = LOGIN_TITLE
          break
        case 'reset_password':
          this.$router.push('/forgot-password')
          break
      }
    },

    changeKeepIn() {
      this.keepIn = !this.keepIn
    },
    
    submit() {
      this.failedText = ''
      this.loadingSpinner = true
      if (this.formType === "signin") {
        this.login()
      } else if (this.formType === "register") {
        if (this.isPasswordValidate && this.isMatchingPassword) {
          this.register()
        } else {
          this.loadingSpinner = false
        }
      } else if (this.formType === "reset_password") {
        sendResetLink(this.email, { Language: LANG_CODE }).then((resp) => {
          this.loadingSpinner = false
          if (resp.err) {
            this.failedText = this.$t("loginView.invalidEmailContactAdministrator")
          } else {
            this.formType = 'reset_password_sent'
          }
        });
      } else if (this.formType === "verify_email") {
        this.changePassword()
      }
    },
    async login() {
      if (this.keepIn) {
        this.$store.dispatch("account/keepUserLogged")
      }
      login({ Email: this.email.trim(), Password: this.password.trim() }).then(async (resp) => {
        if (resp.ssojwt) {
          await this.$store.dispatch('setToken', resp)
          if (this.redirectURL) {
            window.location.href = this.redirectURL
          } else {
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/")
          }
        }
        if (resp.err) {
          this.loadingSpinner = false
          const errorCode = resp.err.errorCode
          switch(errorCode) {
            case 'EMAIL_LIMIT':
            case 'IP_LIMIT':
              this.failedText = this.$t('loginAPIError.EMAIL_LIMIT')
              break
            case 'ACCESS_ERR':
              this.failedText = this.$t('loginAPIError.ACCESS_ERR')
              break
            case 'NO_QUOTA':
              this.failedText = this.$t('loginAPIError.NO_QUOTA')
              break
            // case 'USER_PENDING':
            //   this.failedText = this.$t('loginAPIError.USER_PENDING')
            //   break
            // case 'USER_DEL':
            //   this.failedText = this.$t('loginAPIError.USER_DEL')
            //   break
            case 'MAINT_ERR':
              this.failedText = this.$t('loginAPIError.MAINT_ERR')
              break
            default:
              this.failedText = this.$t('loginAPIError.wrongEmailOrPassword')
              break
          }
        }
      })
    },
    async register() {
      const params = {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        Password: this.password,
        Language: 'en',
        Country: localization.country.name,
        Device: localization.device,
        IpAddress: localization.ipAddress,
      }
      try {
        const resp = await create(params)
        if (resp.err) {
          this.loadingSpinner = false
          this.failedText = resp.err.error || 'Unexpected Error'
        } else {
          if( this?.$route?.query?.RefId) {
            await verifyReferral({ token: resp?.ssojwt, RefId: this.$route?.query?.RefId, Source: this?.$route?.query?.Source })
          }
          await this.$store.dispatch('setToken', resp)
          if (this.redirectURL) {
            window.location.href = this.redirectURL
          } else {
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/")
          }
        }
      } catch(err) {
        this.loadingSpinner = false
        this.failedText = err && err.error
      }
      // register(params).then(async (resp) => {
      //     this.loadingSpinner = false
      //     if (resp.register === 'failed') {
      //       if (resp.reason === 'user-exist') {
      //         this.failedText = `User ${this.email} already exists.`
      //       } else {
      //         this.failedText = 'Register failed.'
      //       }
      //     } else if (resp.err) {
      //       this.failedText = resp.err.message
      //     } else if (resp.errorEmails && resp.errorEmails.length) {
      //       this.failedText = resp.errorEmails[0].err
      //     } else {
      //       const msg = this.$t("common.verificationLinkSentMsg", { email: this.email })
      //       await this.$store.dispatch('notification/set', [true, msg, 'success'])
      //       this.formType = 'signin'
      //       localStorage.setItem('bib_register_pw', this.password)
      //     }
      // })
    },
    async changePassword() {
      await this.$store.dispatch('notification/set', [false, '', ''])
      const params = {
        Email: this.email,
        Token: this.verify_code,
        NewPassword: this.password
      }
      changePasswordWithToken(params).then(async (resp) => {
        if (resp.changePassword === 'success') {
          this.$store.dispatch('notification/set', [true, this.$t("common.accountVerifiedMsg"), 'success'])
          this.login()
        }
        if (resp.changePassword === 'failed') {
          this.loadingSpinner = false
          this.failedText = this.$t("loginView.repeatPasswordLinkExpiredOrRevoked")
        }
        if (resp.err) {
          this.loadingSpinner = false
          this.failedText = resp.err.message
        }
      })
    },
    clientValidation() {
      validateRequest({ contact: this.email, tokenType: "code" }).then((e) => {
        if (e.err) return alert("Verify error");
        console.log(`verify_email`, e);
      });
      console.log(`new verification sent...`);
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
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
