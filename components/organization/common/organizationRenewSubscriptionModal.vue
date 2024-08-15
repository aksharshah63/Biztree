<template>
    <bib-modal-wrapper no-header>
      <div slot="content" class="dialog-content">
        <div class="custom-close">
          <bib-icon
            variant="gray4"
            class="cursor-pointer"
            :scale="1.5"
            icon="close"
            @click="$emit('close')"
          ></bib-icon>
        </div>
        <div class="text-center p-1 pb-0">
          <h3>Renew Your Subscription</h3>
          <p>
            {{descriptionText}}
          </p>
        </div>
      </div>

      <div class="align-center justify-between" slot="footer">
        <bib-button size="lg" :label="$t('common.cancel')" variant="gray" pill @click="$emit('close')"></bib-button>
        <bib-button size="lg" :label="$t('common.renew')" variant="primary-24" pill @click="$emit('renew')" :disabled="!licenseDetail || !licenseDetail.LicenseKey"></bib-button>
      </div>
    </bib-modal-wrapper>
</template>

<script>
export default {
  props: {
    licenseDetail: Object,
    businessData: Object
  },
  mounted() {
  },
  computed: {
    descriptionText() {
      if (this.licenseDetail && this.licenseDetail.LicenseKey) {
        return `A charge of ${this.licenseDetail.RenewalCurrency + this.licenseDetail.RenewalPrice} will be applied to the credit card we have on file and your account subscription will be extended until ${this.expireDate}`
      } else {
        return 'No license'
      }
    },
    expireDate() {
      let date = this.isSubscriptionExpired && new Date() || new Date(this.licenseDetail.SubscriptionExpirationDate)
      date.setFullYear(date.getFullYear() + 1)
      date = new Date(date.getTime() - 24 * 60 * 60 * 1000)
      return this.licenseDetail && date.toLocaleString('en-US', {
        day: 'numeric',
        year: 'numeric',
        month: 'long', 
      })
    },
    isSubscriptionExpired() {
      return this.businessData && Date.parse(this.businessData.BibLicenseExpiration) < Date.now()
    },
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dialog-content {
  position: relative;
  .custom-close {
    position: absolute;
    top: -1rem;
    right: -1.2rem;
  }
}
</style>
