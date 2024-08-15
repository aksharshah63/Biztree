<template>
  <div v-if="isAdmin">
    <!-- HEADER -->
    <content-header>
      <template slot="bottom-left">
        <div class="align-center">
          <div class="ml-1 justify-center" @click="goBack">
            <bib-icon icon="arrow-left" style="width: 1.5rem; height: 1.5rem; cursor: pointer;" variant="gray5"></bib-icon>
          </div>
          <h2 class="font-w-600 font-heading-sm ml-1">Referrers</h2>
        </div>
      </template>
    </content-header>

    <div :class="['main-container', { 'dark': !isLightTheme }]">
      <bib-table :fields="tableFields" class="bg-white table-referrers" :class="!isLightTheme? 'referrers-dark-table': 'referrers-light-table' " :sections="referrals" @item-clicked="handleItemClick_Table" @column-header-clicked="headerColumnClick($event.column)" :hide-no-column="true">
        <template #cell(blank)>
          <div style="min-width: 13px;max-width: 13px;" class="d-flex gap-05">
          </div>
        </template>
        <template #cell(flag)>
          <div class="justify-center gap-05">
            <span class="text-dark">
              <bib-icon :style="{ opacity: '0.2' }" icon="flag-racing" :scale="1"></bib-icon>
            </span>
          </div>
        </template>
        <template #cell(RefId)="data">
          <div class="d-flex gap-05">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              {{ data?.value?.RefId }}
            </span>
          </div>
        </template>
        <template #cell(name)="data">
          <div>
            <bib-avatar v-if="data?.value?.UserDetails?.Photo" :src="data?.value?.UserDetails?.Photo" size="2rem" />
            <bib-avatar v-if="!data?.value?.UserDetails?.Photo" class="mt-auto mb-auto" shape="circle" size="2rem"></bib-avatar>
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              {{ data?.value?.FullName }}
            </span>
          </div>
        </template>
        <template #cell(referrals)="data">
          <div class="justify-center">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              {{
                data?.value?.Referrals
              }}
            </span>
          </div>
        </template>
        <template #cell(Lead)="data">
          <div class="justify-center">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              {{
                data?.value?.Lead || 0
              }}
            </span>
          </div>
        </template>
        <template #cell(sales)="data">
          <div class="justify-center">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              {{
                data?.value?.Sales
              }}
            </span>
          </div>
        </template>
        <template #cell(CommissionAmount)="data">
          <div class="justify-end">
            <span :class="!isLightTheme ? 'text-light' : 'text-dark'">
              ${{
                parseFloat(data?.value?.CommissionAmount).toFixed(2)
              }}
            </span>
          </div>
        </template>
        <template #cell(status)="data">
          <div class="justify-center">
            <span :style="data?.value?.Status === 'Active' ? { color: 'green' } : { color: 'gray' }">
              {{ data?.value?.Status }}
            </span>
          </div>
        </template>
        <template #cell_action="data">
          <bib-button :class="[ { 'dark-dots': !isLightTheme }]"  pop="horizontal-dots">
            <template v-slot:menu>
              <div class="list" :class="!isLightTheme? 'view-dark':'view-light'">
                <span class="list__item" @click.stop="handleAction_Table(data)">View</span>
              </div>
            </template>
          </bib-button>
        </template>
      </bib-table>
    </div>

    <organization-referral-details-modal :data="selectedReferralData" :show="showReferralDetailsModal" @close="handleClickOutsideReferral" :isLightTheme="isLightTheme" />
  </div>
</template>

<script>
import { getAllReferrals } from "../../model/referrals";
import { sortColumn } from "../../utils/tablesort";
export default {
  layout: "home",
  props: ["global"],
  data() {
    return {
      selectedReferralData: {},
      showReferralDetailsModal: null,
      businessData: null,
      tableFields: [
        {
          key: "",
          label: "#",
        },
        {
          key: "RefId",
          label: "REF ID",
          width: '12%',
          header_icon: {
            sortKey: "RefId",
            type: "number",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "name",
          label: "NAME",
          header_icon: {
            sortKey: "FullName",
            type: "string",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "referrals",
          label: "REFERRALS",
          width: '12%',
          header_icon: {
            sortKey: "Referrals",
            type: "number",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "Lead",
          label: "LEADS",
          width: '12%',
          header_icon: {
            sortKey: "Lead",
            type: "number",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "sales",
          label: "SALES",
          width: '12%',
          header_icon: {
            sortKey: "Sales",
            type: "number",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "CommissionAmount",
          label: "PAYOUT",
          width: '12%',
          header_icon: {
            sortKey: "Sales",
            type: "number",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
        {
          key: "status",
          label: "STATUS",
          width: '12%',
          header_icon: {
            sortKey: "Sales",
            type: "string",
            icon: "swap-vertical",
            event: "employee-name-sort",
            isActive: false,
          },
        },
      ],
      referrals: [],
      isLightTheme: this.$cookies.get('isLightTheme'),
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === "ADMIN";
    }
  },
  async created() {
    this.getReferrals();
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
    async getReferrals() {
      if (this.$store.state.account.data.userRole === "ADMIN") {
        this.$store.dispatch('loading/set', true)
        const resp = await getAllReferrals()
        if (resp.err) {
          this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
          setTimeout(async () => {
            await this.$store.dispatch('notification/set', [false, '', ''])
          }, 5000)
        } else {
          resp?.forEach((i) => {
            i.FullName = i?.UserDetails?.FirstName + ' ' + i?.UserDetails?.LastName;
            i.Status = i?.Status ? "Active" : "Inactive"
          });
          this.referrals = resp;
        }
        this.$store.dispatch('loading/set', false)
      }
    },
    handleItemClick_Table(item) { },
    handleAction_Table(data) {
      this.selectedReferralData = data
      this.showReferralDetailsModal = true;
    },
    async sortColumn(columnKey) {
      if (this.sortByField && this.sortByField.key != columnKey) {
        this.sortByField.header_icon.isActive = false;
      }
      const field = this.tableFields.find((field) => field.key === columnKey);
      field.header_icon.isActive = !field.header_icon.isActive;
      this.sortByField = field;
      this.referrals = sortColumn({ items: this.referrals, field: this.sortByField });
    },
    headerColumnClick(column) {
      this.sortColumn(column);
    },
    goBack() {
      this.$router.push(`/referrals/dashboard`);
    },
    handleClickOutsideReferral() {
      if(this.showReferralDetailsModal)this.showReferralDetailsModal=false;
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
