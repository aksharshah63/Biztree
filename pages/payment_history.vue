<template>
  <div>
    <!-- HEADER -->
    <content-header>
      <template slot="top-left">
        <bib-icon icon="home" :scale="1.5" class="ml-075 mr-05" variant="secondary-sub2"></bib-icon>
        <div class="font-sm"> Payment History</div>
      </template>
      <template slot="bottom-left">
        <h2 class="font-w-600 font-heading-sm ml-3">Payment History Biztree Inc.</h2>
      </template>

      <template v-if="false" slot="bottom-right">
        <bib-input :options="languages" size="md" type="select" class="header-menu-select"></bib-input>
        <bib-input :options="languages" size="md" type="select" class="header-menu-select"></bib-input>
        <bib-input :options="languages" size="md" type="select" class="header-menu-select"></bib-input>
        <div class="icon-circle icon-circle--background mr-1">
          <bib-icon icon="horizontal-dots" variant="secondary" :scale="1.3"></bib-icon>
        </div>
      </template>
    </content-header>

    <!-- Table -->
    <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="tableSections" @item-clicked="handleItemClickTable">
      <template #cell(date)="data">{{ data.value.date }}</template>
      <template #cell(order_id)="data">{{ data.value.OrderId }}</template>
      <template #cell(organization)="data">{{ data.value.BillingCompany }}</template>
      <template #cell(product)="data">{{ data.value.ProductSku }}</template>
      <template #cell(amount)="data">{{ `${data.value.Total} ${data.value.CurrencyCode}`  }}</template>
    </bib-table>

    <div v-if="!tableSections.length" class="text-center mt-1">
      No records
    </div>

    <!-- PAYMENT HISTORY MODAL -->
    <organization-payment-history-invoice :selectedPayment="selectedPayment" @close="selectedPayment = null" @click:outside="selectedPayment = null" />

  </div>
</template>

<script>
import { getBusinessLicenses } from "~/model/business";
export default {
  layout: "home",
  props: ["global"],
  auth: false,
  data() {
    return {
      selectedPayment: null,
      languages: [
        { label: "...", value: null },
        { label: "Orange", value: "orange" },
        { label: "Apple", value: "apple" },
        { label: "Grape", value: "grape" },
      ],
      tableFields: [
        {
          key: "",
          label: "",
        },
        {
          key: "date",
          label: "Date",
        },
        {
          key: "order_id",
          label: "Order ID",
        },
        {
          key: "organization",
          label: "Organization",
        },
        {
          key: "product",
          label: "Product",
        },
        {
          key: "amount",
          label: "Amount",
        },
      ],
      tableSections: [],
    };
  },
  computed: {},
  async created() {
    this.$store.dispatch('loading/set', true)
    const resp = await getBusinessLicenses(`/business/${this.$store.state.account.data.businessId}/licenses?showAllTransactions=yes`)
    if (resp.err) {
      this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
      setTimeout(async () => {
        await this.$store.dispatch('notification/set', [false, '', ''])
      }, 5000)
    } else {
      const licenses = Array.isArray(resp) ? resp : []
      let allTrans = []
      licenses.forEach(e => {
        if (e.Transactions) {
          allTrans = [...allTrans, ...e.Transactions]
        }
      })
      this.tableSections = this.refreshTransactions(allTrans)
    }
    this.$store.dispatch('loading/set', false)
  },
  mounted() {},
  methods: {
    refreshTransactions (data) {
      data.forEach(e => {
        e.date = this.$moment(e.TransactionDate).format('DD-MM-YYYY')
      })
      return data
    },
    handleItemClickTable(item) {
      this.selectedPayment = item;
    },
  },
};
</script>
<style lang="scss" scoped>
.header-menu-select {
  margin-right: 16px;
  width: 150px;

  @media only screen and (max-width: 1250px) {
    width: 100px;
  }
}
</style>
