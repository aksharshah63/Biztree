<template>
    <!-- PURCHASE MODAL // http://localhost:3000/?purchaseCompleted=true/false/0230695353[order id] -->
    <bib-modal-wrapper v-if="purchaseCompleted" size="md" @click:outside="purchaseCompleted = null" @close="purchaseCompleted = null">
        <div class="LandingModals__content p-2 pt-3 pb-3 text-center">
            <template v-if="purchaseCompleted === 'false'">
                <bib-icon icon="warning" variant="danger" :scale="3" class="mb-1" />
                <h3 class="mb-1">{{ $t("dialogs.appStoreHeadline") }}</h3>
                <div class="p-1 pb-2 text-secondary font-sm" v-html="$t('dialogs.appStoreBody', { phone: '1-800-BIZTREE', email: $store.state.account.data.userEmail, token })"></div>
                <bib-button :label="$t('dialogs.close')" variant="danger" pill @click="purchaseCompleted = null" class="LandingModals__content__button" />
            </template>
            <template v-else>
                <Logo width="260px" />
                <div>
                    <h3 v-html="$t('dialogs.purchase2Header')"></h3>
                    <div v-if="!(typeof purchaseCompleted == 'boolean')" class="font-sm text-secondary mt-1">{{ $t("dialogs.purchase2OrerNumber") }}: {{ purchaseCompleted }}</div>
                </div>

                <div>
                    <div class="pb-1 text-secondary font-sm" v-html="$t('dialogs.purchase2Body', { email: $store.state.account.data.userEmail })"></div>
                    <div class="text-secondary font-sm" v-html="$t('dialogs.purchase2Body2')"></div>
                </div>
                <bib-button :label="$t('dialogs.closeContinue')" variant="primary" size="xl" pill @click="purchaseCompleted = null" class="LandingModals__content__button" />
            </template>
        </div>
    </bib-modal-wrapper>
</template>

<script>
export default {
    data: () => ({
        purchaseCompleted: null,
        token: null,
    }),
    mounted() {
        let queryChanges = false;

        // purchase completed
        if (this.$route.query.purchaseCompleted !== undefined) {
            this.purchaseCompleted = this.$route.query.purchaseCompleted || true;
            this.token = this.$route.query.token;
            delete this.$route.query.purchaseCompleted;
            delete this.$route.query.token;
            queryChanges = true;
        }

        // clear the querys from the url
        if (queryChanges) {
            const queryString = new URLSearchParams(this.$route.query).toString();
            history.pushState("", "", `${location.pathname}${queryString ? `?${queryString}` : ``}`);
        }
    },
}
</script>

<style lang="scss" scoped>
::v-deep.LandingModals {
    &__content {
        display: flex;
        align-items: center;
        flex-direction: column;
        text-align: center;
        gap: 3rem;
    }

    .modal__mask {
        background: rgb(50 50 50 / 60%);
        backdrop-filter: blur(2px);

        .modal__wrapper {
            box-shadow: none !important;
            outline: none !important;
            padding-bottom: 2rem;
            max-width: 520px;

            &__header {
                border-bottom: none;
            }
        }
    }
}
</style>