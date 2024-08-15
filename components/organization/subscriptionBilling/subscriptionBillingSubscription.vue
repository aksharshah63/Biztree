<template>
  <div class="mt-3">
    <!-- SUBSCRIPTION INFORMATION -->
    <div v-if="this.subscriptionInfo" class="mb-3">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.subscriptionInformation") }}</div>

      <div v-if="!isSubscription" class="text-center">
        {{ $t('subscription.noSubscription') }}
      </div>

      <div v-if="isSubscription" :class="['subscription-card ml-2 mr-2', {'dark': !lightThemeChecked}]">
        <bib-icon class="img" icon="law-building-solid" :scale="2"></bib-icon>
        <div>
          <template v-if="businessData && businessData.BibLicense">
            <div class="font-lg mb-025">
              <span class="font-w-700">Business in a Box</span>
            </div>
            <div class="subscription-card__content font-md d-flex flex-d-column">
              <div>
                {{$t('common.orgName')}}:
                <span class="font-w-700">{{businessData.CompanyName || '-'}}</span>
              </div>
              <div v-show="expireDate">
                {{isSubscriptionExpired ? $t('common.subscriptionExpired') : $t('common.subscriptionValidUntil')}}:
                <span class="font-w-700">{{expireDate}}</span>
              </div>
              <div>
                {{$t('common.users')}}:
                <span class="font-w-700">{{usersCount}}</span>
                <span>({{$t('common.activeCapital')}} {{subscriptionInfo.activeUsers}})</span>
              </div>
              <div v-show="!isSubscriptionExpired">
                {{$t('common.availableSeats')}}:
                <span class="font-w-700">{{countSeatsAvailable}}</span>
                <span
                  v-show="countSeatsAvailable === 0"
                  @click="$store.commit('gui/PAYMENT_MODAL', true)"
                  class="text-primary ml-05 cursor-pointer"
                  style="text-decoration: underline !important;"
                >{{$t('common.addUserSeats')}}</span>
              </div>
              <div v-show="!isPaypal && (isSubscriptionExpired || isExpiresIn60Days)">
                <span class="cursor-pointer w-100 text-primary text-underline" @click="renewClicked">{{$t('common.renewSubscription')}}</span>
              </div>
              <div 
                v-if="isPaypal" @click="managePaypal"
                class="text-primary cursor-pointer"
                style="text-decoration: underline !important;">
                {{$t('common.managePaypalSubscription')}}
              </div>
              <div v-if="!isPaypal" class="auto-renewal-switch">
                {{$t('common.autoRenew')}}:
                <p v-if="isAutoRenewal">{{$t("common.on")}}</p>
                <p v-if="!isAutoRenewal">{{$t("common.off")}}</p>
                <bib-switch 
                variant="primary" 
                class="button-group__button"
                :checked="isAutoRenewal"
                @change="autoRenewalStatusChange">
                </bib-switch>
              </div>
            </div>
          </template>
          <template v-if="businessData && businessData.Status === 'FREETRIAL' && !businessData.BibLicense">
            <div class="font-lg mb-025">
              <span class="font-w-700">Business in a Box  Trial</span>
            </div>
            <div class="subscription-card__content font-md d-flex flex-d-column">
              <div>
                {{$t('common.orgName')}}:
                <span class="font-w-700">{{businessData.CompanyName || '-'}}</span>
              </div>
              <div v-show="expireDate">
                {{isSubscriptionExpired ? $t('common.subscriptionExpired') : $t('common.subscriptionValidUntil')}}:
                <span class="font-w-700">{{expireDate}}</span>
              </div>
              <div>
                {{$t('common.users')}}:
                <span class="font-w-700">{{usersCount}}</span>
              </div>
              <div
                  @click="$store.commit('gui/PAYMENT_MODAL', true)"
                  class="text-primary cursor-pointer"
                  style="text-decoration: underline !important;"
                >{{$t('common.upgradeToTheFullVersion')}}</div>
            </div>
          </template>
        </div>

        <div v-if="businessData && businessData.BibLicense && !isSubscriptionExpired" :class="['subscription-card__dot-menu icon-circle icon-circle--background', {'dark': !lightThemeChecked}]">
          <bib-popup pop="horizontal-dots" :class="{'dark': !lightThemeChecked}" icon-hover-variant="primary-24">
            <template v-slot:menu>
              <div class="list" :class="{'dark': !lightThemeChecked}">
                <span v-if="!isSubscriptionExpired" class="list__item">
                  <!-- <bib-link v-if="!isAvailableSeats" :label="$t('common.addUser')" :href="bibUpgradeLicenseUrlTrial" target="_blank" class="text-black w-100"></bib-link> -->
                  <span
                    v-show="countSeatsAvailable === 0"
                    @click="$store.commit('gui/PAYMENT_MODAL', true)"
                    class="cursor-pointer w-100"
                  >{{$t('common.addUserSeats')}}</span>
                  <span v-if="isAvailableSeats" class="cursor-pointer w-100" @click="inviteTeamMemberModal = true">{{$t('common.addUser')}}</span>
                </span>
                <!-- <span class="list__item">
                  Auto-renew: 
                  <p v-if="isAutoRenewal">ON</p>
                  <p v-if="!isAutoRenewal">OFF</p>
                  <bib-switch 
                  variant="secondary" 
                  :checked="isAutoRenewal"
                  @change="autoRenewalStatusChange">
                  </bib-switch>
                </span> -->
                <span v-show="!isPaypal" class="list__item">
                  <span class="cursor-pointer w-100" @click="renewClicked">{{$t('common.renewSubscription')}}</span>
                </span>
                <!-- <div v-show="isAutoRenewal" class="separator" />
                <span v-show="isAutoRenewal" class="list__item list__item__danger w-100" @click="isOpenConfirmModal = true">{{ $t("common.cancelSubscription") }}</span> -->
              </div>
            </template>
          </bib-popup>
        </div>
      </div>
    </div>

    <!-- PRODUCT DETAILS MODAL -->
    <organization-product-details-modal :show="productDetails" @close="productDetails = null" />

    <!-- CONFIRM MODAL -->
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('subscription.confirmCancelSubscriptionText')"
      @close="isOpenConfirmModal = null"
      @confirm="cancelSubscription">
    </confirm-dialog>

    <!-- INVITE TEAM MEMBER MODAL -->
    <organization-invite-team-member-modal
      :show="inviteTeamMemberModal"
      @add-member="addMember"
      @close="inviteTeamMemberModal = null"
    />

    <!-- RENEW SUBSCRIPTION MODAL -->
    <organization-renew-subscription-modal
      v-if="isOpenRenewModal"
      :licenseDetail="licenseDetail"
      :businessData="businessData"
      @close="isOpenRenewModal = null"
      @renew="handleRenewSubscription"
    />

    <!-- ADD PAYMENT CARD -->
    <organization-add-payment-card-modal
      v-if="isOpenAddPaymentCardModal"
      :businessData="businessData"
      @close="isOpenAddPaymentCardModal = null"
      @callback="cardAddCallback"
    ></organization-add-payment-card-modal>
  </div>
