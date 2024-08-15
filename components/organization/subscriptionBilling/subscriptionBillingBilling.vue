<template>
  <div v-if="this.billingHistory" class="mt-3">
    <div class="font-w-700 ml-2 mb-2">{{ $t("common.billingHistory") }}</div>

    <div class="ml-2 mr-2 history-container">
      <div v-for="(row, index) in filteredBillingHistory" :key="index" class="history-row" @click="selectedPayment = row">
        <div class="history-row__date-time">
          <div>{{ row.date }}&nbsp;</div>
          <div>@ {{ row.time }}</div>
        </div>
        <div :class="['history-row__info', {'dark': !lightThemeChecked}]">
          <div class="info__payment-id text-primary">{{ row.OrderId || '----------' }}</div>
          <div class="info__user-count">
            {{ row.BillingCompany || 'Business in a Box Pro' }}
            <span class="ml-025">({{ row.BillingName }})</span>
          </div>
          <div class="info__amount">
            <span class="mr-025">{{ `${currencySign(row.CurrencyCode)}${row.Total} ${row.CurrencyCode}` }}</span>
            <!-- ({{ row.period }}) -->
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-3" v-if="!billingHistory.length">{{ $t('subscription.noRecords') }}</div>

    <!-- PAYMENT HISTORY MODAL -->
    <organization-payment-history-invoice v-if="selectedPayment" :selectedPayment="selectedPayment" @close="selectedPayment = null" @click:outside="selectedPayment = null" />

  </div>
</template>

<script>
import { getBusiness, getTransactions } from "~/model/business";
import { getPaypalTransactions, getPaypalPaymentInfo, getPaypalPlanInfo } from "~/model/paypal";
import { getTwoDecimal } from '@/assets/utils/index'
export default {
  props: ["lightThemeChecked"],
  data() {
    return {
      businessData: null,
      selectedPayment: null,
      billingHistory: null,
    };
  },
  computed: {
    isPaypal() {
      this.businessData && this.businessData.ExternalStore === 'PAYPAL';
    },
    filteredBillingHistory() {
      const idSet = new Set();
      let filterdHistory = {};
      let index = 0;
      this.billingHistory.map((value) => {
        if (!idSet.has(value.OrderId) && !value.ProductSku.startsWith('BUDGETO')) {
          idSet.add(value.OrderId);
          filterdHistory = {
            ...filterdHistory,
            [index]: value
          }
          index++;
        }
      })
      return filterdHistory;
    }
  },
  async created() {
    this.$store.dispatch('loading/set', true)
    const resp0 = await getBusiness({ businessId: this.$store.state.account.data.businessId })
    this.businessData = resp0[0];
    if (this.businessData.ExternalStore === 'PAYPAL') {
      return await this.paypalTransactions();
    }
    const resp = await getTransactions({ Emails: this.businessData.ContactEmail })
    if (resp && resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      this.refreshTransactions(resp || [])
    }
    this.$store.dispatch('loading/set', false)

  },
  mounted() {},
  methods: {
    refreshTransactions(data) {
      data.forEach((e) => {
        let tDateTime = new Date(e.TransactionDate)
        e.date = this.$moment(tDateTime).format('YYYY-MM-DD')
        e.time = this.$moment(tDateTime).format('HH:mm:ss')
        e.Total = getTwoDecimal(e.Total)
      })
      this.billingHistory = data.filter(t => t.PaymentStatus === 'Approved')
    },
    currencySign(CurrencyCode) {
      switch(CurrencyCode) {
        case 'EUR':
          return '€'
        case 'GBP':
          return '£'
        case 'CAD':
          return '$'
        case 'USD':
          return '$'
        default:
          return '$'
      }
    },
    async paypalTransactions() {
      let transactions = await getPaypalTransactions({ subscriptionId: this.businessData.ExternalStoreSecret });
      const subscription = await getPaypalPaymentInfo({ subscriptionId: this.businessData.ExternalStoreSecret });
      const plan = await getPaypalPlanInfo({ planId: subscription.plan_id });
      // prepare paypal transaction data to fill the payment invoice
      transactions = transactions.filter(t => t.status === 'COMPLETED')
      transactions.forEach((e) => {
        let tDateTime = new Date(e.time)
        e.date = this.$moment(tDateTime).format('YYYY-MM-DD')
        e.time = this.$moment(tDateTime).format('HH:mm:ss')
        e.ID = subscription.id
        e.BillingName = this.businessData.ContactName
        e.Total = e.amount_with_breakdown.gross_amount.value
        e.SubTotal = e.Total
        e.CurrencyCode = e.amount_with_breakdown.gross_amount.currency_code
        e.OrderId = subscription.id
        e.PaymentCardTypeName = this.businessData.ExternalStore
        e.PaymentCardNumberMask = ''
        e.PaymentTransactionId = e.id
        e.BillingCountryName = this.businessData.Country
        e.BillingPhone = this.businessData.ContactPhone
        e.BillingEmail = this.businessData.ContactEmail
        e.ProductSku = plan.name.substring(9, plan.name.indexOf('-User'));
      })
      this.billingHistory = transactions;
      this.$store.dispatch('loading/set', false);
    }
  },
};
</script>

<style lang="scss" scoped>
.history-container {
  overflow: auto;
  max-height: 40vh;
}
.history-row {
  cursor: pointer;
  width: 100%;
  padding: 0 0.3rem;
  margin: 1rem 0;
  font-size: 14px;
  @include flex-align;

  &__date-time {
    margin-left: 16px;
    width: 120px;
    font-size: 12px;
    display: list-item;
    color: $gray1;
  }

  &__info {
    width: 100%;
    @include flex-align;
    @include flex-justify(space-between);
    background: $background;
    padding: 10px;
    .info__user-count {
      width: 18rem;
    }
    &.dark{
      background-color: var(--bib-surface-tertiary);
    }
  }

  @media only screen and (max-width: 790px) {
    flex-direction: column;
    &__date-time {
      @include flex-align;
      width: 100%;
      margin-bottom: 6px;
    }

    &__info {
      display: block;
    }
  }
}
</style>
