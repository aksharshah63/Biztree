<template>
    <div v-show="isAdmin || isNonAdmin">
        <!-- HEADER -->
        <content-header>
            <template slot="bottom-left">
                <div class="organization-headline">
                    <h2 class="font-w-600 font-heading-sm">{{'Close your account'}}</h2>
                </div>
            </template>
        </content-header>

        <div class="form__container">
            <div v-show="isAdmin" :class="['form__container-component-holder p-2 bg-light shape-roundedx2 mt-2', {'dark': !lightThemeChecked}]">
                <div class="text-center p-2">
                    <p class="font-w-600">
                        {{$t('profile.confirmDeleteAccountText')}}
                    </p>
                </div>
                <div class="align-center justify-between">
                    <bib-button size="lg" :label="$t('common.cancel')" variant="gray" @click="redirectTo"></bib-button>
                    <bib-button size="lg" :label="$t('common.deleteAccount')" variant="danger" @click="isOpenConfirmModal=true"></bib-button>
                </div>
            </div>
            <div v-show="isNonAdmin" :class="['form__container-component-holder p-2 bg-light shape-roundedx2 mt-2', {'dark': !lightThemeChecked}]">
                <div class="text-center p-2">
                    <p class="font-w-600">
                        Please contact the administrators of your organization.
                    </p>
                </div>
            </div>
        </div>

        <!-- CONFIRM MODAL -->
        <confirm-dialog
        v-if="isOpenConfirmModal"
        :text="$t('profile.closeAccountNote')"
        @close="isOpenConfirmModal = null"
        @confirm="updateStatus">
        </confirm-dialog>
    </div>
</template>

<script>
import { updateBusinessStatus, getBusiness, removeBusinessStore } from "~/model/business";
import { cancelPaypalSubscription } from "~/model/paypal";
export default {
    layout: "home",
    props: ["global"],

    data() {
        return {
            user: this.$store.state.account.data,
            businessId: this.$store.state.account.data.businessId,
            isOpenConfirmModal: null,
            businessData: null,
            lightThemeChecked: this.$cookies.get('isLightTheme'),
        }
    },
    computed: {
        isAdmin() {
            return this.$store.state.account.data.userRole === 'ADMIN'
        },
        isNonAdmin() {
            return this.$store.state.account.data.userRole === 'USER'
        },
    },
    watch: {
        '$store.state.isLightTheme'(newValue) {
        this.lightThemeChecked = newValue;
        }
    },
    async created() {
        const res = await getBusiness({ businessId: this.$store.state.account.data.businessId });
        this.businessData = res[0];
    },
    methods: {
        redirectTo() {
            this.$router.push(`/organizations/${this.businessId}`)
        },
        async updateStatus() { // Status = 'DELETED' => soft delete
            this.$store.dispatch('loading/setGlobal', true)
            const data = { status: 'DELETED' }
            try {
                // If PayPal Subscription, cancel it and delete business external store
                if(this.businessData.ExternalStore === 'PAYPAL' && this.businessData.ExternalStoreSecret){
                    await cancelPaypalSubscription({ subscriptionId: this.businessData.ExternalStoreSecret});
                    await removeBusinessStore(this.businessId);
                }
                await updateBusinessStatus(this.businessId, data)
                await this.$store.dispatch('account/logout')
                this.$store.dispatch('loading/setGlobal', false)
            } catch(err) {
                this.$store.dispatch('loading/setGlobal', false)
                await this.$store.dispatch('notification/set', [true, err.message, 'danger'])
            }
            this.isOpenConfirmModal = false
        },
    }
}
</script>

<style lang="scss" scoped>
.organization-headline {
  width: 100%;
  @include flex-align;
  margin-left: 40px;
}

.form {
  &__container {
    @include flex-justify;
    margin: 2rem 14px;
    &-content {
        position: relative;
    }
  }
}
</style>