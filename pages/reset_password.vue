<template>
  <div class="login">
    <Header />
    <div class="justify-center p-1 pt-05 pb-05 bg-white border-top-gray3 border-bottom-gray3">
      <div class="text-center">
        <h1 class="font-w-600 font-xl">{{ $t("common.resetPassword") }}</h1>
      </div>
    </div>

    <div v-if="failedText" class="font-w-600 text-danger bg-danger-sub3 text-center mt-3 mr-1 ml-1 p-1 shape-sharp">
      {{failedText}}
    </div>

    <div class="login__container">
      <!-- FORM -->
      <form @submit.prevent="submit" class="login__container-content">
        <!-- new password -->
        <bib-input
            type="password"
            v-model="newPassword"
            name="new-password"
            :label="$t('common.newPassword')"
            :variant="isNewPasswordValidate ? 'light': 'light alert'"
            @input="checkNewPasswordValidate"
            required
            @keyup.enter="$event.target.nextElementSibling.focus()"
            test_id="input_new_pw"
        />
        <div v-if="!isNewPasswordValidate" class="text-danger font-sm">
            ({{ validateText }})
        </div>

        <!-- confirm password -->
        <bib-input
            type="password"
            name="confirm-password"
            :label="$t('common.confirmPassword')"
            v-model="confirmPassword"
            :variant="isMatchingPassword ? 'light': 'light alert'"
            required
            @keyup.enter="$event.target.nextElementSibling.focus()"
            test_id="input_confirm_pw"
            class="mt-05"
        />

        <bib-button type="submit" size="lg" variant="primary-24" class="w-100 mt-1 mb-0" test_id="btn_pw_submit">
          <template slot="button">
            <template>{{ $t("common.submit") }}</template>
          </template>
        </bib-button>
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
import { changePasswordWithToken, login, verifyToken } from "~/model/user";
export default {
  data: () => ({
    email: null,
    newPassword: null,
    confirmPassword: null,
    failedText: '',
    loadingSpinner: false,
    isNewPasswordValidate: true,
    validateText: '',
  }),
  computed: {
    isMatchingPassword () {
        return (this.newPassword && this.confirmPassword) ? this.newPassword === this.confirmPassword : true
    }
  },
  async created() {
    this.redirectURL = this.$route.query.redirect
    const token = this.$store.state.token
    if (token) {
      this.loadingSpinner = true;
      this.checkTokenValidity(token);
    }
  },
  mounted() {
    this.email = this.$route.query.Email
    this.token = this.$route.query.Token
    this.$nextTick(() => {
      document.querySelector('input[name="new-password"').focus()
    })
  },
  methods: {
    checkNewPasswordValidate() {
      if (this.newPassword === '') {
        this.isNewPasswordValidate = false;
        this.validateText = this.$t("common.passwordRequiredValidationText");
      } else if(this.newPassword.includes(' ')) {
        this.isNewPasswordValidate = false;
        this.validateText = this.$t("common.passwordSpaceValidationText");
      } else if(this.newPassword.length < 8) {
        this.isNewPasswordValidate = false;
        this.validateText = this.$t("common.passwordLengthValidationText");
      } else if(!this.newPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*#?&^()_+=~]{8,}$/)) {
        this.isNewPasswordValidate = false;
        this.validateText = this.$t("common.passwordConfirmValidationText");
      } else {
        this.isNewPasswordValidate = true;
        this.validateText = '';
      }
    },
    async checkTokenValidity(token) {
      const decodedToken = await verifyToken({ token: token })
      if (decodedToken.code === 'valid_token') {
        this.loadingSpinner = false;
      }
    },
    submit() {
      if (!this.isNewPasswordValidate || !this.isMatchingPassword) {
        return
      }
      this.failedText = ''
      this.loadingSpinner = true
      const params = {
        Email: this.email,
        Token: this.token,
        NewPassword: this.newPassword
      }
      changePasswordWithToken(params).then(async (resp) => {
        if (resp.changePassword === 'success') {
          this.$store.dispatch('notification/set', [true, this.$t("common.passwordUpdatedMsg"), 'success'])
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
    login() {
      login({ Email: this.email, Password: this.newPassword }).then(async (resp) => {
          if (resp.ssojwt) {
            await this.$store.dispatch('setToken', resp)
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/my_profile")
          }
          if (resp.err) {
            this.loadingSpinner = false
            this.failedText = resp.err.error
          }
      })
    }
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
      max-width: 29rem;
      height: auto;
      padding: 32px;
      padding-bottom: 30px;
      background: $background;
      border-radius: 6px;
    }

    a.button {
      font-size: 1rem;
    }
  }
}
</style>
