<template>
  <div class="mt-3">
    <!-- SUBSCRIPTION INFORMATION -->
    <div class="mb-3">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.subscriptionInformation") }}</div>

      <div class="subscription-card ml-2 mr-2">
        <div class="subscription-card__dot-menu icon-circle icon-circle--background">
          <bib-button size="md" pop="elipsis">
            <div slot="menu" class="list">
              <span class="list__item" @click="addUsersInputState = true">{{ $t("common.addUsers") }}</span>
              <span class="list__item" @click="productDetails = true">{{ $t("common.renewSubscription") }}</span>
              <span class="list__item" @click="$router.push('/payment_history')">{{ $t("common.paymentHistory") }}</span>
              <div class="separator" />
              <span class="list__item danger">{{ $t("common.cancelSubscription") }}</span>
            </div>
          </bib-button>
        </div>

        <img :src="`/img/default_company.svg`" />
        <div class="subscription-card__text">
          <div class="font-md mb-025">
            <span class="font-w-700 font-lg">Business in a box Pro</span>
            <span class="font-w-700 font-lg ml-05">$29.95/{{ $t("common.month") }}</span>
            <span>({{ $t("common.billedAnnualy") }})</span>
          </div>
          <div class="font-md">
            <span>{{ $t("common.organizationShort") }}</span>
            <span class="font-w-700 font-lg mr-05">Biztree, inc.</span>
            <span>{{ $t("common.users") }}:</span>
            <span class="font-w-700 font-lg">10</span>
            <span>(8 {{ $t("common.active") }})</span>
            <span class="text-primary" style="text-decoration: underline; cursor: pointer" v-if="!addUsersInputState" @click="addUsersInputState = true">{{ $t("common.addMoreUsers") }}</span>
          </div>
          <div class="align-center mt-1" v-if="addUsersInputState">
            <bib-input type="number" placeholder="..." :label="$t('common.users')"></bib-input>
            <bib-button size="xl" :label="$t('common.update')" variant="primary-24" pill type="submit" class="ml-1 mt-1" @click="addUsersInputState = false"></bib-button>
          </div>
        </div>
      </div>
    </div>

    <!-- PAYMENTS -->
    <div class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.paymentInformation") }}</div>

      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2">
        <!-- EMPTY -->
        <div class="add-paymenn-card">{{ $t("common.addPaymentMethod") }}</div>

        <!-- PAYMENT CARDS -->
        <organization-payment-card height="130px" v-for="(card, index) in ['mastercard', 'visa', 'amex']" :key="index" :card="card" @click="(cardDetailsState = 'edit_card'), (cardDetails = card)">
          <bib-button size="lg" class="payment-card__dot-menu danger" pop="elipsis">
            <div slot="menu" class="list" @click.stop>
              <span class="list__item" @click.stop="test(1)">{{ $t("common.makePrimary") }}</span>
              <span class="list__item" @click.stop="(cardDetailsState = 'edit_card'), (cardDetails = card)">{{ $t("common.editCardInformation") }}</span>
              <span class="list__item" @click.stop="(cardDetailsState = 'edit_billing'), (cardDetails = card)">{{ $t("common.editBillingInformation") }}</span>
              <span class="list__item" @click.stop="$router.push('/payment_history')">{{ $t("common.paymentHistory") }}</span>
            </div>
          </bib-button>
        </organization-payment-card>

        <!--  -->
      </div>
    </div>

    <!-- CARD DETAILS -->
    <organization-payment-card-details-modal :cardDetails="cardDetails" :modalState="cardDetailsState" @close="cardDetails = null" />

    <!-- PRODUCT DETAILS MODAL -->
    <organization-product-details-modal :show="productDetails" @close="productDetails = null" />
  </div>
</template>

<script>
import { uploadFile } from "~/assets/utils/file";
export default {
  data() {
    return {
      addUsersInputState: false,
      cardDetails: false,
      productDetails: false,
      cardDetailsState: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    if (this.$route.query?.tab && this.$route.query.tab === "billing") {
      this.addUsersInputState = true;
    }
  },
  methods: {
    test(e) {
      console.log(`eee`, e);
    },
    uploadAvatar() {
      uploadFile({ multiple: true }).then((e) => {
        this.organization_image = e[0];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.subscription-card {
  @include flex-align(flex-start);
  padding: 40px 24px;
  background: $background;
  border-radius: 4px;
  position: relative;

  &__dot-menu {
    position: absolute !important;
    top: 8px;
    right: 8px;

    &:hover {
      border-radius: 100px;
      background: $background-dark;
    }
  }

  img {
    width: 48px;
    height: 48px;
    object-fit: cover;
    border-radius: 80px;
    margin-right: 26px;
  }
}

.add-paymenn-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 130px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;

  &:active {
    // transform: scale(0.98);
  }
}

.payment-card__dot-menu {
  position: absolute !important;
  top: 8px;
  right: 8px;

  &:hover {
    border-radius: 100px;
    background: $background-dark;
  }
}
</style>
