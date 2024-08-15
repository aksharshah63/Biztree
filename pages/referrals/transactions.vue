<template>
  <div v-if="isAdmin">
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="align-center">
          <div class="ml-1 justify-center" @click="goBack">
            <bib-icon icon="arrow-left" style="width: 1.5rem; height: 1.5rem; cursor: pointer;" variant="gray5"></bib-icon>
          </div>
          <h2 class="font-w-600 font-heading-sm ml-1">{{ $t("common.transactions") }}</h2>
        </div>
      </template>
    </content-header>
    <div :class="['main-container', { 'dark': !isLightTheme }]">
      <div v-if="transactions && transactions.length > 0">
        <bib-table :fields="tableFields" class="bg-white table-transactions" :class="!isLightTheme ? 'transactions-dark-table' : 'transactions-light-table'" :sections="transactions" @item-clicked="handleItemClick_Table" @column-header-clicked="headerColumnClick($event.column)" :hide-no-column="true">
          <!-- Cell templates -->
          <template #cell(createdAt)="data">
            <div class="justify-start">
              <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
                {{ $moment(new Date(data.value?.createdAt)).format('DD-MM-YYYY') }} - {{ $moment(new Date(data.value?.createdAt), 'HH:mm').format('hh:mm A') }}
              </span>
            </div>
          </template>
          <template #cell(_id)="data">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">{{ data.value._id }}</span>
          </template>
          <template #cell(ReferralId)="data">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">{{ data.value.ReferralId }}</span>
          </template>
          <template #cell(Source)="data">
            <div class="justify-center">
              <span :class="!isLightTheme ? 'text-light' : 'text-dark'">{{ data?.value?.ReferredUser?.NewUser?.Source || "-" }}</span>
            </div>
          </template>
          <template #cell(CommissionAmount)="data">
            <div class="justify-end">
              <span :class="!isLightTheme ? 'text-light' : 'text-dark'">${{ parseFloat(data.value.CommissionAmount).toFixed(2) }}</span>
            </div>
          </template>
          <template #cell(Status)="data">
            <div class="justify-center">
              <span :style="data?.value?.Status === 'Approved' ? { color: 'green' } : data?.value?.Status === 'On hold' ? { color: '#FFAB00' } : { color: 'red' }">
                {{ data.value.Status }}
              </span>
            </div>
          </template>
          <template #cell_action="data">
            <bib-button pop="horizontal-dots" :class="[{ 'dark-dots': !isLightTheme }]">
              <template v-slot:menu>
                <div class="list" :class="!isLightTheme ? 'view-dark' : 'view-light'">
                  <span class="list__item" @click.stop="handleAction_Table(data)">View</span>
                </div>
              </template>
            </bib-button>
          </template>
        </bib-table>
      </div>
      <div v-else>
        <bib-table :fields="tableFields" class="bg-white" :sections="transactions" @item-clicked="handleItemClick_Table" :hide-no-column="true">
        </bib-table>
        <p class="text-center text-muted">No transactions available.</p>
      </div>
    </div>
    <organization-transaction-details-modal v-if="showDetailsModal" :data="selectedTransactionData" :show="showDetailsModal" @close="handleClickOutsideTransaction" :isLightTheme="isLightTheme" />
  </div>
</template>

<script>
import { getUsersTransactions } from "../../model/referrals";
import { sortColumn } from "../../utils/tablesort";
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
      showDetailsModal: null,
      selectedTransactionData: {},
      tableFields: [
        {
          key: "",
          label: "#",
        },
        {
          key: "createdAt",
          label: "DATE & TIME",
          header_icon: {
            sortKey: "createdAt",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "date",
            isActive: false,
          },
        },
        {
          key: "_id",
          label: "TRANSACTION ID",
          header_icon: {
            sortKey: "_id",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "string",
            isActive: false,
          },
        },
        {
          key: "ReferralId",
          label: "REFERRER ID",
          header_icon: {
            sortKey: "ReferralId",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "string",
            isActive: false,
          },
          width: '15%'
        },
        {
          key: "Source",
          label: "SOURCE",
          header_icon: {
            sortKey: "Source",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "string",
            isActive: false,
          },
          width: '15%'
        },
        {
          key: "CommissionAmount",
          label: "AMOUNT",
          header_icon: {
            sortKey: "CommissionAmount",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "number",
            isActive: false,
          },
          width: '15%'
        },
        {
          key: "Status",
          label: "STATUS",
          header_icon: {
            sortKey: "Status",
            icon: 'swap-vertical',
            event: "employee-name-sort",
            type: "string",
            isActive: false,
          },
          width: '15%'
        },
      ],
      transactions: [],
      order: 'asc',
      isLightTheme: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === "ADMIN";
    }
  },
  async created() {
    if (this.$store.state.account.data.userRole === "ADMIN") this.getTransactionsData()
  },
  mounted() {
    if (this.$store.state.account.data.userRole !== "ADMIN") this.$router.push(`/my_profile`);
  },
  watch: {
    '$store.state.isLightTheme'(newValue) {
      this.isLightTheme = newValue;
    }
  },
  methods: {
    handleItemClick_Table(item) {
      console.log('table item clicked:', item)
    },
    handleAction_Table(data) {
      this.selectedTransactionData = data
      this.showDetailsModal = true;
    },
    async getTransactionsData() {
      this.$store.dispatch('loading/set', true)
      const resp = await getUsersTransactions()

      console.log("resp", resp);

      this.transactions = resp;
      this.$store.dispatch('loading/set', false)
    },
    async sortColumn(columnKey) {
      if (this.sortByField && this.sortByField.key != columnKey) {
        this.sortByField.header_icon.isActive = false;
      }
      const field = this.tableFields.find((field) => field.key === columnKey);
      field.header_icon.isActive = !field.header_icon.isActive;
      this.sortByField = field;
      this.transactions = sortColumn({ items: this.transactions, field: this.sortByField });
    },
    headerColumnClick(column) {
      this.sortColumn(column);
    },
    goBack() {
      this.$router.push(`/referrals/dashboard`);
    },
    handleClickOutsideTransaction() {
      if (this.showDetailsModal) this.showDetailsModal = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100vh;

  &.dark {
    background-color: var(--bib-black);
    color: var(--bib-light);
    border: 1px solid var(--bib-border-primary);
  }

  &__content {
    width: inherit;
  }

}
</style>
