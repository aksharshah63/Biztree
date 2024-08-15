<template>
  <div class="mt-3">
    <!-- TEAM -->
    <div v-if="this.businessData" class="mb-05">
      <div class="font-w-700 ml-2 mb-2">{{ $t("common.paymentInformation") }}</div>

      <div class="grid-auto-200 grid-gap-2 pl-2 pr-2">
        <!-- EMPTY -->
        <div v-if="!isCardPayment && !isPaypalPayment" class="add-paymenn-card" @click="isOpenAddPaymentCardModal = true">
          <!-- <bib-link :label="$t('common.addPaymentMethod')" :href="bibPaymentAppURL" target="_blank"></bib-link> -->
          <span>{{$t('common.addPaymentMethod')}}</span>
        </div>

        <!-- PAYMENT CARDS -->
        <div v-if="isCardPayment">
          <organization-payment-card height="130px" v-for="(card, index) in [paymentInfo.CardTypeName.toLowerCase()]" :key="index" :card="card" :cardInfo="paymentInfo" :lightThemeChecked="lightThemeChecked" >
            <bib-popup v-if="isAdmin" pop="horizontal-dots" icon-hover-variant="primary-24" class="payment-card__dot-menu danger" :class="{'dark': !lightThemeChecked}">
              <template v-slot:menu>
                <div :class="['list', {'dark': !lightThemeChecked}]" @click.stop>
                  <span class="list__item" @click.stop="(cardDetailsState = 'edit_card'), (cardSymbol = card)">{{ $t("common.editCardInformation") }}</span>
                  <span class="list__item" @click.stop="(cardDetailsState = 'edit_billing'), (cardSymbol = card)">{{ $t("common.editBillingInformation") }}</span>
                  <div class="separator" />
                  <span class="list__item list__item__danger" @click="isOpenConfirmModal = true">{{ $t("common.deletePaymentMethod") }}</span>
                </div>
              </template>
            </bib-popup>
          </organization-payment-card>
        </div>

        <!-- PAYPAL PAYMENT INFO -->
        <subscription-billing-paypal-payment 
          :businessData="businessData" 
          v-if="isPaypalPayment"
          :loadPaymentInfo="loadPaymentInfo"
        />

      </div>
    </div>

    <!-- CONFIRM MODAL -->
    <confirm-dialog
      v-if="isOpenConfirmModal"
      :text="$t('common.confirmText')"
      @close="isOpenConfirmModal = null"
      @confirm="deletePaymentMethod">
    </confirm-dialog>

    <!-- CARD DETAILS -->
    <organization-payment-card-details-modal
      v-if="cardSymbol"
      :lightThemeChecked="lightThemeChecked"  
      :cardData="paymentInfo"
      :modalState="cardDetailsState"
      :businessData="businessData"
      @update="updateCardInfo"
      @close="handleClose"
    />

    <!-- ADD PAYMENT CARD -->
    <organization-add-payment-card-modal
      v-if="isOpenAddPaymentCardModal"
      :businessData="businessData"
      :lightThemeChecked="lightThemeChecked" 
      @close="isOpenAddPaymentCardModal = null"
      @callback="cardAddCallback"
    ></organization-add-payment-card-modal>

  </div>
</template>

<script>
import { getBusiness, getPaymentInfo, changeAutoRenewal } from "~/model/business";
import { updateCard } from "~/model/business";
export default {
  props: ["lightThemeChecked"],
  data() {
    return {
      businessData: null,
      cardSymbol: null,
      cardDetailsState: null,
      paymentInfo: null, // Credit Card information
      isOpenConfirmModal: null,
      bibPaymentAppURL: process.env.PAYMENT_APP_URL,
      isOpenAddPaymentCardModal: null,
    };
  },
  computed: {
    isAdmin() {
      return this.$store.state.account.data.userRole === 'ADMIN'
    },
    isCardPayment() {
      return this.businessData && this.$store.state.business.AutoRenewal === 1 && this.paymentInfo
    },
    isPaypalPayment() {
      return this.businessData && this.businessData.ExternalStore === 'PAYPAL'
    }
  },
  created() {
    this.loadPaymentInfo()
  },
  mounted() {
    const self = this
    this.$root.$on('load_card_info', function(value) {
      self.loadPaymentInfo()
    })
  },
  methods: {
    async loadPaymentInfo() {
      this.paymentInfo = null
      this.$store.dispatch('loading/set', true)
      const resp0 = await getBusiness({ businessId: this.$store.state.account.data.businessId })
      if (resp0.err) {
        this.$store.dispatch('notification/set', [true, resp0.err.message, 'danger'])
        setTimeout(async () => {
          await this.$store.dispatch('notification/set', [false, '', ''])
        }, 5000)
      } else {
        this.businessData = resp0[0]
      }
      if (this.businessData && this.businessData.AutoRenewal === 1 && this.businessData.ExternalStore !== 'PAYPAL') {
        const resp = await getPaymentInfo({ businessId: this.businessData.Id })
        if (resp) {
          if (!resp.err) {
            this.paymentInfo = resp
          } else {
            this.$store.dispatch('notification/set', [true, resp.err.message, 'danger'])
            setTimeout(async () => {
              await this.$store.dispatch('notification/set', [false, '', ''])
            }, 5000)
          }
        }
      }
      this.$store.dispatch('loading/set', false)
    },
    async deletePaymentMethod () {
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
        this.paymentInfo = null
      }
      this.isOpenConfirmModal = null
      this.$store.dispatch('loading/setGlobal', false)
    },
    cardAddCallback(cardData) {
      this.businessData.AutoRenewal = 1
      this.isOpenAddPaymentCardModal = null
      this.loadPaymentInfo()
    },
    async updateCardInfo() {
      this.paymentInfo = null
      const resp = await getPaymentInfo({ businessId: this.businessData.Id })
      this.paymentInfo = resp
    },
    async handleClose() {
      this.cardSymbol = null
      const resp = await getPaymentInfo({ businessId: this.businessData.Id })
      this.paymentInfo = resp
    },
  },
};
</script>

<style lang="scss" scoped>
.add-paymenn-card {
  @include flex-align;
  @include flex-justify;
  width: 100%;
  height: 130px;
  border: 1px solid $border-color;
  font-weight: bold;
  font-size: 15px;
  color: $primary;
  cursor: pointer;

  // &:active {
  //   transform: scale(0.98);
  // }
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

.payment-card__dot-menu {
  &.dark{
    &:hover{
      background-color: var(--bib-text);
    }
  }
}

.list{
  .list__item:hover{
    background: var(--bib-light-sub1);
  }

  .list__item__danger:hover {
    background-color: #D9000D;
    color: var(--bib-background);
  }

  &.dark{
    background-color: var(--bib-text);
    color: var(--bib-secondary);
    border: 1px solid var(--bib-border-primary) !important;
    
    .list__item:hover {
      background-color: var(--bib-surface-tertiary);
    }
    .list__item__danger:hover {
      background-color: #D9000D;
      color: var(--bib-background);
    }
  }
}

::v-deep {
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
