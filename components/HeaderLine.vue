<template>
    <div class="justify-center p-1 pt-05 pb-05 bg-white border-top-gray3 border-bottom-gray3">
        <div class="text-center">
            <h1 class="font-w-600 font-xl">
              <span v-show="formType === 'signin'">{{$t('loginView.signInToYourAccount')}}</span>
              <span v-show="formType === 'register'">{{$t('loginView.resigterHeadline1')}}<br/>{{$t('loginView.resigterHeadline2', {templates: templatesWithCommas})}}</span>
              <span v-show="formType === 'reset_password'">
                {{$t('loginView.resetYourPassword')}}
                <div class="font-w-500 font-lg">{{$t('loginView.resetPasswordSubtitle')}}</div>
              </span>
              <span v-show="formType === 'reset_password_sent'">
                {{$t('loginView.beingResetPassword')}}
              </span>              
            </h1>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        formType: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            templates: 3000
        }
    },
    computed: {
        templatesWithCommas() {
            return this.templates.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    }
}
</script>

<style lang="scss" scoped>

</style>