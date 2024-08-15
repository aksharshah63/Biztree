<template>
    <div :class="['main-container', { 'dark': !isLightTheme }]">
        <div class="main-container__content ">
            <div class="grid-2 grid-gap-4 grid-break-800 ">
                <div class="grid-1 grid-col-1 grid-gap-4">
                    <div class="right-container grid-col-1">
                        <div class="mb-1 justify-between">
                            <span class="referral-link-label">Most Active Referrers</span>
                            <a :class="['view-all', { 'dark': !isLightTheme }]" @click="goToPage('referrers')"> <span :class="['transaction-text', { 'dark': !isLightTheme }]">View all</span></a>
                        </div>
                        <div :class="['transaction-history-container', { 'dark': !isLightTheme }]">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr :class="['transaction-content-header', { 'dark': !isLightTheme }]" class="py-05">
                                        <th class="ml-05 justify-start" style="max-width: 36%; min-width: 36%;">Name</th>
                                        <th class="ml-05 justify-around" style="max-width: 12%; min-width: 12%;">Referrals</th>
                                        <th class="ml-05 justify-around" style="max-width: 9%; min-width: 9%;">Leads</th>
                                        <th class="ml-05 justify-around" style="max-width: 9%; min-width: 9%;">Sales</th>
                                        <th class="ml-05 justify-end" style="max-width: 16%; min-width: 16%;">Commission</th>
                                        <th class="justify-center" style="max-width: 8%; min-width: 8%;">
                                            <bib-icon icon="elipsis" :class="[{ 'dark-elipsis': !isLightTheme }]" variant="black"></bib-icon>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="referrals.length === 0">
                                    <tr>
                                        <td colspan="6" class="justify-center" style="text-align: center; padding-top: 100px;">
                                            No referrals available
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(reff, index) in referrals" :key="index" :class="['transaction-content', { 'dark': !isLightTheme }]" class="py-05">
                                        <td class="ml-05 text-ellipsis" style="max-width: 36%; min-width: 36%;">
                                            <bib-avatar v-if="reff.UserDetails?.Photo" :src="reff.UserDetails?.Photo" size="1.5rem"></bib-avatar>
                                            <bib-avatar v-if="!reff.UserDetails?.Photo" class="mt-auto mb-auto" shape="circle" size="1.5rem"></bib-avatar>
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]" class="ml-05">{{ reff?.UserDetails?.FirstName + " " + reff?.UserDetails?.LastName }}</span>
                                        </td>
                                        <td class="ml-05 justify-around" style="max-width: 12%; min-width: 12%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]">{{ reff?.Referrals }}</span>
                                        </td>
                                        <td class="ml-05 justify-around" style="max-width: 9%; min-width: 9%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]">{{ reff?.Lead || 0 }}</span>
                                        </td>
                                        <td class="ml-05 justify-around" style="max-width: 9%; min-width: 9%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]">{{ reff?.Sales }}</span>
                                        </td>
                                        <td class="ml-05 justify-end" style="max-width: 16%; min-width: 16%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]">${{ parseFloat(reff?.CommissionAmount).toFixed(2) }}</span>
                                        </td>
                                        <td class="justify-center" style="max-width: 8%; min-width: 8%;cursor: pointer;">
                                            <bib-button pop="horizontal-dots"  :class="[ { 'dark-dots': !isLightTheme }]" >
                                                <template v-slot:menu>
                                                    <div class="list" :class="!isLightTheme? 'view-dark':'view-light'">
                                                        <span class="list__item" @click.stop="handleAction(reff)">View</span>
                                                    </div>
                                                </template>
                                            </bib-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="grid-1 grid-col-1 grid-gap-4">
                    <div class="right-container grid-col-1">
                        <div class="mb-1 justify-between">
                            <span class="referral-link-label">Latest Transactions</span>
                            <a :class="['view-all', { 'dark': !isLightTheme }]" @click="goToPage('transactions')"> <span :class="['transaction-text', { 'dark': !isLightTheme }]">View all</span></a>
                        </div>
                        <div :class="['transaction-history-container', { 'dark': !isLightTheme }]">
                            <table style="width: 100%; border-collapse: collapse;">
                                <thead>
                                    <tr :class="['transaction-content-header', { 'dark': !isLightTheme }]" class="py-05">
                                        <th class="ml-05 justify-start" style="max-width: 33%; min-width: 33%;">Date - Time</th>
                                        <th class="ml-05 justify-start" style="max-width: 39%; min-width: 39%;">Transaction ID</th>
                                        <th class="ml-05 justify-end" style="max-width: 15%; min-width: 15%;">Amount</th>
                                        <th class="justify-center" style="max-width: 10%; min-width: 10%;">
                                            <bib-icon icon="elipsis" :class="[{ 'dark-elipsis': !isLightTheme }]" variant="black"></bib-icon>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="transactions.length === 0">
                                    <tr>
                                        <td colspan="4" class="justify-center" style="text-align: center; padding-top: 100px;">
                                            No transactions available
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="(trs, index) in transactions" :key="index" :class="['transaction-content', { 'dark': !isLightTheme }]" class="py-05">
                                        <td class="ml-05 justify-start" style="max-width: 33%; min-width: 33%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]" class="text-ellipsis">{{ $moment(new Date(trs?.createdAt)).format('DD-MM-YYYY') }} {{ $moment(new Date(trs?.createdAt), 'HH:mm').format('hh:mm A') }}</span>
                                        </td>
                                        <td class="ml-05 justify-start" style="max-width: 39%; min-width: 39%;">
                                            <span :class="['transaction-text', { 'dark': !isLightTheme }]" class="text-ellipsis">{{ trs?._id }}</span>
                                        </td>
                                        <td class="ml-05 justify-end" style="max-width: 15%; min-width: 15%;">
                                            <div>
                                                <span :class="['transaction-text', { 'dark': !isLightTheme }]">${{ parseFloat(trs?.CommissionAmount).toFixed(2) }}</span>
                                            </div>
                                        </td>
                                        <td class="justify-center" style="max-width: 10%; min-width: 10%;cursor: pointer;">
                                            <bib-button pop="horizontal-dots"  :class="[ { 'dark-dots': !isLightTheme }]" >
                                                <template v-slot:menu>
                                                    <div class="list" :class="!isLightTheme? 'view-dark':'view-light'">
                                                        <span class="list__item" @click.stop="handleAction_Table(trs)">View</span>
                                                    </div>
                                                </template>
                                            </bib-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <organization-transaction-details-modal :data="selectedTransactionData" :show="showTransactionDetailsModal" @close="handleClickOutsideTransaction" :isLightTheme="isLightTheme"  >
        </organization-transaction-details-modal>

        <organization-referral-details-modal :data="selectedReferralData" :show="showReferralDetailsModal" @close="handleClickOutsideReferral" :isLightTheme="isLightTheme">
        </organization-referral-details-modal>
    </div>