</template>

<script>
import { changeAutoRenewal, getBusiness, updateCard } from "~/model/business";
import { getBusinessLicenses, renewLicense } from "~/model/license";

export default {
  props: ["lightThemeChecked"],
  data() {
    return {
      businessData: null,
      productDetails: null,
      subscriptionInfo: null,
      isOpenConfirmModal: null,
      inviteTeamMemberModal: false,
      bibUpgradeLicenseUrlTrial: `${process.env.BIB_UPGRADE_LICENSE_URL_TRIAL}/?lang=${this.$i18n.locale}`,
      bibRenewLicenseLink: process.env.BIB_RENEW_LICENSE_URL,
      bibUpgradeLicenseUrl: process.env.BIB_UPGRADE_LICENSE_URL,
      licenseDetail: null,
      isOpenRenewModal: false,
      numberOfPendingUsers: null,
      isOpenAddPaymentCardModal: null,
    };
  },
  computed: {
    isSubscription() {
      return this.businessData
    },
    isPaypal() {
      return this.businessData.ExternalStore === 'PAYPAL'
    },
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    isAutoRenewal() {
      return this.$store.state.business.AutoRenewal !== 0
    },
    expireDate() {
      if (this.businessData && this.businessData.BibLicenseExpiration) {
        return new Date(this.businessData.BibLicenseExpiration).toLocaleString('en-US', {
          day: 'numeric',
          year: 'numeric',
          month: 'long', 
        })
      } else {
        return null
      }
    },
    usersCount() {
      return this.subscriptionInfo && this.subscriptionInfo.activeUsers + this.numberOfPendingUsers || 0
    },
    isAvailableSeats() {
      return this.subscriptionInfo && (this.subscriptionInfo.totalAvailableUsers - this.usersCount) > 0 || false
    },
    countSeatsAvailable() {
      return this.subscriptionInfo && (this.subscriptionInfo.totalAvailableUsers - this.usersCount) || 0
    },
    isExpiresIn60Days() {
      const expirationLeftDays = Math.round((new Date(this.businessData.BibLicenseExpiration) - new Date()) / (24 * 60 * 60 * 1000))
      return expirationLeftDays <= 60
    },
    isSubscriptionExpired() {
      const today = new Date()
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0, 0) - 1
      return this.businessData && Date.parse(this.businessData.BibLicenseExpiration) <= endOfDay
    }
  },
  async created() {
    await this.$store.dispatch('business/getSubscriptionInfo');
  },
  mounted() {},
  watch:{
    "$store.state.business.subscriptionInfo"({err, ...resp }){
      this.$store.dispatch('loading/set', true);
      if (err) {
        this.$store.dispatch('notification/set', [true, err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.subscriptionInfo = resp
        this.numberOfPendingUsers = this.subscriptionInfo && this.subscriptionInfo.pendingUsers || 0
        this.businessData = resp && resp.businessData || null
        this.$store.dispatch('business/set_AutoRenewal', this.businessData.AutoRenewal)
      }
      this.$store.dispatch('loading/set', false)
    }
  },
  methods: {
    async autoRenewalStatusChange() {
      if (this.isAutoRenewal) {
        this.isOpenConfirmModal = true;
        if (this.isOpenConfirmModal == null) {
          this.businessData.AutoRenewal = 0
          this.$store.dispatch('loading/setGlobal', true)
          const resp = await changeAutoRenewal({ Id: this.$store.state.account.data.businessId, AutoRenewal: 0 })
          if (resp.err) {
            this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          } else {
            this.businessData.AutoRenewal = 0
            this.$store.dispatch('business/set_AutoRenewal', 0)
          }
          this.$store.dispatch('loading/setGlobal', false)
        }
      } else {
        await this.$store.dispatch('business/getSubscriptionInfo');
        this.isOpenAddPaymentCardModal = true
        if (this.isOpenAddPaymentCardModal == null){
          this.businessData.AutoRenewal = 1
          this.$store.dispatch('loading/setGlobal', true)
          const resp = await changeAutoRenewal({ Id: this.$store.state.account.data.businessId, AutoRenewal: 1 })
          if (resp.err) {
            this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          } else {
            this.businessData.AutoRenewal = 1
            this.$store.dispatch('business/set_AutoRenewal', 1)
          }
          this.$store.dispatch('loading/setGlobal', false)
        }
      }
    },
    renewClicked() {
      const isStoreClient = ['AAPLIOS', 'AAPLMACOS', 'GOOGANDR'].includes(this.$store.state.business.data.ExternalStore);       
      if (isStoreClient && this.$mobile.emit("appStorePurchaseDialogInitiate", { action: "plans-and-pricing" })) return;
      
      if (this.isAutoRenewal) {
        this.getLicense()
      } else {
        this.isOpenAddPaymentCardModal = true
      }
    },
    managePaypal(){
      if (window.location.href.includes("localhost") || 
          window.location.href.includes("http://dev.account.business-in-a-box.com/")) {
        window.open(`https://www.sandbox.paypal.com/myaccount/autopay/connect/${this.businessData.ExternalStoreSecret}`, '_blank')
      } else {
        window.open(`https://www.paypal.com/myaccount/autopay/connect/${this.businessData.ExternalStoreSecret}`, '_blank')
      }
    },
    async getLicense() {
      this.$store.dispatch('loading/set', true)
      const params = {
        BusinessId: this.businessData.Id,
        QueryParams: 'LicenseKey&NumberOfUsers&SubscriptionExpirationDate&RenewalPrice&RenewalCurrency'
      }
      const resp = await getBusinessLicenses(params)
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.error || resp.err, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.licenseDetail = resp[0]
        this.isOpenRenewModal = true
      }
      this.$store.dispatch('loading/set', false)
    },
    async handleRenewSubscription() {
      this.$store.dispatch('loading/setGlobal', true)
      const data = {
        BusinessId: this.businessData.Id,
        LicenseKey: this.licenseDetail.LicenseKey
      }
      const resp = await renewLicense(data)
      if (resp.err) {
        let errorMsg = '';
        switch(resp.err.errorCode) {
          case 'CONN_ERR':
            errorMsg = 'Please check the correctness / validity of the credit card information saved and try again.'
            break
          case 'INVALID_REQ':
            errorMsg = 'Invalid HTTP method for current request'
            break
          case 'INVALID_BUSINESS_ID':
            errorMsg = 'Invalid Business Id'
            break
          case 'MISSING_LIC_KEY':
            errorMsg = 'Missing LicenseKey'
            break
          case 'NO_BUS_FOUND':
            errorMsg = 'No business found'
            break
          case 'NO_LIC_FOUND':
            errorMsg = 'No license found'
            break
          case 'FAIL_FIND_RENEWAL_POLICY':
            errorMsg = 'Failed to find renewal policy for Business'
            break
          case 'FAIL_FIND_CREDIT_CARD':
            errorMsg = 'Failed to find credit card information for Business'
            break
          case 'CREDIT_CARD_EXPIRED':
            errorMsg = 'Credit card expired for Business'
            break
          case 'FAIL_FIND_COUNTRY_MAP':
            errorMsg = 'Failed to find country'
            break
          case 'CREDIT_CARD_PREV_DECLINED':
            errorMsg = 'Credit card previously declined with an reason that we should not retry'
            break
          default:
            errorMsg = 'Unknown error'
        }
        this.$store.dispatch('notification/set', [true, errorMsg || resp.err, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.$root.$emit('close_expiration_notification')
        await this.$store.dispatch('business/getSubscriptionInfo');
        await this.$store.dispatch('notification/set', [true, this.$t("common.paymentCompletedSuccessfullyRenewed"), 'success'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
        this.isOpenRenewModal = false
      }
      this.$store.dispatch('loading/setGlobal', false)
    },
    async cancelSubscription() {
      this.$store.dispatch('loading/setGlobal', true)
      const resp = await changeAutoRenewal({ Id: this.$store.state.account.data.businessId, AutoRenewal: 0 })
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.businessData.AutoRenewal = 0
        this.$store.dispatch('business/set_AutoRenewal', 0)
      }
      this.isOpenConfirmModal = null
      this.$store.dispatch('loading/setGlobal', false)
    },
    addMember() {
      this.numberOfPendingUsers++
    },
    cardAddCallback(cardData) {
      this.businessData.AutoRenewal = 1
      this.isOpenAddPaymentCardModal = null
      this.$root.$emit('load_card_info')
      // this.getLicense()
    },
  },
};
</script>

<style lang="scss" scoped>
.subscription-card {
  position: relative;
  display: flex;
  padding: 40px 24px;
  background: $background;
  border-radius: 4px;

  &.dark {
    background-color: var(--bib-surface-tertiary);
    color: var(--bib-secondary);
    border: 1px solid var(--bib-border-primary);
  }

  &__content {
    div {
      padding: 0.1rem 0;
    }
  }

  &__dot-menu {
    position: absolute !important;
    top: 8px;
    right: 8px;

    &:hover {
      border-radius: 100px;
      background: $background-dark;
    }
    &.dark{
      background-color: var(--bib-text);
    }
  }

  .img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 80px;
    margin-right: 26px;
  }

  .auto-renewal-switch {
    display: flex;
    align-items: center;
    padding: 0.1rem 0;
    height: 25px;
    gap: 0.2rem;
  }

  .manage-paypal{
    cursor: pointer
  }

  .list{
    .list__item:hover{
      background: var(--bib-light-sub1);
    }
    &.dark{
      background-color: var(--bib-text);
      color: var(--bib-secondary);
      border: 1px solid var(--bib-border-primary) !important;
      
      .list__item:hover {
        background-color: var(--bib-surface-tertiary);
      }

      .danger:hover {
        background-color: #D9000D;
      }
    }
  }

  .list__item {
    p {
      width: 2rem;
      padding: 0 0.2rem;
      margin: 0;
    }
  }

  @media only screen and (max-width: 790px) {
    margin: 0 1rem;
    padding: 40px 20px;
    img {
      display: none;
    }
  }
}

::v-deep {
  .subscription-card {
    &.dark {
      .button-group__button {
        span {
          background-color: var(--bib-black);
          border: 1px solid var(--bib-border-primary);
        }
      }
    }
  }

  .popup {
    &.dark {
      .menu {
        .pop {
          border: 1px solid var(--bib-border-primary) !important;
        }
      }
    }
  }
}

</style>
