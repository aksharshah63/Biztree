<template>
  <bib-modal-wrapper v-if="show" size="lg" @close="closeModal" :title="$t('common.updateMember')">
    <div slot="content" class="pl-1 pr-1">
      <form @submit.prevent="handleSubmit">
        <div v-if="failedText" class="font-w-600 text-danger bg-danger-sub3 text-center mr-1 ml-1 p-1 mb-1 shape-sharp">
          {{failedText}}
        </div>
        <div class="grid-2 grid-gap-2">
          <bib-input
            type="text"
            v-model="firstName"
            class="grid-col-1"
            required
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :label="$t('common.firstName')"
            placeholder=""
            name="first-name"
          ></bib-input>
          <bib-input
            type="text"
            v-model="lastName"
            class="grid-col-1"
            required
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :label="$t('common.lastName')"
            placeholder=""
            name="last-name"
          ></bib-input>
        </div>
        <bib-input
          type="text"
          v-model="jobTitle"
          class="grid-col-1"
          :variant="lightThemeChecked ? 'light' : 'dark'"
          :label="$t('common.jobTitle')"
          placeholder=""
          name="first-name"
        ></bib-input>
        <div class="align-center justify-between mt-1" slot="footer">
          <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="closeModal"></bib-button>
          <bib-button type="submit" size="lg" :label="$t('common.update')" variant="primary-24" pill></bib-button>
        </div>
      </form>
    </div>
  </bib-modal-wrapper>
</template>

<script>
import { updateUser } from "~/model/user";
export default {
  props: ["show", "user", "lightThemeChecked"],
  data() {
    return {
      firstName: '',
      lastName: '',
      jobTitle: '',
      failedText: '',
    };
  },
  computed: {},
  created() {
    this.firstName = this.user.FirstName
    this.lastName = this.user.LastName
    this.jobTitle = this.user.JobTitle
  },
  mounted() {},
  methods: {
    handleSubmit() {
      const userData = this.user
      userData.FirstName = this.firstName
      userData.LastName = this.lastName
      userData.JobTitle = this.jobTitle
      this.$store.dispatch('loading/setGlobal', true)
      this.failedText = ''
      updateUser(userData).then(async (resp) => {
        this.$store.dispatch('loading/setGlobal', false)
        if (resp.updateUser === 'success') {
          this.closeModal()
        } else {
          this.failedText = resp.err.message
        }
      })
    },
    reset() {
      this.firstName = ''
      this.lastName = ''
    },
    closeModal() {
      this.reset()
      this.$emit('close')
    }
  },
};
</script>

<style lang="scss" scoped></style>
