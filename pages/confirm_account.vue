<template>
  <div class="login">
    <Header />

    <div class="login__header-3">
      <div class="login__header-3__left-side">
          <div v-if="!failedText" class="text-success font-w-700">
            <template>{{successText}}</template>
          </div>
          <div v-if="failedText" class="text-danger">
            {{failedText}}
          </div>
      </div>
    </div>

    <div v-if="loadingSpinner" class="loading-mask">
      <div class="loading-wrapper">
        <bib-spinner variant="primary-24"></bib-spinner>
      </div>
    </div>
  </div>
</template>

<script>
import { verifyToken, login, changePasswordWithToken } from "~/model/user";
export default {
  data: () => ({
    email: null,
    token: null,
    password: null,
    isConfirmed: false,
    failedText: '',
    successText: '',
    loadingSpinner: false
  }),
  created() {
    this.email = this.$route.query.Email
    this.token = this.$route.query.Token
    this.password = localStorage.getItem('bib_register_pw')
    const token = this.$store.state.token
    if (token) {
      this.loadingSpinner = true
      this.checkTokenValidity(token)
    } else {
      this.checkIfPasswordExisting()
    }
  },
  methods: {
    async checkTokenValidity(token) {
      const decodedToken = await verifyToken({ token: token })
      if (decodedToken.code === 'valid_token') {
        await this.$store.dispatch('account/authenticate')
        this.$router.push("/")
      } else {
        this.checkIfPasswordExisting()
      }
    },
    checkIfPasswordExisting() {
      if (!this.password) {
        this.failedText = 'Password is missing. Please open activation link in the same browser.'
      } else {
        this.loadingSpinner = true
        this.changePassword()
      }
    },
    async changePassword() {
      await this.$store.dispatch('notification/set', [false, '', ''])
      const params = {
        Email: this.email,
        Token: this.token,
        NewPassword: this.password
      }
      changePasswordWithToken(params).then(async (resp) => {
        if (resp.changePassword === 'success') {
          this.failedText = ''
          this.successText = 'Your account has been verified'
          this.login()
        }
        if (resp.changePassword === 'failed') {
          this.loadingSpinner = false
          this.failedText = resp.error
        }
        if (resp.err) {
          this.loadingSpinner = false
          this.failedText = resp.err.message
        }
      })
    },
    login() {
      login({ Email: this.email, Password: this.password }).then(async (resp) => {
        if (resp.login === 'success') {
          localStorage.removeItem('bib_register_pw')
          await this.$store.dispatch('setToken', resp)
          if (this.redirectURL) {
            window.location.href = this.redirectURL
          } else {
            await this.$store.dispatch('account/authenticate')
            this.$router.push("/")
          }
        }
        if (resp.login === 'failed') {
          this.loadingSpinner = false
          this.failedText = 'Wrong email or password';
        }
        if (resp.err) {
          this.loadingSpinner = false
          this.failedText = resp.err.message;
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
// @import "@/assets/style/global";

.login {
  height: 100%;

  &__header-3 {
    @include flex-align;
    @include flex-justify(space-between);

    height: 72px;
    border-top: 1px solid $light;
    border-bottom: 1px solid $light;
    line-height: 100%;

    &__left-side {
      @include flex-align;
      height: 72px;
      line-height: 100%;
      font-size: 1.1rem;
      font-weight: bold;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
