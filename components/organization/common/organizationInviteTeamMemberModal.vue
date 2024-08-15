<template>
  <bib-modal-wrapper v-if="show" size="lg" @close="closeModal" :title=" $t('common.inviteTeammateToJoinOrg', { org: 'HR' })">
    <div slot="content" class="pl-1 pr-1">
      <form @submit.prevent="invite">
        
        <div v-if="failedText" class="font-w-600 text-danger bg-danger-sub3 text-center mr-1 ml-1 p-1 mb-1 shape-sharp">
          {{failedText}}
        </div>
        <div class="grid-2 grid-gap-2 mb-1">
          <bib-input
            type="text"
            v-model="firstName"
            class="grid-col-1"
            required
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :label="'First Name'"
            placeholder=""
            name="first-name"
          ></bib-input>
          <bib-input
            type="text"
            v-model="lastName"
            class="grid-col-1"
            required
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :label="'Last Name'"
            placeholder=""
            name="last-name"
          ></bib-input>
        </div>

        <div>
          <bib-input
            type="email"
            v-model="email"
            required
            :label="$t('common.emailAddress')"
            :variant="email && !isEmailValidate ? lightThemeChecked ? 'light alert' : 'dark alert' : lightThemeChecked ? 'light' : 'dark'"
            placeholder=""
            name="email"
          ></bib-input>
          <div v-if="email && !isEmailValidate" class="text-danger font-sm">
            ({{ $t('common.emailAddressValidationText') }})
          </div>
        </div>

        <div class="align-center justify-between mt-2" slot="footer">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="closeModal"></bib-button>
          <bib-button type="submit" size="lg" :label="$t('common.invite')" variant="primary-24" pill :disabled="!isEmailValidate || isSubmitDisabled"></bib-button>
        </div>
      </form>
    </div>
  </bib-modal-wrapper>
</template>

<script>
import { invitePerson } from "~/model/user";
export default {
  props: ["show", "lightThemeChecked"],
  data() {
    return {
      firstName: '',
      lastName: '',
      email: null,
      failedText: '',
    };
  },
  computed: {
    isEmailValidate() {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return this.email && this.email.match(reg) || false;
    },
    isSubmitDisabled() {
      return !this.firstName || !this.lastName || !this.email
    },
  },
  created() {},
  mounted() {},
  methods: {
    invite() {
      const params = {
        FirstName: this.firstName,
        LastName: this.lastName,
        InviterEmail: this.$store.state.account.data.userEmail,
        Email: this.email,
        BusinessId: this.$store.state.account.data.businessId,
        Role: 'USER',
        InviterId: this.$store.state.account.data.userId
      }
      this.$store.dispatch('loading/setGlobal', true)
      this.failedText = ''
      invitePerson(params).then(async (resp) => {
        this.$store.dispatch('loading/setGlobal', false)
        if (resp.errorEmails && resp.errorEmails.length) {
          this.failedText = resp.errorEmails[0].err
        } else if (resp.inviteUser === 'failed') {
          if (resp.error === 'remaining quota: 0') {
            // this.closeModal(this.failedText)
            this.failedText = this.$t('people.seatsExceededNote')
          } else {
            this.failedText = resp.error
          }
        } else {
          const msg = this.$t("people.sentInvitationMsg", { email: this.email })
          await this.$store.dispatch('notification/set', [true, msg, 'success'])
          this.reset()
          this.$emit('add-member', resp.Id)
          this.closeModal()
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 8000)
        }
      })
    },
    reset() {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
    },
    closeModal(value) {
      this.$emit('close', value)
    }
  },
  watch: {
    email(to) {
      this.failedText = ''
    }
  }
};
</script>

<style lang="scss" scoped></style>
