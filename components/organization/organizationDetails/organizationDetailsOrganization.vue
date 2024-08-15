<template>
  <form v-if="orgData" @submit.prevent="updateOrgSubmit" class="mt-3">
    <div class="font-w-700 ml-2 mb-1">{{ $t("common.organizationInformation") }}</div>

    <!-- <div class="avatar-container align-end m-2">
      <img :src="organization_image ? organization_image.base64 : `/img/default_company.svg`" class="organization-image organization-image--big cursor-pointer" @click="uploadAvatar()" />
      <div class="font-md text-primary cursor-pointer" @click="uploadAvatar()">{{ $t("common.uploadPicture") }}</div>
    </div> -->

    <div class="pl-2 pr-2">
      <div class="grid-2 grid-gap-2 grid-break-800 mb-1">
        <div class="grid-col-1">
          <bib-input
            type="text"
            v-model="orgData.CompanyName"
            placeholder=""
            :label="$t('common.organizationName')"
            @input="changeCompanyName($event)"
            :variant="organizationEditState && !orgData.CompanyName?  lightThemeChecked? 'light alert' : 'dark alert' : lightThemeChecked? 'light' : 'dark'"
            required
            :disabled="!organizationEditState"
            test_id="input_org_name"
          ></bib-input>
        </div>
        <div class="grid-col-1">
          <bib-input
            type="text"
            v-model="orgData.Website"
            placeholder=""
            :label="$t('common.website')"
            :disabled="!organizationEditState"
            :variant="organizationEditState && orgData.Website && !isWebsiteValidate ? lightThemeChecked? 'light alert' : 'dark alert' : lightThemeChecked? 'light' : 'dark'"
            test_id="input_org_website"
          ></bib-input>
          <div v-if="organizationEditState && orgData.Website && !isWebsiteValidate" class="text-danger font-sm">
            ({{ $t('common.websiteValidationText') }})
          </div>
        </div>
      </div>
      <div class="grid-2 grid-gap-2 grid-break-800 mb-1">
        <div class="grid-col-1">
          <bib-input
            type="email"
            v-model="orgData.ContactEmail"
            placeholder=""
            :label="$t('common.emailAddress')"
            required
            :variant="organizationEditState && !isEmailValidate ? lightThemeChecked? 'light alert' : 'dark alert': lightThemeChecked? 'light' : 'dark'"
            :disabled="!organizationEditState"
            test_id="input_org_email"
          ></bib-input>
          <div v-if="organizationEditState && !isEmailValidate" class="text-danger font-sm">
            ({{ $t('common.emailAddressValidationText') }})
          </div>
        </div>
        <div class="grid-col-1">
          <bib-input
            type="text"
            v-model="orgData.ContactPhone"
            placeholder=""
            :variant="lightThemeChecked ? 'light' : 'dark'"
            :label="$t('common.telephoneNumber')"
            :disabled="!organizationEditState"
            @keypress="isPhoneNumber($event)"
            test_id="input_org_phone_number"
          ></bib-input>
          <div v-if="organizationEditState && !isPhoneNumberValidate" class="text-danger font-sm">
            ({{ $t('common.phoneNumberValidationText') }})
          </div>
        </div>
      </div>
      <div class="grid-2 grid-gap-2 grid-break-800 mb-1">
        <bib-input
          class="grid-col-1"
          type="text"
          v-model="orgData.NumberOfEmployees"
          placeholder=""
          :variant="lightThemeChecked ? 'light' : 'dark'"
          :label="$t('common.numberOfEmployees')"
          :disabled="!organizationEditState"
          @keypress="isNumberAndDash($event)"
          test_id="input_org_number_of_employees"
        ></bib-input>

      </div>
      <!-- <div class="grid-2 grid-gap-2 grid-break-800">
        <bib-input class="grid-col-1" type="text" v-model="orgData.Website" placeholder="" :label="$t('common.website')" :disabled="!organizationEditState"></bib-input>
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="" :label="$t('common.businessCategory')" :disabled="!organizationEditState"></bib-input>
      </div> -->
      <!-- <div class="grid-2 grid-gap-2 grid-break-800">
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="" :label="$t('common.yearFounded')" :disabled="!organizationEditState"></bib-input>
        <bib-input class="grid-col-1" type="text" v-model="organization_image" placeholder="" :label="$t('common.taxId')" :disabled="!organizationEditState"></bib-input>
      </div>
      <bib-input type="textarea" v-model="organization_image" placeholder="" :label="$t('common.description') " :disabled="!organizationEditState"></bib-input>
      <bib-input type="text" v-model="organization_image" placeholder="" :label="$t('common.tags')" :disabled="!organizationEditState"></bib-input> -->
    </div>

    <div class="align-center justify-between pt-1 pl-2 pr-2">
      <template v-if="organizationEditState">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="cancelUpdate" test_id="btn_edit_cancel"></bib-button>
        <bib-button size="lg" :label="$t('common.update')" variant="primary-24" pill type="submit" :disabled="isUpdateDisabled" test_id="btn_update_submit"></bib-button>
      </template>
      <template v-else>
        <bib-button v-if="isAdmin" size="lg" :label="$t('common.edit')" variant="primary-24--outline" pill @click="organizationEditState = true" test_id="btn_edit_state"></bib-button>
      </template>
    </div>

    <div v-if="isAdmin" class="w-100 text-center p-2 mt-2">
      <span @click="$router.push('/organizations/delete')" class="text-danger border-bottom-danger cursor-pointer">{{$t('common.closeOrganizationAccount')}}</span>
    </div>
  </form>
