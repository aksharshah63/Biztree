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
            <!-- First name -->
            <div class="fieldset">
              <label>{{$t('common.firstName')}}<strong>*</strong></label>
              <bib-input type="text" v-model="firstName" variant="light" :placeholder="$t('common.firstName')" required test_id="input_first_name"/>
            </div>
  
            <!-- Last name -->
            <div class="fieldset">
              <label>{{$t('common.lastName')}}<strong>*</strong></label>
              <bib-input type="text" v-model="lastName" variant="light" :placeholder="$t('common.lastName')" required test_id="input_last_name"/>
            </div>

            <!-- Email -->
            <div class="fieldset">
              <label>{{$t('common.emailAddress')}}<strong>*</strong></label>
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
  
            <!-- Password -->
            <div class="fieldset" :class="{'grid-2 grid-gap-2 grid-break-900': formType ==='register'}">
              <div class="grid-col-1">
                <label>{{$t('common.password')}}<strong>*</strong></label>
                <bib-input
                  type="password"
                  v-model="password"
                  name="password"
                  :placeholder="$t('common.password')"
                  :variant="!isPasswordValidate ? 'light alert': 'light'"
                  required
                  test_id="input_password"
                />
                <div v-if="!isPasswordValidate" class="text-danger font-sm">
                  ({{ $t("common.passwordConfirmValidationText") }})
                </div>
              </div>
              <div class="grid-col-1">
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
  
          </div>
  
          <!-- Submit button -->
          <div class="p-2 pt-1 pb-1 border-top-light border-bottom-light">
            <bib-button type="submit" size="lg" variant="primary-24" class="w-100 mt-025 mb-025" test_id="btn_submit">
              <template slot="button">
                <template>{{ $t("common.createAccount") }}</template>
              </template>
            </bib-button>
          </div>
  
          <!-- (agree to terms of use & privary policy) -->
          <div class="p-2 pt-1 pb-1 border-bottom-light text-center font-md text-secondary">
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
          <div class="bottom-part p-2 pt-1 pb-1 mt-05 mb-05 text-center" :class="'justify-center'">
            <div class="bottom-part__row">
              {{ $t("loginView.haveAnAccount") }}
              <span class="link" @click="setFormType('signin')">{{ $t("common.signIn") }}</span>
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
  import { getAllCookies, getTrackingSource, setTrackingSource } from "~/assets/utils/cookies";
  import { verifyToken, create} from "~/model/user";
  import HeaderLine from '../components/HeaderLine.vue';
  const REGISTER_TITLE = "Create Account | Business in a Box";
  const LANG_CODE = getAllCookies()[process.env.LANG_COOKIE_NAME] || 'en'
  export default {
    components: { HeaderLine },
    head() {
      return {
        title: this.headTitle
      }
    },
    data: () => ({
      headTitle: REGISTER_TITLE,
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
      await setTrackingSource(this.$route.query)
      const token = this.$store.state.token
      if (token) {
      this.loadingSpinner = true;
      this.checkTokenValidity(token);
      }
    },
    async mounted() {
      this.formType = this.$route.query.state?.toLowerCase() || "register"
      await this.$store.dispatch('notification/set', [false, '', ''])
    },
    methods: {
      async checkTokenValidity(token) {
        const decodedToken = await verifyToken({ token: token });
        if (decodedToken.code === 'valid_token') {
          if (this.redirectURL) {
            window.location.href = this.redirectURL;
          }
          else {
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/");
          }
        } else {
          this.loadingSpinner = false;
        }
      },
      setFormType (type) {
        switch(type) {
          case 'register':
            this.$router.push('/create-account')
            break
          case 'signin':
            this.$router.push('/login')
            break
        }
      },
      
      submit() {
        this.failedText = ''
        this.loadingSpinner = true
        if (this.formType === "register") {
          if (this.isPasswordValidate && this.isMatchingPassword) {
            this.register()
          } else {
            this.loadingSpinner = false
          }
        }
      },
      async register() {
        const params = {
          FirstName: this.firstName,
          LastName: this.lastName,
          Email: this.email,
          Password: this.password,
          Language: this.$route.query.lan ? this.$route.query.lan : 'en',
          Country: localization.country.name,
          Device: localization.device,
          IpAddress: localization.ipAddress,
          ...getTrackingSource()
        }
        try {
          const resp = await create(params)
          if (resp.err) {
            this.loadingSpinner = false
            this.failedText = resp.err.error || 'Unexpected Error'
          } else {
            await this.$store.dispatch('setToken', resp)
            if (this.redirectURL) {
              window.location.href = this.redirectURL
            }
            else if (`${process.env.ACCOUNT_CREATION_REDIRECT}`) {
              window.location.href = `${process.env.ACCOUNT_CREATION_REDIRECT}`;
            }
            else {
              await this.$store.dispatch('account/authenticate');
              this.$router.push("/my_profile");
            }
          }
        } catch(err) {
          this.loadingSpinner = false
          this.failedText = err && err.error
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
      background: $background-dark;
  
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
  
