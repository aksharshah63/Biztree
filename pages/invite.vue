<template>
  <div class="login">
    <Header />
    <div class="justify-center p-1 pt-05 pb-05 bg-white border-top-gray3 border-bottom-gray3">
      <div class="text-center">
        <h1 class="font-w-600 font-xl">{{ $t("common.invite") }}</h1>
      </div>
    </div>

    <div v-if="failedText" class="font-w-600 text-danger bg-danger-sub3 text-center mt-3 mr-1 ml-1 p-1 shape-sharp">
      {{failedText}}
    </div>

    <div class="login__container">
      <!-- FORM -->
      <form @submit.prevent="submit" class="login__container-content">
        <!-- Full name -->
        <bib-input 
        type="text"
        v-model="firstName"
        class="fieldset mb-1"
        @keyup.enter="$event.target.nextElementSibling.focus()"
        variant="light"
        :label="$t('common.firstName')"
        name="first-name"
        required />

        <bib-input
          v-model="lastName"
          type="text"
          class="fieldset mb-1"
          @keyup.enter="$event.target.nextElementSibling.focus()"
          variant="light"
          :label="$t('common.lastName')"
          name="last-name"
          required />

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
        />
        <div v-if="!isNewPasswordValidate" class="text-danger font-sm">
            ({{validateText}})
        </div>

        <br/>
        <!-- confirm password -->
        <bib-input
            type="password"
            name="confirm-password"
            :label="$t('common.confirmPassword')"
            v-model="confirmPassword"
            :variant="isMatchingPassword ? 'light': 'light alert'"
            required
            @keyup.enter="$event.target.nextElementSibling.focus()"
        />

        <bib-button type="submit" size="lg" variant="primary-24" class="w-100 mt-1 mb-0">
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
import { acceptInvite, login } from "~/model/user";
export default {
  data: () => ({
    firstName: '',
    lastName: '',
    email: null,
    newPassword: '',
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
  mounted() {
    this.email = this.$route.query.Email
    this.token = this.$route.query.Token
    this.$nextTick(() => {
        document.querySelector('input[name="first-name"').focus()
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
    submit() {
      if (!this.isNewPasswordValidate || !this.isMatchingPassword) {
        return
      }
      this.failedText = ''
      this.loadingSpinner = true
      const params = {
        FirstName: this.firstName,
        LastName: this.lastName,
        Email: this.email,
        Token: this.token,
        NewPassword: this.newPassword
      }
      acceptInvite(params).then(async (resp) => {
        if (resp.invite_accept === 'success') {
          this.$store.dispatch('notification/set', [true, this.$t("common.registerSuccessText"), 'success'])
          this.login()
        } else {
          this.loadingSpinner = false
          this.failedText = this.$t("loginView.invitationLinkExpiredOrRevoked")
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
            this.$router.push("/")
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
// @import "@/assets/style/global";

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

      a.button {
        font-size: 1rem;
      }
    }

    &__footer {
      text-align: center;
      margin-top: 6px;
      font-size: 13px;
      color: $text-lighter;
      line-height: 22px;

      .link {
        color: $primary;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
          color: $primary-sub1;
        }
      }
    }
  }
}
</style>