</template>

<script>
import { getUsersTransactions, getAllReferrals } from "../model/referrals";
import OrganizationReferralDetailsModal from './organization/common/organizationReferralDetailsModal.vue';
import organizationTransactionDetailsModal from './organization/common/organizationTransactionDetailsModal.vue';
export default {
    components: { organizationTransactionDetailsModal, OrganizationReferralDetailsModal },
    layout: "home",
    props: ["global", "isLightTheme"],
    data() {
        return {
            referrals: [],
            transactions: [],
            showTransactionDetailsModal: null,
            selectedTransactionData: {},
            showReferralDetailsModal: null,
            selectedReferralData: {},
        };
    },
    computed: {
        isAdmin() {
            return this.$store.state.account.data.userRole === "ADMIN";
        },
        isMobileView() {
            return this.$store.state.ui.windowSize.width < 600;
        },
    },
    async created() {
        this.getTransactionsData()
    },
    mounted() { },
    methods: {
        handleAction_Table(data) {
            this.selectedTransactionData = { value: data }
            this.showTransactionDetailsModal = true;
        },
        handleAction(data) {
            this.selectedReferralData = { value: data }
            this.showReferralDetailsModal = true;
        },
        async getTransactionsData() {
            this.$store.dispatch('loading/set', true)
            const resp = await getUsersTransactions({ limit: 10, page: 1 })
            this.transactions = resp;

            const res = await getAllReferrals({ limit: 10, page: 1, type: "most-active" })
            this.referrals = res;

            this.$store.dispatch('loading/set', false)
        },
        goToPage(page) {
            this.$router.push(`/referrals/${page}`);
        },
        handleClickOutsideTransaction() {
            if(this.showTransactionDetailsModal)this.showTransactionDetailsModal=false;
        },
        handleClickOutsideReferral() {
            if(this.showReferralDetailsModal)this.showReferralDetailsModal=false;
        },
    },
};
</script>

<style lang="scss" scoped>
.main-container {
    @include flex-justify;
    width: 100%;
    height: 100vh;
    padding: 15px 1.5rem;

    &__content {
        width: inherit;
    }

    &.dark {
        background-color: var(--bib-black);
        color: var(--bib-light);
        border: 1px solid var(--bib-border-primary);
    }
}

.referral-link-label {
    font-weight: bold;
}

.right-container {
    // background-color: #F9F9F9;
    border-radius: 8px;
    padding: 16px;
}

.content-scroll {
    min-height: 250px;
    max-height: 250px;
    overflow: scroll;
}

.transaction-history-container {
    background-color: #F9F9F9;
    border-radius: 8px;
    border: 1px solid #F1F1F1;
    min-height: 300px;
    max-height: 300px;

    &.dark {
        // background-color: var(--bib-text);
        background-color: var(--bib-black);
        border: 1px solid #343437;
    }
}

.transaction-content-header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #F1F1F1;
    background-color: #f2f2f5;
    color: #FFFFFF;
    border-radius: 8px 8px 0px 0px;
    font-size: 14px;

    &.dark {
        background-color: var(--bib-dark);
        border-bottom: 1px solid #343437;
    }
    &.dark th{
        color:var(--bib-gray5);
    }
}

.transaction-content-header th {
    font-weight: 400;
    font-size: 14px;
    line-height: 16.94px;
    color: #1D1D20;

    &.dark {
        color: #8D8D8F;
    }
}


.transaction-content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #F1F1F1;

    &.dark {
        border-bottom: 1px solid #343437;
    }
}

.transaction-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 16.94px;
    color: #1D1D20;

    &.dark {
        color: var(--bib-light);
    }
}


.transaction-text-time {
    color: #8D8D8F;
}

.text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.view-all {
    border-bottom: 1px solid #000;
    cursor: pointer;

    &.dark {
        border-bottom: 1px solid var(--bib-light);
    }
}

</style>