</template>

<script>
import { uploadFile } from "~/assets/utils/file";
import { updateBusiness } from "~/model/business";
export default {
  props: {
    businessData: Object,
    lightThemeChecked: Boolean,
  },
  data() {
    return {
      organization_image: null,
      organizationEditState: false,
      orgData: null,
      orgUpdatedData: null
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    isWebsiteValidate() {
      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
	    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
	    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
	    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
	    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
	    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
	    return !!urlPattern.test(this.orgData.Website)
    },
    isPhoneNumberValidate() {
      // const reg = /^(\+)?(\d{1,2})?[( .-]*(\d{3})[) .-]*(\d{3,4})[ .-]?(\d{4})$/ // works pretty widely for phone numbers
      // return this.orgData.ContactPhone ? this.orgData.ContactPhone.match(reg) : true
      return true
    },
    isEmailValidate() {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return this.orgData.ContactEmail && this.orgData.ContactEmail.match(reg) || false;
    },
    isUpdateDisabled() {
      return !this.orgData.CompanyName || !this.isEmailValidate
    }
  },
  created() {
    this.orgData = JSON.parse(JSON.stringify(this.businessData))
    this.orgUpdatedData = JSON.parse(JSON.stringify(this.orgData))
  },
  mounted() {},
  methods: {
    isNumberAndDash (evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if (
        (charCode > 31 && (charCode < 45 || charCode == 46 || charCode == 47 || charCode > 57)) || // prevent non-number or non-dash
        (this.orgData.NumberOfEmployees.length === 0 && (charCode === 48 || charCode === 45)) || // prevent first letter '0' or '-'
        (this.orgData.NumberOfEmployees.slice(-1) === '-' && charCode === 48) // prevent first letter '0' which is next to '-'
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    isPhoneNumber (evt) {
      const charCode = (evt.which) ? evt.which : evt.keyCode
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 32 && charCode !== 43 && charCode !== 45 && charCode !== 40 && charCode !== 41) {
        evt.preventDefault()
      } else {
        return true
      }
    },
    isAddWWW(evt) {
      if(!this.orgData.Website.includes('www.')) {
        this.orgData.Website = `www.${this.orgData.Website}`
      }
    },
    changeCompanyName(event) {
      this.$root.$emit('change_company_name', this.orgData.CompanyName)
    },
    uploadAvatar() {
      uploadFile({ multiple: true }).then((e) => {
        this.organization_image = e[0];
      });
    },
    async updateOrgSubmit() {
      if (this.orgData.CompanyName && this.isEmailValidate) {
        this.$store.dispatch('loading/set', true)
        await updateBusiness(this.orgData)
        this.$store.dispatch('loading/set', false)
        this.orgUpdatedData = JSON.parse(JSON.stringify(this.orgData))
        this.organizationEditState = false
      }
    },
    cancelUpdate() {
      this.orgData = JSON.parse(JSON.stringify(this.orgUpdatedData))
      this.$root.$emit('change_company_name', this.orgData.CompanyName)
      this.organizationEditState = false
    }
  },
};
</script>

<style lang="scss" scoped>
.organization-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 16px;

  &--big {
    width: 80px;
    height: 80px;
  }
}
</style>
