<template>
  <div class="paypal__info" v-if="isPaypalPayment">
    <div class="detail">
      <img src="/img/paypal_logo.svg" class="paypal_logo mb-1"/>
      <div v-if="!paypalPaymentInfo.Subscription_Expire" class="cancel_subscription" @click="isOpenPaypalConfirmModal = true">{{$t('common.cancel')}}</div>
      <div v-if="paypalPaymentInfo.Subscription_Expire" class="subscribe" @click="paypalSubscribe">{{$t('subscription.subscribe')}}</div>
    </div>
            
    <div class="detail note">
      {{paypalPaymentInfo.Subscription_Expire ? $t('subscription.subscriptionCancelNote') : $t('subscription.paypalNote')}}
    </div>

    <div v-for="key in Object.keys(paypalPaymentInfo)" :key="key" v-show="paypalPaymentInfo[key]" class="detail">
      <div>{{key.replace("_", " ")}}</div>
      <div>{{ paypalPaymentInfo[key]}}</div>
    </div>

    <div class="switch_payment mt-1">
      <div class="button" @click="isOpenAddPaymentCardModal = true">{{ $t('subscription.switchToCC') }}</div>
      <!-- <bib-button size="lg" :label="$t('subscription.switchToCC')" variant="primary" pill /> -->
    </div>
    

    <!-- CONFIRM MODAL FOR PAYPAL PAYMENT CANCELLATION -->
    <confirm-dialog
        v-if="isOpenPaypalConfirmModal"
        :text="$t('common.confirmText')"
        @close="isOpenPaypalConfirmModal = null"
        @confirm="deletePayPalPaymentMethod">
    </confirm-dialog>

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
import { updateBusinessStore, updateCard, removeBusinessStore, changeAutoRenewal } from "~/model/business";
import { getPaypalPaymentInfo, getPaypalPlanInfo, cancelPaypalSubscription, createPaypalSubscription } from "~/model/paypal";
import { getTwoDecimal } from '@/assets/utils/index'
export default {
  props: ["businessData", "loadPaymentInfo"],
  data() {
    return {
      subscriptionInfo: null,
      paypalPaymentInfo: null,
      isOpenPaypalConfirmModal: null,
      isOpenAddPaymentCardModal: null
    };
  },
  computed: {
    isPaypalPayment() {
      return this.businessData && this.paypalPaymentInfo
    }
  },
  watch: {
    businessData(){
      this.loadPaypalPaymentInfo()
    }
  },
  async created() {
    // Execute needful API post paypal payment redirection
    if(this.$route.query.subscription_id && this.$route.query.ba_token) {
        const subscription = await getPaypalPaymentInfo({subscriptionId: this.$route.query.subscription_id})
        if (subscription && subscription.status !== 'APPROVAL_PENDING') {
            // Update External Store
            const storeData = { store: 'PAYPAL', ExternalStoreSecret: subscription.id };
            await updateBusinessStore(this.$store.state.account.data.businessId, storeData);
            this.businessData.ExternalStoreSecret = this.$route.query.subscription_id;
        }
    }
    this.loadPaypalPaymentInfo();
  },
  mounted() {},
  methods: {
    async loadPaypalPaymentInfo() {
      if (this.businessData && this.businessData.ExternalStore === 'PAYPAL') {
        this.$store.dispatch('loading/set', true)
        const paypalInfo = await getPaypalPaymentInfo({ subscriptionId: this.businessData.ExternalStoreSecret });
        this.subscriptionInfo = paypalInfo;
        if (paypalInfo) {
          if (!paypalInfo.err) {
            this.paypalPaymentInfo = { 
              Name: paypalInfo.subscriber.name.given_name + ' ' + paypalInfo.subscriber.name.surname,
              Email: paypalInfo.subscriber.email_address,
              Renewal_Amount: paypalInfo.status !== 'CANCELLED' ? 
                await this.calculateRenewalAmount(paypalInfo.plan_id, paypalInfo.  quantity) + paypalInfo.billing_info.outstanding_balance.currency_code : '',
              Renewal_Date: paypalInfo.status !== 'CANCELLED' ?
                new Intl.DateTimeFormat('en-US').format(new Date(paypalInfo.billing_info.next_billing_time)) : '',
              Subscription_Id: `#${paypalInfo.id}`,
              Subscription_Expire: paypalInfo.status === 'CANCELLED' ?
                new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(this.businessData.BibLicenseExpiration)): ''
            };
          
          } else {
            this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
        }
        this.$store.dispatch('loading/set', false)
      }
    },
    async calculateRenewalAmount(planId, quantity) {
      let plan = await getPaypalPlanInfo({planId}),
        total = 0;
      for (let tier of plan.billing_cycles[0].pricing_scheme.tiers || []) {
        const size = tier.ending_quantity ? parseInt(tier.ending_quantity) : quantity;
        for (let i = parseInt(tier.starting_quantity); i <= size && i <= quantity; i++) {
          total += parseFloat((tier.amount.value));
        }
      }
      return Math.round(total * 100) / 100;
    },
    async deletePayPalPaymentMethod() {
      await cancelPaypalSubscription({subscriptionId: this.subscriptionInfo.id});
      this.isOpenPaypalConfirmModal = null;
      this.loadPaymentInfo();
    },
    async paypalSubscribe(){
      this.$store.dispatch('loading/setGlobal', true)
      const start_time = this.businessData.BibLicenseExpiration && new Date(this.businessData.BibLicenseExpiration) > new Date() ? 
        this.businessData.BibLicenseExpiration : null;

      const data = {
        email: this.$store.state.account.data.userEmail,
        plan_id: this.subscriptionInfo.plan_id,
        quantity: this.subscriptionInfo.quantity,
        business_id: this.$store.state.account.data.businessId,
        start_time,
        source: 'ACCOUNT_APP',
        return_url: window.location.href.split('?')[0],
        cancel_url: window.location.href.split('?')[0]
      };
      const { href } = await createPaypalSubscription(data);
      window.location.href = href;
    },
    async addCard(cardData) {
      cardData.BusinessId = this.businessData.Id
      this.$store.dispatch('loading/setGlobal', true)
      const resp = await updateCard(cardData)
      if (resp.err) {
        this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        await this.switchPaymentToCC();
        this.isOpenAddPaymentCardModal = null
        this.loadPaymentInfo()
      }
      this.$store.dispatch('loading/setGlobal', false)
    },
    async cardAddCallback(cardData) {
      this.isOpenAddPaymentCardModal = null
      await this.switchPaymentToCC()
      this.loadPaymentInfo()
    },
    async switchPaymentToCC() {
      await removeBusinessStore(this.$store.state.account.data.businessId);
      await cancelPaypalSubscription({ subscriptionId: this.subscriptionInfo.id });
    },
  },
};
</script>

<style lang="scss" scoped>
.paypal__info {
  background: white;
  padding: 2rem;
  border-radius: 4px;
  .detail {
    display: flex;
    justify-content: space-between;
  }

  .cancel_subscription {
    color: #e83a5d;
    text-decoration: underline;
    cursor: pointer;
  }
  .subscribe {
    text-decoration: underline;
    cursor: pointer;
  }
  .note {
    font-size: 12px;
    margin-bottom: 2rem;
    color: #9b9b9b;
  }
  .switch_payment {
    .button {
      width: 100%;
      background: #0741a3;
      border-radius: 15px;
      text-align: center;
      color: white;
      padding: 5px;
      cursor: pointer;
      text-transform: uppercase;
    }
    .button:hover{
        background: #325AA9;
    }
  }
}
</style>